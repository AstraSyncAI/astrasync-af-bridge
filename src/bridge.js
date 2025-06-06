/**
 * AstraSync AF Bridge
 * 
 * Bridge for importing Letta Agent Files (.af) into the AstraSync compliance platform.
 * This is a developer preview using temporary storage and simulated trust scores.
 * 
 * @module astrasync-af-bridge
 */

import axios from 'axios';
import JSZip from 'jszip';
import fs from 'fs/promises';
import path from 'path';

export class AgentFileBridge {
  constructor(apiUrl) {
    // Use environment variable first, then parameter, then default
    this.apiUrl = process.env.ASTRASYNC_API_URL || apiUrl || 'https://api.astrasync.ai';
    
    this.axios = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  async registerAgentFile(afFilePath) {
    try {
      // 1. Parse the .af file
      const afData = await this.parseAgentFile(afFilePath);
      
      // 2. Map to AstraSync format
      const registrationData = this.mapToAstraSync(afData);
      
      // 3. Register with AstraSync
      const registration = await this.registerWithAstraSync(registrationData);
      
      // 4. Return combined response - aligned with API response format
      return {
        astraSync: {
          agentId: registration.agentId || `TEMP-${Date.now().toString(36).toUpperCase()}`,
          status: "pending_registration",
          trustScore: {
            value: registration.trustScore?.value || Math.floor(Math.random() * 30) + 70,
            type: "temporary"
          },
          verificationUrl: `https://astrasync.ai/verify/${registration.agentId || 'preview'}`,
          message: "Developer preview - using temporary storage"
        },
        letta: {
          originalFile: path.basename(afFilePath),
          agentName: afData.agent.name,
          preservedState: true
        },
        message: "Letta agent successfully registered with AstraSync compliance layer"
      };
    } catch (error) {
      throw new Error(`Failed to register agent file: ${error.message}`);
    }
  }

  async parseAgentFile(afFilePath) {
    // Read the .af file
    const data = await fs.readFile(afFilePath);
    
    // Check if it's JSON or ZIP format
    const fileContent = data.toString('utf-8');
    if (fileContent.trim().startsWith('{')) {
      // New format: Direct JSON
      const agentData = JSON.parse(fileContent);
      
      // Extract additional metadata
      const metadata = {
        agent: agentData,
        files: ['agent.json'],
        hasMemory: !!agentData.memory || !!agentData.core_memory,
        hasTools: !!agentData.tools && agentData.tools.length > 0
      };
      
      return metadata;
    } else {
      // Legacy format: ZIP file
      try {
        const zip = await JSZip.loadAsync(data);
        
        // Extract agent.json from the zip
        const agentJsonFile = zip.file('agent.json');
        if (!agentJsonFile) {
          throw new Error('No agent.json found in .af file');
        }
        
        const agentJsonContent = await agentJsonFile.async('string');
        const agentData = JSON.parse(agentJsonContent);
        
        // Extract additional metadata if available
        const metadata = {
          agent: agentData,
          files: Object.keys(zip.files),
          hasMemory: !!zip.file('memory.json'),
          hasTools: !!agentData.tools && agentData.tools.length > 0
        };
        
        return metadata;
      } catch (error) {
        throw new Error('Invalid .af file format. Expected JSON or ZIP.');
      }
    }
  }

  mapToAstraSync(afData) {
    const { agent } = afData;
    
    // Map Letta capabilities to AstraSync format
    const capabilities = {
      streaming: true, // Letta agents typically support streaming
      pushNotifications: false,
      stateTransitionHistory: afData.hasMemory,
      auditTrail: true,
      complianceReporting: true,
      blockchainAttestation: true,
      crossJurisdictionalCompliance: false
    };
    
    // Map tools to skills
    const skills = this.mapLettaToolsToSkills(agent.tools || []);
    
    // Handle different field names between formats
    const agentName = agent.name || agent.agent_name || "Unnamed Letta Agent";
    const agentType = agent.agent_type || agent.type || "letta";
    
    return {
      name: agentName,
      description: agent.description || agent.system || "Imported from Letta Agent File",
      email: process.env.DEVELOPER_EMAIL || "developer@astrasync.ai",
      version: agent.version || "1.0.0",
      owner: agent.creator || "Letta User",
      ownerUrl: "https://letta.com",
      capabilities,
      skills,
      metadata: {
        source: "letta-af",
        originalId: agent.id || agent.agent_id,
        agentType: agentType,
        memoryConfig: agent.memory || agent.memory_config,
        llmConfig: agent.llm_config || agent.model_config,
        importedAt: new Date().toISOString()
      }
    };
  }

  mapLettaToolsToSkills(tools) {
    return tools.map((tool, index) => ({
      id: `letta-tool-${index}`,
      name: tool.name || tool.function?.name || `Tool ${index + 1}`,
      description: tool.description || tool.function?.description || "Imported Letta tool",
      tags: ["letta", "imported", ...(tool.tags || [])],
      examples: tool.examples || [],
      inputModes: ["application/json", "text/plain"],
      outputModes: ["application/json", "text/plain"]
    }));
  }

  async registerWithAstraSync(registrationData) {
    // Optional demo mode for testing without API
    if (process.env.DEMO_MODE === 'true') {
      console.log('🔧 Running in demo mode...');
      
      // Simulate API response
      return {
        agentId: `TEMP-${Date.now().toString(36).toUpperCase()}`,
        status: "pending_registration",
        trustScore: {
          value: Math.floor(Math.random() * 30) + 70,
          type: "temporary"
        },
        message: "Developer preview - using simulated response"
      };
    }
    
    try {
      const response = await this.axios.post('/v1/register', registrationData);
      return response.data;
    } catch (error) {
      // Align error handling with API patterns
      if (error.response) {
        const { status, data } = error.response;
        if (status === 400) {
          throw new Error(`Invalid registration data: ${data.error || 'Bad request'}`);
        } else if (status === 401) {
          throw new Error('Authentication failed: Invalid API key');
        } else if (status === 429) {
          throw new Error('Rate limit exceeded: Please try again later');
        } else {
          throw new Error(`AstraSync API error: ${data.error || data.message || error.response.statusText}`);
        }
      } else if (error.request) {
        throw new Error('Unable to connect to AstraSync API. Please check your network connection and API URL.\nAPI URL: ' + this.apiUrl);
      }
      throw error;
    }
  }

  async verifyAgent(agentId) {
    try {
      // For developer preview, we'll use a simple verify endpoint
      const response = await this.axios.post('/v1/verify', { agentId });
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`Verification failed: ${error.response.data.message || error.response.statusText}`);
      }
      throw error;
    }
  }
}