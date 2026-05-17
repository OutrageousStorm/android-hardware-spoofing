#!/usr/bin/env python3
"""
device_spoof.py -- Spoof Android device hardware properties
Usage: python3 device_spoof.py --model "Pixel 7" --device "flame" --manufacturer "Google"
       python3 device_spoof.py --preset samsung_s21  # use preset
       python3 device_spoof.py --restore             # restore original
"""
import subprocess, argparse, json

PRESETS = {
    "pixel_7": {
        "model": "Pixel 7", "device": "panther", "manufacturer": "Google",
        "product": "panther", "brand": "google"
    },
    "samsung_s21": {
        "model": "SM-G991U", "device": "d2s", "manufacturer": "samsung",
        "product": "d2s", "brand": "samsung"
    },
    "oneplus_9": {
        "model": "OP5050AL", "device": "lemonade", "manufacturer": "OnePlus",
        "product": "lemonade", "brand": "OnePlus"
    },
    "xiaomi_poco": {
        "model": "M2012K11AC", "device": "alioth", "manufacturer": "Xiaomi",
        "product": "alioth", "brand": "Xiaomi"
    },
}

def adb(cmd, dry_run=False):
    if dry_run: print(f"  [DRY] adb shell {cmd}")
    else: subprocess.run(f"adb shell {cmd}", shell=True, capture_output=True)

def spoof_device(props, dry_run=False):
    for key, val in props.items():
        adb(f"setprop ro.product.{key} \"{val}\"", dry_run)
        adb(f"setprop ro.{key} \"{val}\"", dry_run)
        print(f"  ✓ {key} = {val}")

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--preset", choices=PRESETS.keys(), help="Use a preset")
    parser.add_argument("--model", help="Device model name")
    parser.add_argument("--device", help="Device codename")
    parser.add_argument("--manufacturer", help="OEM name")
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--list-presets", action="store_true")
    args = parser.parse_args()

    if args.list_presets:
        print("\nAvailable presets:")
        for name, props in PRESETS.items():
            print(f"  {name:<20} {props.get('manufacturer')} {props.get('model')}")
        return

    props = {}
    if args.preset:
        props = PRESETS[args.preset]
    else:
        if args.model: props['model'] = args.model
        if args.device: props['device'] = args.device
        if args.manufacturer: props['manufacturer'] = args.manufacturer

    if not props:
        parser.print_help()
        return

    print(f"\n🎭 Device Spoofing")
    print("="*40)
    spoof_device(props, args.dry_run)
    print("\n✅ Reboot to apply changes: adb reboot")

if __name__ == "__main__":
    main()
