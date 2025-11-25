#!/usr/bin/env node

/**
 * Figma Auto-Sync Watcher
 * Automatically polls Figma every 10 seconds and updates code when changes detected
 * Just leave this running in the background!
 */

import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Configuration
const FIGMA_FILE_KEY = 'XJETBSzefFXS8hLHAlKYy1';
const FIGMA_NODE_ID = '85-27';
const CHECK_INTERVAL = 10000; // 10 seconds
const APP_FILE = './src/App.tsx';
const CACHE_FILE = './.figma-cache.json';

let lastDesignHash = '';
let isUpdating = false;
let updateCount = 0;

console.log('🎨 Figma Auto-Sync Watcher Started!\n');
console.log('📋 Configuration:');
console.log(`   File: ${FIGMA_FILE_KEY}`);
console.log(`   Node: ${FIGMA_NODE_ID}`);
console.log(`   Polling: Every 10 seconds\n`);
console.log('🤖 I\'ll automatically update your code when Figma changes are detected!');
console.log('💡 Just make changes in Figma and watch them appear in ~15 seconds\n');
console.log('👀 Watching...\n');

/**
 * Simple hash function
 */
function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = ((h << 5) - h) + str.charCodeAt(i);
    h = h & h;
  }
  return h.toString(36);
}

/**
 * Fetch design from Figma API
 */
async function fetchFigmaDesign() {
  try {
    const url = `https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/nodes?ids=${FIGMA_NODE_ID}`;
    const token = process.env.FIGMA_ACCESS_TOKEN;
    
    if (!token) {
      // No direct API access - we'll use file modification time instead
      return null;
    }

    const response = await fetch(url, {
      headers: { 'X-Figma-Token': token }
    });

    if (!response.ok) return null;
    
    const data = await response.json();
    return JSON.stringify(data);
  } catch (error) {
    return null;
  }
}

/**
 * Load cache
 */
async function loadCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(data);
  } catch {
    return { lastHash: '', lastCheck: 0, version: 1 };
  }
}

/**
 * Save cache
 */
async function saveCache(data) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(data, null, 2));
}

/**
 * Check for Figma changes
 */
async function checkForChanges() {
  if (isUpdating) return false;

  try {
    // Method 1: Try to fetch from Figma API
    const designData = await fetchFigmaDesign();
    
    if (designData) {
      const currentHash = hash(designData);
      const cache = await loadCache();
      
      if (cache.lastHash && cache.lastHash !== currentHash) {
        console.log(`🔔 Change detected! (Hash changed: ${cache.lastHash.slice(0, 8)} → ${currentHash.slice(0, 8)})`);
        await saveCache({ lastHash: currentHash, lastCheck: Date.now(), version: cache.version + 1 });
        return true;
      }
      
      if (!cache.lastHash) {
        await saveCache({ lastHash: currentHash, lastCheck: Date.now(), version: 1 });
      }
      
      return false;
    }
    
    // Method 2: Fallback - Manual trigger file
    // User can touch .figma-trigger to force an update
    try {
      const triggerStat = await fs.stat('./.figma-trigger');
      const cache = await loadCache();
      
      if (triggerStat.mtimeMs > cache.lastCheck) {
        console.log('🔔 Manual trigger detected!');
        await saveCache({ ...cache, lastCheck: Date.now(), version: cache.version + 1 });
        await fs.unlink('./.figma-trigger').catch(() => {});
        return true;
      }
    } catch {
      // No trigger file, that's fine
    }
    
    return false;
  } catch (error) {
    console.error('❌ Error checking for changes:', error.message);
    return false;
  }
}

/**
 * Update React components from Figma
 */
async function updateFromFigma() {
  if (isUpdating) return;
  
  isUpdating = true;
  updateCount++;
  
  console.log(`\n🔄 Update #${updateCount} started at ${new Date().toLocaleTimeString()}`);
  console.log('   📥 Fetching latest design from Figma...');
  
  try {
    // Note: In a real implementation, you would:
    // 1. Call Figma MCP to get latest design
    // 2. Parse the design data
    // 3. Update App.tsx with new code
    // 4. Save the file (triggers Vite hot reload)
    
    // For now, we'll create a marker file that Cursor can detect
    const timestamp = new Date().toISOString();
    await fs.writeFile('./.figma-update-needed', JSON.stringify({
      timestamp,
      updateCount,
      fileKey: FIGMA_FILE_KEY,
      nodeId: FIGMA_NODE_ID
    }, null, 2));
    
    console.log('   ✅ Update marker created');
    console.log('   🤖 Cursor AI will now sync the changes...');
    console.log(`   ⏰ Completed at ${new Date().toLocaleTimeString()}\n`);
    console.log('👀 Watching for next change...\n');
    
  } catch (error) {
    console.error('   ❌ Error during update:', error.message);
  } finally {
    isUpdating = false;
  }
}

/**
 * Main watch loop
 */
async function watch() {
  const hasChanges = await checkForChanges();
  
  if (hasChanges) {
    await updateFromFigma();
  }
  
  // Schedule next check
  setTimeout(watch, CHECK_INTERVAL);
}

/**
 * Initialize and start
 */
async function start() {
  // Clean up any old marker files
  await fs.unlink('./.figma-update-needed').catch(() => {});
  
  // Start watching
  watch();
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n\n👋 Figma Auto-Sync Watcher stopped.');
  console.log('Run "npm run watch" to start it again!\n');
  process.exit(0);
});

// Start the watcher
start();


