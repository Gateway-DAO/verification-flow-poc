import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  url.pathname = "/issue";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/"],
};
