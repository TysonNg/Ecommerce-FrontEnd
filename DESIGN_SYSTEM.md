# E-Shop Frontend Design System & Style Guide

> **Core Philosophy**: Clean, trustworthy, and modern Electronic eCommerce store modeled after the classic Astra/Elementor retail aesthetic. All UI elements, micro-interactions, and texts must strictly follow these conventions.

---

## 1. Language & Localization Rule

> [!IMPORTANT]
> **Strict Rule**: 100% of all UI labels, button texts, toast messages, placeholders, badges, and modals must be in **English**.
> - ✅ Examples: "Shopping Cart", "View Cart", "Checkout", "Add to cart", "Added to cart!", "Subtotal:", "Today's best deal", "Categories", "Sale!".
> - ❌ Never use Vietnamese or mixed languages in UI elements.

---

## 2. Color Palette (Tokens)

| Token Name | Hex Code | Usage |
| :--- | :--- | :--- |
| `primary-blue` | `#0573f0` | Main brand color, Navbar background, active category links, hover highlights, primary checkout buttons. |
| `dark-header-blue` | `#0769da` | Top utility/support bar background. |
| `navbar-border` | `#4068d3` | Divider between logo search bar and navigation links. |
| `page-bg` | `#f8fbfc` | Base background for the whole store (clean, bright, subtle cool gray). |
| `card-bg` | `#ffffff` | Background for product cards, section shelves, modal popups, and drawer. |
| `border-subtle` | `#dce3e5` | Standard border for product cards, section containers, quantity selectors, and tables. |
| `border-medium` | `#c3c3c3` | Sidebar category dividers, dropdown border. |
| `charcoal-cta` | `#333333` / `#2b323e` | Standard dark button fill for "View Cart", "Checkout", "Add to Cart" on detail page. Hovers to `#0573f0`. |
| `card-cart-bg` | `#f1e0e0` | **Signature product card cart button background** (subtle pale blush pink). |
| `card-cart-icon` | `#48515b` | Icon color inside the product card cart button. |
| `sale-tag-bg` | `#ffffff` | Background of the Sale! tag pill on product cards. |
| `text-primary` | `#171717` / `#2b323e` | Headings, product titles, bold prices. |
| `text-secondary` | `#48515b` | Regular body text, strikethrough original prices, descriptions. |
| `text-muted` | `#5e6d73` / `#6e97a5` | Small category hints, subtitle descriptions. |
| `danger` | `#e5484d` / `#ff6b6b` | Delete item button, logout, error states. |
| `success` | `#10b981` | Success checkmarks, toast success accent. |

---

## 3. Typography & Text Hierarchy

- **Font Family**: Modern Sans-Serif (`Geist Sans`, `Arial`, `Helvetica`, `sans-serif`).
- **Headings**:
  - `Hero / Shop title`: `text-3xl` to `text-5xl font-bold` (e.g. `SHOP`, `Brand's deal`).
  - `Section Header`: `text-[1.2rem]` or `text-xl font-bold` with optional `see more` link in `#5774e9 font-bold text-sm`.
  - `Product Card Title`: `text-sm font-semibold text-slate-800 line-clamp-2 hover:text-blue-600 transition-colors`.
- **Prices**:
  - Regular price: `text-xs` or `text-sm font-bold text-slate-900` formatted with `.00` (e.g. `$44.00`).
  - Strikethrough previous price: `text-xs line-through text-[#48515b]` (e.g. `$59.00`).

---

## 4. Component Patterns & Signatures

### A. Product Card (`ProductCard`)
- **Card Container**:
  - Clean white surface `bg-white rounded-lg` (or `rounded-2xl`).
  - Subtle hover elevation: `hover:-translate-y-1 hover:shadow-lg transition-all duration-300`.
- **Thumbnail Image**:
  - Square container with centered object-contain image.
- **Sale Tag**:
  - Pill placed at top-left: `border border-[#dce3e5] bg-white rounded-2xl text-xs text-[#48515b] p-1.5 absolute top-3 left-3`.
- **Card Cart Icon Button (Strict Vibe Signature)**:
  - Must use the original styling:
    ```tsx
    <FontAwesomeIcon
      onClick={(e) => handleAddToCart(e)}
      className={`${
        isHovered ? "opacity-100" : "opacity-0"
      } transition-opacity duration-300 hover:opacity-80 text-[#48515b] text-sm cursor-pointer absolute rounded-full py-1.5 px-1.5 top-3 bg-[#f1e0e0]`}
      style={{ right: `${cartRem}rem` }}
      icon={faCartShopping}
    />
    ```

### B. Quantity Selector (`HandleCart`)
- **Box Style**:
  - Border: `border-2 border-[#dce3e5]` or `border border-slate-200`.
  - Buttons (`-` and `+`): Background `#f8fbfc`, cursor pointer, font bold.
  - Number display: Center-aligned, padded, font semibold text `#696969` or `text-slate-800`.

### C. Slide-Over Cart Drawer (`CartTab`)
- **Positioning**: Always `fixed top-0 right-0 bottom-0 z-[9995]` with `w-full max-w-[360px] sm:max-w-[400px]`.
- **Backdrop**: `fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-[9990]`.
- **Header**: `Shopping Cart` + item count badge + close button (`✕`).
- **Item Row**: Thumbnail (60x60px), product name (2-line clamp), quantity adjuster, total item price (`$XX.00`), and delete button.
- **Footer**: `Subtotal: $XX.00`, plus two buttons:
  - `View Cart`: Outline / secondary button leading to `/cart`.
  - `Checkout`: Primary Blue `#0573f0` leading to `/cart/checkout`.

### D. Toast Notifications (`ToastContainer`)
- **Positioning**: Floating fixed at `fixed bottom-5 right-5 z-[9999]`.
- **Content**:
  - Green checkmark badge.
  - Title: `"Added to cart!"`.
  - Description: `"Item has been added to your shopping cart."`.
  - Rich product preview: Thumbnail image, name, price, quantity pill.
  - Quick Action button: `"View Cart"` with cart icon, triggers `openCartModal()`.
  - Shrinking progress bar (4 seconds duration).

### E. Skeleton Loading (`ProductSkeleton`)
- **Shimmer Effect**: `@keyframes shimmer` moving linear gradient from `#e9eff4` to `#f8fafc`.
- **Structure**: Mirrors actual components (Hero Banner, Services bar, Categories grid, and 4 or 6 column Product Grids) to prevent Cumulative Layout Shift (CLS).

---

## 5. Responsive Grid & Container Standards

All page sections must share standard container widths:
```scss
xl:w-[1200px] lg:w-[1024px] md:w-[768px] sm:w-[640px] w-full px-4 mx-auto
```

- **4-Product Grid**:
  ```html
  <ul className="grid xl:grid-cols-16 sm:grid-cols-8 grid-cols-4 gap-4">
    <!-- Each ProductCard has col-span-4 -->
  </ul>
  ```
- **6-Product Grid**:
  ```html
  <ul className="grid xl:grid-cols-12 sm:grid-cols-8 grid-cols-4 gap-4">
    <!-- Each ProductCard has col-span-4 -->
  </ul>
  ```

---

## 6. Checklist Before Committing UI Code

### Admin workspace exception

The `/admin` workspace uses the same English labels, Geist font, blue/charcoal
palette, white surfaces and subtle gray borders. Its data-focused interface uses
a 224px dark sidebar and the available content width instead of storefront grids.
Admin panels and tables are square; controls and badges have at most 4px corners.
Do not apply storefront shadows, hover elevation, shimmer gradients or backdrop
blur to admin components. Circular avatars are permitted.

1. [ ] Are all texts in English?
2. [ ] Does the product card retain the signature `bg-[#f1e0e0]` cart button?
3. [ ] Are container widths standardized (`xl:w-[1200px] ...`) without hardcoded broken classes?
4. [ ] Are links using relative paths (`/products/...`) and not `http://localhost:...`?
5. [ ] Is there proper visual feedback (Toast / Badge pop / Loading state) on interactive actions?
