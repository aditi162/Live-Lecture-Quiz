const token = localStorage.getItem("token");
if (!token) window.location.href = "student-login.html";

const quizId = new URLSearchParams(location.search).get("id");
const headers = { Authorization: "Bearer " + token, "Content-Type": "application/json" };
const msg = document.getElementById("msg");

const escapeHtml = (value) =>
  String(value).replace(/[&<>"]/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  })[char]);

async function load() {
  const res = await fetch(`/api/student/quiz/${quizId}`, { headers });
  const data = await res.json();

  if (!res.ok) {
    msg.textContent = data.message;
    document.getElementById("submitBtn").style.display = "none";
    return;
  }

  document.getElementById("title").textContent = data.title + " (" + data.subject + ")";
  document.getElementById("questions").innerHTML = data.questions.map((q, i) => `
    <div class="q-card">
      <p><b>Q${i + 1}. ${escapeHtml(q.text)}</b></p>
      ${q.options.map((o, j) => `
        <label class="opt-row">
          <input type="radio" name="q${i}" value="${j}"> ${escapeHtml(o)}
        </label>`).join("")}
    </div>`).join("");
}

document.getElementById("submitBtn").onclick = async () => {
  const count = document.querySelectorAll(".q-card").length;
  const answers = [];
  for (let i = 0; i < count; i++) {
    const picked = document.querySelector(`input[name="q${i}"]:checked`);
    answers.push(picked ? Number(picked.value) : -1);
  }

  const res = await fetch(`/api/student/quiz/${quizId}/submit`, {
    method: "POST",
    headers,
    body: JSON.stringify({ answers }),
  });
  const data = await res.json();

  if (res.ok) {
    document.getElementById("questions").innerHTML = "";
    document.getElementById("submitBtn").style.display = "none";
    msg.textContent = `Submitted! Your score: ${data.score} / ${data.total}`;
  } else {
    msg.textContent = data.message;
  }
};

document.getElementById("back").onclick = () => {
  window.location.href = "my-quizzes.html";
};

load();
