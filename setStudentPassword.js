require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Student = require("./models/Student");

(async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const students = await Student.find({ password: { $exists: false } });
  for (const s of students) {
    const plain = "pass" + s.rollNumber;          // e.g. roll 101 -> pass101
    s.password = await bcrypt.hash(plain, 10);
    await s.save();
    console.log(s.rollNumber, "->", plain);
  }
  console.log("Done");
  process.exit();
})();