# irisjeanjames.com

Static site. No build step. Open index.html through any local web server (for example `python3 -m http.server`) because the site list loads from sites.json.

## Edit
- Sites and categories: sites.json
- Screenshots: save as assets/shots/<domain>.webp (for example assets/shots/highcountry.guide.webp), 4:3, about 800 px wide. A tile shows the leaf placeholder until its screenshot exists.
- Contact address: search index.html for hello@irisjeanjames.com and confirm it is a real mailbox.
- Fonts (Fraunces and Literata) are bundled in assets/fonts, so the site loads no third-party fonts.

## Deploy
GitHub Pages: push to a repo, Settings > Pages > deploy from branch. Add a file named CNAME containing irisjeanjames.com only when you are ready to switch the domain.
Cloudflare Pages: connect the repo, no build command, output directory is the repo root.
