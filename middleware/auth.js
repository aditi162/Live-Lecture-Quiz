const jwt = require("jsonwebtoken");

function facultyOnly(req, res, next) {
    const header = req.headers.authorization || "";
    const token = header.split(" ")[1];

    if(!token){
        return res.status(401).json({ message: "Access denied. No token provided." });

    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== "faculty"){
            return res.status(403).json({ message: "Access denied. Not a faculty member." });
        }
        req.user = decoded;
        next();
    }catch(err){
        return res.status(400).json({ message: "Invalid token." });
    }}
  

    function studentOnly(req, res, next){
        const token = (req.headers.authorization || "").split(" ")[1];
        if(!token)  return res.status(401).json({ message: "No token" });

         try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if(decoded.role !== "student"){
            return res.status(403).json({ message: "Students only" });
        }
        req.user = decoded;
        next();
    }catch(err){
        return res.status(401).json({ message: "Invalid token." });
    }}
      module.exports = { facultyOnly, studentOnly };
