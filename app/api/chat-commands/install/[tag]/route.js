
import { getTokenDatabase } from "@/app/lib/database";
import { installChatCommands } from "@/app/lib/streamelements";
import { NextResponse } from "next/server";

export async function POST(data, request) {
  try {
    let success = 0;
    let failed = 0;
    let failedCommands = [];

    const body = await data.json();

    // console.log("Request Params:", request.params);
    const tokenDatabase = await getTokenDatabase(request.params);

    const userData = {
      access_token: tokenDatabase.details.access_token,
      account_id: tokenDatabase.details.account_id,
    }

    for (const item of body) {
      const command = {
        account_id: userData.account_id,
        access_token: userData.access_token,
        command: item
      };

      const response = await installChatCommands(command);

      if (response.status === "failed") {
        failed++;
        failedCommands.push(`${response.command} - ${response.message}`);
        continue;
      }
      success++;
    }

    console.log({ result: { success: success, failed: failed }, failed_commands: failedCommands });
    return NextResponse.json({ status: "success", message: "Commands installed successfully!", result: { success: success, failed: failed }, failed_commands: failedCommands }, { status: 200 });

  } catch (error) {
    console.log("/chat-commands/install/[tag] error:", error.message);
    return NextResponse.json({ status: "failed", message: error.message }, { status: 500 });
  }

}
