import { Router } from "express";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    res.json({ message: "Login endpoint", email });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    res.json({ message: "Register endpoint", email });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

export { router as authRoutes };
