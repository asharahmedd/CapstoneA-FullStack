export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return new Response(JSON.stringify({ error: 'Search query is required' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const response = await fetch(
      `https://superheroapi.com/api/2dd8d90a86c2172c514ab3b0664c279c/search/${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch superheroes' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}