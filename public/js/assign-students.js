const token = localStorage.getItem("token");
if(!token) window.location.href = "faculty-login.html";

const headers = { Authorization: "Bearer " + token};

// Loads quizzes and students when the page opens


async function loadData(){
    const [quizRes, studentRes] = await Promise.all([
        fetch("/api/quiz/mine", {headers}),
        fetch("/api/quiz/students", { headers}),
    ]);

    if(quizRes.status === 401 || quizRes.status === 403){
        localStorage.clear();
        window.location.href = "faculty-login.html";
        return;
    }

    const quizzes = await quizRes.json();
    const students = await studentRes.json();

    document.getElementById("quizSelect").innerHTML = quizzes
        .map(q => `<option value="${q._id}">${q.title} (${q.subject})</option>`)
        .join("");

    document.getElementById("students").innerHTML = students
        .map(s =>
            `<label class = "opt-row">
            <input type = "checkbox" class = "stu" value = "${s._id}">
            ${s.rollNumber} - ${s.name}
            </label>`
        ).join("");
}

// select all

document.getElementById("selectAll").onchange = (e) =>{
    document.querySelectorAll(".stu").forEach(c => (c.checked = e.target.checked));
};

//  save the assignment
document.getElementById("saveBtn").onclick = async() =>{
    const msg = document.getElementById("msg");
    const quizId = document.getElementById("quizSelect").value;
    const studentIds = [...document.querySelectorAll(".stu:checked")].map(c => c.value);

    if(!quizId){msg.textContent = "Create a quiz first."; return;}

    const res = await fetch(`api/quiz/${quizId}/assign`, {
        method: "PUT",
        headers: {...headers, "Content-type": "application/json"},
        body: JSON.stringify({studentIds}),
    });
    const data = await res.json();
    msg.textContent = data.message;
};

document.getElementById("back").onclick = ()=>{
    (window.location.href = "faculty-dashboard.html");
}

loadData();