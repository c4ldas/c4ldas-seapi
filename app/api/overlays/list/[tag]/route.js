import { NextResponse } from "next/server";
import { getTokenDatabase } from "@/app/lib/database";
import { getOverlays } from "@/app/lib/streamelements";

export async function GET(_, request) {
  try {
    const params = await request.params;
    const tokenDatabase = await getTokenDatabase(params);
    const data = {
      access_token: tokenDatabase.details.access_token,
      refresh_token: tokenDatabase.details.refresh_token,
      account_id: tokenDatabase.details.account_id
    }

    const response = await getOverlays(data);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.log("/api/overlays/list/[tag]:", error.message);
    return NextResponse.json({ status: "failed", message: "Failed to get overlays, please try again later" });
  }
}

export async function POST(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed" });
}
