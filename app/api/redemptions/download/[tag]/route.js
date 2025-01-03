import { NextResponse } from "next/server";
import { getTokenDatabase } from "@/app/lib/database";
import { getBearer, getRedemptions } from "@/app/lib/streamelements";

export async function GET(search, request) {
  try {
    // Convert query strings (map format) to object format - Only works for this specific case!
    const obj = Object.fromEntries(search.nextUrl.searchParams);
    const tokenDatabase = await getTokenDatabase(request.params);

    const data = {
      access_token: tokenDatabase.details.access_token,
      refresh_token: tokenDatabase.details.refresh_token,
      account_id: tokenDatabase.details.account_id,
      amount: obj.amount,
      offset: obj.offset
    }

    const bearer = await getBearer(data);
    data.bearer = bearer.tokenV2;

    const redemptionList = await getRedemptions(data);
    return NextResponse.json(redemptionList, { status: 200 });

  } catch (error) {
    console.log("/api/redemptions/download/[tag]:", error.message);
    return NextResponse.json({ status: "failed", message: "Failed to get redemptions, please try again later" });
  }
}

export async function POST(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed" });
}
