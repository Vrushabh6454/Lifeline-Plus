import express from "express";
import jwt from "jsonwebtoken";
import users from "../config/users.json" assert { type: "json" };
const router = express.Router();

router.post("/login", (req, res) => {
  const { email, password, role } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password && u.role === role
  );

  if (!user) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ email, role }, process.env.JWT_SECRET, {
    expiresIn: "2h",
  });

  res.json({ token });
});

export default router;
