# MUNDIAL — Complete Product Design & Technical Specification

**A premium 5-a-side football game celebrating World Cup history**
Version 1.0 · Production Design Document · iOS & Android

---

## 1. Product Vision

Mundial is a mobile football game where players build 5-a-side dream teams from the entire history of every nation that has ever qualified for a FIFA World Cup, then compete through the 48-team 2026 tournament format — solo, online, or in fully custom simulated tournaments.

The product pillars, in priority order:

1. **Heritage** — the emotional pull of national football history. Pelé next to Ronaldinho. Maradona next to Messi.
2. **Premium feel** — every screen, transition, and press-state should feel like a flagship iOS app, not a mobile game UI.
3. **Fast fun** — 5v5 arcade matches under 6 minutes, one-thumb friendly.
4. **Depth without clutter** — deep stats, collections, and tournament tools that never crowd the core loop.

An important legal note before anything else: shipping this product requires licensing. "FIFA," "World Cup," official tournament marks, national federation crests, and the names/likenesses of real players (living and estates of deceased players) are all protected. This document designs everything to be *legally adaptable*: generic kits, original logo, original trophy design, and a player database architecture that can swap real names for licensed or stylized alternatives ("Brazilian Legend #10") without code changes. Budget for FIFPro-style licensing or plan a stylized-name fallback from day one.

---

## 2. Naming

Candidates, evaluated for timelessness, pronounceability across languages, and trademark risk:

| Name | Feel | Notes |
|---|---|---|
| **Mundial** | Timeless, one word, globally understood | Strongest candidate. Spanish/Portuguese for "World Cup" colloquially. Clean app-store search term. |
| **Copa Legacy** | Heritage-forward | Good, slightly long. |
| **Copa 1930** | Vintage, specific | Charming, but anchors brand to one date. |
| **Glory Cup** | Trophy-focused | Generic-feeling; weaker. |
| **Mundial Club** | Community angle | Save for the multiplayer sub-brand. |
| **Copa Eterna** | "Eternal cup" | Beautiful, strong secondary option. |

**Recommendation: MUNDIAL.** Wordmark set in a geometric retro face, always paired with the roundel logo. Multiplayer season branding can use "Mundial Club" as the ranked-community sub-brand, and "Copa Eterna" is reserved as the name of the in-game custom tournament trophy.

---

## 3. Brand Identity

### 3.1 Logo

Concept: **"The Orbit Roundel."** A circular badge built from pure geometry, inspired by the optical, radiating style of late-1960s/early-70s tournament graphics (concentric motion, bold counters) without copying any official mark.

Construction:
- A perfect circle divided into **five concentric rings** (echoing 5-a-side), each ring a step of the green gradient from Deep Forest (outer) to Light Mint (inner).
- At center, a **stylized football built from 12 geometric petals** rotated around the axis — reads as both a ball and a globe.
- A single **gold meridian arc** sweeps across the roundel at 30°, suggesting a ball's flight path and giving the mark motion.
- Wordmark "MUNDIAL" in all-caps geometric sans below or right of the roundel, letter-spaced +8%.

Variants: full roundel + wordmark (marketing), roundel only (app icon), single-color gold-on-green (foil/celebration screens), one-color charcoal (documents). The app icon is the roundel on a Deep Forest → Emerald vertical gradient with a subtle inner shadow so it feels dimensional on the home screen.

Animated logo: on cold launch, the five rings draw in sequentially (stroke-dashoffset animation, 900ms total, staggered 80ms), the gold arc sweeps last, then the mark settles with a soft spring.

### 3.2 Color Palette

**Primary — Gradient Greens**

| Token | Hex | Use |
|---|---|---|
| `green.forest` | `#0B3D2E` | App background (dark), primary surfaces |
| `green.emerald` | `#12805C` | Primary buttons, active states, brand core |
| `green.olive` | `#3E5C3A` | Secondary surfaces, muted accents |
| `green.mint` | `#CFF5E1` | Highlights, light-mode tint, gradient terminus |

**Secondary**

| Token | Hex | Use |
|---|---|---|
| `gold.500` | `#D4AF37` | Trophies, ratings, premium moments, focus rings |
| `gold.300` | `#EFD98B` | Gradient partner for gold |
| `white` | `#FFFFFF` | Cards (light mode), primary text on dark |
| `charcoal.900` | `#1E2422` | Text on light surfaces (never pure black) |
| `charcoal.600` | `#5B6660` | Secondary text |

Signature gradients:
- **Pitch gradient**: `forest → emerald`, 160°, used on hero surfaces and the animated home background.
- **Trophy gradient**: `gold.500 → gold.300`, 45°, reserved exclusively for achievement/championship moments so gold retains meaning.
- **Mint wash**: `mint at 8% opacity` over forest for elevated dark-mode cards.

Rule: gold is *earned*. It never appears on ordinary buttons — only ratings, trophies, ranked badges, and celebrations. This single constraint does most of the "elegant, not flashy" work.

### 3.3 Typography

- **Display / numerals**: a geometric grotesque with strong retro character (e.g., licensed equivalent in the family of Neue Haas Grotesk Display or a custom cut). Used for greetings, ratings, scorelines. Ratings use **tabular figures** always.
- **Text**: the platform-native stack — SF Pro (iOS) / Roboto Flex (Android) — for body copy, ensuring perfect rendering and Dynamic Type support.
- Scale (pt): Display 40/34, Title 28, Heading 22, Body 17, Caption 13. Line-height 1.2 display, 1.45 body. Generous — whitespace is a feature.

---

## 4. Design Language & Component System

### 4.1 Principles

Layered depth, soft light. The UI is built from **cards floating on gradient fields**. Three elevation tiers:

- **Field** (background): animated pitch gradient, very slow (60s loop) hue drift ±4°, plus sparse particle dust at 3% opacity.
- **Card** (elevation 1): 24pt corner radius, shadow `0 8 24 rgba(11,61,46,0.18)`, dark mode uses mint-wash fill + 1px inner border at 6% white.
- **Sheet/Modal** (elevation 2): 32pt top radius, background blur (glass) at 40pt radius, drag handle, spring presentation.

### 4.2 Core Components

**Buttons**
- Primary: emerald fill, white label, 20pt radius, 56pt height. Press: scales to 0.97 + shadow tightens (spring, 120ms in / 240ms out), subtle haptic (light impact).
- Secondary: mint-wash fill, emerald label. Tertiary: text-only. Destructive: charcoal with red label, never a red fill (keeps palette calm).

**Flag Cards** — the signature component. Rounded-rectangle flags (aspect 3:2, 16pt radius, 1px hairline border at 10% charcoal, soft drop shadow). Rendered as vector assets, not emoji. In grids they sit on cards with the nation name and a small "times qualified" count. Selected state: gold focus ring (2pt) + spring pop to 1.04.

**Player Cards** — portrait card, 3:4. Layout: nation flag chip top-left, position chip top-right, portrait center, name, era badge (e.g., "1958–1971"), and a large gold tabular rating bottom-right. Flip animation (3D rotateY, 450ms) reveals the six attribute bars on the back. Rarity is expressed by frame material: standard (charcoal frame), legend (emerald), icon (gold foil with animated sheen).

**Navigation** — floating pill tab bar, 5 items (Home, Play, Tournaments, Collection, Profile), glass background, active item gets an emerald dot + label. It auto-hides on scroll-down, returns on scroll-up. All pushes use a shared-element style transition where the tapped card expands into the next screen (300ms, easeOutExpo).

**Stat bars, list rows, chips, toasts, empty states** — all specified in the design-system library (Figma tokens mirror the code tokens 1:1; token names above are the source of truth).

### 4.3 Motion Standards

- Springs everywhere: default `damping 0.82, response 0.35s`. No linear easing in the product.
- Durations: micro 120–180ms, transitions 280–350ms, celebrations 1.5–4s.
- Confetti/fireworks are GPU particle systems (see §12), capped at 60fps with automatic particle-count reduction on thermal throttling.
- **Reduce Motion**: every celebration and parallax has a static/crossfade fallback. This is a launch requirement, not a nice-to-have.

### 4.4 Themes & Accessibility

Dark and light mode from day one (dark is the hero). All text pairs pass WCAG AA (emerald on white passes; mint text is never used on white). Dynamic Type up to XL, VoiceOver/TalkBack labels on all interactive elements, minimum 44pt touch targets, haptics mirrored with visual feedback for hearing-impaired users, and a color-blind-safe mode that adds pattern fills to team differentiation in matches.

---
## 5. Information Architecture

```
Mundial
├── Onboarding (first launch only)
│   ├── Welcome / brand moment
│   ├── Identity (name, email, news opt-in)
│   ├── Favorite nation picker
│   └── Handoff animation → Home
├── Home (dashboard)
│   ├── Greeting + favorite team hero
│   ├── Continue card (resume tournament/save)
│   └── Mode cards → Single Player · Multiplayer · Tournament Simulator
├── Play
│   ├── Single Player (nation → formation → squad → kit → tournament)
│   └── Multiplayer (ranked, casual, friends, private lobbies)
├── Tournaments
│   ├── Active tournament hub (bracket, groups, next match)
│   └── Tournament Simulator (custom cups, saves)
├── Collection (jerseys, balls, stadiums, badges, moments)
├── Profile (stats, achievements, online record, history)
└── Settings (account, notifications, themes, accessibility, data)
```

Navigation model: 5-tab floating bar (Home, Play, Tournaments, Collection, Profile). Settings lives behind the avatar on Home and Profile. Deep links: `mundial://lobby/{code}`, `mundial://match/{id}`, `mundial://tournament/{id}`.

---

## 6. User Flows

### 6.1 Onboarding (target: under 90 seconds)

1. **Brand moment** (3s, skippable): animated roundel draw-in on pitch gradient.
2. **Identity**: single card — name field, email field, optional checkbox "Send me football news, updates, and tournament emails." Continue is enabled once name + valid email exist. (Account is created lazily; auth details in §13.)
3. **Favorite nation**: full-screen grid of flag cards for **every nation ever qualified for a World Cup** (all 80+ historical qualifiers, including historical entities — see §7.1). Search bar pinned top; confederation filter chips (UEFA, CONMEBOL, CONCACAF, CAF, AFC, OFC). Tapping a flag pops it with a gold ring and shows a confirm bar: "Play as Brazil 🏆×5" (title count).
4. **Handoff**: the chosen flag card lifts, scales, and flies into its slot on the Home hero as Home builds in beneath it — the user's first shared-element transition, teaching the app's motion language immediately.

### 6.2 Single Player core loop

Nation → Formation → Squad → Kit → World Cup draw → Group stage → Knockouts → Celebration → Home. Every step is resumable; state persists after every decision.

### 6.3 Match decision loop

For each fixture: **Play Match** (live 5v5 arcade) or **Simulate** (instant, with commentary + stat sheet). Elimination triggers auto-simulation of the rest of the bracket, culminating in the champion celebration regardless of who wins — the tournament always gets its ending.

Full screen-by-screen flow diagrams (happy path + edge cases: quit mid-match, connection loss, save conflict) are enumerated in §8 alongside each screen.

---

## 7. Content: Nations & Players

### 7.1 Nations

The database includes every nation that has ever qualified for a FIFA World Cup finals — roughly 80+ across 1930–2026, handled with care for historical entities:

- Historical entities are first-class records: **Soviet Union, Yugoslavia, Czechoslovakia, East Germany, Zaire, Dutch East Indies**, etc., each with era metadata and a "successor nation" link (e.g., USSR → Russia) so legacy players can surface in both contexts where appropriate.
- Each nation record: name (localized), ISO-style code, confederation, flag asset ref, traditional kit colors (primary/secondary/accent), qualification years array, titles won, best finish, and active/historical flag.

### 7.2 Player database

Every historical player belongs to a nation and includes:

name · nation · position (GK/DF/MF/FW, with sub-roles) · era (career span + signature tournament years) · overall rating (1–99) · attributes: speed, passing, shooting, defending, physical, dribbling, goalkeeping (GK only) · portrait asset · preferred foot · career years · historical notes (1–2 sentence bio) · rarity tier (Standard / Legend / Icon).

Content strategy: launch with a curated **~1,200-player** set (15–25 per major nation, 8–12 per smaller nation), covering every qualified nation with at least its most iconic World Cup squad members. Ratings are set by an editorial rubric (peak World Cup performance weighted 60%, career 40%) and stored server-side so balance patches never require app updates. Examples of coverage:

- **Brazil**: Pelé, Garrincha, Ronaldo, Ronaldinho, Kaká, Romário, Cafu, Djalma Santos, Zico, Sócrates, Roberto Carlos, Taffarel…
- **Argentina**: Maradona, Messi, Kempes, Batistuta, Zanetti, Passarella, Di María…
- **Germany**: Beckenbauer, Gerd Müller, Neuer, Matthäus, Klose, Kahn, Lahm…
- …continuing editorially for every nation (Cameroon: Milla; USA: Donovan; South Korea: Park Ji-sung; etc.).

(Reminder from §1: real names/likenesses ship only with licensing; the schema's `display_name` / `licensed` fields allow a stylized fallback per player.)

---

## 8. Screen-by-Screen UX

**8.1 Home.** Dark pitch-gradient field, slow animated hue drift. Top: avatar + "Good evening, Diego" in display type. Hero card: favorite nation flag, record vs. that nation's real history ("Your Brazil: 12W–3L"), and a Continue button if a tournament is live (shows next fixture + round). Below: a 2-column masonry of mode cards — Single Player (large), Multiplayer, Tournament Simulator, Collection, Statistics — each with an illustrated icon and parallax on scroll (6pt translation). Pull-to-refresh triggers a tiny ball-spin loader.

**8.2 Nation Select.** Same grid as onboarding, but headed by "Recently played" and the favorite pinned first. Selecting pushes Formation via flag shared-element.

**8.3 Formation Select.** Three large cards showing animated pitch diagrams for **2–1–1, 1–2–1, 1–1–2** (player dots pulse into position on appear). Copy under each explains the shape ("2–1–1 — solid back line, lone striker"). Horizontal snap carousel; the centered card is selected.

**8.4 Squad Builder.** Split view: top half is the pitch with 5 slots (GK + 4 by formation); bottom half is a position-filtered, searchable player-card rail sorted by rating. Tap a slot → rail filters to that position; tap a card → it flies to the slot with a spring and the team's average rating ticker counts up. Long-press any card to flip it for attributes. A "Best XI" button auto-fills for speed-runners. Validation: all 5 slots required; duplicate players blocked.

**8.5 Kit Select.** A rotating **3D jersey model** (front/back, drag to rotate, momentum + snap to front/back poses) rendered in-engine. Options: Home / Away / Alternate (where the nation's tradition supports one), all generic cuts colored from the nation's `kit_colors` with 4 pattern variants (solid, hoop, sash, gradient). Selecting stamps the kit onto the squad's player cards in real time behind the sheet.

**8.6 Draw / Groups.** Cinematic draw: 12 group cards (A–L) fill as flag chips fly in from a pot carousel; the user's nation lands last with a gold ring and haptic. Skippable. Result: scrollable group tables with fixture lists.

**8.7 Tournament Hub.** Segmented control: Groups · Bracket · My Matches. Bracket is a horizontally panning tree (R32 → Final) with pinch-zoom; the user's path is highlighted in emerald, completed matches show mini scorelines. Next fixture card is pinned bottom with **Play** and **Simulate** buttons.

**8.8 Live Match (see §10 for mechanics).** Landscape. Minimal HUD: score + clock top-center in a glass pill, virtual stick bottom-left, two context buttons bottom-right (pass/tackle, shoot/slide), sprint by stick-flick. Pause sheet: resume, restart (group stage only), forfeit, settings.

**8.9 Simulation.** A live-ticker sheet: minute-by-minute commentary lines stream in (goal events pause with a flag flash + haptic), then a full-time stat sheet — possession donut, shots, cards, and per-player ratings (tap a player for their match line). Buttons: Continue / Rematch (custom cups only).

**8.10 Celebration.** Full-screen takeover: winning nation's flag ripples behind a 3D gold trophy that lowers in and is "lifted" (tilts up with a light burst) — gold confetti physics + fireworks, champion stats card (top scorer, best rating, user's path). If the user won: "CHAMPIONS" in display type with a foil sheen sweep; if eliminated earlier, the tone is documentary ("France are World Champions") with the user's run summarized. Single button: Return Home.

**8.11 Multiplayer Lobby.** Tabs: Ranked · Casual · Friends. Ranked shows division badge (Bronze→Legend), season timer, and leaderboard entry point. Friends: code-based private lobbies (6-char codes, QR share). Matchmaking screen shows both squads' cards riffling while connecting.

**8.12 Tournament Simulator.** Create flow: name your cup → pick participating nations (any count from 4 to 48; format auto-suggests) → arrange groups manually or auto-draw → simulate match-by-match at your own pace. Saves list with resume cards (cup name, round, timestamp). This is the toy-box mode: no squads required, pure simulation, shareable results card at the end.

**8.13 Collection.** Shelf metaphor: horizontally scrolling shelves for Jerseys, Classic Balls, Stadium Themes, Badges, Historic Moments. Locked items are silhouettes with unlock hints ("Win a knockout match on penalties"). Equipping a stadium theme re-skins match environments; equipping a ball changes the match ball model.

**8.14 Profile & Statistics.** Header: avatar, favorite flag, ranked badge. Stat grid: games, W/L, goals, assists, clean sheets, titles. Charts: form (last 10), most-used players (top 5 cards), online record, tournament history timeline (each cup a row: nation, result, tap for full bracket replay).

**8.15 Settings.** Account, notifications (match reminders, season events, news — mirrors onboarding opt-in), theme (dark/light/system), accessibility (reduce motion, haptics, color-blind mode, commentary text size), data (cloud sync status, export, delete account), legal.

---
## 9. Tournament Logic — 2026 Format

Faithful to the official 2026 structure:

- **48 teams · 12 groups (A–L) of 4.** Round-robin within groups (6 matches per group, 72 total).
- **Advancement**: top 2 from each group (24) + the **8 best third-placed teams** = 32.
- **Knockouts**: Round of 32 → Round of 16 → Quarterfinals → Semifinals → **Third-Place Playoff** → Final. 104 matches total.
- Group ranking tiebreakers, in order: points → goal difference → goals scored → head-to-head points → head-to-head GD → head-to-head goals → fair play points (fewer cards) → drawing of lots (seeded RNG).
- Best-third ranking: points → GD → goals → fair play → lots. The R32 bracket mapping of third-place qualifiers follows the official allocation matrix (implemented as a lookup table keyed by the combination of qualifying groups).
- Knockout draws: no extra-time shortcut — simulated matches resolve level games through ET then penalties (penalties modeled per-player from shooting + a composure factor; GK rating weighs saves).

**Draw generation (Single Player)**: user's nation is seeded into a random group; remaining 47 slots filled from the qualified-nations pool with confederation-separation constraints (max 1 per confederation per group except UEFA max 2), matching real draw rules. Seeded RNG per tournament so a save can deterministically re-derive its bracket.

**Custom cups (Simulator)**: 4–48 teams; the engine general-izes the format (e.g., 16 teams → 4 groups + R16; 48 → full 2026 shape) and always offers manual group editing before lock-in.

---

## 10. Gameplay & Match Engine

### 10.1 Live 5v5 arcade match

Design target: the pick-up-and-play fluency of top arcade football games — fast, forgiving, readable.

- **Camera**: elevated 3/4 view, gentle follow with look-ahead in the ball's direction.
- **Controls**: left virtual stick (move), context button A (pass on attack / press-tackle on defense), button B (shoot with hold-to-power on attack / slide on defense), flick-sprint. Through-ball via swipe on A. Auto-switch to nearest defender with manual swap on tap.
- **Match length**: 2 × 2.5-minute halves (scaled clock). Golden-goal ET + penalties in knockouts. Penalties are a timing-and-aim minigame (drag to corner, tap to strike inside a shrinking ring).
- **Attributes matter, arcade-scaled**: speed → max velocity/accel; dribbling → turn radius + close control; shooting → power/accuracy cone; passing → lead accuracy; defending → tackle reach/success; physical → shoulder duels; goalkeeping → save radius and reaction window. Rating gaps are felt but never insurmountable (a 78 team can beat a 92 team played well; simulation odds are steeper).
- **AI**: utility-based positioning per formation; difficulty tiers rise through the tournament (group stage = Normal, final = Elite).
- **Engine**: Unity (URP) — deterministic fixed-timestep simulation (critical for multiplayer, §11), stylized low-poly players with rating-tier visual flair (icons get subtle gold boot trims).

### 10.2 Simulation model

A possession-chain Monte Carlo: team strength vector (attack, midfield, defense, GK — aggregated from the 5 players with era-adjusted weights) drives chance creation via a Poisson-like process minute by minute, producing: goals (scorer weighted by shooting + position), cards (from tackle intensity), possession %, shots/on-target, and per-player match ratings (base 6.0 ± event contributions). Commentary is template-based with 400+ localized lines keyed to event type, score state, and minute ("Late drama in Group C!"). Same seeded RNG discipline: a simulated match is reproducible from its seed.

---

## 11. Multiplayer Architecture

- **Model**: deterministic lockstep is too fragile on mobile networks; use **client-side prediction + authoritative server rollback** (GGPO-style netcode adapted to server-authoritative). Servers run headless Unity match instances at 30Hz tick; clients predict at 60fps and reconcile.
- **Transport**: UDP with reliability layer (e.g., Netcode for Entities / custom over ENet); WebSocket fallback. Target: playable at ≤120ms RTT, degraded-but-fair to 200ms via input delay scaling.
- **Matchmaking**: skill-based (Glicko-2), queue widened over time; region-first with cross-region fallback. Ranked divisions Bronze → Silver → Gold → Emerald → Legend, monthly seasons, soft reset, placement matches (5).
- **Cross-platform**: iOS/Android share identical deterministic sim builds; version-gated matchmaking (clients must match sim version).
- **Friends & lobbies**: friend graph in backend, private lobbies via 6-char codes, invites through deep links/QR. Rematch flow in-lobby.
- **Integrity**: server authoritative on all outcomes; input-rate sanity checks; replay files (input streams + seed, tiny) stored for reports; disconnect handling — leaver in ranked forfeits after 30s grace with AI takeover for the opponent's satisfaction.
- **Leaderboards**: seasonal, per-division, friends-filtered; computed in Redis sorted sets, snapshotted nightly.

---

## 12. Animation Specifications (selected)

| Moment | Spec |
|---|---|
| Button press | scale 1→0.97, shadow blur 24→12, spring(0.8, 0.12s), light haptic |
| Card lift (tap) | translateY −6, shadow +40%, 160ms easeOut |
| Page push | shared-element expand of tapped card, 320ms easeOutExpo; content cross-fades 80ms late |
| Player card flip | rotateY 0→180°, 450ms, midpoint content swap, specular sweep on gold frames |
| Flag select | ring draws (240ms) + pop to 1.04 spring, medium haptic |
| Goal (live) | 120ms hit-stop, camera punch-in 6%, net ripple, crowd audio swell |
| Trophy lift | trophy descends (800ms), pause, tilt-lift with radial light burst, then confetti |
| Confetti | GPU particles, 800–1500 count by device tier, gravity + drag + flutter torque, gold/mint/white palette, 4s decay |
| Fireworks | 5–9 bursts, staggered, additive glow, capped emission on thermal warning |
| Loading | roundel rings rotate at alternating speeds; never a bare spinner |
| Gradient field | 60s hue drift ±4°, paused off-screen and under Low Power Mode |

All motion respects Reduce Motion (crossfade fallbacks) and is centrally tokenized (`motion.spring.default`, etc.) so feel is tunable product-wide.

---

## 13. Technical Architecture

### 13.1 Stack

- **Client**: Unity (URP) single codebase for iOS/Android — gameplay, 3D jerseys/trophy, celebrations. UI built in Unity UI Toolkit with the design-token pipeline (tokens exported from Figma as JSON, consumed at build).
- **Backend**: Go (or NestJS) services on Kubernetes: `auth`, `profile`, `content` (players/nations/ratings), `tournament`, `matchmaking`, `match-server-fleet` (Agones for game-server orchestration), `stats`, `collection`, `leaderboard`.
- **Data**: PostgreSQL (system of record), Redis (sessions, queues, leaderboards), S3+CDN (portraits, flags, 3D assets via addressables), ClickHouse (analytics/telemetry).
- **Sync**: client-first saves in SQLite; cloud sync via versioned snapshots with vector-clock conflict resolution (last-writer-wins per field, tournament saves are append-only event logs so they merge cleanly). Full offline support for Single Player and Simulator; multiplayer requires connection.

### 13.2 Database schema (core tables)

```sql
users(id uuid pk, email citext unique, name text, news_opt_in bool,
      favorite_nation_id fk, created_at, auth_provider, region)

nations(id pk, code text, name jsonb/*localized*/, confederation,
        kit_colors jsonb, qualification_years int[], titles int,
        best_finish text, historical bool, successor_nation_id fk null)

players(id pk, nation_id fk, display_name text, licensed bool,
        position, sub_role, era_start int, era_end int,
        overall int, speed int, passing int, shooting int,
        defending int, physical int, dribbling int, goalkeeping int null,
        preferred_foot, rarity, portrait_ref, notes jsonb, version int)

squads(id pk, user_id fk, nation_id fk, formation text,
       gk_id fk, slots jsonb /*position→player_id*/, kit jsonb, created_at)

tournaments(id pk, user_id fk, mode enum('single','custom'),
            seed bigint, format jsonb, state enum, current_round,
            created_at, updated_at)

tournament_teams(tournament_id fk, nation_id fk, group_label,
                 pts, gf, ga, fair_play int, position int)

matches(id pk, tournament_id fk, round, group_label null,
        home_nation fk, away_nation fk, home_goals, away_goals,
        et bool, pens jsonb null, played_by_user bool,
        events jsonb /*minute,type,player*/, ratings jsonb, seed bigint)

user_stats(user_id pk, games, wins, losses, goals, assists,
           clean_sheets, titles, online_mmr, division,
           most_used jsonb, updated_at)

collections(user_id, item_id, unlocked_at, equipped bool)
collection_items(id pk, type enum('jersey','ball','stadium','badge','moment'),
                 name jsonb, asset_ref, unlock_rule jsonb, rarity)

mp_matches(id pk, season, home_user fk, away_user fk, result jsonb,
           mmr_delta, replay_ref, region, sim_version, played_at)

friendships(user_id, friend_id, status); lobbies(code pk, host_id, state, ttl)
```

### 13.3 API shape

REST for CRUD (`/v1/nations`, `/v1/players?nation=BRA`, `/v1/tournaments/{id}/advance`), WebSocket for lobby/social presence, UDP game protocol for matches. Content endpoints are aggressively CDN-cached with version headers so player-database patches propagate without app updates.

### 13.4 Auth & security

Sign in with Apple / Google + email magic-link; guest-first play with deferred account linking (onboarding email creates a provisional account). JWT access + refresh rotation; server-side receipt validation for any future IAP; rate limiting at gateway; all match outcomes server-verified; PII minimized and regionally stored (GDPR/CCPA: export + delete flows in Settings); COPPA-aware age gate before email capture.

### 13.5 Performance & scalability

Cold start < 2.5s to Home (async asset warm-up); addressable bundles keep base install < 400MB; 60fps target on mid-tier devices (dynamic resolution + particle LOD); game-server fleet autoscales per region on queue depth (Agones); stateless services horizontally scale; player DB reads are CDN-edge cached. Telemetry: crash (Crashlytics), performance traces, and funnel analytics on onboarding/mode entry.

---

## 14. Development Roadmap

**MVP (Months 0–5) — "The Tournament."**
Onboarding · full nation/flag set · ~600-player initial database · squad builder (3 formations) · kit select (2D card-based interim, 3D if timeline allows) · complete 2026 tournament logic · simulation engine with commentary · live 5v5 vs AI (core controls, one stadium) · celebrations · local saves + cloud sync · dark mode · analytics. *Exit criteria: a player can win the World Cup end-to-end and it feels premium.*

**Beta (Months 5–9) — "The Club."**
Real-time multiplayer (casual + friends/private lobbies) · matchmaking infra + 2 regions · 3D jersey viewer · Tournament Simulator with saves · Collection v1 (jerseys, balls, badges) · statistics/profile suite · light mode + full accessibility pass · player DB to ~1,200 · closed beta via TestFlight/Play Console, netcode telemetry loop.

**Version 1.0 (Months 9–12) — "The Season."**
Ranked seasons + divisions + leaderboards · third region + cross-region fallback · stadium themes + historic moments in Collection · achievements · localization (EN/ES/PT/FR/DE/AR/JA) · marketing site + launch trailer built from in-engine celebrations · live-ops content pipeline (rating patches, seasonal flag frames).

**Post-1.0 candidates** (sequenced by retention impact): **Career Mode** (manage one nation across multiple cups with aging eras) → **Historical World Cups** (playable 1970, 1986, 1998… with era-locked squads) → **Seasonal Events** (limited-time cups with unique unlocks) → **Custom Cups sharing** (publish a cup config, friends play the same bracket) → **Player Trading economy** (only if designed without pay-to-win: cosmetic-adjacent, duplicate-exchange based).

---

## 15. Open Risks

1. **Licensing** (players, "World Cup" marks) — the single existential dependency; mitigation baked into schema and branding (§1, §7.2).
2. **Netcode quality on mobile** — mitigate with early beta telemetry and input-delay scaling; ship casual MP before ranked.
3. **Content editorial load** (1,200 rated players) — build the internal rating CMS in month 1; it pays for itself by Beta.
4. **Scope of live 5v5** — the match engine is the deepest well; the MVP gate is "fun in 10 seconds," not feature parity with console games.

*— End of specification —*
