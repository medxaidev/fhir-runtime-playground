# Contributing to FHIR Runtime Playground

Thank you for your interest in contributing to FHIR Runtime Playground!

## Project Scope

This is a demonstration project for the `fhir-runtime` engine. The playground is designed to showcase the capabilities of `fhir-runtime` v0.2 in a browser environment.

## Reporting Issues

### For FHIR Runtime Issues

If you encounter issues related to:
- FHIR validation logic
- FHIRPath evaluation
- StructureDefinition parsing
- Snapshot generation
- Profile building

Please report them in the [fhir-runtime repository](https://github.com/medxaidev/fhir-runtime/issues).

### For Playground Issues

If you encounter issues related to:
- UI/UX problems
- Browser compatibility
- Module navigation
- Display or rendering issues

Please open an issue in this repository with:
- Description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Browser and version
- Screenshots if applicable

## Development Setup

```bash
# Clone the repository
git clone https://github.com/medxaidev/fhir-runtime-playground.git
cd fhir-runtime-playground

# Install dependencies
npm install

# Start development server
npm run dev
```

## Code Style

- Use TypeScript strict mode
- Follow existing code patterns
- Use React functional components with hooks
- Use Mantine UI components for consistency
- Keep components focused and single-purpose

## Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Make your changes
4. Test thoroughly (`npm run build` should succeed)
5. Commit with clear messages
6. Push to your fork
7. Open a pull request

### PR Guidelines

- Describe what your PR does and why
- Reference any related issues
- Ensure the build passes
- Keep changes focused and atomic
- Update documentation if needed

## Architecture Principles

Please review the development documentation before contributing:

- [`devdocs/README.md`](devdocs/README.md) - Project overview
- [`devdocs/architecture/ARCHITECTURE.md`](devdocs/architecture/ARCHITECTURE.md) - Architecture
- [`devdocs/development/COMPONENTS.md`](devdocs/development/COMPONENTS.md) - Component structure

**Key principles:**
1. Keep the architecture minimal
2. Avoid unnecessary abstractions
3. Do not introduce backend services
4. All execution happens in the browser
5. Delegate FHIR logic to `fhir-runtime`

## Non-Goals

This project intentionally does NOT include:
- FHIR Server or REST API
- Terminology Server
- Authentication
- Data persistence
- Remote profile registry
- Server-side validation

Please do not submit PRs that add these features.

## Questions?

Feel free to open an issue for discussion before starting work on significant changes.

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
