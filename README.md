<h2>Getting Started</h2>

<p>This project aims to have an easy way to share and install Streamelements overlays in your Twitch channel using a simple code. Also, here I am going to share some widgets that I created so the community can use it on their channels.</p>

<p>Most of the overlays are written for Twitch, but nothing is stopping you from using them on other platforms (unless they are specifically designed for it).</p>

<p>A small portion of the page is dedicated to custom endpoints. At the moment, there are only two endpoints. One is the top leaderboard and the other is the top watchtime. Both can be used on your stream chat. Suggestions for new endpoints are highly accepted.</p>

<p>If you find any issues on the page or something is not working as expected, please let me know. Also, if you have any idea or suggestions feel free to contact me.</p>

<h2>Webpage</h2>

<p>The project main URL is: </p>
<p><a href="https://seapi.c4ldas.com.br" target="_blank">https://seapi.c4ldas.com.br</a></p>

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
|  |  
|  |--api/
|     |-- overlays/
|     |     |-- install/      # done
|     |     |-- list/         # done
|     |     |-- share/        # done
|     |     |-- show-shared/  # done
|     |     |-- unshare/      # done
|     |
|     |-- github/
|     |    |-- widgets/       # done
|     | 
|     |-- logout/             # done
|     |-- callback/           # done
|     |-- top/                # done
|     |-- watchtime/          # done
</pre>
