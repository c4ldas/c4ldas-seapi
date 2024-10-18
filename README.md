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
|  |--lib/
|  |
|  |--(frontend)/
|  |  |-- homepage          # done
|  |  |-- login/            # done
|  |  |-- share/            # done
|  |  |-- install/          # in progress (pending removal of access_token)
|  |  
|  |--api/
|     | 
|     |-- overlays/
|     |     |-- install/    # in progress
|     |     |-- share/      # done
|     |
|     |-- github/
|     |    |-- widgets/     # done
|     |
|     |-- logout/           # done
|     |-- callback/         # in progress (pending removal of access_token)
|     |-- top/              # pending
|     |-- watchtime/        # pending
</pre>
