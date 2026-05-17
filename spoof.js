/**
 * spoof.js -- Frida script to spoof Build properties at runtime
 * Usage: frida -U -f com.example.app -l spoof.js --no-pause
 * Intercepts getProperty calls to return fake hardware info
 */

setTimeout(function() {
    Java.perform(function() {
        console.log("[Hardware Spoof] Active");

        var Build = Java.use("android.os.Build");

        // Spoof device name
        Object.defineProperty(Build, "DEVICE", {
            value: "fake_device", writable: false, configurable: false
        });
        Object.defineProperty(Build, "MODEL", {
            value: "FakePhone 2000", writable: false, configurable: false
        });
        Object.defineProperty(Build, "MANUFACTURER", {
            value: "FakeCorp", writable: false, configurable: false
        });
        Object.defineProperty(Build, "BRAND", {
            value: "fakecorp", writable: false, configurable: false
        });
        Object.defineProperty(Build, "PRODUCT", {
            value: "fake_device", writable: false, configurable: false
        });

        // Spoof API level
        Object.defineProperty(Build.VERSION, "SDK_INT", {
            value: 33, writable: false, configurable: false
        });

        // Spoof FINGERPRINT
        Object.defineProperty(Build, "FINGERPRINT", {
            value: "fakecorp/fake_device/fake_device:13/TP1A.220624.014/fake:user/release-keys",
            writable: false, configurable: false
        });

        // Hook System.getProperty for ro.* properties
        var System = Java.use("java.lang.System");
        System.getProperty.overload("java.lang.String").implementation = function(key) {
            var spoofs = {
                "ro.product.device": "fake_device",
                "ro.product.model": "FakePhone 2000",
                "ro.product.manufacturer": "FakeCorp",
                "ro.product.brand": "fakecorp",
                "ro.build.fingerprint": "fakecorp/fake_device/fake_device:13/TP1A.220624.014/fake:user/release-keys",
                "ro.debuggable": "0",
                "ro.secure": "1",
                "ro.build.type": "user",
            };
            var val = spoofs[key];
            if (val) {
                console.log("[Spoof] " + key + " -> " + val);
                return val;
            }
            return this.getProperty.call(this, key);
        };

        console.log("[Hardware Spoof] Properties patched");
    });
}, 0);
