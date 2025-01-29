let solde = 0.0;
let current_xp = 0.0;
let needed_xp = 100.0;
let current_lvl = 0;

let name = "Roucoule Inc.";

const soldeText = document.querySelector("#card-balance");
const current_xpText = document.querySelector("#current-xp");
const needed_xpText = document.querySelector("#needed-xp");
const current_lvlText = document.querySelector("#current-lvl");
const level_bar = document.getElementById("level-bar-top");
const nameText = document.querySelector("#card-name");
const mainButton = document.querySelector("#main-button");

console.log(Math.round(5.45));

function updatesDisplay() {
  const progress = (current_xp / needed_xp) * 100;

  soldeText.innerHTML = solde;
  current_xpText.innerHTML = current_xp;
  needed_xpText.innerHTML = Math.round(needed_xp);
  current_lvlText.innerHTML = current_lvl;

  level_bar.style.width = `${progress}%`;

  nameText.innerHTML = name;
}

mainButton.addEventListener("click", function () {
  solde = solde + 1;
  current_xp = current_xp + 1;

  if (current_xp >= needed_xp) {
    current_xp = 0;
    needed_xp = needed_xp * 1.25;
    current_lvl = current_lvl + 1;
  }

  updatesDisplay();
});

updatesDisplay();
