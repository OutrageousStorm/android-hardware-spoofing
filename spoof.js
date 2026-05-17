// spoof.js -- Spoof hardware props via Frida
Java.perform(function() {
    var Build = Java.use("android.os.Build");
    var fields = [
        "FINGERPRINT", "DEVICE", "PRODUCT", "MANUFACTURER", 
        "MODEL", "BRAND", "HARDWARE", "SERIAL", "DISPLAY"
    ];
    
    fields.forEach(function(field) {
        try {
            var val = Build[field].value;
            console.log("[BUILD] " + field + " = " + val);
            // Would require reflection to actually spoof
        } catch(e) {}
    });
    
    console.log("[Hardware Spoof] Ready");
});
