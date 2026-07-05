# CODEBUDDY.md

This file provides guidance to CodeBuddy Code when working with code in this repository.

## Project Overview

A personal blog built with **Hexo 5.4.0**, using the **Landscape** theme (heavily customized). Originally migrated from WordPress. The blog is authored in Chinese (zh-CN). Deployed to Gitee Pages (`mimonarchrd.gitee.io`) via `hexo-deployer-git`, with a Travis CI pipeline that also deploys to GitHub Pages.

## Commands

```bash
npm install          # Install dependencies
npm run server       # Start local dev server (hexo server)
npm run build        # Generate static files (hexo generate)
npm run clean        # Clean generated files and cache (hexo clean)
npm run deploy       # Deploy to Gitee (hexo deploy)
hexo new "Title"     # Create a new post
hexo new draft "Title"  # Create a new draft
hexo publish "Title"    # Move draft to posts
```

No linter or formatter is configured in this project.

## Architecture

### Directory Layout

```
_config.yml          # Main Hexo config (site metadata, permalink, deployment, live2d)
package.json         # Hexo + plugins
scaffolds/           # Templates for new posts/drafts/pages
source/
  _posts/            # Published posts (Markdown with YAML front-matter)
  _drafts/           # Draft posts
  about/             # Static pages
  friends/
  tags/
  categories/
  privacy-policy/
themes/landscape/    # Active theme — customized default Landscape
live2d_models/       # Live2D mascot model assets (Hatsune Miku)
```

### Theme Customizations (themes/landscape/)

The Landscape theme has several custom integrations that differ from the upstream default:

- **Valine comments**: Initialized in `layout/layout.ejs` (lines 17-23) with hardcoded LeanCloud appId/appKey. Comment div rendered in `layout/_partial/article.ejs` (lines 33-40). Valine JS loaded in `layout/_partial/head.ejs` (line 25).
- **Table of Contents**: Conditional TOC sidebar in `layout/_partial/article.ejs` (lines 1-8). Enabled per-post via `toc: true` in front-matter.
- **jQuery**: Loaded from bootcdn (Chinese CDN) in `layout/_partial/after-footer.ejs` (line 17).
- **Live2D widget**: Configured in root `_config.yml` under `live2d`, using local model from `live2d_models/live2d-widget-miku/`.

### Template & Style Stack

- **Templates**: EJS (`.ejs` files in `themes/landscape/layout/`)
- **CSS**: Stylus (`.styl` files in `themes/landscape/source/css/`, entry point `style.styl`)
- **Markdown renderer**: `hexo-renderer-marked`

### CSS Architecture

- Variables defined in `themes/landscape/source/css/_variables.styl` (colors, fonts, layout grid)
- Grid system: 12 columns (9 main + 3 sidebar), 80px columns + 20px gutters
- Responsive breakpoints: mobile (<479px), tablet (480-767px), desktop (>=768px)
- Component styles split across `_partial/` and utility mixins in `_util/`

### Permalink Structure

Posts use `passages/:title/` permalink pattern (configured in `_config.yml`).

### Content Front-Matter

New posts use minimal front-matter (title, date, tags). WordPress-migrated posts retain `url` and `id` fields from the original site. Posts can reference images hosted on `static.xiaoblogs.cn` CDN.

## Deployment

- **Primary**: `hexo deploy` pushes to Gitee (`https://gitee.com/mimonarchrd/mimonarchrd.git`, branch `master`)
- **CI**: Travis CI (`.travis.yml`) builds on master and deploys to GitHub Pages via `$GH_TOKEN`
