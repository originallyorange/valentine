const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const question = document.getElementById("question");
const catContainer = noBtn.querySelector(".cat-container");

let noClickCount = 0;

const escalationTexts = [
    "Will you be my Valentine? 💖🐱💘",
    "Are you sure? 🥺",
    "Really sure?? 😿",
    "That seems incorrect.",
    "The cats are suffering.",
    "This is getting awkward.",
    "Please reconsider.",
    "You are making them fall.",
    "This could go on forever.",
    "Last chance before chaos escalates..."
];

const catImages = [
    "cats/cat1.png",
    "cats/cat2.png",
    "cats/cat3.png",
    "cats/cat4.png",
    "cats/cat5.png"
];

const meowSounds = [
    "sounds/meow1.mp3",
    "sounds/meow2.mp3",
    "sounds/meow3.mp3",
    "sounds/meow4.mp3",
    "sounds/meow5.mp3",
    "sounds/meow6.mp3",
    "sounds/meow7.mp3",
    "sounds/meow8.mp3",
    "sounds/meow9.mp3",
    "sounds/meow10.mp3",
    "sounds/meow11.mp3",
    "sounds/meow12.mp3",
    "sounds/meow13.mp3",
    "sounds/meow14.mp3",
    "sounds/meow15.mp3",
    "sounds/meow16.mp3",
    "sounds/meow17.mp3"
];

/* ---------- CAT UTIL ---------- */

function getRandomCat() {
    return catImages[Math.floor(Math.random() * catImages.length)];
}

function getRandomSound() {
    return meowSounds[Math.floor(Math.random() * meowSounds.length)];
}

function spawnCatInButton() {
    catContainer.innerHTML = "";
    const img = document.createElement("img");
    img.src = getRandomCat();
    catContainer.appendChild(img);
}

spawnCatInButton();

/* ---------- YES ---------- */

yesBtn.addEventListener("click", () => {
    question.textContent = "Yayyyyy!!! 💖🐱💘💕";

    yesBtn.remove();
    noBtn.remove();

    launchConfetti();
});

/* ---------- NO ---------- */

noBtn.addEventListener("click", () => {

    noClickCount++;

    if (noClickCount < escalationTexts.length) {
        question.textContent = escalationTexts[noClickCount];
    } else {
        question.textContent = "You cannot escape destiny. 💘";
    }

    document.body.classList.add("shake");
    setTimeout(() => document.body.classList.remove("shake"), 300);

    playMeow();
    releaseCat();
    moveNoButtonSafely();
    spawnCatInButton();
});

/* ---------- CAT PHYSICS ---------- */

function releaseCat() {
    const currentCat = catContainer.querySelector("img");
    if (!currentCat) return;

    const fallingCat = currentCat.cloneNode(true);
    fallingCat.classList.add("falling-cat");

    const rect = currentCat.getBoundingClientRect();
    fallingCat.style.left = rect.left + "px";
    fallingCat.style.top = rect.top + "px";

    document.body.appendChild(fallingCat);

    let velocityY = -8 - Math.random() * 4; // initial upward bounce
    let velocityX = (Math.random() - 0.5) * 2; // small sideways drift
    let gravity = 0.5;
    let rotation = 0;
    let rotationSpeed = (Math.random() - 0.5) * 10;

    function animate() {
        velocityY += gravity;

        let currentTop = parseFloat(fallingCat.style.top);
        let currentLeft = parseFloat(fallingCat.style.left);

        currentTop += velocityY;
        currentLeft += velocityX;
        rotation += rotationSpeed;

        // Bounce off bottom slightly
        if (currentTop > window.innerHeight - 40) {
            currentTop = window.innerHeight - 40;
            velocityY *= -0.4; // dampened bounce
        }

        fallingCat.style.top = currentTop + "px";
        fallingCat.style.left = currentLeft + "px";
        fallingCat.style.transform = `rotate(${rotation}deg)`;

        if (currentTop < window.innerHeight || Math.abs(velocityY) > 0.5) {
            requestAnimationFrame(animate);
        } else {
            fallingCat.remove();
        }
    }

    requestAnimationFrame(animate);
}

/* ---------- SOUND ---------- */

function playMeow() {
    const audio = new Audio(getRandomSound());
    audio.volume = 0.4;
    audio.play();
}

/* ---------- SAFE POSITIONING ---------- */

function moveNoButtonSafely() {
    const padding = 20;

    const questionRect = question.getBoundingClientRect();
    const yesRect = yesBtn.getBoundingClientRect();

    const maxX = window.innerWidth - noBtn.offsetWidth - padding;
    const maxY = window.innerHeight - noBtn.offsetHeight - padding;

    let randomX, randomY;
    let tries = 0;

    do {
        randomX = Math.random() * maxX;
        randomY = Math.random() * maxY;

        var tempRect = {
            left: randomX,
            right: randomX + noBtn.offsetWidth,
            top: randomY,
            bottom: randomY + noBtn.offsetHeight
        };

        tries++;

    } while (
        (isColliding(tempRect, questionRect) ||
         isColliding(tempRect, yesRect)) &&
        tries < 50
    );

    noBtn.style.left = randomX + "px";
    noBtn.style.top = randomY + "px";
    noBtn.style.transform = "none";
}

function isColliding(a, b) {
    return !(
        a.right < b.left ||
        a.left > b.right ||
        a.bottom < b.top ||
        a.top > b.bottom
    );
}

/* ---------- CONFETTI ---------- */

function launchConfetti() {
    const colors = ["#ff4d6d", "#ff85a2", "#ffb3c6", "#ffffff"];

    for (let i = 0; i < 180; i++) {
        const piece = document.createElement("div");
        piece.classList.add("confetti");

        piece.style.backgroundColor =
            colors[Math.floor(Math.random() * colors.length)];

        piece.style.left = Math.random() * window.innerWidth + "px";
        piece.style.top = "-20px";

        document.body.appendChild(piece);

        let velocity = Math.random() * 4 + 2;
        let drift = Math.random() * 4 - 2;

        function drop() {
            const currentTop = parseFloat(piece.style.top);
            const currentLeft = parseFloat(piece.style.left);

            piece.style.top = currentTop + velocity + "px";
            piece.style.left = currentLeft + drift + "px";

            if (currentTop < window.innerHeight) {
                requestAnimationFrame(drop);
            } else {
                piece.remove();
            }
        }

        requestAnimationFrame(drop);
    }
}
