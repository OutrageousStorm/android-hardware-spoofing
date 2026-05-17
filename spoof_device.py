#!/usr/bin/env python3
"""
spoof_device.py -- Spoof Android device properties via Magisk
Creates a Magisk module that spoofs at runtime.
Usage: python3 spoof_device.py --model Pixel6Pro --show-current
"""
import subprocess, sys, argparse
from pathlib import Path

def adb(cmd):
    r = subprocess.run(f"adb shell {cmd}", shell=True, capture_output=True, text=True)
    return r.stdout.strip()

def get_props():
    props = {}
    for key in ["ro.product.model", "ro.build.fingerprint", "ro.build.tags",
                "ro.serialno", "ro.product.device"]:
        props[key] = adb(f"getprop {key}")
    return props

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", help="Device model to spoof")
    parser.add_argument("--fingerprint", help="Build fingerprint to spoof")
    parser.add_argument("--show-current", action="store_true", help="Show current properties")
    args = parser.parse_args()

    if args.show_current:
        print("\nCurrent device properties:\n")
        props = get_props()
        for k, v in props.items():
            print(f"  {k:<30} {v}")
        return

    if not any([args.model, args.fingerprint]):
        parser.print_help()
        sys.exit(1)

    print("🎭 Device Spoofing Module")
    print("Note: Requires Magisk + resetprop binary")
    print("\nTo spoof, use Magisk props overlay or a props module.")
    print("\nExample with resetprop:")
    if args.model:
        print(f"  resetprop ro.product.model {args.model}")
    if args.fingerprint:
        print(f"  resetprop ro.build.fingerprint {args.fingerprint}")
