const prisma = require("../configs/prismaClient");
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Name, email, and password are required",
    });
  }

  try {
    const hashPassword = await argon2.hash(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    res.status(201).json({
      message: "User registered successfully!",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);

    if (err.code === "P2002") {
      return res.status(400).json({
        error: "Email already exists!",
      });
    }

    res.status(500).json({
      error: "Registration failed",
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: "Validation failed",
      message: "Email and password are required",
    });
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({
        error: "User not found!",
      });
    }

    const valid = await argon2.verify(user.password, password);

    if (!valid) {
      return res.status(401).json({
        error: "Invalid credentials!",
      });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({
      message: "Login successful!",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({
      error: "Login failed!",
      message: err.message,
    });
  }
};
