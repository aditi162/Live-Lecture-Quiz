const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
    title: { type: String, required: true },
    subject: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "Faculty"},
    questions: [
        {
            text: String,
                options: [String],
                correctIndex: Number,
             },
            ],
            assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Student" }],
        });

        module.exports = mongoose.model("Quiz", quizSchema);