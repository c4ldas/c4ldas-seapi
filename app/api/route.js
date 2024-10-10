export async function GET(request) {

  // console.log(request.nextUrl.origin);
  return Response.redirect(request.nextUrl.origin);
}
