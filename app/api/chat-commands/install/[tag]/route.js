
// Not working, still need work to do

import { getTokenDatabase } from "@/app/lib/database";
import { installChatCommands } from "@/app/lib/streamelements";
import { NextResponse } from "next/server";

export async function POST(request) {

  let success = 0;
  let failed = 0;

  const body = await request.json();

  for (const item of body) {
    const response = await installChatCommands(item);
    if (response.status === "failed") {
      failed++;
      continue;
    }
    success++;
  }

  return NextResponse.json({ status: "success", message: "Still under development." });
  return NextResponse.json({ status: "success", result: { success: success, failed: failed }, message: "Commands installed successfully!" });

  try {
    // const overlayData = await getOverlayFromDB(request.params);
    const tokenDatabase = await getTokenDatabase(request.params);

    const data = {
      access_token: tokenDatabase.details.access_token,
      account_id: tokenDatabase.details.account_id,
    }

    // const userData = await getUserData(tokenDatabase.details.access_token);


    const response = await installChatCommands(data);

    return NextResponse.json(response, { status: 200 });

  } catch (error) {
    console.log("/chat-commands/install/[tag] error:", error.message);
    return NextResponse.json({ status: "failed", message: error.message }, { status: 500 });
  }
}
