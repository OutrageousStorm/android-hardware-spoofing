#!/usr/bin/env python3
"""
check_spoofing.py -- Detect spoofed device properties
Usage: python3 check_spoofing.py
"""
import subprocess

def adb(cmd):
    r = subprocess.run(f"adb shell {cmd}", shell=True, capture_output=True, text=True)
    return r.stdout.strip()

def main():
    print("\n🔍 Device Property Check\n")

    model = adb("getprop ro.product.model")
    fp = adb("getprop ro.build.fingerprint")
    tags = adb("getprop ro.build.tags")
    serial = adb("getprop ro.serialno")
    build_type = adb("getprop ro.build.type")

    props = [
        ("Device Model", model),
        ("Build Fingerprint", fp),
        ("Build Tags", tags),
        ("Serial Number", serial),
        ("Build Type", build_type),
    ]

    print(f"{'Property':<25} {'Value':<40} {'Status'}")
    print("─" * 70)
    for name, val in props:
        status = "⚠️  SUSPICIOUS" if "test-keys" in str(val) else "✅"
        print(f"{name:<25} {val:<40} {status}")
    print()

if __name__ == "__main__":
    main()
