// /app/api/[[...notFound]]/route.js
import { NextResponse } from 'next/server'

export async function GET(request) {
  if (request.nextUrl.pathname === '/api') {
    return NextResponse.redirect(request.nextUrl.origin);
  }

  return NextResponse.json({ status: "failed", message: 'Endpoint not found' }, { status: 200 })
}
