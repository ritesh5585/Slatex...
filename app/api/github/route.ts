export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return Response.json({ error: "Username required" }, { status: 400 });
  }

  const res = await fetch(`https://api.github.com/users/${username}`);
  const data = await res.json();

  console.log(data)
  return Response.json(data);
}
