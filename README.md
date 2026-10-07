# FUTURE_FS_03: Brew & Bloom Café Website and Live Pitch

A fast, mobile-friendly website for **Brew & Bloom**, a café on Church Street, Bengaluru. Built with plain HTML, CSS and JavaScript (no build step), for Future Interns Task 3.

**Live demo:** _add your link here_  ·  **Pitch:** see [PITCH.md](PITCH.md)

## What the website does
- **Menu with prices**, in categories (click any item for size, milk and extras): hot coffee, iced and cold brew, matcha and more, bites, desserts
- **Drink recommender:** four questions (caffeine, hot or iced, taste, milk) and it suggests the top three drinks
- **Custom drink builder:** pick Espresso, Cold Brew, Matcha or Milk, then milk (Regular, Oat, Coconut, Almond), hot or iced, size, syrup, sweetness and extras. The drawing and the price update live
- **Cart and ordering:** adjust quantities, choose pickup or dine-in, place the order, then send it to the café on WhatsApp
- **Loyalty points:** 1 point per ₹10, a welcome bonus, redeem 100 points for ₹50 off, and Bronze, Silver and Gold tiers
- **Customer dashboard:** points, tier progress, order history, favourite drink and one-tap reorder
- Story, why-us, filterable photo gallery with viewer, contact form (sends via WhatsApp) and footer
- Opening hours, address, Google Map, call and WhatsApp buttons, and local-business SEO

## Photos
The `images` folder already holds a photo for every menu item, the hero, the story section, the parallax band and a 12-photo gallery. To swap any photo, save a new .jpg with the same name in `images`, or open **photos.html** in Edge or Chrome and drag a photo onto its row. **PHOTOS.md** lists every file. The photos are stock photos for the demo: replace them with the café's own before launch.

## Important notes
- **All prices, hours and menu items are SAMPLE data.** Confirm them with the owner and edit `js/config.js`.
- The drink pictures are original illustrations drawn in code. For real photos, add them to `images/` and use `heroImage` or `gallery` (see config).
- This is a front-end demo: the cart, orders and points are saved **in the visitor's browser** (localStorage), and orders reach the café through WhatsApp. A production version would add a backend and database.

## Run it
Double-click `index.html`, or use the VS Code **Live Server** extension. No install needed.

## Edit it
Everything (name, phone, menu, prices, builder options, loyalty rules, hours) is in `js/config.js`.

## Deploy free on GitHub Pages
1. Push this folder to a public GitHub repo named `FUTURE_FS_03`.
2. On GitHub open **Settings, then Pages**.
3. Choose **Deploy from a branch**, branch `main`, folder `/ (root)`, then Save.
4. After a minute the site is live at `https://YOUR-USERNAME.github.io/FUTURE_FS_03/`.
