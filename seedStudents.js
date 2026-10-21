require("dotenv").config();
const mongoose = require("mongoose");
const Student = require("./models/Student");

(async () => {
    await mongoose.connect(process.env.MONGO_URI);
    await Student.insertMany([
       { name: "Student One", rollNumber: "101" },
        { name: "Student Two", rollNumber: "102" },
        { name: "Student Three", rollNumber: "103" },
        { name: "Student Four", rollNumber: "104" },
        { name: "Student Five", rollNumber: "105" },
        { name: "Student Six", rollNumber: "106" },
        { name: "Student Seven", rollNumber: "107" },
        { name: "Student Eight", rollNumber: "108" },
        { name: "Student Nine", rollNumber: "109" },
        { name: "Student Ten", rollNumber: "110" },
        
    ]);
console.log("Students added");
process.exit();
})();