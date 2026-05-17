# 🎭 Android Hardware Spoofing

Spoof IMEI, device fingerprint, serial — fool device checks.

## Methods
1. **Frida** (no root) — hook Build properties at runtime
2. **Magisk** (rooted) — persistent via resetprop
3. **Modification** — edit device props file (requires root)

## Usage
```bash
frida -U -f com.banking.app -l spoof.js
```
