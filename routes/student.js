const express = require("express");
const jwt = require("jsonwebtoken");
const Student = require("../models/Student");
const Quiz = require("../models/Quiz");
const { studentOnly } = require("../middleware/auth");
const Result = require("../models/Result");

const router = express.Router();

// login with the roll number only

router.post("/login", async(req, res)=>{
    const { rollNumber} = req.body;
    const student = await Student.findOne({rollNumber: String(rollNumber).trim()});
    if (!student) return res.status(400).json({message: "Invalid roll number"});


const token = jwt.sign(
    {id: student._id, role: "student"},
    process.env.JWT_SECRET,
    {expiresIn: "1d"}
);
res.json({token, name: student.name});
});

// quizzes assigned to these students
router.get("/quizzes", studentOnly, async(req, res)=>{
    const quizzes = await Quiz.find({assignedStudents: req.user.id})
        .select("title subject");
    res.json(quizzes);
});

// get a quiz to attempt(no correct answers sent)
router.get("/quiz/:id", studentOnly, async(req, res)=>{
    try{
        const quiz = await Quiz.findOne({ _id: req.params.id , assignedStudents: req.user.id });
        if(!quiz) return res.status(404).json({ message: "Quiz not found"});

        const done = await Result.findOne({ quiz: quiz._id, student: req.user.id});
        if (done){
            return res.status(400).json({messsage: `Already attempted. Your score: ${done.score}/${done.total}`});
        }

        res.json({
            title: quiz.title,
            subject: quiz.subject,
            questions: quiz.questions.map(q =>({ text: q.text, options: q.options})),
        });
    }catch(err){
        res.status(400).json({ message: "Invalid quiz"});
    }
});

// submit answers, grade on the server
router.post("/quiz/:id/submit", studentOnly, async(req, res)=>{
    try{
        const quiz = await Quiz.findOne({ _id: req.params.id, assignedStudents: req.user.id});
        if(!quiz) return res.status(404).json({message: "Quiz not found"});

        const answers = req.body.answers || [];
        let score = 0;
        quiz.questions.forEach((q, i) =>{
            if(Number(answers[i]) === q.correctIndex) score++;

        });

        await Result.create({
            quiz: quiz._id,
            student: req.user.id,
            score,
            total: quiz.questions.length,
        });
        res.json({ score, total: quiz.questions.length});
    }catch(err){
        if(err.code === 11000) return res.status(400).json({message: "You have already attempted this quiz"});
        res.status(400).json({ message: "Could not submit"});
    }
});
module.exports = router;
