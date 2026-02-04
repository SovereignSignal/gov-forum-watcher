/**
 * Storage Migration Utility
 *
 * Migrates localStorage keys from the old "gov-forum-watcher-*" prefix
 * to the new "discuss-watch-*" prefix to preserve existing user data
 * during the rebrand to discuss.watch.
 */

const MIGRATION_FLAG_KEY = 'discuss-watch-migration-completed';

// Map of old keys to new keys
const KEY_MIGRATIONS: Record<string, string> = {
  'gov-forum-watcher-forums': 'discuss-watch-forums',
  'gov-forum-watcher-alerts': 'discuss-watch-alerts',
  'gov-forum-watcher-bookmarks': 'discuss-watch-bookmarks',
  'gov-forum-watcher-theme': 'discuss-watch-theme',
  'gov-forum-watcher-read-discussions': 'discuss-watch-read-discussions',
  'gov-forum-watcher-onboarding-completed': 'discuss-watch-onboarding-completed',
  'gov-forum-watcher-bookmarks-migrated-v1': 'discuss-watch-bookmarks-migrated-v1',
  // Also migrate from intermediate "gov-watch-*" keys used briefly
  'gov-watch-theme': 'discuss-watch-theme',
};

/**
 * Check if migration has already been completed
 */
export function hasMigrated(): boolean {
  if (typeof window === 'undefined') return true;
  return localStorage.getItem(MIGRATION_FLAG_KEY) === 'true';
}

/**
 * Migrate all localStorage keys from old prefix to new prefix.
 * This preserves existing user data (forums, alerts, bookmarks, theme, etc.)
 *
 * Should be called once at app startup before any storage reads.
 */
export function migrateStorageKeys(): void {
  if (typeof window === 'undefined') return;

  // Skip if already migrated
  if (hasMigrated()) return;

  let migratedCount = 0;

  for (const [oldKey, newKey] of Object.entries(KEY_MIGRATIONS)) {
    try {
      const oldValue = localStorage.getItem(oldKey);

      // Only migrate if old key exists and new key doesn't
      if (oldValue !== null && localStorage.getItem(newKey) === null) {
        localStorage.setItem(newKey, oldValue);
        localStorage.removeItem(oldKey);
        migratedCount++;
      }
    } catch (error) {
      console.warn(`Failed to migrate storage key ${oldKey}:`, error);
    }
  }

  // Mark migration as complete
  localStorage.setItem(MIGRATION_FLAG_KEY, 'true');

  if (migratedCount > 0) {
    console.log(`discuss.watch: Migrated ${migratedCount} storage keys from previous version`);
  }
}
