const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true},
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" , required: true},
    score: Number,
    total: Number, 
    submittedAt: { type: Date, default: Date.now},

});
// one result per student per quiz
resultSchema.index({quiz:1, student:1}, {unique:true});

module.exports = mongoose.model("Result", resultSchema);