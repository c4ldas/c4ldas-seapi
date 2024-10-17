import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { overlaySaveToDB } from "@/app/lib/database";
// import { seRemoveDBIntegration } from "@/app/lib/database";
// import { revokeToken } from "@/app/lib/streamelements";

export async function GET(_, request) {
  try {
    const response = await getOverlayCode(request);

    const result = {
      code: Date.now(),
      overlay_data: response,
      account_id: request.params.accountId,
      name: response.name
    }

    const saved = await overlaySaveToDB(result);
    return new Response(result.code, { status: 200 });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: "Failed to get overlay information, please try again later" });
  }
}



async function getOverlayCode(data) {
  const access_token = cookies().get('se_access_token').value;

  try {
    const request = await fetch(`https://api.streamelements.com/kappa/v2/overlays/${data.params.accountId}/${data.params.overlayId}`, {
      "method": "GET",
      "headers": {
        "Accept": "application/json",
        "Authorization": `oAuth ${access_token}`
      }
    });

    const response = await request.json();
    return response;

  } catch (error) {
    console.log("getOverlayCode(): ", error);
    return NextResponse.json({ status: "failed", message: "Failed to get overlay information, please try again later" });
  }

  /* export async function GET(request) {
    return NextResponse.json({ status: "failed", message: "Method not allowed" });
  } */
}

