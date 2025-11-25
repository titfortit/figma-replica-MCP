#!/usr/bin/env node

/**
 * Figma Auto-Sync Script (Standalone MCP)
 * Spawns a Figma MCP server and fetches design data directly.
 */

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import fs from 'fs/promises';
import path from 'path';
import { spawn } from 'child_process';

// Configuration
const FIGMA_FILE_KEY = 'XJETBSzefFXS8hLHAlKYy1';
const FIGMA_NODE_ID = '111-568'; // Compass component
const CHECK_INTERVAL = 5000; // 5 seconds
const APP_FILE = './src/App.tsx';

let lastHash = '';
let isUpdating = false;

console.log('🎨 Figma Auto-Sync Started (Standalone MCP)!');
console.log(`📋 Watching Figma file: ${FIGMA_FILE_KEY}`);

if (!process.env.FIGMA_API_KEY) {
  console.warn('⚠️  Warning: FIGMA_API_KEY environment variable is not set.');
  console.warn('    The MCP server may fail to authenticate.');
}

/**
 * Simple hash function to detect changes
 */
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString();
}

/**
 * Fetch design context from Figma via standalone MCP server (HTTP/SSE)
 */
async function fetchFigmaDesign() {
  let client;
  let serverProcess;

  try {
    console.log('   Spawning MCP server (HTTP mode)...');
    // Spawn the server
    serverProcess = spawn("npx", ["-y", "figma-developer-mcp", "--port", "3333"], {
      env: {
        ...process.env,
        FIGMA_API_KEY: process.env.FIGMA_API_KEY,
        PATH: process.env.PATH
      },
      stdio: 'pipe' // We need to read stdout to know when it's ready
    });

    // Wait for server to be ready
    await new Promise((resolve, reject) => {
      serverProcess.stdout.on('data', (data) => {
        const output = data.toString();
        // console.log('[Server]:', output); // Optional debug
        if (output.includes('listening on port 3333')) {
          resolve();
        }
      });

      serverProcess.stderr.on('data', (data) => {
        console.error('[Server Error]:', data.toString());
      });

      serverProcess.on('error', reject);

      // Timeout after 10s
      setTimeout(() => reject(new Error('Server start timeout')), 10000);
    });

    console.log('   Server ready! Connecting via SSE...');

    const transport = new SSEClientTransport(
      new URL("http://localhost:3333/sse")
    );

    client = new Client({
      name: "figma-sync-client",
      version: "1.0.0",
    }, {
      capabilities: {},
      requestTimeout: 300000 // 5 minutes
    });

    await client.connect(transport);
    console.log('   Connected!');

    // List tools to see what's available (optional, for debugging)
    console.log('   Listing tools...');
    const tools = await client.listTools();
    console.log('   Available tools:', tools.tools.map(t => t.name).join(', '));

    // Use the get_figma_data tool
    console.log(`   Calling tool: get_figma_data for ${FIGMA_FILE_KEY} node ${FIGMA_NODE_ID}`);

    const result = await client.callTool({
      name: "get_figma_data",
      arguments: {
        fileKey: FIGMA_FILE_KEY,
        nodeIds: [FIGMA_NODE_ID]
      }
    });

    console.log('   Tool call complete!');

    return result;

  } catch (error) {
    console.error('❌ Error fetching from MCP:', error.message);
    return null;
  } finally {
    if (client) {
      await client.close();
    }
    if (serverProcess) {
      serverProcess.kill();
      console.log('   MCP server stopped.');
    }
  }
}

/**
 * Check if Figma design has changed
 */
async function checkForChanges() {
  if (isUpdating) {
    return false;
  }

  try {
    // For this demo, we'll still use the local file hash as a primary trigger
    // to avoid spamming the MCP server every 5 seconds if not needed,
    // but in a real "watch" scenario, you might poll the MCP or use notifications.

    const appContent = await fs.readFile(APP_FILE, 'utf-8');
    const contentHash = simpleHash(appContent);

    if (lastHash === '' || lastHash !== contentHash) {
      lastHash = contentHash;
      return true; // Local file changed, maybe trigger a sync/check
    }

    // Optionally: Poll MCP for changes (rate limited)
    // const design = await fetchFigmaDesign();
    // if (design) { ... compare ... }

    return false;
  } catch (error) {
    console.error('❌ Error checking for changes:', error.message);
    return false;
  }
}

/**
 * Update React components with latest Figma design
 */
async function updateComponents() {
  if (isUpdating) return;

  isUpdating = true;
  console.log('🔄 Updating components from Figma...');

  try {
    const designData = await fetchFigmaDesign();

    if (designData) {
      console.log('✅ Retrieved design data from MCP!');
      // Save data to file for inspection
      await fs.writeFile('design.json', JSON.stringify(designData, null, 2));
      console.log('💾 Saved design data to design.json');
      console.log(`   Data length: ${JSON.stringify(designData).length} chars`);
    } else {
      console.log('⚠️  Failed to retrieve design data.');
    }

    console.log(`⏰ Last sync: ${new Date().toLocaleTimeString()}\n`);
  } catch (error) {
    console.error('❌ Error updating components:', error.message);
  } finally {
    isUpdating = false;
  }
}

/**
 * Main watch loop
 */
async function watch() {
  // Initial sync
  await updateComponents();

  // Then watch
  setInterval(async () => {
    const hasChanges = await checkForChanges();
    if (hasChanges) {
      await updateComponents();
    }
  }, CHECK_INTERVAL);
}

// Start watching
console.log('👀 Watching for Figma changes...\n');
watch();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Figma Auto-Sync stopped. Goodbye!');
  process.exit(0);
});



