const { execSync } = require("child_process");
const jwt = require("jsonwebtoken");

const JWT_SECRET =
  process.env.JWT_SECRET || "your-super-secret-jwt-key-change-in-production";

const payload = {
  userId: "test-user",
  username: "testuser",
  role: "user",
};

const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });

// Copy to clipboard
try {
  execSync(`powershell -Command "Set-Clipboard -Value '${token}'"`, {
    shell: true,
    stdio: "ignore",
  });
  console.log("Token copied to clipboard! (expires in 7 days)");
} catch (error) {
  console.log(token);
}

console.log("\nUse in requests with header:\n");
console.log(`Authorization: Bearer ${token}\n`);
