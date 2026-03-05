# FHIR Runtime Playground

A **browser-only FHIR R4 Explorer, Validator, and FHIRPath Console** powered by the [`fhir-runtime`](https://github.com/medxaidev/fhir-runtime) engine.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Preview

https://medxai.com.cn/fhir-runtime-playground/

## Overview

FHIR Runtime Playground is a comprehensive web application for exploring, validating, and testing FHIR R4 resources directly in your browser. It serves as both a practical tool for FHIR developers and a live demonstration of the `fhir-runtime` v0.2 capabilities.

**Key Features:**

- 🔍 **Explore** - Browse FHIR R4 and US Core resource element trees
- ✅ **Validate** - Validate resources against StructureDefinition profiles
- 🔄 **Diff** - Compare two StructureDefinitions element-by-element
- 📝 **FHIRPath** - Evaluate FHIRPath expressions against resources

## Features

### Explore Module

- Interactive resource element tree browser
- Support for FHIR R4 base resources (Patient, Observation, Encounter, Condition, etc.)
- US Core profile support
- Element details with cardinality, type, and binding information

### Validate Module

- Three-column validation workspace (Profile | Resource | Result)
- Full validation pipeline using `fhir-runtime`:
  - Parse StructureDefinition
  - Generate snapshot
  - Build canonical profile
  - Validate FHIR JSON resources
- Detailed validation results with error messages and paths

### Diff Module

- Element-by-element comparison of two StructureDefinitions
- Color-coded differences:
  - 🟢 **Green** - New elements
  - 🔴 **Red** - Removed elements
  - 🟡 **Yellow** - Changed cardinality or type
  - 🔵 **Blue** - Changed constraints
- Side-by-side snapshot comparison

### FHIRPath Module

- Monaco editor for resource editing
- FHIRPath expression evaluation
- Support for both `evalFhirPath` and `evalFhirPathTyped`
- Real-time expression results

## Technology Stack

- **Framework**: React 19 + TypeScript + Vite
- **UI Library**: Mantine 8
- **Code Editor**: Monaco Editor
- **Icons**: Lucide React
- **FHIR Engine**: fhir-runtime v0.2

## Installation

```bash
# Clone the repository
git clone https://github.com/medxaidev/fhir-runtime-playground.git
cd fhir-runtime-playground

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Development Server

The development server runs on `http://localhost:3000`:

```bash
npm run dev
```

### Production Build

Build the application for production deployment:

```bash
npm run build
```

The built files will be in the `dist/` directory.

## Project Structure

```
fhir-runtime-playground/
├── src/
│   ├── modules/           # Four main modules (Explore, Validate, Diff, FHIRPath)
│   ├── lib/               # Shared utilities and context
│   ├── polyfills/         # Browser polyfills for Node.js modules
│   └── main.tsx           # Application entry point
├── spec/
│   ├── fhir/r4/           # FHIR R4 specification bundles
│   └── us-core/           # US Core Implementation Guide
├── public/                # Static assets
├── devdocs/               # Development documentation
└── dist/                  # Production build output
```

## FHIR Runtime Integration

This playground uses the `fhir-runtime` v0.2 package for all FHIR operations:

- **Context Management**: `FhirContextImpl`, `loadBundleFromObject`, `preloadCoreDefinitions`
- **Parsing**: `parseStructureDefinition`, `parseFhirJson`
- **Profile Generation**: `SnapshotGenerator.generate()`, `buildCanonicalProfile`
- **Validation**: `StructureValidator.validate()`
- **FHIRPath**: `evalFhirPath`, `evalFhirPathTyped`

See [`devdocs/development/RUNTIME-INTEGRATION.md`](devdocs/development/RUNTIME-INTEGRATION.md) for detailed API usage.

## Browser Compatibility

This application runs entirely in the browser with no backend requirements. It uses polyfills for Node.js modules to ensure compatibility with the `fhir-runtime` package.

Supported browsers:

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Non-Goals

This project intentionally **does NOT include**:

- FHIR Server or REST API
- Terminology Server or ValueSet expansion
- Authentication or user accounts
- Data persistence or storage
- Remote profile registry
- Server-side validation

All functionality is client-side only.

## Development

### Prerequisites

- Node.js 18+ and npm

### Development Documentation

Comprehensive development documentation is available in the `devdocs/` directory:

- [`devdocs/README.md`](devdocs/README.md) - Documentation index
- [`devdocs/ROADMAP.md`](devdocs/ROADMAP.md) - Development roadmap
- [`devdocs/architecture/ARCHITECTURE.md`](devdocs/architecture/ARCHITECTURE.md) - Architecture overview
- [`devdocs/development/COMPONENTS.md`](devdocs/development/COMPONENTS.md) - Component hierarchy
- [`devdocs/development/RUNTIME-INTEGRATION.md`](devdocs/development/RUNTIME-INTEGRATION.md) - Runtime API usage

### Code Style

- TypeScript strict mode enabled
- React functional components with hooks
- Mantine UI components for consistent styling
- Monaco Editor for code editing

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Author

**Fangjun** - [fangjun20208@gmail.com](mailto:fangjun20208@gmail.com)

## Related Projects

- [fhir-runtime](https://github.com/medxaidev/fhir-runtime) - The underlying FHIR engine

## Contributing

This is a demonstration project for `fhir-runtime`. For issues or feature requests related to FHIR validation, parsing, or FHIRPath evaluation, please refer to the [fhir-runtime repository](https://github.com/medxaidev/fhir-runtime).

## Acknowledgments

- Built with [fhir-runtime](https://github.com/medxaidev/fhir-runtime) v0.2
- FHIR® is a registered trademark of HL7
- Uses FHIR R4 specification and US Core Implementation Guide
