# AstraSync AF Bridge

Bridge for importing Letta Agent Files (.af) into the AstraSync compliance platform. This allows any Letta agent to gain blockchain-verified compliance registration with minimal friction.

> **Production**: This integration uses temporary IDs and simulated trust scores. Production blockchain registration will be available upon full platform launch. No API key required!

## Quick Start

```bash
# Install dependencies
npm install

# Set up your email in .env file
echo "DEVELOPER_EMAIL=your-email@example.com" >> .env

# Register a Letta agent (saves JSON in current directory)
npm run register path/to/agent.af

# Or specify output location
node src/cli.js register my-agent.af -o results/output.json

# Or use full path
node src/cli.js register /path/to/agent.af --output /path/to/output.json
```

## What This Does

1. **Parses Letta .af files** - Extracts agent metadata, tools, and configuration
2. **Maps to AstraSync format** - Converts Letta's structure to AstraSync's compliance framework
3. **Registers with blockchain** - Creates immutable compliance record
4. **Returns unified response** - Provides both AstraSync ID and original Letta metadata

## Architecture

```
Letta .af file → AF Parser → Metadata Mapper → AstraSync API → Blockchain Registration
                                                      ↓
                                                 Trust Score & ID
```

## Example Output

```json
{
  "astraSync": {
    "agentId": "TEMP-LX9K7M",
    "status": "pending_registration",
    "trustScore": {
      "value": 85,
      "type": "temporary"
    },
    "verificationUrl": "https://astrasync.ai/verify/TEMP-LX9K7M",
    "message": "Developer preview - using temporary storage"
  },
  "letta": {
    "originalFile": "research-agent.af",
    "agentName": "Deep Research Agent",
    "preservedState": true
  },
  "message": "Letta agent successfully registered with AstraSync compliance layer"
}
```

## Integration with Existing Tools

This bridge works alongside:
- [astrasync-api](https://github.com/AstraSyncAI/astrasync-api) - Core registration API
- [astrasync-mcp-bridge](https://github.com/AstraSyncAI/astrasync-mcp-bridge) - MCP protocol support

## Use Cases

- **Compliance for Letta Agents**: Add regulatory compliance to any Letta agent
- **Cross-Platform Portability**: Move agents between Letta and other platforms while maintaining compliance
- **Enterprise Deployment**: Enable Letta agents in regulated environments

## Configuration

Set environment variables or use `.env` file:

```env
ASTRASYNC_API_URL=https://astrasync.ai/api  # Optional, this is the default
DEVELOPER_EMAIL=your-email@example.com  # Required for registration
```

## Development

```bash
# Run tests
npm test

# Run in development mode
npm run dev

# Build for production
npm run build
```

## Production Notes

- Uses temporary PostgreSQL storage via Railway
- Generates TEMP- prefixed IDs until blockchain integration
- Trust scores are simulated (70-100 range)
- Full production features available upon platform launch

## License

MIT - See LICENSE file for details