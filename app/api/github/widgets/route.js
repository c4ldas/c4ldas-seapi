import { NextResponse } from "next/server";
import { JSDOM } from "jsdom";

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
    // Get the directory list from the repository
    const request = await fetch('https://api.github.com/repos/c4ldas/streamelements-widgets/contents/', {
      "next": { revalidate: 600 }, // 10 minutes
      "headers": {
        "Accept": "application/vnd.github.v3.raw",
        "Authorization": `Bearer ${process.env.GITHUB_API_KEY}`
      }
    });
    const response = await request.json();

    // Loop through each directory
    let widgetList = []

    const promises = response.map(async (item) => {
      if (item.name.startsWith("README")) return; // Ignore the readme file from root folder

      // Get the README of current directory as HTML format
      const htmlRequest = await fetch(`https://api.github.com/repos/c4ldas/streamelements-widgets/readme/${item.name}`, {
        "next": { revalidate: 600 }, // 10 minutes
        "headers": {
          "accept": "application/vnd.github.v3.raw",
          "Authorization": `Bearer ${process.env.GITHUB_API_KEY}`
        }
      })
      const html = await htmlRequest.text();

      // Create a temp HTML to to use DOM queries
      const dom = new JSDOM(html);
      const document = dom.window.document;

      // Save the folder name, widget name and widget description
      const widget_folder = item.name;
      const widget_name = document.querySelector("#widget-name").textContent;
      const widget_description = document.querySelector("#description").textContent;

      widgetList.push({ widget_folder, widget_name, widget_description });
    });

    // Wait for all promises to resolve
    await Promise.all(promises);
    return widgetList;

  } catch (error) {
    console.log("getGithubWidgets():", error);
    const response = { error: "Failed to list widgets from Github, please try again later" }
    throw response;
  }
}