import { cookies } from "next/headers";
import { getOverlayFromDB } from "@/app/lib/database";
import { overlayInstall } from "@/app/lib/streamelements";
import { NextResponse } from "next/server";

export async function POST(_, request) {

  const overlayData = await getOverlayFromDB({ code: request.params.code });

  const data = {
    access_token: cookies().get('se_access_token').value,
    code: request.params.code,
    id: cookies().get('se_id').value,
    overlay_data: overlayData.details
  }

  const response = await overlayInstall(data);
  console.log(response);

  return NextResponse.json(overlayData, { status: 200 });
}
