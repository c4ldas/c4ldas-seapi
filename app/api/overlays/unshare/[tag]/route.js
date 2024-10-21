import { getTokenDatabase, removeOverlayFromDB } from "@/app/lib/database";
import { NextResponse } from "next/server";

export async function POST(data, request) {
  try {

    const body = await data.json();

    const accountId = await getTokenDatabase(request.params);
    const overlayDeleted = await removeOverlayFromDB({ code: body.code, account_id: accountId.details.account_id });
    // const overlayDeleted = await removeOverlayFromDB({ code: body.code, account_id: "123456789" });

    console.log("overlayToDelete:", overlayDeleted);

    return NextResponse.json({ status: "success", message: overlayDeleted.message, overlay_code: body.code }, { status: 200 });

  } catch (error) {
    console.log("/api/overlays/unshare/:", error);
    return NextResponse.json({ status: "failed", message: error.message }, { status: error.details.code });
  }
}

export async function GET(_, request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed" }, { status: 405 });
}