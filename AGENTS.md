# AGENTS.md

Angular 16 admin panel (PrimeNG/PrimeFlex) for the Flaca Sanmiguelense site. **Despite the repo name, this is a frontend, not a backend** — the real API is `ws-flacaSanmiguelense/`. The Angular project is still internally named "heroes" from its CLI scaffold. Deployed under `/admin/` on the same host as the public site.

## Commands

- `npm install` — node_modules is not committed
- `npm start` — dev server at `http://localhost:4200/`
- `npm run build` — output goes to `dist/admin` (see `angular.json`)
- `npm run prod` — production build with `--base-href /admin/` (this is the deploy artifact)
- `npm test` — Karma/Jasmine, needs Chrome; only scaffold specs exist. No lint script is configured.

## Architecture quirks (not obvious from filenames)

- **The API base URL lives in `src/environments/` and switches automatically** (no more hardcoded URL in `servicio.service.ts`): `ServicioService.api` reads `environment.apiUrl`. `ng serve` (development) uses `environment.ts` → `http://127.0.0.1:8000/api/private/`; `ng build` / `npm run prod` (production configuration) applies the `fileReplacements` in `angular.json` and swaps in `environment.prod.ts` → `https://flacasanmiguelense.itses.edu.mx/api/private/`. Change URLs in the environment files, not in the service.
- All HTTP goes through `ServicioService` (get/post/put/patch/delete by model string). Posts use `application/x-www-form-urlencoded` — the Laravel API expects form encoding, not JSON. Image fields are uploaded with `ServicioService.subirImagen()` (`POST imagenes`, multipart), which sets the form control (`imagen_url`/`imagen`) with the returned URL — there is no manual URL typing anymore.
- Auth: login stores the Sanctum token in `localStorage` under `token` (plus `user`); `src/app/provider/auth.interceptor.ts` attaches `Authorization: Bearer ...` and, on 401/403, clears storage and redirects to `/login` with `returnUrl`.
- Routing is inverted from the usual layout: `app-routing.module.ts` lazy-loads `AuthModule` at `''` and redirects everything else to `login`; the actual admin routes (agenda, patrocinadores, faq, convocatorias, registro-convocatorias — all behind `AuthGuard`) are declared in `src/app/auth/auth-routing.module.ts`. The `galeria` route exists as a commented-out line there; its component still ships.
- Rich text uses Quill v1 (`allowedCommonJsDependencies` in `angular.json` papers over the CommonJS warning — don't remove it).

## Conventions

- UI text and git commit messages are in Spanish (see `git log`).
