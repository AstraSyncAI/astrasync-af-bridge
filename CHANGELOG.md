# Changelog

All notable changes to the AstraSync AF Bridge will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-10-20

### 🎉 Production Release

This marks the official production release of the AstraSync AF Bridge for Letta Agent Files!

### Changed
- **BREAKING**: Updated default API endpoint from Railway development environment to production (`https://astrasync.ai/api`)
- Updated package version from 0.1.0 to 1.0.0
- Updated all documentation from "Developer Preview" to "Production"
- Updated package keywords from "developer-preview" to "production"
- Updated package description to reflect production status

### Improved
- Production-grade API endpoints with improved reliability
- Enhanced documentation for production use
- Cleaner configuration and setup process
- Full support for Letta Agent File (.af) format

### Migration Guide

If you're upgrading from v0.1.x (Developer Preview):

1. **Update your installation:**
   ```bash
   npm install --upgrade @astrasync/af-bridge
   ```

2. **Environment variables (optional):**
   - The default API URL now points to production: `https://astrasync.ai/api`
   - If you have `ASTRASYNC_API_URL` set in your `.env`, you can update it to the production URL
   - The bridge's default already points to production

3. **No code changes required** - The AF bridge is backward compatible. All API calls will automatically use the new production endpoints.

4. **Agent Files:** All existing .af files continue to work with the production infrastructure

### Note
- All existing functionality continues to work as expected
- Letta Agent File (.af) format support remains unchanged
- Demo mode continues to work for offline testing
- Compatible with Letta/MemGPT agent exports

---

## [0.1.0] - 2025-09-XX

### Developer Preview Release
- Initial public release
- Bridge for Letta Agent Files (.af format)
- Support for JSON and ZIP .af formats
- Agent registration with AstraSync
- Railway development API endpoint
- CLI tool for agent file management
- Demo mode for offline testing
