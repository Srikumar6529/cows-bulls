from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

secret_number = ""


class GuessRequest(BaseModel):
    guess: str


def generate_secret_number():
    digits = [random.choice(range(1, 10))]

    while len(digits) != 4:
        digit = random.choice(range(10))

        if digit not in digits:
            digits.append(digit)

    return "".join(map(str, digits))


@app.get("/start")
def start_game():
    global secret_number
    secret_number = generate_secret_number()
    print("Secret:", secret_number)
    return {"message": "New game started"}


@app.post("/guess")
def check_guess(request: GuessRequest):
    global secret_number

    guess = request.guess

    if len(guess) != 4 or not guess.isdigit():
        return {
            "error": "Guess must be exactly 4 digits"
        }
    if len(set(guess)) != 4:
        return {
            "error": "Digits must be unique"
        }

    if guess == secret_number:
        return {
            "guess": guess,
            "cows": 0,
            "bulls": 4,
            "correct": True,
            "message": "Correct guess! Booyah!"
        }

    bulls = 0
    cows = 0

    for i in range(4):
        if guess[i] == secret_number[i]:
            bulls += 1
        elif guess[i] in secret_number:
            cows += 1

    return {
        "guess": guess,
        "cows": cows,
        "bulls": bulls,
        "correct": False
    }