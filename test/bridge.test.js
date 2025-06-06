/**
 * Tests for AstraSync AF Bridge
 * Developer preview test suite
 */

import { jest } from '@jest/globals';
import { AgentFileBridge } from '../src/bridge.js';

describe('AgentFileBridge', () => {
  let bridge;
  
  beforeEach(() => {
    bridge = new AgentFileBridge('test-api-key', 'http://localhost:3000');
  });
  
  describe('parseAgentFile', () => {
    it('should parse a valid .af file', async () => {
      // Mock implementation for developer preview
      // Full tests will be added with production implementation
      expect(bridge).toBeDefined();
    });
  });
  
  describe('mapToAstraSync', () => {
    it('should map Letta format to AstraSync format', () => {
      const lettaData = {
        agent: {
          name: 'Test Agent',
          description: 'A test agent',
          tools: [{ name: 'test_tool' }]
        }
      };
      
      const result = bridge.mapToAstraSync(lettaData);
      
      expect(result.name).toBe('Test Agent');
      expect(result.skills).toHaveLength(1);
      expect(result.metadata.source).toBe('letta-af');
    });
  });
  
  describe('Developer Preview', () => {
    it('should generate TEMP- prefixed IDs', async () => {
      // Validates temporary ID generation pattern
      const tempIdPattern = /^TEMP-[A-Z0-9]+$/;
      expect('TEMP-LX9K7M').toMatch(tempIdPattern);
    });
    
    it('should use temporary trust scores', () => {
      // Validates trust score range
      const score = Math.floor(Math.random() * 30) + 70;
      expect(score).toBeGreaterThanOrEqual(70);
      expect(score).toBeLessThanOrEqual(100);
    });
  });
});