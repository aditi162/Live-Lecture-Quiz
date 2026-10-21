const token = localStorage.getItem("token");
if(!token) window.location.href = "student-login.html";

document.getElementById("welcome").textContent = "Welcome " + localStorage.getItem("name");

async function load(){
    const res = await fetch("/api/student/quizzes", {
        headers: {Authorization: "Bearer " + token},
    });
    if(res.status === 401 || res.status === 403){
        localStorage.clear();
        window.location.href = "student-login.html";
        return;
    }
    const quizzes = await res.json();
    document.getElementById("list").innerHTML = quizzes.length
        ? quizzes.map(q =>
            `<a class = "action-card" href = "take-quiz.html?id=${q._id}">
            <h3>${q.title}</h3><p>${q.subject}</p>
            </a>`).join("")
            : "<p>No quizzes assigned to you yet.</p>";
        }

    document.getElementById("logout").onclick = () =>{
        (window.location.href = "student-login.html")
    }
        load();