# Design — Project Identity

> This document is project-long-lived. Tokens are not changed without
> the Architect's approval. Developers MUST use these tokens
> instead of improvising their own colors/spacings.

## Style Direction

Calm, light, data-first business interface — near-white surfaces, ink-blue text, one confident indigo accent reserved for actions and the active nav item, with semantic status colours carrying all meaning; Linear/Stripe-grade restraint rather than decoration.

## Colors

- `--color-bg`: **#FFFFFF**
- `--color-surface`: **#F7F8FA**
- `--color-surface_alt`: **#F1F3F7**
- `--color-fg`: **#0F172A**
- `--color-fg_muted`: **#64748B**
- `--color-fg_subtle`: **#94A3B8**
- `--color-border`: **#E2E8F0**
- `--color-border_strong`: **#CBD5E1**
- `--color-accent`: **#4F46E5**
- `--color-accent_hover`: **#4338CA**
- `--color-accent_active`: **#3730A3**
- `--color-accent_soft`: **#EEF2FF**
- `--color-accent_fg`: **#FFFFFF**
- `--color-success`: **#15803D**
- `--color-success_soft`: **#DCFCE7**
- `--color-warning`: **#B45309**
- `--color-warning_soft`: **#FEF3C7**
- `--color-danger`: **#B91C1C**
- `--color-danger_soft`: **#FEE2E2**
- `--color-info`: **#1D4ED8**
- `--color-info_soft`: **#DBEAFE**
- `--color-neutral_soft`: **#F1F5F9**
- `--color-neutral_fg`: **#475569**
- `--color-overlay`: **rgba(15, 23, 42, 0.40)**
- `--color-focus_ring`: **#4F46E5**

## Typography

- `font_family`: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif
- `font_family_mono`: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, monospace
- `heading_weight`: 600
- `body_weight`: 400
- `medium_weight`: 500
- `size_xs`: 12px
- `size_sm`: 13px
- `size_base`: 14px
- `size_md`: 15px
- `size_lg`: 16px
- `size_xl`: 20px
- `size_2xl`: 24px
- `size_3xl`: 28px
- `line_height_body`: 1.5
- `line_height_heading`: 1.25
- `letter_spacing_label`: 0.04em
- `numeric_rule`: All amounts, KPI values and table figures use font-variant-numeric: tabular-nums; order numbers, e-mail and ids use font_family_mono at size_sm.

## Spacing Scale

- `--space-0`: 4px
- `--space-1`: 8px
- `--space-2`: 12px
- `--space-3`: 16px
- `--space-4`: 24px
- `--space-5`: 32px
- `--space-6`: 48px

## Border-Radii

- `--radius-sm`: 6px
- `--radius-md`: 10px
- `--radius-lg`: 14px
- `--radius-pill`: 999px

## Components

### Button

Base: inline-flex, gap 8px, radius md (10px), font-weight 500, size_base (14px), padding 0 16px, height 40px; large/primary-action variant height 44px padding 0 20px; touch variant at <=768px min-height 44px and min-width 44px. Variants: primary bg=accent #4F46E5 / text accent_fg #FFFFFF / border none; secondary bg=#FFFFFF / text fg #0F172A / border 1px solid border_strong #CBD5E1; ghost bg transparent / text fg_muted #64748B / hover bg surface_alt #F1F3F7; danger bg #B91C1C / text #FFFFFF. States (all variants): hover = primary #4338CA, secondary bg surface #F7F8FA border #94A3B8, ghost text fg; active = primary #3730A3 + inset 0 1px 2px rgba(15,23,42,0.18), and translateY(1px); disabled = opacity 0.5, cursor not-allowed, no hover change, aria-disabled plus native disabled; loading = disabled + 16px spinner, label unchanged. Focus-visible: outline 2px solid focus_ring #4F46E5, outline-offset 2px, never removed. Transition 120ms ease-out on background-color/border-color/transform.

### IconButton

Square 36x36px (44x44px at <=768px), radius sm (6px), bg transparent, text fg_muted, hover bg surface_alt #F1F3F7 and text fg; active bg #E2E8F0; disabled opacity 0.4 with tooltip 'Coming soon'; focus-visible same 2px accent ring; icon 18px stroke 1.5px.

### MainNav

Persistent shell navigation. Desktop >=1024px: fixed left sidebar, width 240px, bg surface #F7F8FA, border-right 1px border, padding 16px 12px, product wordmark 16px/600 at top, items 40px tall, radius md, gap 4px. <=1023px: becomes a top bar, height 56px, bg #FFFFFF, border-bottom 1px border, horizontally scrollable nav items with 44px tap height. NavItem: default text fg_muted, hover bg surface_alt + text fg, active bg accent_soft #EEF2FF + text accent + 600 weight + 3px accent left bar (desktop) / 2px accent bottom bar (mobile), icon 18px + label size_base. Keyboard: single Tab stop into nav, ArrowUp/Down or Left/Right moves, Enter activates; focus-visible 2px accent ring inset.

### TextInput / SearchField

Height 40px (44px <=768px), radius md, bg #FFFFFF, border 1px solid border #E2E8F0, padding 0 12px (24px left when search icon present: icon 16px fg_subtle), text size_base fg, placeholder fg_subtle #94A3B8. Focus: border accent + box-shadow 0 0 0 3px accent_soft, no outline removal. Filled search shows a 24px clear (x) IconButton at right; clearing restores the full list and returns focus to the field. No error styling before the user has typed (AC-08); with a query but zero matches the field keeps its focus ring and the EmptyState below carries the message. Label always visible above the field, 12px/500 fg_muted.

### FilterChips

Horizontal scrollable row (gap 8px) used for order-status and customer-status filters; optional 'All' chip first. Chip: height 32px (40px <=768px), padding 0 12px, radius pill, size_sm/500. Unselected: bg #FFFFFF, border 1px solid border, text fg_muted; hover border_strong + text fg. Selected: bg accent_soft #EEF2FF, border 1px solid #C7D2FE, text accent, 600 weight, optional count suffix in tabular-nums. Keyboard: roving tabindex, Arrow keys move, Space/Enter toggles; focus-visible 2px accent ring. Chip labels use the plural screen names exactly: Alle, Bezahlt, Offen, Überfällig, Storniert.

### StatusBadge

Pill badge, height 22px, padding 0 8px, radius pill, size_xs (12px)/500, 6px dot + 6px gap, bg soft / text dark, border none. Order statuses: Paid = #DCFCE7/#15803D, Pending = #FEF3C7/#B45309, Overdue = #FEE2E2/#B91C1C, Cancelled = #F1F5F9/#475569. Customer statuses: Active = #DCFCE7/#15803D, New = #DBEAFE/#1D4ED8, At risk / Churn = #FEF3C7/#B45309, Inactive = #F1F5F9/#475569. Never colour-only: the text label always states the status (AC-04, a11y non-colour cue).

### Card / KpiCard

Card: bg #FFFFFF, border 1px solid border, radius lg (14px), padding 24px, no shadow at rest; hover only on interactive cards (border_strong + shadow 0 1px 3px rgba(15,23,42,0.06)). KpiCard layout: label 12px/500 uppercase letter-spacing 0.04em fg_muted; value size_3xl (28px)/600 fg tabular-nums, margin-top 8px; delta line size_sm/500 with 12px arrow glyph, success #15803D or danger #B91C1C, margin-top 4px; optional 'Coming soon' note size_xs fg_subtle. Four KPI cards render at 1280px as one row (4 x 1fr, gap 24px), <=1023px 2 columns, <=560px 1 column.

### DataTable / ListRow

Table: full-width, header row height 40px, header text size_xs uppercase letter-spacing 0.04em fg_muted, border-bottom 1px border_strong; body row height 52px (>=1024px) / 64px (<=768px), border-bottom 1px border, bg #FFFFFF. Hover row: bg surface #F7F8FA, cursor pointer. Clickable rows are real <button>-like elements: role=button/row with tabindex, Enter and Space open the detail view (AC-12), focus-visible ring inset 2px accent. Numeric columns right-aligned tabular-nums; order numbers and customer names in 500 weight. Active/selected row: bg accent_soft + 3px accent left bar. <=768px the table collapses into stacked cards: each row becomes a Card with label/value pairs, 24px vertical rhythm, status badge top-right (AC-03 must stay legible at 390px).

### DetailView / PageHeader

Header: back control first ('← Zurück zur Liste', ghost Button, 44px tap target) — it restores the list with the previous query and filter intact (AC-05/AC-06) and is the first focusable element. Title size_2xl (24px)/600, subtitle size_base fg_muted margin-top 4px. Meta block: two-column definition grid (label 12px uppercase fg_subtle, value size_base fg), gap 16px/24px, columns collapse to one at <=640px. Content sections stack with 32px separation, each preceded by a section heading size_lg/600. Sub-total / VAT / total rows: right-aligned tabular-nums, total row separated by border-top 1px border_strong and weight 600.

### EmptyState

Centered block, padding 48px 24px, max-width 420px, inside the list/table card. Icon 48px stroke 1.5px colour #94A3B8; headline size_lg (16px)/600 fg; body size_base fg_muted margin-top 8px stating what was searched/filtered and how many matches exist (e.g. 'Keine Kunden für „Meier“ mit Status Inaktiv.'); primary Button margin-top 24px labelled 'Filter zurücksetzen' that clears the search and filter and restores the full list (AC-08). Never renders a bare message without the action.

### ChartCard

Card wrapper (see Card) with title size_lg/600 and a 'Letzte 12 Monate' subtitle size_sm fg_muted. Recharts LineChart/AreaChart, height 280px (min 200px at <=640px), margins 8px. Line stroke accent #4F46E5 width 2px, dots 4px radius with 2px white stroke, area fill accent at 12% opacity gradient to 0%. Grid: horizontal lines only, 1px dashed #E2E8F0. Axes: no axis lines, tick text size_xs fg_subtle, Y ticks in German EUR short notation (e.g. '12.000 €'), X ticks month abbreviations. Tooltip: 1px border radius md bg #FFFFFF shadow 0 4px 12px rgba(15,23,42,0.10), value in the single currency format. Accessible: the chart gets role=img with an aria-label stating the range and trend, plus a hidden data table for screen readers.

### ActivityList

Vertical timeline inside a Card: 24px row gap, 8px dot (accent for created, success for paid, warning for overdue) connected by a 1px vertical border_strong line, content column: primary line size_base fg (customer/order in 500 weight), secondary line size_sm fg_muted with the single date/time format, optional amount right-aligned tabular-nums. Rows are not clickable unless they have a target; if not, they render as plain text (no hover) — no control that silently does nothing (AC-07).

### Dialog / ComingSoonPanel

Used exclusively for actions that exist but are not built (export, new customer, invoice download). Overlay rgba(15,23,42,0.40), dialog width 480px (calc(100% - 32px) <=560px), bg #FFFFFF, radius lg, padding 24px, shadow 0 12px 32px rgba(15,23,42,0.18), title size_lg/600, body size_base fg_muted, primary 'Verstanden' Button and secondary 'Abbrechen'. Focus is trapped, Esc and overlay click close, focus returns to the trigger. Alternative inline form: a disabled Button plus a 'Coming soon' badge (bg #F1F5F9, text #475569) next to it — the control never appears enabled while doing nothing.

### NotFoundView

Shown for unknown routes and non-existent customer/order ids (AC-11). Centered, max-width 420px: '404' size_3xl/600 colour #94A3B8, headline size_xl (20px)/600 fg naming the missing thing (e.g. 'Auftrag #1042 wurde nicht gefunden.'), body size_base fg_muted, primary Button 'Zum Dashboard' linking to the dashboard. Reuses the main shell so navigation stays reachable; no stack traces, no blank screen.

## Layout Principles

- App shell: 240px fixed left sidebar + main column. Main column max-width 1200px, centered, padding 32px (24px at <=1023px, 16px at <=640px). Page background #FFFFFF, sidebar and secondary surfaces #F7F8FA — the whole app is one light theme, no dark mode in the MVP.
- Breakpoints: 390px (mobile, stacked cards, 44px tap targets, single column), 640px, 768px (table to cards switchover), 1024px (sidebar appears, KPI row becomes 4-up), 1280px (reference desktop viewport), 1440px (main column stops growing, content stays 1200px).
- Grid: 12-column, 24px gutter, 24px vertical gap. KPI row 4x1fr at >=1024px, 2x2 at 640-1023px, 1 column below 640px. Dashboard below the KPIs: 2/3 chart + 1/3 activity list at >=1024px, stacked below.
- Vertical rhythm: 16px between label and value, 24px between cards in a group, 32px between page sections, 48px only around empty states. Only the spacing scale is used (4/8/12/16/24/32/48) — never arbitrary pixel values.
- Borders over shadows: 1px #E2E8F0 separates surfaces; shadows appear only on hover (interactive cards, rows) and on overlays/tooltips. Radii: 6px controls, 10px inputs/buttons, 14px cards and dialogs, 999px for badges and filter chips.
- Currency — ONE format everywhere (AC-09): German notation with thousands separator '.' and decimal ',' plus two decimals and the trailing currency code: 1.234,56 EUR. Implement via Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', currencyDisplay: 'code' }) as formatCurrency(). Negative amounts carry a leading '-'. Compact axis/tick notation: 12.000 EUR. KPI figures use the same formatter, never a shortened version.
- Dates — ONE format everywhere (AC-09): dd.MM.yyyy, zero-padded, e.g. 14.03.2026 via formatDate(). Never yyyy-mm-dd, never 'Mar 14'. The activity list may additionally show a relative hint ('vor 2 Tagen') only in its own secondary line, always next to the absolute date.
- Order numbers, customer ids and e-mail addresses are never reformatted: mono font, size_sm, copied verbatim from the mock data (e.g. #1042).
- Percentages: one decimal, comma separator, sign always explicit, non-breaking space before the sign: '+12,4 %'. Counts (open orders, list totals) are plain integers with '.' grouping: 1.284.
- List state is part of the UI contract: search query, status filter and sort are reflected in the URL-independent component state and visibly shown (active chip + field content) so returning from a detail view reads as 'same list, same filter' (AC-05).
- Accessibility baseline: one <h1> per screen, semantic <nav>/<main>/<section>, visible 2px accent focus ring on every interactive element, keyboard path nav -> filter -> search -> rows -> detail, status never communicated by colour alone, contrast >= 4.5:1 for text (fg #0F172A and fg_muted #64748B both pass on light surfaces; fg_subtle is for non-essential meta only).
- Every row action area has a fixed right-hand column width (amount, badge or chevron) so numbers align vertically across rows and the eye can scan a column of amounts at 390px as well as at 1280px.
