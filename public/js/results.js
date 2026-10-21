const token = localStorage.getItem("token");
if (!token) window.location.href = "faculty-login.html";
const headers = { Authorization: "Bearer " + token };

async function loadQuizzes() {
  const res = await fetch("/api/quiz/mine", { headers });
  if (res.status === 401 || res.status === 403) {
    localStorage.clear();
    window.location.href = "faculty-login.html";
    return;
  }
  const quizzes = await res.json();
  const select = document.getElementById("quizSelect");
  select.innerHTML = quizzes
    .map(q => `<option value="${q._id}">${q.title} (${q.subject})</option>`)
    .join("");
  if (quizzes.length) loadResults();
}

async function loadResults() {
  const id = document.getElementById("quizSelect").value;
  const res = await fetch(`/api/quiz/${id}/results`, { headers });
  const data = await res.json();

  if (!res.ok) {
    document.getElementById("heading").textContent = data.message;
    document.getElementById("table").innerHTML = "";
    return;
  }

  const done = data.rows.filter(r => r.attempted).length;
  document.getElementById("heading").textContent =
    `${data.title}: ${done} of ${data.rows.length} attempted`;

  document.getElementById("table").innerHTML =
    "<tr><th>Roll No</th><th>Name</th><th>Status</th><th>Score</th></tr>" +
    data.rows.map(r => `
      <tr>
        <td>${r.rollNumber}</td>
        <td>${r.name}</td>
        <td>${r.attempted ? "Attempted" : "Not attempted"}</td>
        <td>${r.attempted ? r.score + " / " + r.total : "-"}</td>
      </tr>`).join("");
}

document.getElementById("quizSelect").onchange = loadResults;
document.getElementById("back").onclick = () =>
  (window.location.href = "faculty-dashboard.html");

loadQuizzes();