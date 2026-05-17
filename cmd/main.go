package main

import (
	"bufio"
	"flag"
	"fmt"
	"log"
	"math/rand"
	"os"
	"os/exec"
	"strconv"
	"strings"
	"time"
)

func adb(args ...string) (string, error) {
	cmd := exec.Command("adb", args...)
	out, err := cmd.CombinedOutput()
	return string(out), err
}

func getProp(key string) string {
	out, err := adb("shell", "getprop", key)
	if err != nil {
		return ""
	}
	return strings.TrimSpace(out)
}

func setProp(key, value string) error {
	_, err := adb("shell", fmt.Sprintf("setprop %s %s", key, value))
	return err
}

func generateIMEI() string {
	// Random 15-digit IMEI
	rand.Seed(time.Now().UnixNano())
	s := ""
	for i := 0; i < 15; i++ {
		s += fmt.Sprintf("%d", rand.Intn(10))
	}
	return s
}

func generateSerial() string {
	rand.Seed(time.Now().UnixNano())
	chars := "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	s := ""
	for i := 0; i < 16; i++ {
		s += string(chars[rand.Intn(len(chars))])
	}
	return s
}

func spoofDevice() {
	fmt.Println("\n🎭 Device Hardware Spoofer\n")
	fmt.Println("Warning: Spoofing device props requires root via su or Shizuku.")
	fmt.Println("Some changes may not persist after reboot.\n")

	reader := bufio.NewReader(os.Stdin)

	// Current values
	model := getProp("ro.product.model")
	brand := getProp("ro.product.brand")
	device := getProp("ro.product.device")
	imei := generateIMEI()
	serial := generateSerial()

	fmt.Printf("Current model:  %s\n", model)
	fmt.Printf("Current brand:  %s\n", brand)
	fmt.Printf("Current device: %s\n\n", device)

	fmt.Printf("New model (or blank): ")
	newModel, _ := reader.ReadString('\n')
	newModel = strings.TrimSpace(newModel)
	if newModel == "" {
		newModel = "Pixel 6"
	}

	fmt.Printf("New brand (or blank): ")
	newBrand, _ := reader.ReadString('\n')
	newBrand = strings.TrimSpace(newBrand)
	if newBrand == "" {
		newBrand = "Google"
	}

	fmt.Printf("\nSpoofed IMEI:  %s\n", imei)
	fmt.Printf("Spoofed serial: %s\n", serial)

	fmt.Print("\nApply spoofing? (y/N): ")
	confirm, _ := reader.ReadString('\n')
	if strings.ToLower(strings.TrimSpace(confirm)) != "y" {
		fmt.Println("Cancelled.")
		return
	}

	// Apply via su shell
	cmds := []string{
		fmt.Sprintf("setprop ro.product.model %s", newModel),
		fmt.Sprintf("setprop ro.product.brand %s", newBrand),
		fmt.Sprintf("setprop ro.serialno %s", serial),
		fmt.Sprintf("setprop ro.ril.miui.imei0 %s", imei),
	}

	for _, cmd := range cmds {
		adb("shell", "su", "-c", cmd)
		fmt.Printf("✓ %s\n", cmd)
	}

	fmt.Println("\n✅ Spoof applied (may require reboot to persist)")
}

func checkSpoofing() {
	fmt.Println("\n🔍 Hardware Spoofing Detection Check\n")

	props := []string{
		"ro.product.model",
		"ro.product.brand",
		"ro.product.device",
		"ro.serialno",
		"ro.ril.miui.imei0",
		"ro.build.fingerprint",
	}

	for _, prop := range props {
		val := getProp(prop)
		fmt.Printf("%s: %s\n", prop, val)
	}
}

func main() {
	flag.Parse()

	if len(os.Args) < 2 {
		fmt.Println("Usage: spoof spoof | spoof check")
		os.Exit(1)
	}

	switch os.Args[1] {
	case "spoof":
		spoofDevice()
	case "check":
		checkSpoofing()
	default:
		log.Fatal("Unknown command: " + os.Args[1])
	}
}
