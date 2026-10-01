# hiteshkhatana.com

Personal portfolio of Hitesh Khatana. Next.js 16, React 19, three.js (via @react-three/fiber) and Framer Motion.

## Run it locally

Requires Node.js 20 or newer.

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
npm start          # serve the production build
```

## Edit your content

| What | File |
| --- | --- |
| Name, email, links, headline, hero stats, "What I do" cards, roles, awards, education | `data/profile.ts` |
| Projects | `data/projects.ts` |
| Skills, grouped | `data/skills.ts` |
| Passages the "Ask my résumé" demo can answer from | `data/corpus.ts` |
| Résumé PDF | `public/HiteshKhatana_Resume.pdf` |

### Add a new project

Open `data/projects.ts`, copy any object in the `projects` array, and change the fields. The project cards, case-study panel and the ⌘K menu update automatically. Keep the strongest project first. `accent` picks the card colour: `cyan`, `amber` or `violet`. `links`, `metrics`, `note` and `next` are optional.

To make the "Ask my résumé" demo know about it too, add a passage to `corpus` in `data/corpus.ts`.

## Deploy to Vercel with your domain

1. Push this folder to a GitHub repository.
2. Go to vercel.com, choose **Add New → Project**, and import the repository. Leave the defaults; Vercel detects Next.js.
3. In the project, open **Settings → Domains** and add `hiteshkhatana.com`, then `www.hiteshkhatana.com` (set one to redirect to the other).
4. Vercel shows the DNS records to add. At your domain registrar, add them (typically an `A` record for the apex domain and a `CNAME` for `www`). HTTPS is issued automatically once DNS resolves.

Every push to `main` redeploys the site.

## Project structure

```
app/          layout, page, global styles, SEO routes (sitemap, robots, OG image, icon)
components/   one file per section or interaction
data/         all content
public/       résumé PDF
```

## Notes

- Fonts are self-hosted through Fontsource, so builds don't depend on Google Fonts.
- The 3D hero pauses when scrolled out of view and uses fewer points on phones.
- Everything respects the visitor's reduced-motion setting.
