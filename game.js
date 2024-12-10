const die1 = document.getElementById("die1");
const die2 = document.getElementById("die2");
const rollBtn = document.getElementById("rollBtn");
const startBtn = document.getElementById("startBtn");
const individualDiceBtn = document.getElementById("individualDiceBtn");
const sumOfDiceBtn = document.getElementById("sumOfDiceBtn");
const endTurnBtn = document.getElementById("endTurnBtn");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const roundText = document.getElementById("roundText");
const turnText = document.getElementById("turnText");
const winnerSection = document.getElementById("winner");
const diceSumText = document.getElementById("diceSum");

const boxes = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];

let currentPlayer = 1;
let die1Value = 0;
let die2Value = 0;
let player1Points = 0;
let player2Points = 0;
let currentRound = 1;
let player1Name = "";
let player2Name = "";

function shut(boxNumber) {
    const box = document.getElementById(`box${boxNumber}`);
    box.classList.add("shut");
    box.textContent = "X";
}

function buildRow(round, points) {
    const tr = document.createElement("tr");
    tr.id = `round${round}`;

    const th = document.createElement("th");
    th.textContent = `Round ${round}`;

    const tdP1 = document.createElement("td");
    tdP1.className = "p1Pts";
    tdP1.textContent = points;

    const tdP2 = document.createElement("td");
    tdP2.className = "p2Pts";

    tr.insertAdjacentElement("beforeend", th);
    tr.insertAdjacentElement("beforeend", tdP1);
    tr.insertAdjacentElement("beforeend", tdP2);

    return tr;
}

function resetBoard() {
    boxes.fill(0);

    const allBoxes = document.querySelectorAll(".box");
    allBoxes.forEach((box, index) => {
        box.classList.remove("shut");
        box.textContent = index + 1;
        box.dataset.lid = "open";
    });

    roundText.textContent = `Round: ${currentRound}`;
    turnText.textContent = `It's ${currentPlayer === 1 ? player1Name : player2Name}'s turn`;
}

endTurnBtn.addEventListener("click", () => {
    if (currentPlayer === 1) {
        const player1PointsThisTurn = 45 - boxes[0];
        player1Points += player1PointsThisTurn;

        
        const newRow = buildRow(currentRound, player1PointsThisTurn);
        document.querySelector("tbody").appendChild(newRow);

        currentPlayer = 2;
        turnText.textContent = `It's ${player2Name}'s turn`;
    } else {

        let roundRow = document.querySelector(`#round${currentRound}`);
        if (!roundRow) {
            roundRow = buildRow(currentRound, "");
            document.querySelector("tbody").appendChild(roundRow);
        }

        const player2PointsThisTurn = 45 - boxes[0];
        player2Points += player2PointsThisTurn;

        const player2Td = roundRow.querySelector(".p2Pts");
        player2Td.textContent = player2PointsThisTurn;

        currentPlayer = 1;
        turnText.textContent = `It's ${player1Name}'s turn`;

        currentRound++;
        if (currentRound > 5) {
            gameOver();
            return;
        }
    }

    resetBoard();

    rollBtn.disabled = false;
    endTurnBtn.disabled = true;
});

startBtn.addEventListener("click", () => {
    player1Name = player1Input.value.trim();
    player2Name = player2Input.value.trim();

    if (player1Name === "" || player2Name === "") {
        alert("Please fill in both player names!");
        return;
    }

    turnText.textContent = `It's ${player1Name}'s turn`;
    rollBtn.disabled = false;
    document.getElementById("players").style.display = "none";
    document.getElementById("board").style.display = "block";
    document.getElementById("dice").style.display = "block";
    winnerSection.style.display = "none";
    document.querySelector('#tp1name').textContent = player1Name;
    document.querySelector('#tp2name').textContent = player2Name;
});

rollBtn.addEventListener("click", () => {
    die1Value = Math.floor(Math.random() * 6) + 1;
    die2Value = Math.floor(Math.random() * 6) + 1;

    die1.className = `bi bi-dice-${die1Value}`;
    die2.className = `bi bi-dice-${die2Value}`;
    diceSumText.textContent = `Sum: ${die1Value + die2Value}`;

    if (die1Value === die2Value) {
        individualDiceBtn.disabled = true;
        sumOfDiceBtn.disabled = true;
        endTurnBtn.disabled = false;
        rollBtn.disabled = true;
        return;
    }

    individualDiceBtn.disabled = boxes[die1Value] === "X" || boxes[die2Value] === "X";
    sumOfDiceBtn.disabled = boxes[die1Value + die2Value] === "X" || die1Value + die2Value > 9;
    endTurnBtn.disabled = individualDiceBtn.disabled && sumOfDiceBtn.disabled ? false : true;
    rollBtn.disabled = true;
});

individualDiceBtn.addEventListener("click", () => {
    shut(die1Value);
    shut(die2Value);

    boxes[die1Value] = "X";
    boxes[die2Value] = "X";

    boxes[0] += die1Value + die2Value;

    rollBtn.disabled = false;
    individualDiceBtn.disabled = true;
    sumOfDiceBtn.disabled = true;
    endTurnBtn.disabled = true;
});

sumOfDiceBtn.addEventListener("click", () => {
    const diceSum = die1Value + die2Value;
    shut(diceSum);

    boxes[diceSum] = "X";
    boxes[0] += diceSum;

    rollBtn.disabled = false;
    individualDiceBtn.disabled = true;
    sumOfDiceBtn.disabled = true;
    endTurnBtn.disabled = true;
});


function gameOver() {

    document.getElementById("board").style.display = "none";
    document.getElementById("dice").style.display = "none";

    const winnerSection = document.getElementById("winner");
    const winnerText = document.getElementById("winnerText");
    const player1Score = player1Points;
    const player2Score = player2Points;


    if (player1Score < player2Score) {
        winnerText.textContent = `${player1Name} wins! Score: ${player1Score} vs. ${player2Score}`;
    } else if (player2Score < player1Score) {
        winnerText.textContent = `${player2Name} wins! Score: ${player1Score} vs. ${player2Score}`;
    } else {
        winnerText.textContent = `It's a tie! Score: ${player1Score} vs. ${player2Score}`;
    }


    winnerSection.style.display = "block";
    document.getElementById("playAgainBtn").style.display = "inline";
}





document.getElementById("playAgainBtn").addEventListener("click", function () {
    currentRound = 1;
    resetBoard();


    const scoreTable = document.getElementById("scorecard");
    const rows = scoreTable.querySelectorAll("tr");
    rows.forEach((row, index) => {
        if (index !== 0) row.remove();
    });


    player1Input.value = '';
    player2Input.value = '';


    document.getElementById("board").style.display = "none";
    document.getElementById("dice").style.display = "none";
    document.getElementById("winner").style.display = "none";
    document.getElementById("players").style.display = "block";
    startBtn.style.display = "block";

    startBtn.disabled = false;
    endTurnBtn.disabled = true;
});










