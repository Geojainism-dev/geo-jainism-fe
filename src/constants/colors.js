/**
 * GEO Jainism — Design System Color Tokens
 *
 * Single source of truth for the entire color palette.
 * CSS variables in landing.css mirror these values under .landing-root.
 *
 * Usage in JS/JSX:  import { PALETTE, DARK } from "@/constants/colors";
 * Usage in CSS:     var(--saffron), var(--lotus-pink), etc.
 */

// ─────────────────────────────────────────────────────────────────────────────
// SAFFRON PALETTE  —  Sacred-orange spine
// CSS vars: --saffron, --saffron-light, --marigold, --marigold-deep,
//           --turmeric, --ashoka-orange, --terracotta, --sandstone
// ─────────────────────────────────────────────────────────────────────────────
export const SAFFRON = {
  saffron:      "#F4A535", // --saffron        | primary accent, CTAs
  saffronLight: "#FDECC8", // --saffron-light  | subtle tints, pill backgrounds
  marigold:     "#F7D580", // --marigold        | highlights, shimmer accents
  marigoldDeep: "#E8A820", // --marigold-deep   | hover states, gradient end
  turmeric:     "#F5C842", // --turmeric        | decorative highlights
  ashoka:       "#F08030", // --ashoka-orange   | warm accent, dividers
  terracotta:   "#C8785A", // --terracotta      | earthy mid-tone
  sandstone:    "#E8D5B0", // --sandstone       | card borders, subtle strokes
};

// ─────────────────────────────────────────────────────────────────────────────
// SECONDARY PALETTE  —  Lotus · Tulsi · Sky · Cream · BG tones
// CSS vars: --lotus-pink, --lotus-deep, --tulsi-green, --tulsi-deep,
//           --sky-pale, --cream, --bg-alt, --bg-deep
// ─────────────────────────────────────────────────────────────────────────────
export const SECONDARY = {
  lotus:       "#F2C4CE", // --lotus-pink   | pinkish tint, JourneyCarousel accent alt
  lotusDeep:   "#E8909F", // --lotus-deep   | deeper pink, Pakistan section accent
  tulsi:       "#C8DFC0", // --tulsi-green  | soft sage green, subtle fills
  tulsiDeep:   "#7DAF6E", // --tulsi-deep   | primary green accent, JourneyCarousel
  skyPale:     "#D8EEF5", // --sky-pale     | cool light blue, unused in main flow
  cream:       "#FDF8F0", // --cream / bg1  | page base background (light theme)
  bgAlt:       "#F5EBD8", // --bg-alt       | alternate section background
  bgDeep:      "#EBDFC4", // --bg-deep      | deeper warm background
};

// ─────────────────────────────────────────────────────────────────────────────
// NEUTRALS  —  Brown spine, ink, pearl
// CSS vars: --deep-brown, --ink, --pearl
// ─────────────────────────────────────────────────────────────────────────────
export const NEUTRALS = {
  deepBrown: "#3D2314", // --deep-brown | headings & text in light mode
  ink:       "#2A1A0E", // --ink        | body text, light mode
  pearl:     "#FAF6EF", // --pearl      | secondary bg, cards light mode
};

// ─────────────────────────────────────────────────────────────────────────────
// DARK THEME OVERRIDES
// Applied via  .landing-root[data-theme="dark"]  in landing.css
// These remap the same CSS variable names to dark values.
// ─────────────────────────────────────────────────────────────────────────────
export const DARK = {
  // Semantic remaps
  cream:       "#1A0E07", // --cream (dark)       | base bg in dark mode
  pearl:       "#221810", // --pearl (dark)        | card/section bg
  ink:         "#F2E7D3", // --ink (dark)          | body text
  deepBrown:   "#FAF0D9", // --deep-brown (dark)   | headings
  sandstone:   "#4A3420", // --sandstone (dark)    | subtle strokes
  saffronLight:"#3A2514", // --saffron-light (dark)| muted saffron tint

  // Base backgrounds
  bgMain:      "#140A04", // --bg-main      | page root background
  bgAlt:       "#1F140B", // --bg-alt       | section alternate bg
  textMain:    "#E8DFCE", // --text-main    | primary text
  textStrong:  "#FAF0D9", // --text-strong  | headings, emphasis
  cardBg:      "rgba(42,26,14,0.85)", // --card-bg
  cardBorder:  "rgba(244,165,53,0.35)", // --card-border

  // Section-specific dark backgrounds (from landing.css dark selectors)
  footer:           "#0A0603",
  timelineSection:  "linear-gradient(160deg,#1F140B 0%,#281B10 50%,#2F2015 100%)",
  coursesSection:   "linear-gradient(160deg,#1F140B 0%,#28190D 50%,#2F2015 100%)",
  shootingSection:  "linear-gradient(160deg,#18110A 0%,#23180E 100%)",
  donateSection:    "linear-gradient(135deg,#2A1A0E,#1A0E07)",

  // Commonly used inline dark rgba values (for components using useDarkMode hook)
  particleSaffronGlow: "rgba(244,165,53,0.9)",
  cardOverlay:         "rgba(42,26,14,0.88)",
  subtleText:          "rgba(240,223,180,0.70)",
  mutedText:           "rgba(200,223,192,0.65)",
};

// ─────────────────────────────────────────────────────────────────────────────
// FLAT EXPORT  —  handy for one-line destructuring
// e.g.  const { tulsiDeep, lotusDeep } = PALETTE;
// ─────────────────────────────────────────────────────────────────────────────
export const PALETTE = {
  ...SAFFRON,
  ...SECONDARY,
  ...NEUTRALS,
};
