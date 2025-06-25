"use client"

import Header from "@/app/components/Header";
import FooterComponent from "@/app/components/Footer";
import { useState, useEffect } from "react";

export default function Valorant({ params, searchParams }) {

  const [isLoading, setIsLoading] = useState(false);
  const [origin, setOrigin] = useState('');
  const [site, setSite] = useState('');
  const [msg, setMsg] = useState();

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    const submitter = e.nativeEvent.submitter.id;
    submitter === "formatted" ? showFormatted(e) : generateCode(e);
  }

  async function showFormatted(e) {
    e.preventDefault();
    setIsLoading(true);
    document.querySelector("#response").innerText = "";

    const request = await fetch("/api/json-textify?" +
      new URLSearchParams({
        channel: "$(channel)",
        msg: msg,
        site: site,
      }), {
      method: "GET",
    })

    const response = await request.text();
    document.querySelector('#response').innerText = response;
    setIsLoading(false);
  }

  async function generateCode(e) {
    e.preventDefault();
    document.querySelector('#response-code').style.visibility = 'hidden';
    setTimeout(() => document.querySelector('#response-code').style.visibility = 'visible', 250);

    const responseCode = `.me $(touser) ► $\{customapi.${origin}/api/json-textify?channel=$(channel)&site=${site}&msg="${msg}"\}`;

    document.querySelector('#response-code').innerText = responseCode;
  }

  function copyToClipboard(event) {
    const copyText = document.querySelector("#response-code");
    navigator.clipboard.writeText(copyText.innerText);

    const dialog = document.getElementById("popup");

    // Show the dialog next to the clicked element
    dialog.style.top = (event.pageY - 70) + "px";
    dialog.style.marginLeft = (event.pageX) + "px";
    dialog.show();

    // Close the dialog after 2 seconds
    setTimeout(() => dialog.close(), 2000);
  }

  return (
    <div className="container">
      <Header />
      <main className="main block">
        <h1>JSON Textify</h1>
        <h3>How to use this endpoint on Streamelements</h3>
        <p>This API will read the JSON response from the website and convert the values in parenthesis to JSON paths, returning its value</p>
        <div style={{ paddingTop: "10px" }}>
          <code className="code">
            $(touser) ► $(customapi.{origin}<wbr />/api/json-textify<wbr />
            ?channel=$(channel)<wbr />
            &site=<span className="red">SITE_WITH_JSON_DATA</span><wbr />
            &msg=&quot;<span className="red">MESSAGE</span>&quot;)
          </code>
        </div>

        <h3>Example:</h3>
        <p>Let&apos;s say you want to show the first ability name of Pok&eacute;mon Pikachu from PokeAPI:</p>
        <div>site=<span className="blue">https://pokeapi.co/api/v2/pokemon/pikachu</span></div>
        <div>msg=&quot;<span className="blue">First ability: (abilities[0].ability.name)</span>&quot;</div>

        <p>The command will be:</p>
        <code className="code">
          $(touser) ► $(customapi.{origin}<wbr />/api/json-textify<wbr />
          ?channel=$(channel)<wbr />
          &site=https://pokeapi.co/api/v2/pokemon/pikachu<wbr />
          &msg=&quot;First ability: (abilities[0].ability.name)&quot;)
        </code>

        <p>This is the response:</p>
        <code className="code">
          First ability: static
        </code>

        <p>
          <strong>
            Note:
          </strong>
          <br /> You can format the message and use as many JSON paths as you want in the message.
          <br /> Just make sure the path is correct and to add them inside parenthesis.
        </p>

        <hr />

        <h2>Configure your message</h2>
        <div>You can use the box below to configure your chat message.</div>

        <form id="form" onSubmit={handleSubmit} className="form" style={{ paddingTop: "10px" }}>
          <input type="text" id="site" className="site" placeholder="site: https://pokeapi.co/api/v2/pokemon/pikachu" onChange={(e) => { setSite(e.target.value) }} required={true} />
          <input type="text" id="message" className="message" placeholder="msg: First ability: (abilities[0].ability.name)" onChange={(e) => { setMsg(e.target.value) }} required={true} />

          <input type="submit" id="formatted" className="formatted" value="Show response" />
          <input type="submit" id="generate-code" className="generate-code" value="Generate chat code" />
          {isLoading && (<div id="loading" className="loading">Loading...</div>)}
          <div id="response" className="response"></div>
          <div id="response-code" className="response-code" onClick={copyToClipboard}></div>
        </form>

        <dialog id="popup" style={{ backgroundColor: "var(--popup-color)" }}>Copied to clipboard</dialog>
      </main >
      <FooterComponent />
    </div >
  );
}
