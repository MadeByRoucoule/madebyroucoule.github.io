let balance = 0;
let moneyPerClick = 1;
let moneyPerSecond = 0;
let xpPerClick = 1;
let currentXp = 0;
let level = 0;
let nextLevelXp = 100;
let hireCost = 100;
let clickUpgradeCost = 500;
let xpUpgradeCost = 750;

const balanceElement = document.getElementById('balance');
const moneyPerClickElement = document.getElementById('MoneyPerClick');
const moneyPerSecondElement = document.getElementById('MoneyPerSecond');
const xpPerClickElement = document.getElementById('XpPerClick');
const currentXpElement = document.getElementById('currentXp');
const levelElement = document.getElementById('level');
const nextLevelXpElement = document.getElementById('nextLevelXp');
const levelProgressBar = document.getElementById('levelProgressBar');
const clickArea = document.querySelector('.click-area');
const upgradeButtons = document.querySelectorAll('.money-per-second-upgrade');
const secondContainer = document.querySelector('.secondContainer');

const reels = document.querySelectorAll('.reel');
const spinButton = document.getElementById('spin-button');
const result = document.getElementById('result');

const symbols = ['🍒', '🍋', '🍊', '🍇', '🔔', '💎'];

function updateDisplay() {
    balanceElement.textContent = formatNumberWithSpaces(balance);
    moneyPerClickElement.textContent = formatNumberWithSpaces(moneyPerClick);
    moneyPerSecondElement.textContent = formatNumberWithSpaces(moneyPerSecond);
    xpPerClickElement.textContent = formatNumberWithSpaces(xpPerClick);
    currentXpElement.textContent = formatNumberWithK(currentXp);
    levelElement.textContent = level;
    nextLevelXpElement.textContent = formatNumberWithK(nextLevelXp);
    levelProgressBar.style.width = `${(currentXp / nextLevelXp) * 100}%`;
}

function handleClick() {
    balance += moneyPerClick;
    currentXp += xpPerClick;
    checkLevelUp();
    updateDisplay();
}

function checkLevelUp() {
    if (currentXp >= nextLevelXp) {
        level++;
        currentXp -= nextLevelXp;
        nextLevelXp = Math.floor(nextLevelXp * 1.5);
        
        if (level === 1) {
    secondContainer.style.display = 'flex';  // ou 'block', selon votre mise en page
    setTimeout(() => secondContainer.classList.remove('hidden'), 10);
}
    }
    updateDisplay();
}

function generatePassiveIncome() {
    balance += moneyPerSecond;
    updateDisplay();
}

function handleUpgrade(index) {
    switch(index) {
        case 0:
            if (balance >= hireCost) {
                balance -= hireCost;
                moneyPerSecond += 5;
                hireCost = Math.floor(hireCost * 1.2);
                updateUpgradeButton(0, hireCost);
            }
            break;
        case 1:
            if (balance >= clickUpgradeCost) {
                balance -= clickUpgradeCost;
                moneyPerClick *= 2;
                clickUpgradeCost = Math.floor(clickUpgradeCost * 2);
                updateUpgradeButton(1, clickUpgradeCost);
            }
            break;
        case 2:
            if (balance >= xpUpgradeCost) {
                balance -= xpUpgradeCost;
                xpPerClick *= 1.2;
                xpUpgradeCost = Math.floor(xpUpgradeCost * 1.5);
                updateUpgradeButton(2, xpUpgradeCost);
            }
            break;
    }
    updateDisplay();
}

function updateUpgradeButton(index, newCost) {
    const upgradeButtons = document.querySelectorAll('.money-per-second-upgrade');
    const button = upgradeButtons[index];
    const detailsSpan = button.querySelector('.upgrade-details');
    
    let newText;
    switch(index) {
        case 0:
            newText = `+5 €/s | ${newCost}€`;
            break;
        case 1:
            newText = `x2 €/c | ${newCost}€`;
            break;
        case 2:
            newText = `+2 Xp/c | ${newCost}€`;
            break;
    }
    
    detailsSpan.textContent = newText;
}

function spin() {
    spinButton.disabled = true; // Désactiver le bouton pendant le spin
    result.textContent = ''; // Réinitialiser le résultat

    const spins = Array.from(reels).map((reel, index) => {
        return new Promise(resolve => {
            const symbolIndex = Math.floor(Math.random() * symbols.length);
            let turns = 0;

            const interval = setInterval(() => {
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                turns++;
                if (turns >= 20) { // Arrêter après 20 tours
                    clearInterval(interval);
                    reel.textContent = symbols[symbolIndex]; // Afficher le symbole final
                    resolve(symbolIndex);
                }
            }, 100); // Changer le symbole toutes les 100ms
        });
    });

    Promise.all(spins).then(results => {
        if (results[0] === results[1] && results[1] === results[2]) {
            result.textContent = 'Jackpot !';
            // Ajoutez ici la logique pour attribuer un prix
        } else {
            result.textContent = 'Essayez encore !';
        }
        spinButton.disabled = false; // Réactiver le bouton
    });
}

function formatNumberWithK(number) {
    if (number >= 1000) {
        return (number / 1000).toFixed(2) + 'k';
    }
    return number.toFixed(2);
}

function formatNumberWithSpaces(number) {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

setInterval(generatePassiveIncome, 1000);

clickArea.addEventListener('click', handleClick);

spinButton.addEventListener('click', spin);

upgradeButtons.forEach((button, index) => {
    button.addEventListener('click', () => handleUpgrade(index));
});