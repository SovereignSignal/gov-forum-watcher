import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.searchParams.get('url');

  if (!url) {
    return NextResponse.json({ valid: false, error: 'URL is required' }, { status: 400 });
  }

  try {
    const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
    const siteResponse = await fetch(`${baseUrl}/site.json`, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(5000),
    });

    if (!siteResponse.ok) {
      return NextResponse.json({ 
        valid: false, 
        error: 'Could not connect to forum' 
      });
    }

    const siteData = await siteResponse.json();
    
    if (siteData.default_locale !== undefined || siteData.categories !== undefined) {
      return NextResponse.json({ 
        valid: true, 
        name: siteData.title || siteData.description || 'Discourse Forum'
      });
    }

    return NextResponse.json({ 
      valid: false, 
      error: 'URL does not appear to be a Discourse forum' 
    });
  } catch (error) {
    console.error('Discourse validation error:', error);
    return NextResponse.json({ 
      valid: false, 
      error: 'Failed to validate forum URL' 
    });
  }
}
