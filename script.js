// ===== NAV-BAR =====

function toggleMenu() {
    const dropdown = document.querySelector(".dropdown");
    const menuToggle = document.querySelector(".menu-toggle");

    if (dropdown && menuToggle) {
        dropdown.classList.toggle("active");
        menuToggle.classList.toggle("active");
    }
}

// ===== TYPEWRITER (Home) =====

const texts = [
    "angehender ICT-Fachmann",
    "ein IT Fan",
    "ein lernfreudiger Mensch"
];

let speed = 100;
const textElement = document.querySelector(".home-typewriter-text");

let textIndex = 0;
let characterIndex = 0;

function typeWriter() {
    if (!textElement) return;

    if (characterIndex < texts[textIndex].length) {
        textElement.innerHTML += texts[textIndex].charAt(characterIndex);
        characterIndex++;
        setTimeout(typeWriter, speed);
    } else {
        setTimeout(eraseText, 1000);
    }
}

function eraseText() {
    if (!textElement) return;

    if (textElement.innerHTML.length > 0) {
        textElement.innerHTML = textElement.innerHTML.slice(0, -1);
        setTimeout(eraseText, 50);
    } else {
        textIndex = (textIndex + 1) % texts.length;
        characterIndex = 0;
        setTimeout(typeWriter, 500);
    }
}

window.onload = function () {
    typeWriter();
};