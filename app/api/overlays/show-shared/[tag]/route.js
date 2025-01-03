import { getSharedOverlaysFromDB, getTokenDatabase } from "@/app/lib/database";
import { NextResponse } from "next/server";

export async function GET(_, request) {
  try {
    const getAccountId = await getTokenDatabase(request.params);
    const overlayList = await getSharedOverlaysFromDB(getAccountId.details);

    if (!getAccountId.success || !overlayList.success) throw error;

    return NextResponse.json(overlayList.details, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: "Failed to get overlays, please try again later" });
  }
}