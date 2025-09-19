// Select HTML elements 
const output = document.getElementById("game-output");
const input = document.getElementById("player-input");
const btn = document.getElementById("submit-btn");

// Game state 
let gameStarted = false;
let gameOver = false;
let hp = 10;
let inventory = [];
let currentEnemy = null;
let moveCount = 0;

// Linear stages: items (magic herb last), enemies, traps
let items = ["stick", "potion", "magic herb"];
const enemies = ["wolf", "spider"];
const traps = ["pitfall", "poisonous plant"];

// Event listeners 
btn.addEventListener("click", handleCommand);
input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") handleCommand();
});

//  Handle player input 
function handleCommand() {
    const command = input.value.trim().toLowerCase();
    input.value = "";
    if (!command) return;

    appendPlayerText(command);

    if (gameOver && command !== "restart") return;

    if (!gameStarted && command === "start") {
        gameStarted = true;
        appendGameText("🌲 You enter the woods. Type 'move' to explore.");
    } else if (!gameStarted) {
        appendGameText("Type 'start' to begin your quest.");
    } else if (command === "move") {
        moveAction();
    } else if (command === "inventory") {
        appendGameText(`Inventory: ${inventory.join(", ") || "empty"}`);
    } else if (command === "hp") {
        appendGameText(`HP: ${hp}`);
    } else if (command === "fight" && currentEnemy) {
        fightEnemy();
    } else if (command === "flee" && currentEnemy) {
        fleeEnemy();
    } else if (command === "restart") {
        restartGame();
    } else {
        appendGameText("Unknown command. Try 'move', 'inventory', 'hp', or 'restart'.");
    }
}

// Append game messages 
function appendGameText(text) {
    const p = document.createElement("p");
    p.textContent = text;
    output.appendChild(p);
    scrollToBottom();
}

function appendPlayerText(text) {
    const p = document.createElement("p");
    p.textContent = `> ${text}`;
    p.classList.add("text-blue-300"); // Tailwind styling
    output.appendChild(p);
    scrollToBottom();
}

function scrollToBottom() {
    output.scrollTop = output.scrollHeight;
}

// Move action conditional function (linear, no repeats) 
function moveAction() {
    if (gameOver) {
        appendGameText("The quest is over. Type 'restart' to play again.");
        return;
    }
     moveCount++;

    if (moveCount === 1) {
        enemyEncounter();
    } else if (moveCount === 2) {
        trapEncounter();
    } 
      else if (moveCount === 3){
        itemEncounter();        // adds an item to the inventory 
      }
    else if (moveCount === 4) {
        // Always give the magic herb as final item
        itemEncounter("magic herb");
    } 
    
    else {
        appendGameText("You've reached the end of your journey. Type 'restart' to play again.");
  }
}

//  Enemy encounter 
function enemyEncounter() {
    const enemy = enemies.shift();
    if (!enemy) {
        appendGameText("The woods are calm. Type 'move' to continue.");
        return;
    }
    currentEnemy = enemy;
    appendGameText(`A ${enemy} appears! 🗡️ Type 'fight' or 'flee'.`);
}

// Fight and flee 
function fightEnemy() {
    appendGameText(`You fight the ${currentEnemy} and win! 🎖️`);
    currentEnemy = null;
    appendGameText("You continue your journey. Type 'move' to proceed.");
}

function fleeEnemy() {
    appendGameText(`You flee from the ${currentEnemy}. 🏃‍♂️`);
    currentEnemy = null;
    appendGameText("You continue your journey. Type 'move' to proceed.");
}

// Trap encounter 
function trapEncounter() {
    const trap = traps.shift();
    if (!trap) {
        appendGameText("The path is clear. Type 'move' to continue.");
        return;
    }
    hp -= 2;
    appendGameText(`You triggered a ${trap}! You lose 2 HP. Current HP: ${hp}`);
    checkGameOver();
    if (!gameOver) appendGameText("Type 'move' to continue exploring.");
}

// Item encounter 
function itemEncounter(specificItem = null) {
    let item = specificItem || items.shift();
    if (!item) return;

    inventory.push(item);

    if (item === "magic herb") {
        appendGameText(`🌿 You found the ${item}! Congratulations, quest complete! 🏆`);
        gameOver = true;
        appendGameText("Type 'restart' to play again.");
    } else {
        appendGameText(`You found a ${item}. Added to your inventory.`);
        appendGameText("Type 'move' to continue exploring.");
    }
}

// Check game over 
function checkGameOver() {
    if (hp <= 0) {
        gameOver = true;
        appendGameText("Your HP has dropped to 0. Game Over. Type 'restart' to play again.");
    }
}

// Restart game , resets all game state variables/clears output 
function restartGame() {
    gameStarted = false;
    gameOver = false;
    hp = 10;
    inventory = [];
    currentEnemy = null;
    moveCount = 0;
// Shuffle arrays for variety when the game restarts
    enemies = shuffleArray(["wolf", "Spider"]);
    traps = shuffleArray(["pitfall", "poisonous plant"]);
    items = shuffleArray(["stick", "potion"]);
    items.push("magic herb"); // magic herb always the last item 
    
    output.innerHTML = "";
    appendGameText("Game restarted! Type 'start' to begin again. 🔄");
}
// Helper function to shuffle arrays 
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5); // it randomly shuffles the array elements 
}