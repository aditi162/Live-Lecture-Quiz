require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Faculty = require("./models/Faculty");

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    const hashed = await bcrypt.hash("faculty123", 10);
    await Faculty.create({ name: "Test Faculty", email: "faculty@test.com", password: hashed });
    console.log("Faculty created");
    process.exit();
})();