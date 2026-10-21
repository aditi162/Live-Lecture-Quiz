require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());
app.use(express.static("public"));

app.use("/api/faculty", require("./routes/faculty"));

app.use("/api/quiz", require("./routes/quiz"));
app.use("/api/student", require("./routes/student"));

mongoose
    .connect(process.env.MONGO_URI)
    .then(()=> console.log("Mongo DB connected"))
    .catch((err) => console.log("DB error: ", err.message));

app.get("/api/test", (req, res) =>{
    res.json({message: "Server is working"});
});

app.listen(process.env.PORT, ()=>{
    console.log("Server running on port " + process.env.PORT);
});
