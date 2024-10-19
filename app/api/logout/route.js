import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTokenDatabase, seRemoveDBIntegration } from "@/app/lib/database";
import { revokeToken } from "@/app/lib/streamelements";

export async function POST(request) {
  try {

    const data = {
      account_id: cookies().get('se_id').value,
      username: cookies().get('se_username').value,
      tag: cookies().get('se_tag').value,
    }

    const token = await getTokenDatabase(data);

    const isRevoked = await revokeToken(token.details);
    if (!isRevoked) return NextResponse.json({ status: "failed", message: "Failed to revoke token, try again later" });

    const isRemoved = await seRemoveDBIntegration(data);
    if (!isRemoved) return NextResponse.json({ status: "failed", message: "Failed to remove from database, try again later" });

    cookies().delete('se_id');
    cookies().delete('se_username');
    cookies().delete('se_tag');

    return NextResponse.json({ status: "success", message: "Integration removed successfully" });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: "Failed to remove integration, try again later" });
  }
}

export async function GET(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed" });
}


