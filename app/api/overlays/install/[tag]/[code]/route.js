import { getOverlayFromDB, getTokenDatabase } from "@/app/lib/database";
import { getUserData, overlayInstall } from "@/app/lib/streamelements";
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

    const overlayResult = await overlayInstall(data);
    const userData = await getUserData(tokenDatabase.details.access_token);

    const response = {
      overlay_id: overlayResult._id,
      overlay_name: overlayResult.name,
      overlay_width: overlayResult.settings.width,
      overlay_height: overlayResult.settings.height,
      apiToken: userData.apiToken,
      overlay_url: `https://streamelements.com/overlay/${overlayResult._id}/${userData.apiToken}`,
      overlay_config_url: `https://streamelements.com/overlay/${overlayResult._id}/editor`,
      account_id: userData._id
    }

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.log("/install/[tag]/[code] error:", error.message);
    return NextResponse.json({ status: "failed", message: error.message }, { status: 500 });
  }
}
