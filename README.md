## SMP Fiesta Display

An elegant, full-screen display application for showcasing SMP Fiesta content. This project is built as a modern web front‑end with a focus on large-format screens, high legibility, and a dark, cinematic visual style.

### Features

- **Large-screen optimized layout**: Typography, spacing, and contrast tuned for TVs, projectors, and event displays.
- **Dark theme design**: Uses a deep, low‑glare background (`--color-background`) with high‑contrast foreground text.
- **Refined typography**: Combines a serif display font (`--font-display`) with a clean sans-serif body font (`--font-body`) for a polished look.
- **Reduced-motion friendly**: Honors the `prefers-reduced-motion` user setting to minimize animations where appropriate.

### Tech Stack

- **Framework**: Modern React-based SPA (single-page application)
- **Language**: TypeScript/JavaScript (depending on project configuration)
- **Styling**: Global CSS with design tokens defined on `:root` (e.g. `--color-text-primary`, `--color-background`)
- **Tooling**: Node.js-based bundler/dev server (e.g. Vite, Create React App, or similar)

### Getting Started

#### 1. Prerequisites

- **Node.js**: Recommended LTS version (e.g. 18+)
- **npm** or **yarn** (examples below use `npm`)

Check your versions:

```bash
node -v
npm -v
```

#### 2. Install dependencies

From the project root:

```bash
npm install
```

#### 3. Run the development server

```bash
npm run dev
```

Then open the printed local URL (commonly `http://localhost:5173` or similar) in your browser. The app is designed to run full‑screen, so for best results:

- **Use full-screen mode** in the browser (F11 on Windows).
- **Disable browser UI elements** where possible (e.g. hide bookmarks bar).

#### 4. Build for production

```bash
npm run build
```

This creates an optimized production build in the output directory used by your bundler (commonly `dist/`). You can then serve that directory using any static file host or a simple Node/Express server.

### Deployment

You can deploy the built assets to any static hosting provider, such as:

- **Netlify**
- **Vercel**
- **GitHub Pages**
- **Static file hosting on a custom server**

Typical deployment flow:

1. Run `npm run build`.
2. Upload or point your host to the generated build directory (e.g. `dist/`).
3. Configure the host to serve `index.html` for all routes if you are using client-side routing.

### Styling & Theming

Global theming is defined in `src/index.css` using CSS custom properties:

- `--color-text-primary`, `--color-text-secondary`, `--color-text-muted`
- `--color-background`
- `--font-display`, `--font-body`

The base document styles:

- Set the background to the main theme color.
- Lock the viewport to full width and height.
- Use a larger base font size for readability on distant displays.

When adding or adjusting components, prefer using these CSS variables so the visual system stays consistent.

### Accessibility Considerations

- **Contrast**: Text colors are chosen to stand out clearly against the dark background.
- **Reduced motion**: If a user has `prefers-reduced-motion: reduce` set, animations and transitions are minimized.
- **Typography**: Larger default font size and adequate line-height improve readability from a distance.

If you introduce new animations, ensure they respect `prefers-reduced-motion`, and keep any critical information visible even when motion is reduced.

### Project Structure (Typical)

A typical structure for this project may look like:

```text
smp-fiesta-display/
  src/
    main.tsx / main.jsx
    App.tsx / App.jsx
    index.css
    components/
      ...
  public/
    ...
  package.json
  README.md
```

Component files under `src/components` should remain focused and composable so layouts are easy to rearrange for different display setups.

### Scripts (Common)

While exact scripts may vary, you will typically see:

- **`npm run dev`**: Start the development server with hot reloading.
- **`npm run build`**: Create an optimized production build.
- **`npm run preview`**: (If available) Preview the production build locally.

Check `package.json` for the exact set of scripts in this repository.

### Contributing

- **Branching**: Use feature branches for new work.
- **Commits**: Write clear, concise commit messages explaining the intent of the change.
- **Style**: Keep styling consistent with the existing CSS tokens and typography system.

Bug reports, feature suggestions, and improvements are welcome via issues and pull requests.



