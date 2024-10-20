import { getOverlayFromDB, getTokenDatabase } from "@/app/lib/database";
import { overlayInstall } from "@/app/lib/streamelements";
import { NextResponse } from "next/server";

export async function POST(_, request) {
  try {
    const overlayData = await getOverlayFromDB(request.params);
    const tokenDatabase = await getTokenDatabase(request.params);

    const data = {
      access_token: tokenDatabase.details.access_token,
      code: request.params.code,
      account_id: tokenDatabase.details.account_id,
      overlay_data: overlayData.details
    }

    const response = await overlayInstall(data);
    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: error.message }, { status: 500 });
  }
}
