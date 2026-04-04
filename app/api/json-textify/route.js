/**
 * /api/json-textify
 * 
 * Fetches a JSON from the provided `site` URL and returns a plain text message
 * based on the `msg` template. The template can include placeholders in the format
 * (path.to.value), which will be replaced with the corresponding values from the JSON.
 * If the object is inside an array, use (path.to.array[index]).
 * 
 * Query parameters:
 * - site: URL pointing to the JSON data
 * - msg: Template string with keys to extract from the JSON
 * 
 * Example:
 * https://seapi.c4ldas.com.br/api/json-textify?site=https://pokeapi.co/api/v2/pokemon/squirtle&msg="Base experience: (base_experience). First ability: (abilities[0].ability.name)"
 */

// The line below clears the error during the deployment:
// [Error]: Dynamic server usage: Route /api/json-textify couldn't be rendered statically because it used `nextUrl.searchParams`.
export const dynamic = 'force-dynamic';


export async function GET(query) {
  const payloadMaxSize = 1048576; // 1MB
  const allowedTypes = [
    'application/json',
    'text/plain',
    'text/javascript',
    'application/javascript',
    'text/json'
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    // Correctly extract parameters: 'site' and 'msg' are the primary targets.
    // searchParams.get() ensures the full value of 'site' is captured even if it contains '&'.
    const searchString = query.nextUrl.search;
    const params = new URLSearchParams(searchString);

    const msg = params.get('msg');
    const channel = params.get('channel');

    // Capture everything after 'site=' to handle unencoded nested parameters
    const siteKey = 'site=';
    const siteIndex = searchString.indexOf(siteKey);
    let site = null;
    if (siteIndex !== -1) {
      site = decodeURIComponent(searchString.substring(siteIndex + siteKey.length));
    }

    // Validate parameters
    if (!channel) return new Response("Missing 'channel' parameter", { status: 200 });
    if (!site || !msg) return new Response("Missing 'site' or 'msg' parameter", { status: 200 });

    // Try to fetch JSON with user agent and timeout
    const request = await fetch(site, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'c4ldas-seapi'
      }
    });
    clearTimeout(timeoutId);

    // Limit size
    const contentLength = request.headers.get('content-length');
    if (contentLength && parseInt(contentLength) > payloadMaxSize) {
      return new Response("Not possible to parse content.", { status: 200 });
    }

    // 2. Permissive Content-Type Allowlist
    const contentType = request.headers.get('content-type') || '';
    const isAllowed = allowedTypes.some(type => contentType.includes(type));

    if (!isAllowed && contentType !== '') {
      return new Response("Invalid content type.", { status: 200 });
    }

    // Manually track bytes to enforce limit even if headers lie
    const reader = request.body.getReader();
    let receivedLength = 0;
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      chunks.push(value);
      receivedLength += value.length;

      if (receivedLength > payloadMaxSize) {
        await reader.cancel(); // Abort the connection immediately to save resources
        return new Response("Not possible to parse content.", { status: 200 });
      }
    }

    // 4. Reconstruct the body from chunks
    const fullBody = new Uint8Array(receivedLength);
    let offset = 0;
    for (const chunk of chunks) {
      fullBody.set(chunk, offset);
      offset += chunk.length;
    }

    const decodedText = new TextDecoder().decode(fullBody);
    const response = JSON.parse(decodedText);

    // Replace placeholders
    const data = msg.replace(/\(([^)]+)\)/g, (_, path) => {
      const value = resolvePath(response, path);

      if (value === undefined) return `(${path})`;
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    });

    // Return plain text
    return new Response(data.toString(), { status: 200 });


  } catch (error) {
    console.log(error.message);
    console.log(error);

    if (error.name === 'AbortError') {
      return new Response("Request timed out", { status: 200 });
    }

    return new Response("Failed to get JSON data from the site", { status: 200 });
  }
}

// Recursive function to resolve object paths
function resolvePath(obj, path) {
  if (path === '.') return obj;
  const forbiddenKeys = ['__proto__', 'constructor', 'prototype'];

  const segments = path.replace(/\[(\d+)\]/g, '.$1').split('.');

  // Limit path depth to 20 segments to prevent CPU exhaustion
  if (segments.length > 20) return undefined;

  return segments.reduce((acc, key) => {
    if (forbiddenKeys.includes(key)) return undefined;

    // Ensure acc is an object and the key is an "own" property (not inherited)
    if (acc && typeof acc === 'object' && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key];
    }

    return undefined;
  }, obj);
}