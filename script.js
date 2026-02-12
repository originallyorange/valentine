const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const question = document.getElementById("question");

yesBtn.addEventListener("click", () => {
    question.textContent = "YAYYYYY!!! 💕🥰";
});

noBtn.addEventListener("click", () => {
    alert("Are you sure? 😢");
});
