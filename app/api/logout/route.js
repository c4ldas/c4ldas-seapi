import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { seRemoveDBIntegration } from "@/app/lib/database";
import { revokeToken } from "@/app/lib/streamelements";

export async function POST(request) {
  try {
    const se_id = cookies().get('se_id').value;
    const se_username = cookies().get('se_username').value;
    const se_access_token = cookies().get('se_access_token').value;

    const isRemoved = await seRemoveDBIntegration(se_id, se_username);
    const isRevoked = await revokeToken(se_access_token);

    cookies().delete('se_id');
    cookies().delete('se_username');
    cookies().delete('se_access_token');

    return NextResponse.json({ status: "success", message: "Integration removed successfully" });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: "Failed to remove integration, try again later" });
  }
}

export async function GET(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed" });
}


