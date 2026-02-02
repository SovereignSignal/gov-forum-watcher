import { NextRequest, NextResponse } from 'next/server';
import { getDb, isDatabaseConfigured } from '@/lib/db';

// POST /api/user/forums - Add or update forum for user
export async function POST(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { privyDid, forumCname, isEnabled } = body;

    if (!privyDid || !forumCname) {
      return NextResponse.json({ error: 'privyDid and forumCname are required' }, { status: 400 });
    }

    const sql = getDb();

    // Get user ID
    const users = await sql`
      SELECT id FROM users WHERE privy_did = ${privyDid}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = users[0].id;

    // Upsert forum
    const result = await sql`
      INSERT INTO user_forums (user_id, forum_cname, is_enabled)
      VALUES (${userId}, ${forumCname}, ${isEnabled ?? true})
      ON CONFLICT (user_id, forum_cname)
      DO UPDATE SET is_enabled = ${isEnabled ?? true}
      RETURNING forum_cname, is_enabled
    `;

    return NextResponse.json({ forum: result[0] });
  } catch (error) {
    console.error('Forums API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update forum' },
      { status: 500 }
    );
  }
}

// DELETE /api/user/forums - Remove forum from user
export async function DELETE(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { privyDid, forumCname } = body;

    if (!privyDid || !forumCname) {
      return NextResponse.json({ error: 'privyDid and forumCname are required' }, { status: 400 });
    }

    const sql = getDb();

    // Get user ID
    const users = await sql`
      SELECT id FROM users WHERE privy_did = ${privyDid}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = users[0].id;

    // Delete forum
    await sql`
      DELETE FROM user_forums
      WHERE user_id = ${userId} AND forum_cname = ${forumCname}
    `;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Forums API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete forum' },
      { status: 500 }
    );
  }
}

// PUT /api/user/forums/bulk - Bulk update forums (for initial sync)
export async function PUT(request: NextRequest) {
  if (!isDatabaseConfigured()) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  try {
    const body = await request.json();
    const { privyDid, forums } = body;

    if (!privyDid || !Array.isArray(forums)) {
      return NextResponse.json({ error: 'privyDid and forums array are required' }, { status: 400 });
    }

    const sql = getDb();

    // Get user ID
    const users = await sql`
      SELECT id FROM users WHERE privy_did = ${privyDid}
    `;

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = users[0].id;

    // Delete all existing forums for user
    await sql`DELETE FROM user_forums WHERE user_id = ${userId}`;

    // Insert all forums
    if (forums.length > 0) {
      for (const forum of forums) {
        await sql`
          INSERT INTO user_forums (user_id, forum_cname, is_enabled)
          VALUES (${userId}, ${forum.cname}, ${forum.isEnabled ?? true})
        `;
      }
    }

    return NextResponse.json({ success: true, count: forums.length });
  } catch (error) {
    console.error('Forums API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to bulk update forums' },
      { status: 500 }
    );
  }
}
