const express = require("express");
const Quiz = require("../models/Quiz");
const {facultyOnly} = require("../middleware/auth");
const Student = require("../models/Student");
const Result = require("../models/Result");

const router = express.Router();

router.post("/", facultyOnly, async (req, res) => {
    const {title, subject, questions} = req.body;
    const quiz = await Quiz.create({
        title,
        subject,
        questions,
        createdBy: req.user.id,
    });
    res.json({message: "Quiz created", id: quiz._id});
});

// list all students //
router.get("/students", facultyOnly, async(req, res) =>{
    const students = await Student.find().sort("rollNumber");
    res.json(students);

})

// list this faculty's quizzes //

router.get("/mine", facultyOnly, async(req, res)=>{
    const quizzes = await Quiz.find({ createdBy: req.user.id}).select("title subject");
    res.json(quizzes);
})

// assign students to a quiz //

router.put("/:id/assign", facultyOnly, async(req , res )=>{
    const { studentIds } = req.body;
    const quiz = await Quiz.findOneAndUpdate(
        {_id : req.params.id, createdBy: req.user.id},
        { assignedStudents: studentIds},
        { returnDocument: "after" }
    );
    if (!quiz) return res.status(404).json({message: "Quiz not found"});
    res.json({ message : "Quiz assigned to " + quiz.assignedStudents.length + "students"});
});

router.get("/:id/results", facultyOnly, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ _id: req.params.id, createdBy: req.user.id })
      .populate("assignedStudents", "name rollNumber");
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    const results = await Result.find({ quiz: quiz._id });

    const rows = quiz.assignedStudents.map(s => {
      const r = results.find(x => String(x.student) === String(s._id));
      return {
        name: s.name,
        rollNumber: s.rollNumber,
        attempted: !!r,
        score: r ? r.score : null,
        total: quiz.questions.length,
      };
    });

    res.json({ title: quiz.title, subject: quiz.subject, rows });
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: "Invalid quiz" });
  }
});
module.exports = router;