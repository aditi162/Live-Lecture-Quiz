const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rollNumber: { type: String, required: true, unique: true },
    password: {type: String},
});

module.exports = mongoose.model("Student", studentSchema);