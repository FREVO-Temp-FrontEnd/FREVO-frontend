# Portfolio detail prototype

This is an isolated visual prototype for review. Open `design/portfolio-detail-prototype.html` through the local Vite server. The production portfolio route, content model, theme, and editing flow were not changed.

## Design read

Portfolio case-study page for freelancers and business reviewers. Preserve FREVO's orange `#f4490b` / `#bd3d14`, dark ink `#20201f`, light background `#f7f8f6`, Archivo headings, Space Grotesk body, rounded surfaces and pill controls. Target dials: DESIGN_VARIANCE 6, MOTION_INTENSITY 2, VISUAL_DENSITY 3. This is a visual redesign prototype that preserves the existing project information.

## Current page audit

The current detail page gives the header, gallery, story, reviews, related work, and metadata the same 2px bordered card treatment. The first image appears below a large heading card. The gallery uses a dense grid even when there are only four assets. Role, contribution, and project metadata are separated across distant sections. This makes the main artifact and the freelancer's specific work harder to scan. Existing routes, back navigation, edit button, image enlargement, media error handling, and privacy rules remain relevant.

## References and application

- [Behance project basics](https://help.behance.net/hc/en-us/articles/204483644-Guide-Project-Basics) describes a project as one story composed of images, text and other media. The prototype pairs a concise title and summary with a dominant image.
- [Adobe Portfolio guidance](https://help.myportfolio.com/hc/en-us/articles/212835888-How-to-create-a-portfolio-that-gets-noticed) recommends leading with a strong overview image, then selected details and backstory. The prototype starts with one large image and a compact four-image selector, then the project story.
- [Adobe Portfolio image and grid guidance](https://help.myportfolio.com/hc/en-us/articles/360035920114-Add-images-and-photo-grids) distinguishes single images from grouped photos. The prototype uses a single focused viewer plus thumbnails instead of equal-size gallery tiles.
- [Material Design layout guidance](https://m2.material.io/design/layout/understanding-layout.html) advises keeping reading lines to a comfortable length. The story column is width-limited and the supporting contribution sits beside it on desktop, below it on mobile.
- [W3C WCAG 2.2](https://www.w3.org/TR/wcag/) requires 4.5:1 contrast for normal text and 3:1 for essential interface boundaries. The prototype uses dark body text, a dark orange primary action and visible focus outlines.

These sources inform the hierarchy and interaction pattern; the layout and styling are original to FREVO.

## Prototype scope

The Mộc Coffee artwork is an AI-generated, four-scene contact sheet stored only in `design/portfolio-moc-contact-sheet.png`. It replaces mismatched demo imagery for this preview and is not an authenticated project asset. The related-work images still come from the existing demo data. The summary and explanatory paragraph are illustrative copy based on the current seed and should be reviewed before implementation.

The thumbnail selector and image dialog work. Back, edit, navigation, and related-work controls provide labeled prototype feedback; they do not change product data. The production editor and permissions remain untouched.

## Verification

`capture-portfolio-detail-prototype.mjs` produces desktop and mobile screenshots and records checks in `portfolio-detail-prototype-checks.json`. Both sizes have no horizontal overflow. Gallery selection and image enlargement pass. Browser page errors: none. The prototype was visually reviewed at 1440px and 390px widths.
