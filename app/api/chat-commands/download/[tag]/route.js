
// Not working, still need work to do

import { getTokenDatabase } from "@/app/lib/database";
import { getCommandList } from "@/app/lib/streamelements";
import { NextResponse } from "next/server";

export async function POST(_, request) {
  try {
    // const overlayData = await getOverlayFromDB(request.params);
    const tokenDatabase = await getTokenDatabase(request.params);

    const data = {
      access_token: tokenDatabase.details.access_token,
      account_id: tokenDatabase.details.account_id,
    }

    // const userData = await getUserData(tokenDatabase.details.access_token);

    const response = await getCommandList(data);

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.log("/chat-commands/download/[tag] error:", error.message);
    return NextResponse.json({ status: "failed", message: error.message }, { status: 500 });
  }
}
