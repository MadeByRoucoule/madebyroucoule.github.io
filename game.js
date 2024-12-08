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
let slotMachineUnlocked = false;

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
const betAmountInput = document.getElementById('bet-amount'); // Champ de saisie pour la mise

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
        
        if (level === 5) {
            slotMachineUnlocked = true;
            document.querySelector('.slotmachineContainer').style.display = 'flex'; // Afficher la machine à sous
        }

        if (level === 1) {
            secondContainer.style.display = 'flex';
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
    if (level < 1) {
        alert("Les améliorations ne sont pas encore débloquées !");
        return;
    }

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

function formatNumberWithK(number) {
    if (number >= 1000) {
        return (number / 1000).toFixed(2) + 'k';
    }
    return number.toFixed(2);
}

function formatNumberWithSpaces(number) {
    return number.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function spinReels() {
    const betAmount = parseInt(betAmountInput.value); // Récupérer la mise du joueur

    if (isNaN(betAmount) || betAmount <= 0 || betAmount > balance) {
        alert("Veuillez entrer une mise valide qui est inférieure ou égale à votre solde.");
        return; // Ne pas continuer si la mise est invalide
    }

    balance -= betAmount; // Déduire le coût du spin
    updateDisplay();

    const resultsArray = [];
    const animations = []; // Pour stocker les promesses d'animation

    reels.forEach((reel, index) => {
        const animationPromise = new Promise((resolve) => {
            let spins = 20; // Augmenter le nombre de rotations
            let currentSpin = 0;

            function animate() {
                reel.innerHTML = ''; // Vider le contenu précédent
                for (let i = 0; i < 3; i++) { // Afficher plusieurs symboles pour l'animation
                    const animatedSymbolDiv = document.createElement('div');
                    animatedSymbolDiv.className = 'symbol';
                    animatedSymbolDiv.textContent = symbols[Math.floor(Math.random() * symbols.length)];
                    reel.appendChild(animatedSymbolDiv);
                }

                currentSpin++;
                if (currentSpin < spins) {
                    setTimeout(() => requestAnimationFrame(animate), 100); // Délai entre chaque spin (100 ms)
                } else {
                    // Ajouter le symbole final après les spins
                    const randomSymbolIndex = Math.floor(Math.random() * symbols.length);
                    const finalSymbolDiv = document.createElement('div');
                    finalSymbolDiv.className = 'symbol';
                    finalSymbolDiv.textContent = symbols[randomSymbolIndex];
                    reel.innerHTML = ''; // Vider le contenu précédent
                    reel.appendChild(finalSymbolDiv); // Ajouter le nouveau symbole final
                    resultsArray.push(symbols[randomSymbolIndex]);
                    resolve(); // Résoudre la promesse quand l'animation est terminée
                }
            }

            animate(); // Démarrer l'animation
        });

        animations.push(animationPromise); // Ajouter la promesse à la liste
    });

    Promise.all(animations).then(() => {
        handleResults(resultsArray, betAmount); // Gérer les résultats après que toutes les animations sont terminées
    });
}

function handleResults(resultsArray, betAmount) {
   // Vérifier les gains
   const uniqueSymbolsCountMap = {};
   
   resultsArray.forEach(symbol => {
       uniqueSymbolsCountMap[symbol] ? uniqueSymbolsCountMap[symbol]++ : uniqueSymbolsCountMap[symbol] = 1; 
   });

   let winningsAmount=calculateWinnings(uniqueSymbolsCountMap, betAmount);

   if (winningsAmount > 0) { 
       balance += winningsAmount;

       displayWin(winningsAmount); // Afficher le gain en vert sur le solde
   } 

   updateDisplay(); // Mettre à jour l'affichage après avoir montré les résultats
}

// Fonction pour afficher le gain en vert sur le solde
function displayWin(amount) {
    const winDisplayDiv = document.createElement('div');
    winDisplayDiv.textContent = `+${formatNumberWithSpaces(amount)}€`;
    winDisplayDiv.style.color = 'green'; // Couleur verte pour les gains
    winDisplayDiv.style.position = 'absolute'; // Positionner le gain par rapport au conteneur
    winDisplayDiv.style.transition = 'opacity 1s ease-out, transform 1s ease-out'; // Transition pour l'effet d'apparition/disparition
    winDisplayDiv.style.opacity = '1';
    winDisplayDiv.style.fontSize = '20px'; // Taille de police pour le gain
    winDisplayDiv.style.fontWeight = 'bold'; // Mettre en gras
    winDisplayDiv.style.transform = 'translateY(-20px)'; // Déplacer légèrement vers le haut
    winDisplayDiv.style.zIndex = '10'; // S'assurer qu'il est au-dessus des autres éléments

    // Positionner l'élément dans le coin supérieur gauche du conteneur
    const containerRect = document.querySelector('.slotmachineContainer').getBoundingClientRect();
    winDisplayDiv.style.left = `${containerRect.left}px`;
    winDisplayDiv.style.top = `${containerRect.top}px`; // Ajuster la position pour qu'il soit en haut à gauche

    document.body.appendChild(winDisplayDiv); // Ajouter à body pour éviter les problèmes de positionnement

    setTimeout(() => {
        winDisplayDiv.style.opacity = '0'; // Rendre l'élément transparent après un certain temps
        winDisplayDiv.style.transform = 'translateY(-40px)'; // Déplacer vers le haut pendant la disparition
        setTimeout(() => winDisplayDiv.remove(), 1000); // Retirer l'élément après la transition
    }, 2000); // Afficher pendant deux secondes avant de disparaître
}

// Fonction pour calculer les gains basés sur les symboles uniques et leurs occurrences
function calculateWinnings(countMap, betAmount) {
   let totalWinnings=0;

   for (const [symbol, count] of Object.entries(countMap)) {
       if (count >= 2) { // Au moins trois symboles identiques pour gagner
           const winningsMultiplierMap= { 
               '🍒': betAmount * count * 1,
               '🍋': betAmount * count * 2,
               '🍊': betAmount * count * 3,
               '🍇': betAmount * count * 4,
               '🔔': betAmount * count * 5,
               '💎': betAmount * count * 10 
           };
           totalWinnings += winningsMultiplierMap[symbol] || 0; 
       }
   }

   return totalWinnings; 
}

setInterval(generatePassiveIncome, 1000);

clickArea.addEventListener('click', handleClick);

spinButton.addEventListener('click', spinReels); // Ajouter l'événement pour le bouton de spin

upgradeButtons.forEach((button, index) => {
    button.addEventListener('click', () => handleUpgrade(index));
});