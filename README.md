# 🎭 Android Hardware Spoofing

Spoof device hardware info via ADB or Frida — CPU, GPU, RAM, device name, IMEI, serial number, and more.

## Tools & Scripts

- `device_spoof.py` — CLI to spoof device properties system-wide
- `spoof.js` — Frida script to override Build properties at runtime
- `imei_faker.sh` — Generate fake but valid IMEIs for testing
- `hardware_info.py` — Dump current hardware identifiers

## Quick start

```bash
# Spoof device name globally
adb shell setprop ro.product.model "FakePhone"
adb shell setprop ro.product.device "fake_device"

# Via Frida at runtime (more stealthy)
frida -U -f com.example.app -l spoof.js --no-pause
```
