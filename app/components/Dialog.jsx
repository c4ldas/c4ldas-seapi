import React from 'react'

export function Dialog(props) {
  return (
    <>
      <dialog id="copy-success" style={{ visibility: "visible", marginLeft: "10px", backgroundColor: "var(--popup-color)" }}>Code copied to clipboard</dialog>
      <dialog id="dialog" className="dialog">
        <div id="dialog-title">Are you sure you want to remove the integration?<br />You can re-add it at any time.</div>
        <div id="dialog-buttons">
          <button id="submit" type="submit" onClick={confirmRemoval}>Confirm</button>
          <button id="cancel" type="reset" onClick={closeDialog}>Cancel</button>
        </div>
      </dialog>
    </>
  )
}

export async function openDialog() {
  const dialog = document.querySelector("#dialog");
  dialog.style.marginLeft = "auto";
  dialog.showModal();
}

function closeDialog() {
  const dialog = document.querySelector("#dialog");
  dialog.close();
}

async function confirmRemoval() {
  const dialogTitle = document.querySelector("#dialog-title");
  const submit = document.querySelector("#submit");
  const cancel = document.querySelector("#cancel");
  dialogTitle.innerText = "Removing integration, please wait...";
  submit.style.display = "none";
  cancel.style.display = "none";

  setTimeout(async () => {
    const request = await fetch("/api/logout", { "method": "POST" });
    const response = await request.json();

    dialogTitle.innerHTML = `${response.message}.<br/> Redirecting back to home page...`;
  }, 1500);

  setTimeout(() => {
    window.location.assign("/");
  }, 3000);
}

