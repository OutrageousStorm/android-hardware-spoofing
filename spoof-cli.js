#!/usr/bin/env node
/**
 * spoof-cli.js -- Interactive hardware spoofing CLI
 * Usage: npm install -g . && spoof-cli
 *        or: node spoof-cli.js
 */
const fs = require('fs');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const SPOOFS = {
  'device': { prop: 'ro.product.device', example: 'walleye', desc: 'Device model' },
  'brand': { prop: 'ro.product.brand', example: 'google', desc: 'Device brand' },
  'model': { prop: 'ro.product.model', example: 'Pixel 2 XL', desc: 'User-facing model name' },
  'fingerprint': { prop: 'ro.build.fingerprint', example: 'google/taimen/taimen:11/RP1A.200720.011/...:user/release-keys', desc: 'Build fingerprint' },
  'build_id': { prop: 'ro.build.id', example: 'RP1A.200720.011', desc: 'Android build ID' },
  'android_version': { prop: 'ro.build.version.release', example: '11', desc: 'Android version' },
  'api_level': { prop: 'ro.build.version.sdk', example: '30', desc: 'API level' },
};

function adb(cmd) {
  try {
    return execSync(`adb shell ${cmd}`, { encoding: 'utf8' }).trim();
  } catch {
    return null;
  }
}

function spoof(key, value) {
  const prop = SPOOFS[key]?.prop;
  if (!prop) { console.log('  ✗ Unknown spoof type'); return; }
  
  const result = adb(`setprop ${prop} "${value}"`);
  if (result === '' || result === null) {
    console.log(`  ✓ Set ${key} → ${value}`);
  } else {
    console.log(`  ✗ Failed: ${result}`);
  }
}

function showMenu() {
  console.log('\n🎭 Hardware Spoof Menu');
  console.log('='*40);
  Object.entries(SPOOFS).forEach(([k, v]) => {
    console.log(`  ${k.padEnd(18)} — ${v.desc}`);
  });
  console.log('  check              — Show current values');
  console.log('  quit               — Exit');
}

function checkDevice() {
  console.log('\n📋 Current Device Properties:\n');
  Object.entries(SPOOFS).forEach(([k, v]) => {
    const val = adb(`getprop ${v.prop}`);
    console.log(`  ${k.padEnd(18)} = ${val || '(not set)'}`);
  });
}

function prompt() {
  rl.question('\nCommand (or "?" for menu, "q" to quit): ', (cmd) => {
    cmd = cmd.trim().toLowerCase();
    
    if (cmd === '?' || cmd === 'help') showMenu();
    else if (cmd === 'q' || cmd === 'quit') { rl.close(); return; }
    else if (cmd === 'check') checkDevice();
    else if (SPOOFS[cmd]) {
      rl.question(`  Enter value for ${cmd} (e.g. "${SPOOFS[cmd].example}"): `, (val) => {
        if (val.trim()) spoof(cmd, val.trim());
        prompt();
      });
      return;
    } else {
      console.log('  ✗ Unknown command');
    }
    
    prompt();
  });
}

console.log('\n🎭 Android Hardware Spoofer\n');
if (!adb('getprop ro.product.device')) {
  console.log('❌ adb device not connected.\n');
  process.exit(1);
}

checkDevice();
showMenu();
prompt();
