import { Router } from "express";

const router = Router();

router.get("/profile", async (req, res) => {
  try {
    res.json({ message: "User profile endpoint" });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

router.put("/profile", async (req, res) => {
  try {
    const { name, email } = req.body;
    res.json({ message: "Profile updated", name, email });
  } catch (error) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});

export { router as userRoutes };
