use clap::{Parser, Subcommand};
use std::process::Command;

#[derive(Parser)]
#[command(name = "android-spoof")]
#[command(about = "Android hardware property spoofing CLI")]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// Spoof device model
    Model { name: String },
    /// Spoof manufacturer
    Manufacturer { name: String },
    /// Check current spoofing status
    Status,
    /// Reset to defaults
    Reset,
}

fn adb(cmd: &str) -> String {
    let output = Command::new("adb")
        .args(&["shell", cmd])
        .output()
        .expect("Failed to execute adb");
    String::from_utf8_lossy(&output.stdout).to_string()
}

fn main() {
    let cli = Cli::parse();
    
    match cli.command {
        Commands::Model { name } => {
            println!("Spoofing model to: {}", name);
            adb(&format!("setprop ro.product.model '{}'", name));
        }
        Commands::Manufacturer { name } => {
            println!("Spoofing manufacturer to: {}", name);
            adb(&format!("setprop ro.product.manufacturer '{}'", name));
        }
        Commands::Status => {
            let model = adb("getprop ro.product.model");
            let mfg = adb("getprop ro.product.manufacturer");
            println!("Current spoofing:");
            println!("  Model: {}", model.trim());
            println!("  Manufacturer: {}", mfg.trim());
        }
        Commands::Reset => {
            println!("Resetting to defaults...");
            adb("resetprop --delete ro.product.model");
            adb("resetprop --delete ro.product.manufacturer");
        }
    }
}
