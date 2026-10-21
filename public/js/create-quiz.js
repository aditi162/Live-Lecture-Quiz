const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "faculty-login.html";
    }

    const questionsDiv = document.getElementById("questions");
    let count = 0;


    //build one question card on page load//
    function addQuestion() {
        count++;
        const div = document.createElement("div");
        div.className = "q-card";
        div.innerHTML = `
        <input class = "field q-text"  placeholder="Question${count}">
        ${[0, 1, 2, 3].map(i => `
            <label class = "opt-row">
                <input type = "radio" name = "correct${count}" value = "${i}" ${i === 0 ? "checked" : ""}>
                <input class = "field q-opt" placeholder="Option ${i + 1}">
            </label>
        `).join("")}
        `;
        questionsDiv.appendChild(div);
    }

    //collect everything and send to backend//
    async function saveQuiz() {
        const msg = document.getElementById("msg");
        const title = document.getElementById("title").value.trim();
        const subject = document.getElementById("subject").value.trim();

        const questions = [...document.querySelectorAll(".q-card")].map((card => ({
            text: card.querySelector(".q-text").value.trim(),
            options: [...card.querySelectorAll(".q-opt")].map(o => o.value.trim()),
            correctIndex: Number(card.querySelector("input[type='radio']:checked").value),
        })));

        const incomplete = questions.some(q => !q.text || q.options.some(o => !o));
        if (!title || !subject || incomplete || questions.length === 0) {
            msg.textContent = "Please fill all fields and add at least one complete question.";
            return;
        }

        const res = await fetch("/api/quiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ title, subject, questions }),
        });
        const data = await res.json();

       if (res.status === 401 || res.status === 403) {
       
         localStorage.clear();
         window.location.href = "faculty-login.html";
        }else{
            msg.textContent = data.message;
        }
    }

    document.getElementById("addQ").onclick = addQuestion;
    document.getElementById("saveQ").onclick = saveQuiz;
    document.getElementById("back").onclick = () => (window.location.href = "faculty-dashboard.html");

    addQuestion(); // starts with one question card on page load//