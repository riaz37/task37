import { handlers } from "@/auth";
import { NextResponse } from "next/server";

const handler = handlers;

export { handler as GET, handler as POST };
