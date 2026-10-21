document.getElementById("loginBtn").addEventListener("click", async () => {
  const rollNumber = document.getElementById("roll").value;

  const res = await fetch("/api/student/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ rollNumber }),
  });
  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("name", data.name);
    window.location.href = "my-quizzes.html";
  } else {
    document.getElementById("error").textContent = data.message;
  }
});