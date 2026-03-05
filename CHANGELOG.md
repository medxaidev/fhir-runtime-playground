# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-05

### Added

- Preview deployment URL in documentation.
- `DEPLOYMENT.md` with deployment guidance for common static hosting options.
- `CONTRIBUTING.md` contribution guidelines.
- GitHub Actions CI workflow for build verification.
- SVG favicon and basic SEO meta tags in `index.html`.
- Browser polyfills for Node.js-only modules required by `fhir-runtime`:
  - `src/polyfills/fs.ts`
  - `src/polyfills/fs-promises.ts`
  - `src/polyfills/path.ts`
  - `src/polyfills/url.ts`
- `src/lib/publicBaseUrl.ts` helper for generating `BASE_URL`-aware public asset URLs.

### Changed

- Build pipeline updated to support browser bundling when `fhir-runtime` imports Node.js modules.
- Spec/resource fetch paths changed to be compatible with sub-path deployments:
  - Spec resource registry paths now use `publicUrl()`.
  - Core bundle fetch paths now use `publicUrl()`.
  - Snapshot diff base profile fetch now uses `publicUrl()`.
- Vite configuration updated:
  - Set `base` to `/fhir-runtime-playground/` for deployment under that sub-path.
  - Added module aliases to route `node:*` imports to browser polyfills.
- Project metadata improvements in `package.json`:
  - Added `repository`, `bugs`, `engines`.
  - Set `private: true` to prevent accidental npm publishing.

### Fixed

- `npm run build` failing due to Vite externalizing Node.js modules (`node:fs`, `node:path`, `node:url`) required by `fhir-runtime`.
- Potential runtime 404s when deployed under a non-root sub-path by removing hard-coded `/spec/...` absolute URLs.

## [0.0.1] - 2026-03-05

### Added

- Initial project scaffold: Vite + React + TypeScript playground application.
- Core modules:
  - Explore
  - Validate
  - Diff
  - FHIRPath
