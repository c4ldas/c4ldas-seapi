import { getAccountInfo, getTopWatchtime } from "@/app/lib/streamelements";
import { NextResponse } from "next/server";

export async function GET(query, request) {
  try {
    const obj = Object.fromEntries(query.nextUrl.searchParams);
    const { amount, minutes = false, type = "text", order = "asc" } = obj;

    if (!amount || amount < 1 || amount > 1000) {
      return new Response(`Minimum amount: 1. Max amount: 1000`, { status: 200 });
    }

    const accountInfo = await getAccountInfo(request.params.username);

    if (accountInfo.statusCode) {
      const error = new Error();
      error.message = accountInfo.message;
      error.status = accountInfo.statusCode;
      throw error;
    }

    const data = {
      accountId: accountInfo._id,
      amount: amount,
      minutes: minutes,
    }

    const topWatchtime = await getTopWatchtime(data);

    if (type == "text") {
      if (order == "desc") {
        return new Response(topWatchtime.reverse().join(', '), { status: 200 });
      }
      return new Response(topWatchtime.join(', '), { status: 200 });
    }

    return NextResponse.json({ status: "success", message: userList }, { status: 200 });
  } catch (error) {
    console.log(error.message);
    return new Response(error.message, { status: 500 });
  }
}
