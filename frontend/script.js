const API_URL = "http://127.0.0.1:8000";

let gameOver = false;

async function startGame() {
    const response = await fetch(`${API_URL}/start`);
    const data = await response.json();

    gameOver = false;

    document.getElementById("message").textContent = data.message;
    document.getElementById("historyList").innerHTML = "";
    document.getElementById("guessInput").value = "";
}

async function submitGuess() {
    if (gameOver) {
        return;
    }

    const guessInput = document.getElementById("guessInput");
    const guess = guessInput.value.trim();
    const message = document.getElementById("message");

    if (guess.length !== 4 || isNaN(guess)) {
        message.textContent = "Enter exactly 4 digits.";
        return;
    }

    const response = await fetch(`${API_URL}/guess`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ guess: guess })
    });

    const data = await response.json();

    if (data.error) {
        message.textContent = data.error;
        return;
    }

    addGuessToHistory(data.guess, data.cows, data.bulls);

    if (data.correct) {
        gameOver = true;
        message.textContent = data.message;
    } else {
        message.textContent = "";
    }

    guessInput.value = "";
    guessInput.focus();
}

function addGuessToHistory(guess, cows, bulls) {
    const historyList = document.getElementById("historyList");

    const card = document.createElement("div");
    card.className = "guess-card";

    card.innerHTML = `
        <div class="guess-number">Guess: ${guess}</div>
        <div class="result">Cows: ${cows}</div>
        <div class="result">Bulls: ${bulls}</div>
    `;

    historyList.prepend(card);
}

document.getElementById("guessInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        submitGuess();
    }
});