import { NextResponse } from "next/server";
import { getTokenDatabase, saveOverlayToDB } from "@/app/lib/database";
import { getOverlayInfo } from "@/app/lib/streamelements";

export async function POST(_, request) {
  try {
    const tokenDatabase = await getTokenDatabase(request.params);

    const data = {
      access_token: tokenDatabase.details.access_token,
      overlay_id: request.params.overlay_id,
      account_id: tokenDatabase.details.account_id
    }

    const response = await getOverlayInfo(data);
    const result = {
      code: Date.now(),
      overlay_data: response,
      account_id: tokenDatabase.details.account_id,
      name: response.name
    }

    const saved = await saveOverlayToDB(result);
    if (!saved) return NextResponse.json({ status: "failed", message: "Failed to save overlay to database, please try again later" });
    return NextResponse.json({ status: "success", message: "Overlay saved successfully", saved: saved, code: result.code });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: "Failed to get overlay information, please try again later" });
  }
}

export async function GET(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed" }, { status: 405 });
}
