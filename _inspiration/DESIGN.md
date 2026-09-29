---
name: International Neo-Construct
colors:
  surface: '#fbf9f4'
  surface-dim: '#dbdad5'
  surface-bright: '#fbf9f4'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3ee'
  surface-container: '#f0eee9'
  surface-container-high: '#eae8e3'
  surface-container-highest: '#e4e2dd'
  on-surface: '#1b1c19'
  on-surface-variant: '#47464a'
  inverse-surface: '#30312e'
  inverse-on-surface: '#f2f1ec'
  outline: '#77767b'
  outline-variant: '#c8c5ca'
  surface-tint: '#5f5e60'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1d'
  on-primary-container: '#858386'
  inverse-primary: '#c8c6c8'
  secondary: '#b61b00'
  on-secondary: '#ffffff'
  secondary-container: '#db3417'
  on-secondary-container: '#fffbff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1c1c16'
  on-tertiary-container: '#86847c'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e1e4'
  primary-fixed-dim: '#c8c6c8'
  on-primary-fixed: '#1b1b1d'
  on-primary-fixed-variant: '#474649'
  secondary-fixed: '#ffdad3'
  secondary-fixed-dim: '#ffb4a5'
  on-secondary-fixed: '#3f0400'
  on-secondary-fixed-variant: '#8e1300'
  tertiary-fixed: '#e6e2d9'
  tertiary-fixed-dim: '#cac6be'
  on-tertiary-fixed: '#1c1c16'
  on-tertiary-fixed-variant: '#484740'
  background: '#fbf9f4'
  on-background: '#1b1c19'
  surface-variant: '#e4e2dd'
typography:
  display-hero:
    fontFamily: Syne
    fontSize: 84px
    fontWeight: '800'
    lineHeight: 88px
    letterSpacing: -0.04em
  display-hero-mobile:
    fontFamily: Syne
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  headline-xl:
    fontFamily: Syne
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.03em
  headline-xl-mobile:
    fontFamily: Syne
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Syne
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Syne
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.015em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 17px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 21px
    letterSpacing: 0em
  label-code:
    fontFamily: Space Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-caps:
    fontFamily: Space Mono
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.14em
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 3rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 2rem
  space-xl: 4rem
---

## Brand & Style
The design system reinterprets classical International Typographic Style through an austere editorial lens. It marries functional constructivism with tactile, museum-grade material sensibilities:
- **Atmosphere:** Archival, cerebral, and rigorously disciplined. The UI evokes heavy unbleached stock paper, Swiss architectural monographs, and precision kinetic instruments.
- **Audience:** High-end architectural studios, design technologists, cultural archives, and editorial platforms demanding uncompromising visual poise.
- **Visual Expression:** High contrast, deliberate asymmetry, and stark hairline grid divisions. Tension is built by pairing dense, monospaced metadata with massive, structural display typography and sudden hits of industrial vermilion.
- **Lighting Dynamics:** Kinetic 3D directional light sweeps gently across textural stone/oatmeal planes, casting razor-sharp, low-distance, high-tension contact shadows rather than soft atmospheric blurs.

## Colors
The palette balances physical paper tones with high-density pigment ink:
- **Base Canvas (`#F7F5F0`):** Archival warm paper base. Never render pure `#FFFFFF`.
- **Surface Mid-Tone (`#EFECE6`):** Secondary container surface and table headers.
- **Hairline / Surface Accent (`#E5E1D8`):** Muted structural grid borders, divider lines, and card containers.
- **Primary Ink (`#0E0E10`):** High-density carbon black for primary copy, stark structural panels, and prominent callouts.
- **Secondary Ink (`#141416`):** Deep obsidian for body text and solid interactive surfaces.
- **Signal Vermilion (`#FF4D2E`):** Industrial safety accent used strictly for focal alerts, status indicators, and kinetic hover hits. Used sparingly to preserve maximum focal intensity.

## Typography
Typographic discipline is strictly mathematical:
- **Display Scales (`Syne`):** Used strictly for high-impact title blocks, numerical figures, and editorial focal points. Keep tightly tracked (`-0.03em` to `-0.04em`) with strict flush-left alignments.
- **Narrative Copy (`Plus Jakarta Sans`):** Clean, neo-grotesque structural clarity for body copy and dense descriptions.
- **Technical Metadata (`Space Mono`):** Applied to indexes, system tags, coordinates, micro-labels, and schema indexes. All uppercase variations use extended tracking (`0.14em`).

## Layout & Spacing
A rigid modular grid anchors all content into structured spatial quadrants:
- **Columns & Subdivisions:** 12-column layout on desktop (>1024px) transitioning to 6-column on tablet (768px-1023px) and 2-column or single-column on mobile (<767px).
- **Asymmetrical Tension:** Prefer intentional weight disparity (e.g., spanning content across 8 columns while reserving 4 columns for solid obsidian modules or vacant negative space).
- **Grid Lines:** Layout columns and card perimeters are reinforced with 1px architectural hairline rules (`#E5E1D8` on canvas, `#141416` over dark blocks). Content hugs boundaries tightly, establishing an unyielding typographic framework.

## Elevation & Depth
Depth is created through physical constructivism, tonal inversion, and kinetic ray shadows:
- **No Soft Diffuse Drops:** Avoid standard blurred drop shadows (`0 8px 24px rgba(0,0,0,0.06)`).
- **Directional Razor Shadows:** Interactive components elevated on hover project a sharp, low-distance, hard-edged shadow: `2px 2px 0px #0E0E10`.
- **Tonal Stacking:** Surfaces step through layered tints: Archival Canvas (`#F7F5F0`) → Mid-Surface (`#EFECE6`) → Solid Obsidian (`#0E0E10`). Depth is established primarily by juxtaposition of dark field blocks against light textured backplates.
- **Architectural Rules:** Crisp 1px hairlines define separation boundaries; visual hierarchy relies on linework density rather than fuzzy z-axis levels.

## Shapes
Sharpness is absolute (`0px` radius throughout). Every module, card, input, and button adheres strictly to right-angled architectural cuts. 
- Elements exist as clean rectilinear planes, slabs, and hairlines.
- Avoid border smoothing, rounded pills, or curved corners.

## Components

### Buttons
- **Primary:** Obsidian background (`#0E0E10`), bone text (`#F7F5F0`), zero radius, uppercase mono label (`label-caps`). On hover: shift upward and left by 1px with a hard `1px 1px 0px #FF4D2E` drop edge.
- **Secondary:** Transparent background, 1px hairline border (`#0E0E10`), obsidian text. On hover: invert completely to `#0E0E10` background with `#F7F5F0` text.
- **Signal / Accent:** Vermilion fill (`#FF4D2E`), bone text (`#F7F5F0`). Used exclusively for single primary conversions per screen.

### Chips & Badges
- Rectilinear 1px bordered boxes using `label-code` typography.
- Status indicator: a hard 6px square vermilion block preceding the label text.
- Default neutral chip: `#EFECE6` fill with `#0E0E10` text and 1px `#E5E1D8` border.

### Input Fields
- Understated architectural slots: `#EFECE6` fill with a bottom-only 2px solid hairline in `#0E0E10` (or fully enclosed 1px `#E5E1D8` box).
- Typography: `body-md` in `#0E0E10`; placeholder rendered in `#0E0E10` at 40% opacity.
- Focus state: Outline snaps to 1px `#0E0E10` with a sharp vermilion corner tick on top right.

### Cards & Modular Blocks
- **Editorial Canvas Card:** 1px hairline boundary (`#E5E1D8`), `#F7F5F0` background, strict internal padding (`space-lg`), header separated by a full-bleed horizontal 1px rule.
- **Monolithic Inverted Block:** Solid `#0E0E10` slab, white/bone typography, vermilion micro-accents. Used to ground the page asymmetrically.

### Lists & Data Grids
- Full-width modular rows separated by 1px `#E5E1D8` rules.
- Hovering a row highlights the entire band with `#EFECE6` and exposes an obsidian index indicator (`01`, `02`, etc.) in `label-code`.

### Checkboxes & Radios
- Sharp 14px squares (no circles for radio; radio uses an inner solid square indicator).
- Unchecked: 1px `#0E0E10` border, clear interior. Checked: Solid `#0E0E10` fill with a clean white inner geometric glyph or solid center square.