import { AgentFileBridge } from '../src/bridge.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function demo() {
  console.log('🚀 AstraSync + Letta Integration Demo\n');
  
  // Initialize the bridge (no API key needed for dev preview!)
  const bridge = new AgentFileBridge(process.env.ASTRASYNC_API_URL);
  
  try {
    // Register a Letta agent
    console.log('📦 Registering Letta agent with AstraSync...\n');
    
    const result = await bridge.registerAgentFile('./sample-agent.af');
    
    console.log('✅ Success! Agent registered with AstraSync compliance layer\n');
    console.log('Registration Details:');
    console.log('====================');
    console.log(`AstraSync ID: ${result.astraSync.agentId}`);
    console.log(`Trust Score: ${result.astraSync.trustScore.value}% (${result.astraSync.trustScore.type})`);
    console.log(`Status: ${result.astraSync.status}`);
    console.log(`\nVerify at: ${result.astraSync.verificationUrl}`);
    
    if (result.astraSync.message) {
      console.log(`\nNote: ${result.astraSync.message}`);
    }    
    // Verify the registration
    console.log('\n🔍 Verifying registration...\n');
    const verification = await bridge.verifyAgent(result.astraSync.agentId);
    
    console.log('Verification Status:', verification.status);
    console.log('Compliance Flags:', verification.compliance);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the demo
demo().catch(console.error);