# Contributing to AstraSync AF Bridge

Thank you for your interest in contributing to the AstraSync AF Bridge! This is a production, and we welcome feedback and contributions.

## Production Status

This bridge is currently in production, which means:
- Uses temporary IDs (TEMP- prefix)
- Simulated trust scores (70-100 range)
- PostgreSQL temporary storage via Railway
- Blockchain registration is pending

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/astrasync-af-bridge.git`
3. Install dependencies: `npm install`
4. Copy `.env.example` to `.env` and add your API key
5. Run tests: `npm test`

## Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes
3. Run tests: `npm test`
4. Commit with descriptive message: `git commit -m "Add: description of change"`
5. Push to your fork: `git push origin feature/your-feature-name`
6. Create a Pull Request

## Code Style

- Use ES6+ JavaScript features
- Add JSDoc comments for public methods
- Keep functions focused and small
- Use meaningful variable names
- Add error handling for all async operations

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Test with actual .af files when possible

## Reporting Issues

- Check existing issues first
- Include steps to reproduce
- Provide error messages and logs
- Specify your environment (OS, Node version)

## Questions?

Join our discussions on GitHub or reach out to the team.