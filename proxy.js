import { NextResponse } from 'next/server';

// Add the tags so the crawler doesn't index the pages
export function proxy(request) {
  const response = NextResponse.next();
  response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  return response;

}

// Limit middleware to the paths you care about
export const config = {
  matcher: ['/login']
};