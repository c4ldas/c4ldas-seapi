SEAPI written for [Next.js](https://nextjs.org) and hosted on [Vercel](https://vercel.com).

<h2>Getting Started</h2>

This project aims to be the same as https://seapi.c4ldas.com.br/ but using [Next.js](https://nextjs.org) and hosted on [Vercel](https://vercel.com).

<h2>Structure</h2>

> **Note**: This project is not yet finished, please check back later for updates.

At the moment the structure of the application is:

<pre>
/
|- public/
|  |-- images/
|  |-- css/
|
|- app/
|  |--components/
|  |--lib/                    # pending (check if the account ID is already registered. If so, uses the same tag)
|  |
|  |--(frontend)/
|  |  |-- homepage            # done
|  |  |-- login/              # done
|  |  |-- share/              # done
|  |  |-- install/            # done
|  |  |-- show-shared/        # done
|  |  |-- leaderboard/        # pending
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
