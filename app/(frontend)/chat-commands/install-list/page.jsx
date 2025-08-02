"use client";

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useEffect, useState } from "react";
import { encodeData } from "@/app/lib/streamelements";
import { getCookies } from "cookies-next";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Dialog, openDialog } from "@/app/components/Dialog";

export default function Generate({ request, searchParams }) {
  const error = searchParams.error;
  const pathName = usePathname();

  const [cookie, setCookie] = useState({});
  const [encoded, setEncoded] = useState("");
  const [jsonData, setJsonData] = useState(null);
  const [commandList, setCommandList] = useState([]);
  const [commandsToInstall, setCommandsToInstall] = useState([]);
  const [loading, setLoading] = useState(false);
  const [origin, setOrigin] = useState();
  const [isValidJSON, setIsValidJSON] = useState(null);

  useEffect(() => {
    // Encoded data will follow the pattern for callback: group_URLPath_timestamp. 
    // "Group" is used to separate scopes on /login page.
    // "URLPath" is the path used on callback page.
    // "Timestamp" is generated on the server. So, when encoded, the encoded data will look like this: chatCommand_generate-list_1749237834453
    setEncoded(encodeData("chatCommand_chat-commands/install-list"));
    setCookie(getCookies());
    setOrigin(window.location.origin);
  }, [cookie.se_id]);

  async function installList() {
    if (!jsonData || commandsToInstall.length === 0) return;

    setLoading(true);
    const commands = jsonData.filter((item) => commandsToInstall.includes(item.command));
    console.log("Commands to install:", commands);

    const request = await fetch(`/api/chat-commands/install/${cookie["se_tag"]}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(commands)
    });

    const response = await request.json();
    console.log(response);

    const dialog = document.querySelector("#code-generated");
    const dialogTitle = dialog.querySelector("#dialog-title");
    // const dialogResult = dialog.querySelector("#dialog-result");

    dialogTitle.innerText = response.message;
    // dialogResult.innerText = `Successfully installed: ${response.result.success}.\n Failed to install: ${response.result.failed}.`;
    dialog.style.marginLeft = "auto";
    dialog.showModal();

    setLoading(false);
    return response;
  }


  async function testJSON(data) {
    console.log("Testing JSON file...");
    const file = data.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        setJsonData(parsed);
        setIsValidJSON(true);

        const commands = parsed.map((item) => item.command);
        setCommandList(commands);
        console.log(commands);

        document.querySelector("#result").innerText = "";
        document.querySelector("#submit").disabled = false;

      } catch (error) {
        setJsonData(null);
        setCommandList([]);
        setCommandsToInstall([]);
        setIsValidJSON(false);
        console.log("Invalid JSON");
        // console.error("Error parsing JSON:", error);
        document.querySelector("#result").innerText = "The chosen file is not a valid JSON command list. Please select another file.";
        document.querySelector("#result").style.color = "red";
        document.querySelector("#submit").disabled = true;
      }
    };
    reader.readAsText(file);
  }


  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1 className="title">Install command list<br /> (Under development)</h1>
        <hr />
        {!cookie.se_id &&
          <>
            <h2 className="title">Login with Streamelements</h2>
            <h3 className="subtitle">
              You can use this page to install a list of the custom command to your channel. Use it after obtaining the list from generate command list page.
              <br /><br />
              Click on the button below to login with Streamelements:
            </h3>
            <div className="main">
              <Link href={`/login?state=${encoded}`}>
                <button type="submit" style={{ padding: "0.5rem" }}>Login with Streamelements</button>
              </Link>
            </div>
          </>
        }
        {cookie.se_id &&
          <>
            <p><strong>Channel name:</strong> {cookie.se_username} </p>
            <p><strong>Channel ID:</strong> {cookie.se_id}</p>
            <p><strong>Platform:</strong> {cookie.se_provider}</p>
            <p><button id="remove-integration" type="submit" onClick={() => openDialog({ pathName })}>Logout</button></p>
            <h2 className="title">Install command list</h2>
            <h3 className="subtitle">
              Click below to upload your list of custom commands and install them on your channel.
            </h3>

            <form>
              <label htmlFor="file" className="se-input-install-commands">Choose JSON file</label>
              <input type="file" id="file" accept=".json" style={{ display: "none" }} onChange={(e) => { testJSON(e) }} />
              <span className={` status-indicator ${isValidJSON == true ? "valid" : isValidJSON == false ? "invalid" : ""}`}></span>

              <div id="result" style={{ "padding": "0.5rem" }}></div>

              {commandList.length > 0 && (
                <>
                  <h3>Please select the commands you want to install and click on the Install button:</h3>

                  {/* Button to toggle all scopes at once */}
                  <button onClick={(e) => {
                    e.preventDefault();
                    if (commandsToInstall.length === 0) setCommandsToInstall(commandList);
                    else setCommandsToInstall([]);
                  }}>
                    {commandsToInstall.length === 0 ? "Select all commands" : "Deselect all commands"}
                  </button>

                  <br /><br />

                  <button type="submit" id="submit" className="se-install-commands" onClick={(e) => {
                    e.preventDefault();
                    installList();
                  }} >
                    Install selected commands
                  </button>

                  <br /><br />

                  {/* Show result of the installation */}
                  {loading && <p>Loading...</p>}



                  {/* Checkbox for each scope */}
                  <div style={{
                    fontSize: "0.8rem",
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "0.5rem 1rem"
                  }}>
                    {commandList.map((item) => (
                      <div key={item}>
                        <input
                          type="checkbox"
                          id={item}
                          value={item}
                          checked={commandsToInstall.includes(item)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setCommandsToInstall([...commandsToInstall, item]);
                            } else {
                              setCommandsToInstall(commandsToInstall.filter((s) => s !== item));
                            }
                          }}
                        />
                        <label htmlFor={item}>{item}</label>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </form>

            <dialog id="code-generated" >
              <h3 id="dialog-title"></h3>
              <p id="dialog-result"></p>
              <div id="dialog-copy">
                <button style={{ padding: "0.5rem", marginRight: "0.5rem" }} id="cancel" onClick={() => document.querySelector("#code-generated").close()}>Close</button>
              </div>
            </dialog>

            <Dialog />
          </>
        }
        {error && <p className="error red">Error: {error}</p>}
      </main>
      <FooterComponent />
    </div >
  );
}
