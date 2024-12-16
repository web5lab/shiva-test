/**
 * Safely encode a string to base64 in the browser
 * @param str - The string to encode
 * @returns The base64 encoded string
 */
export function encodeBase64(str: string): string {
  try {
    return btoa(unescape(encodeURIComponent(str)));
  } catch (error) {
    console.error('Failed to encode string:', error);
    throw new Error('Failed to encode content');
  }
}

/**
 * Safely decode a base64 string in the browser
 * @param str - The base64 string to decode
 * @returns The decoded string
 */
export function decodeBase64(str: string): string {
  try {
    // Remove any whitespace and padding that might cause issues
    const cleaned = str.replace(/\s/g, '').replace(/=+$/, '');
    return decodeURIComponent(escape(atob(cleaned)));
  } catch (error) {
    console.error('Failed to decode string:', error);
    throw new Error('Failed to decode content');
  }
}