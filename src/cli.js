#!/usr/bin/env node

/**
 * AstraSync AF Bridge CLI
 * 
 * Command-line interface for registering Letta agents with AstraSync.
 * Developer preview - uses temporary storage and simulated trust scores.
 */

import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import dotenv from 'dotenv';
import { AgentFileBridge } from './bridge.js';
import fs from 'fs/promises';
import path from 'path';

// Load environment variables
dotenv.config();

const program = new Command();

program
  .name('astrasync-af')
  .description('Bridge for importing Letta Agent Files (.af) into AstraSync')
  .version('0.1.0');

program
  .command('register <file>')
  .description('Register a Letta .af file with AstraSync')
  .option('-u, --api-url <url>', 'AstraSync API URL', 'https://api.astrasync.ai')
  .option('-o, --output <path>', 'Output file path (defaults to current directory)')
  .action(async (file, options) => {
    const apiUrl = options.apiUrl || process.env.ASTRASYNC_API_URL;
    
    const spinner = ora('Reading agent file...').start();
    
    try {
      // Check if file exists
      await fs.access(file);
      
      spinner.text = 'Parsing Letta agent file...';
      
      // Initialize bridge (no API key needed!)
      const bridge = new AgentFileBridge(apiUrl);
      
      spinner.text = 'Registering with AstraSync...';
      
      // Register the agent
      const result = await bridge.registerAgentFile(file);
      
      spinner.succeed('Agent successfully registered!');
      
      // Display results
      console.log('\n' + chalk.green('✅ Registration Complete'));
      console.log(chalk.gray('─'.repeat(50)));
      
      console.log(chalk.bold('\n🔐 AstraSync Compliance (Developer Preview):'));
      console.log(`  Agent ID: ${chalk.cyan(result.astraSync.agentId)}`);
      console.log(`  Trust Score: ${chalk.yellow(result.astraSync.trustScore.value + '% (' + result.astraSync.trustScore.type + ')')}`);
      console.log(`  Status: ${chalk.gray(result.astraSync.status)}`);
      console.log(`  Verification: ${chalk.blue(result.astraSync.verificationUrl)}`);
      
      if (result.astraSync.message) {
        console.log(`  ${chalk.dim(result.astraSync.message)}`);
      }      
      console.log(chalk.bold('\n📦 Letta Agent:'));
      console.log(`  Name: ${chalk.cyan(result.letta.agentName)}`);
      console.log(`  File: ${chalk.gray(result.letta.originalFile)}`);
      
      console.log(chalk.gray('\n─'.repeat(50)));
      console.log(chalk.green(`\n${result.message}\n`));
      
      // Save result to file
      let outputFile;
      if (options.output) {
        outputFile = options.output;
      } else {
        // Default to current directory with same filename
        outputFile = path.basename(file).replace('.af', '-astrasync.json');
      }
      
      await fs.writeFile(outputFile, JSON.stringify(result, null, 2));
      console.log(chalk.gray(`Results saved to: ${outputFile}`));
      
    } catch (error) {
      spinner.fail('Registration failed');
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('verify <agentId>')
  .description('Verify an AstraSync agent registration')
  .option('-u, --api-url <url>', 'AstraSync API URL', 'https://api.astrasync.ai')
  .action(async (agentId, options) => {
    const apiUrl = options.apiUrl || process.env.ASTRASYNC_API_URL;
    
    const spinner = ora('Verifying agent...').start();
    
    try {
      const bridge = new AgentFileBridge(apiUrl);
      const result = await bridge.verifyAgent(agentId);
      
      spinner.succeed('Verification complete!');
      
      console.log('\n' + chalk.green('✅ Agent Verified'));
      console.log(chalk.gray('─'.repeat(50)));
      console.log(JSON.stringify(result, null, 2));
      
    } catch (error) {
      spinner.fail('Verification failed');
      console.error(chalk.red(`\nError: ${error.message}`));
      process.exit(1);
    }
  });

program.parse();