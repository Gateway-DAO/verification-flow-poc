import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  return NextResponse.redirect("/verify");
}

export const config = {
  matcher: ["/"],
};
