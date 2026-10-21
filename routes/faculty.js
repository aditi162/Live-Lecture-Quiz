const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Faculty = require("../models/Faculty");

const router = express.Router();

router.post("/login", async (req, res) => {
    const { email, password } = req.body;


    const faculty = await Faculty.findOne({ email });
    if (!faculty) return res.status(400).json({ message: "Invalid email or password" });

    const match = await bcrypt.compare(password, faculty.password);
    if (!match) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign(
        { id: faculty._id, role: "faculty" },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );

    res.json({ token, name: faculty.name });
});


module.exports = router;