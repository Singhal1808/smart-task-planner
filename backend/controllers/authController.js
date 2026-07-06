import crypto from "crypto";

// In-memory storage - no database needed!
const users = {
  "demo@example.com": "demo123",
  "user@example.com": "password123",
};

const sessions = {};

// Generate random token
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

export const login = (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    // Check credentials
    if (users[email] !== password) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create session
    const token = generateToken();
    sessions[token] = {
      email,
      loginTime: Date.now(),
      expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    };

    res.json({
      message: "Login successful",
      token,
      email,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const logout = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    delete sessions[token];

    res.json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

export const getCurrentUser = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token || !sessions[token]) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = sessions[token];
    res.json({
      email: session.email,
      loginTime: new Date(session.loginTime).toISOString(),
    });
  } catch (error) {
    res.status(500).json({ message: "Server error: " + error.message });
  }
};

// Middleware to verify token
export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const session = sessions[token];

  if (!session) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }

  if (session.expiresAt < Date.now()) {
    delete sessions[token];
    return res.status(401).json({ message: "Token expired" });
  }

  req.user = session;
  next();
};

// Get demo credentials for convenience
export const getDemoCredentials = (req, res) => {
  res.json({
    demoAccounts: [
      { email: "demo@example.com", password: "demo123" },
      { email: "user@example.com", password: "password123" },
    ],
  });
};
