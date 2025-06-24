<h2>Getting Started</h2>

<p>This project aims to have an easy way to share and install Streamelements overlays in your Twitch channel using a simple code or URL. Also, here I am going to share some widgets that I created so the community can use it on their channels.</p>

<p>Most of the overlays are written for Twitch, but nothing is stopping you from using them on other platforms (unless they are specifically designed for it).</p>

<p>A small portion of the page is dedicated to custom endpoints. At the moment, there are only two endpoints. One is the top leaderboard and the other is the top watchtime. Both can be used on your stream chat. Suggestions for new endpoints are highly accepted.</p>

<p>If you find any issues on the page or something is not working as expected, please let me know. Also, if you have any idea or suggestions feel free to contact me.</p>

<p>You can find instructions on how to use it below:</p>

<a href="#if-you-want-to-share-an-overlay-you-created">How to share an overlay</a>
<br /><br />
<a href="#if-you-want-to-install-an-overlay">How to install an overlay</a>
<br /><br />
<a href="#if-you-want-to-see-which-overlays-you-have-shared">How to check the overlays I shared / how to unshare them</a>

<h2>Webpage</h2>

<p>The project main URL is: </p>
<p><a href="https://seapi.c4ldas.com.br" target="_blank">https://seapi.c4ldas.com.br</a></p>

<h2>How to use</h2>

<h3>If you want to share an overlay you created:</h3>
<ul>
  <li>Go to https://seapi.c4ldas.com.br and click on <code>Share overlay / widget</code>;</li>
  <li>Click on <code>Login with Streamelements</code> and authorize the application to have access to your overlays;</li>
  <li>After authorization, the page will show all of your overlays, simply click on the one you want to share and a popup will appear with a Quicklink and code;</li>
  <li>Copy that Quicklink or code and send to your friend.</li>
</ul>

<h3>If you want to install an overlay:</h3>
<p>Option 1: You received a Quicklink:</p>
<ul>
  <li>Just open it and login with your Streamelements account;</li>
  <li>Overlay will be installed automatically;</li>
</ul>

<p>Option 2: You have received a code:</p>
<ul>
  <li>Go to https://seapi.c4ldas.com.br and click on <code>Install overlay / widget</code>;</li>
  <li>Click on <code>Login with Streamelements</code> and authorize the application to install overlays on your account;</li>
  <li>After authorization, type the overlay code in the text box and click on <code>Install overlay</code>;</li>
  <li>The overlay will be installed in your account;</li>
  <li>To configure it, click on <code>Overlay Config Page</code> link;</li>
  <li>To add it to OBS, click on <code>OBS Browser source</code> and create a new browser source with the URL copied;</li>
  <li>Alternatively, you can just drag the button called <code>Drag me to OBS Studio</code> to your OBS and the overlay will be added directly.</li>
</ul>

<h3>If you want to see which overlays you have shared:</h3>
<ul>
  <li>Go to https://seapi.c4ldas.com.br and click on <code>My shared overlay / widgets</code>;</li>
  <li>If you haven't connected, click <code>Login with Streamelements</code> and authorize the application;</li>
  <li>After authorization, you will see the overlays you have shared and the corresponding code;</li>
  <li>If you want to remove it, just click on the 🗑️ icon and confirm;</li>
  <li>Attention: That will not remove the overlay from the accounts that have it installed! It will just remove the option to be installed again.</li>
</ul>
  
<h2>Code and hosting</h2>

<p>This project is written using Javascript and Next.js. It is hosted on Vercel using a hobby account (free plan).</p>

<h2>Structure</h2>

At the moment the structure of the application is:

<pre>
/
|- public/
|  |-- images/
|  |-- css/
|
|- app/
|  |--components/
|  |--lib/                    
|  |
|  |--(frontend)/
|  |  |-- homepage            # done
|  |  |-- login/              # done
|  |  |-- share/              # done
|  |  |-- install/            # done
|  |  |-- show-shared/        # done
|  |  |-- leaderboard/        # done
|  |  |-- endpoints/          # done
|  |  |-- redemptions/        # done
|  |  |-- json-textify/       # done
|  |  
|  |--api/
|     |-- overlays/
|     |     |-- install/      # done
|     |     |-- list/         # done
|     |     |-- share/        # done
|     |     |-- show-shared/  # done
|     |     |-- unshare/      # done
|     |
|     |-- redemptions/
|     |     |-- download/     # done
|     |
|     |-- github/
|     |    |-- widgets/       # done
|     | 
|     |-- logout/             # done
|     |-- callback/           # done
|     |-- top/                # done
|     |-- watchtime/          # done
|     |-- json-textify/       # done
</pre>
