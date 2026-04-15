# TRLweb

Official website for Translearn Education.

## Stack

- Gatsby 5
- Theme UI
- Sass
- Netlify CMS

## Local development

```bash
npm install --legacy-peer-deps
npm run develop
```

The legacy peer flag is currently required because the Netlify CMS dependencies in this site still use older peer ranges.

## Build

```bash
npm run build
```

## Content

- Page content lives in `src/content/pages`
- Blog posts live in `src/content/posts`
- Site metadata lives in `src/util/site.json`
- Netlify CMS config lives in `static/admin/config.yml`

## Deployment

- Repository: `https://github.com/uiewop/TRLweb`
- Production site: `https://translearn.ac.nz`
- Netlify project: `quizzical-jennings-af1411`
- CMS admin: `/admin`
