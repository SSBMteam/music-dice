const notes = ["C", "C#/Db", "D", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const noteFrequencies = {
    "C": 261.63,
    "C#/Db": 277.18,
    "D": 293.66,
    "E": 329.63,
    "F": 349.23,
    "F#/Gb": 369.99,
    "G": 392.00,
    "G#/Ab": 415.30,
    "A": 440.00,
    "A#/Bb": 466.16,
    "B": 493.88
};

const display = document.getElementById("noteDisplay");
const history = document.getElementById("history");
const rollButton = document.getElementById("rollBtn");
const resetButton = document.getElementById("resetBtn");

function playBeep(frequency = 440, duration = 0.05, volume = 0.05) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
}

function getRandomNote() {
    return notes[Math.floor(Math.random() * notes.length)];
}

rollButton.addEventListener("click", () => {

    // wake up audio context if browser suspended it
    if (audioContext.state === "suspended") {
        audioContext.resume();
    }

    const finalNote = getRandomNote();

    let flickerCount = 0;
    const maxFlickers = 15;

    rollButton.disabled = true;

    const interval = setInterval(() => {

        const randomNote = getRandomNote();

        display.textContent = randomNote;

        // Quiet rolling sound
        playBeep(
            300 + Math.random() * 400,
            0.03,
            0.03
        );

        flickerCount++;

        if (flickerCount >= maxFlickers) {

            clearInterval(interval);

            display.textContent = finalNote;

            // Louder, longer final note
            playBeep(
                noteFrequencies[finalNote],
                0.40,
                0.08
            );

            // Retrigger pop animation
            display.style.animation = "none";
            display.offsetHeight;
            display.style.animation = "pop 0.2s ease";

            // Numbered history
            const li = document.createElement("li");
            const number = history.children.length + 1;
            li.textContent = `${number}. ${finalNote}`;
            history.appendChild(li);

            rollButton.disabled = false;
        }

    }, 40);
});

resetButton.addEventListener("click", () => {
    display.textContent = "???";
    history.innerHTML = "";
});