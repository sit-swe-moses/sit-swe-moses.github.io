# 🌸 sit-swe-moses.github.io

> **Navigating this Unwritten AI Era — Here we are.**  
> A vibrant, floral-tech personal portfolio and static web-utility garden hosted on GitHub Pages by **Moses Loh** (SIT Software Engineering).

---

## ✨ Features

- **Floral-Tech Aesthetic:** Bright botanical gradients paired with subtle engineering blueprint grid lines, glassmorphic navigation, and mouse-parallax SVG blossoms.
- **Choreographed Entrance & Smooth Scrolling:** First-load staggered reveal animations and smooth-scroll navigation triggers for **About Me** and **Resources**.
- **Consistent-Height 3D Flip-Card System:** 2-column responsive card grids (`--card-height: 255px`) supporting hover, tap, and keyboard (`Enter`/`Space`) flipping.
- **4 Reusable Back-of-Card Layouts:**
  1. `layout-left-img` — Left thumbnail image, right text description.
  2. `layout-right-img` — Right thumbnail image, left text description.
  3. `layout-top-img` — Top banner image, bottom text description.
  4. `layout-two-col-list` — Structured 2-column bulleted text list.
- **Zero-Build Static Architecture:** Built with semantic HTML5, Tailwind CSS (CDN), modular custom CSS, and vanilla JavaScript—ready to deploy directly on GitHub Pages without bundlers.

---

## 📁 Repository Directory Structure

```text
sit-swe-moses.github.io/
├── index.html          # Main landing page (About Me & Resources grids)
├── example.html        # Live UI reference showcasing all 4 flip-card layouts & templates
├── css/
│   └── main.css        # Shared styles, gradients, animations, and 3D flip-card layouts
├── js/
│   └── main.js         # Scroll reveal observer, smooth navigation, parallax, and routing
├── assets/
│   └── images/         # Local images, thumbnails, and card backgrounds
├── resources/          # Standalone static mini-apps and utility webpages
│   └── ...             # e.g., calculator.html, converters, study tools
└── README.md           # Project documentation
```

---

## 🚀 Adding New Cards & Resources

### 1. Add a New Resource Page
1. Place your new static webpage inside the `resources/` directory (e.g., `resources/calculator.html`).
2. Open `example.html` to pick one of the 4 card layouts (`layout-left-img`, `layout-right-img`, `layout-top-img`, or `layout-two-col-list`).
3. Copy the `<article class="flip-card is-resource ...">` block into the `#resources` grid in `index.html` and update `data-href`:

```html
<article
  class="flip-card is-resource reveal-item"
  tabindex="0"
  role="link"
  aria-label="Open Calculator Page"
  data-href="./resources/calculator.html"
  onclick="navigateToRepoPage(this.dataset.href)">
  <!-- Front & Back card faces -->
</article>
```

### 2. Linking Shared Styles from Inside `resources/`
When creating pages inside `resources/`, reference shared stylesheets, scripts, and home links using `../`:

```html
<link rel="stylesheet" href="../css/main.css" />
<a href="../index.html">← Back to Digital Garden</a>
<script src="../js/main.js"></script>
```

---

## 🛠️ Local Preview

Because the site uses standard relative paths (`./css/main.css`, `./js/main.js`), you can preview it locally using any lightweight static server:

```bash
# Using Python
python3 -m http.server 8000

# Or using VS Code Live Server extension
```

Then visit `http://localhost:8000` in your browser.

---

## 🌸 Credits & Acknowledgments

- **Author:** [Moses Loh](https://www.linkedin.com/in/moses-loh/) — SIT Software Engineering
- **AI Assistance:** Built with [Google Gemini (Gemini 4 Hydrogen)](https://deepmind.google/models/model-cards/gemini-4-hydrogen/)
- **Hosting:** [GitHub Pages](https://pages.github.com/)