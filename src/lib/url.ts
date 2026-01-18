export function normalizeUrl(url: string): string {
  try {
    const parsed = new URL(url);
    let normalized = `${parsed.protocol}//${parsed.host}${parsed.pathname}`;
    normalized = normalized.replace(/\/+$/, '');
    if (!normalized.endsWith('/')) {
      normalized += '/';
    }
    return normalized;
  } catch {
    return url;
  }
}

export function isValidUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function validateDiscourseUrl(url: string): Promise<{ valid: boolean; name?: string; error?: string }> {
  if (!isValidUrl(url)) {
    return { valid: false, error: 'Invalid URL format' };
  }

  try {
    const normalizedUrl = normalizeUrl(url);
    const response = await fetch(`/api/validate-discourse?url=${encodeURIComponent(normalizedUrl)}`);
    const data = await response.json();
    
    if (data.valid) {
      return { valid: true, name: data.name };
    } else {
      return { valid: false, error: data.error || 'Not a valid Discourse forum' };
    }
  } catch {
    return { valid: false, error: 'Could not validate forum URL' };
  }
}
