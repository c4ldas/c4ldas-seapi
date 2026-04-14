import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getTokenDatabase, seRemoveDBIntegration } from "@/app/lib/database";
import { revokeToken } from "@/app/lib/streamelements";

export async function POST(request) {
  try {
    const cookieStore = await cookies();

    const data = {
      account_id: cookieStore.get('se_id').value,
      username: cookieStore.get('se_username').value,
      tag: cookieStore.get('se_tag').value,
    }

    const token = await getTokenDatabase(data);

    const isRevoked = await revokeToken(token.details);
    if (!isRevoked) return NextResponse.json({ status: "failed", message: "Failed to revoke token, try again later" });

    const isRemoved = await seRemoveDBIntegration(data);
    if (!isRemoved) return NextResponse.json({ status: "failed", message: "Failed to remove from database, try again later" });

    cookieStore.delete('se_id');
    cookieStore.delete('se_username');
    cookieStore.delete('se_tag');
    cookieStore.delete('se_provider');
    cookieStore.delete('user_avatar');

    return NextResponse.json({ status: "success", message: "Integration removed successfully" });

  } catch (error) {
    console.log(error);
    return NextResponse.json({ status: "failed", message: "Failed to remove integration, try again later" });
  }
}

export async function GET(request) {
  return NextResponse.json({ status: "failed", message: "Method not allowed" });
}


