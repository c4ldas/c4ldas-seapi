// Replace jsdom with cheerio

import { NextResponse } from "next/server";
import * as cheerio from "cheerio";

export async function GET() {
  try {
    const request = await getGithubWidgets();
    return NextResponse.json(request);
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 400 });
  }
}

export async function getGithubWidgets() {
  try {
    const request = await fetch('https://api.github.com/repos/c4ldas/streamelements-widgets/contents/', {
      "next": { revalidate: 600 },
      "headers": {
        "Accept": "application/vnd.github.v3.raw",
        "Authorization": `Bearer ${process.env.GITHUB_API_KEY}`
      }
    });
    const response = await request.json();

    let widgetList = [];

    const promises = response.map(async (item) => {
      if (item.name.startsWith("README")) return;

      const htmlRequest = await fetch(`https://api.github.com/repos/c4ldas/streamelements-widgets/readme/${item.name}`, {
        "next": { revalidate: 600 },
        "headers": {
          "accept": "application/vnd.github.v3.raw",
          "Authorization": `Bearer ${process.env.GITHUB_API_KEY}`
        }
      });
      const html = await htmlRequest.text();

      const $ = cheerio.load(html);

      const widget_folder = item.name;
      const widget_name = $("#widget-name").text();
      const widget_description = $("#description").text();

      widgetList.push({ widget_folder, widget_name, widget_description });
    });

    await Promise.all(promises);
    return widgetList;

  } catch (error) {
    console.log("getGithubWidgets():", error);
    const response = { error: "Failed to list widgets from Github, please try again later" };
    throw response;
  }
}