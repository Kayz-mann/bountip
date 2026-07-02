# Bountip — Product Catalogue

A small, production-minded React Native product catalogue built on the public
[Fake Store API](https://fakestoreapi.com/products). Browse products, search and
filter by category, view details, and save favourites — with proper loading,
empty, error and offline states throughout.

Built with **Expo (SDK 57) + expo-router**, **TypeScript**, **Redux Toolkit**
(client state) and **TanStack React Query** (server state).

---

## Features

- **Product list** — image, title, price, category and a description preview, in a fast `FlatList`.
- **Product details** — full image, title, description, price, category and star rating.
- **Search** — debounced, case-insensitive title search.
- **Category filter** — horizontal, scrollable category tabs (plus an "All" tab).
- **Every feedback state** — initial loading (skeletons), empty search, empty catalogue, API error with retry, and pull-to-refresh.
- **Favourites** — a dedicated tab, persisted across launches.
- **Dark mode** — follows the system appearance.
- **Offline-friendly** — the catalogue is cached and readable offline, with an offline banner.
- **Accessible** — roles, labels and selected-state on every interactive element.
- **Tested** — unit + integration tests (Jest + React Native Testing Library) and a green CI pipeline.

## Screenshots

> Add captures to `docs/screenshots/` and they'll render here.

| List | Details | Search / Empty | Dark mode |
| ---- | ------- | -------------- | --------- |
| _list.png_ | _details.png_ | _empty.png_ | _dark.png_ |

## Tech stack

| Concern           | Choice                                             |
| ----------------- | -------------------------------------------------- |
| Framework         | Expo SDK 57, React Native 0.86, React 19           |
| Language          | TypeScript (strict)                                |
| Navigation        | expo-router (file-based, typed routes)             |
| Server state      | TanStack React Query (+ AsyncStorage persistence)  |
| Client state      | Redux Toolkit (`createSlice`) + redux-persist      |
| Data fetching     | `fetch` with a typed error layer (no axios)        |
| Images            | expo-image (disk cache)                            |
| Testing           | Jest, React Native Testing Library                 |
| Tooling           | ESLint (eslint-config-expo), GitHub Actions        |

## Requirements

- **Node 20+**
- **Yarn** (this repo uses `yarn.lock` as the single lockfile)
- The **Expo Go** app or an iOS/Android simulator/emulator

## Getting started

```bash
yarn install
yarn ios        # or: yarn android, or: yarn start (then press i / a / w)
```

`yarn start` opens the Expo dev server; scan the QR code with Expo Go or launch a simulator.

## Running tests

```bash
yarn test              # run the suite once
yarn test:watch        # watch mode
yarn test:coverage     # with a coverage report
yarn typecheck         # tsc --noEmit
yarn lint              # eslint
```

## Architecture

### State: React Query vs Redux

The one rule: **anything fetched from the server lives in React Query; anything
the user controls in the UI lives in Redux.** They never overlap.

| State                          | Owner                     | Why                                                   |
| ------------------------------ | ------------------------- | ----------------------------------------------------- |
| Products, product, categories  | **React Query**           | Server cache: loading/error, refetch, offline persist |
| Search text, active category   | **Redux** (`filters`)     | Pure UI state that drives client-side filtering       |
| Favourites                     | **Redux** (`favourites`)  | Client-only, persisted; no server round-trip          |
| Dark mode                      | System (`useColorScheme`) | Already provided by the OS + theme system             |

Using both libraries is deliberate, not redundant: React Query is a *server
cache* and Redux is a *client-state container*, so there is zero duplication —
no product ever lands in Redux, and no filter ever lands in the query cache.
A purist could ship this with React Query only; I use the split because it
gives favourites a persisted, testable home and keeps filtering logic out of
components. **RTK Query is intentionally not used** — it would duplicate
React Query.

### Folder structure

```
src/
  app/                 # expo-router routes (thin — logic lives in hooks/screens)
    _layout.tsx        # providers + root stack; product/[id] pushes over the tabs
    (tabs)/            # Shop + Favourites tabs
    product/[id].tsx   # shared details route
  api/                 # fetch client (typed ApiError) + product services
  components/          # reusable UI (product, filters, state views)
  hooks/               # queries/ (react-query) + filtering/debounce/haptics
  screens/             # screen components rendered by the routes
  store/               # redux slices, typed hooks, persisted store
  lib/                 # query client, formatting helpers
  types/               # Product domain types + runtime guard
  test-utils/          # renderWithProviders, fixtures, fetch mocks
```

## API

The app uses the public [Fake Store API](https://fakestoreapi.com). Three
endpoints cover every screen — each is reproducible with `curl`. Responses below
are real (captured from the live API).

### List products — `GET /products`

```bash
curl -s "https://fakestoreapi.com/products?limit=2"
```

```json
[
  {
    "id": 1,
    "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
    "price": 109.95,
    "description": "Your perfect pack for everyday use and walks in the forest. ...",
    "category": "men's clothing",
    "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
    "rating": { "rate": 3.9, "count": 120 }
  }
]
```

### Single product — `GET /products/{id}`

```bash
curl -s https://fakestoreapi.com/products/1
```

```json
{
  "id": 1,
  "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
  "price": 109.95,
  "description": "Your perfect pack for everyday use and walks in the forest. ...",
  "category": "men's clothing",
  "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_t.png",
  "rating": { "rate": 3.9, "count": 120 }
}
```

### Categories — `GET /products/categories`

```bash
curl -s https://fakestoreapi.com/products/categories
```

```json
["electronics", "jewelery", "men's clothing", "women's clothing"]
```

Note the upstream `jewelery` spelling — the app displays a title-cased label but
keeps the raw string as the filter key.

### Edge case — unknown id returns `200` with an empty body

```bash
curl -s -i https://fakestoreapi.com/products/9999
```

```http
HTTP/2 200
content-type: application/json; charset=utf-8
content-length: 0
```

The body is empty, so a naive `res.json()` throws `Unexpected end of JSON input`.
The API client detects the empty body and maps it to a typed `notfound` error;
`getProduct` resolves to `null` and the details screen shows a "not found" state
instead of crashing or retrying forever. This is covered by a test.

## Technical decisions

- **`fetch` over axios.** One unauthenticated GET host with nothing to intercept
  — axios would be dead weight. A ~30-line client normalises errors into a typed
  `ApiError` (`network | http | notfound | parse`) that drives the error UI.
- **Client-side search & filtering.** Fake Store has no title-search endpoint,
  so the catalogue (~20 items) is fetched once and filtered in memory, debounced.
- **Reused the Expo theme system** (themed components + tokens) rather than adding
  NativeWind — dark mode comes for free and there's no second styling paradigm.
- **Disk-cached images** via expo-image (`memory-disk` + `recyclingKey`) — no
  re-downloads on scroll, and recycled list rows never flash the wrong image.
- **Stable, honest routing.** Uses expo-router's JS `Tabs` inside a root `Stack`
  (product details pushes over the tab bar) instead of the unstable native tabs,
  which cannot be nested in a stack.

## Deliberately avoided (to keep it right-sized)

The brief explicitly warns against over-engineering, so these were conscious "no"s:

| Not done                        | Why                                                   |
| ------------------------------- | ----------------------------------------------------- |
| RTK Query / axios interceptors  | Nothing to intercept; duplicates React Query          |
| Pagination / infinite scroll    | The API returns a fixed ~20 items                     |
| `zod` schema validation         | A tiny `isProduct` runtime guard covers the real risk |
| NativeWind / a design system    | The scaffold already ships a working theme            |
| Manual `useMemo` / `useCallback`| React Compiler is enabled                             |

## Testing

24 tests across 8 suites, focused on behaviour rather than snapshots:

- **List screen (integration):** network error → retry → **recovery** → empty search — the full user loop in one test.
- **`useProduct`:** an unknown id returns a 200 with an *empty body*; the hook resolves `null` (not an error), so details show a "not found" state instead of retrying forever.
- **Filtering:** search (case-insensitive, trimmed), category, and empty-result handling.
- **Debounce:** several rapid changes coalesce into a single update.
- **Slices:** filters and favourites reducers (including toggle idempotency).
- **Components:** product card rendering/press, rating half-stars and the absent-rating path.

## Assumptions & known limitations

- **Unknown/deleted product ids return HTTP 200 with an empty body** (verified against the live API). The client maps this to a "not found" state rather than crashing on JSON parsing or retrying endlessly.
- **Categories include the upstream `jewelery` typo.** Tabs display a title-cased label but filter on the raw key, so the typo is preserved on purpose (breaking it would break filtering).
- **Ratings can be missing.** `product.rating` is treated as optional everywhere.
- **Offline is best-effort.** After a first successful load the catalogue is cached (24h); a *cold* first launch with no network shows the error/retry state.
- **Search/filtering are client-side** given the API's constraints and small payload.

## License

MIT
