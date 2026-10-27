require("dotenv").config();
const mongoose = require("mongoose");
const Faculty = require("./models/Faculty");
const Quiz = require("./models/Quiz");

const q = (text, options, correctIndex) => ({ text, options, correctIndex });

const quizzes = [
    {
        title: "JavaScript Fundamentals",
        subject: "Web Technology",
        questions: [
            q("Which keyword declares a block-scoped variable that can be reassigned?", ["var", "let", "const", "static"], 1),
            q("What does typeof null return?", ["null", "undefined", "object", "number"], 2),
            q("What does the === operator check?", ["Value only", "Type only", "Value and type", "Reference only"], 2),
            q("Which method converts a JSON string into an object?", ["JSON.stringify()", "JSON.parse()", "JSON.object()", "JSON.convert()"], 1)

        ],
    },
    {
        title: "Node.js, Express and MongoDB",
        subject: "Web Technology",
        questions: [
            q("Which best describes Node.js?", ["A JavaScript runtime that runs outside the browser", "A CSS framework", "A database", "A web browser"], 0),
            q("Which Express middleware reads JSON request bodies?", ["express.json()", "express.body()", "express.parse()", "express.read()"], 0),
            q("How does MongoDB store data?", ["Tables and rows", "Documents (JSON-like)", "Spreadsheets", "Plain text files"], 1),
            q("What is Mongoose?", ["A database server", "A library that models MongoDB data in Node.js", "A frontend framework", "A web server"], 1),
            q("What is a JWT used for in this project?", ["Styling pages", "Proving who is logged in on each request", "Storing quiz questions", "Hashing passwords"], 1),
        ],

    },

];

(async()=>{
    await mongoose.connect(process.env.MONGO_URI);
    const faculty = await Faculty.findOne({ email: "faculty@test.com"});
    if(!faculty) {console.log("faculty account not found"); process.exit()};

    for (const z of quizzes){
        const exists = await Quiz.findOne({title: z.title, createdBy: faculty._id});
        if (exists){
            console.log("Skipped (already exists):", z.title); 
            continue;
        }
        await Quiz.create({...z, createdBy: faculty._id});
        console.log("Added:", z.title);

    }

    process.exit();
})
();
