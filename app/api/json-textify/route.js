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


export async function GET(query) {
  try {
    // Convert query strings (map format) to object format - Only works for this specific case!
    const obj = Object.fromEntries(query.nextUrl.searchParams);
    let { site, msg, channel } = obj;

    // Validate parameters
    if (!channel) return new Response("Missing 'channel' parameter", { status: 200 });
    if (!site || !msg) return new Response("Missing 'site' or 'msg' parameter", { status: 200 });

    // Try to fetch JSON
    const request = await fetch(site);
    const response = await request.json();

    // Replace placeholders
    const data = msg.replace(/\(([^)]+)\)/g, (_, path) => {
      const value = resolvePath(response, path);

      if (value === undefined) return `(${path})`;
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
      // return value !== undefined ? String(value) : `(${path})`;
    });

    // Return plain text
    console.log(`channel: ${channel} \nsite: ${site} \nmsg: ${msg} \ndata: ${data}`);
    return new Response(data.toString(), { status: 200 });

  } catch (error) {
    console.log(error.message);
    return new Response("Failed to get JSON data from the site", { status: 200 });
  }
}

// Recursive function to resolve object paths
function resolvePath(obj, path) {
  if (path === '.') return obj;
  return path
    .replace(/\[(\d+)\]/g, '.$1') // convert [0] to .0
    .split('.')
    .reduce((acc, key) => acc?.[key], obj);
}
