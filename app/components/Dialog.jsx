import React from 'react';

// This variable will get the pathname from the pages that use the openDialog() function
// So that the page can reload to the same page when integration is removed
//  "data" gets its value from openDialog() and used in confirmRemoval(), at the end
let data;

export function Dialog() {
  return (
    <>
      <dialog id="copy-success" style={{ visibility: "visible", marginLeft: "10px", backgroundColor: "var(--popup-color)" }}>Copied to clipboard</dialog>
      <dialog id="dialog" className="dialog">
        <div id="dialog-title">Are you sure you want to remove the integration?<br />You can re-add it at any time.</div>
        <br />
        <div id="dialog-buttons">
          <button id="submit" style={{ padding: "0.5rem", marginRight: "0.5rem" }} type="submit" onClick={() => confirmRemoval(data)}>Confirm</button>
          <button id="cancel" style={{ padding: "0.5rem", marginRight: "0.5rem" }} type="reset" onClick={closeDialog}>Cancel</button>
        </div>
      </dialog>
    </>
  )
}

export async function openDialog(e) {
  data = e;
  const dialog = document.querySelector("#dialog");
  dialog.style.marginLeft = "auto";
  dialog.showModal();
}

function closeDialog() {
  const dialog = document.querySelector("#dialog");
  dialog.close();
}

async function confirmRemoval(data) {
  const dialogTitle = document.querySelector("#dialog-title");
  const submit = document.querySelector("#submit");
  const cancel = document.querySelector("#cancel");
  dialogTitle.innerText = "Removing integration, please wait...";
  submit.style.display = "none";
  cancel.style.display = "none";

  setTimeout(async () => {
    const request = await fetch("/api/logout", { "method": "POST" });
    const response = await request.json();

    dialogTitle.innerHTML = `${response.message}.<br/> Reloading page...`;
  }, 1500);

  setTimeout(() => {
    window.location.assign(data.pathName);
  }, 3000);
}
