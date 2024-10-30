import "./style.css";

interface Item {
  name: string;
  cost: number;
  rate: number;
  description: string;
}

interface Upgrade extends Item {
  baseCost: number;
  currentCost: number;
  button: HTMLButtonElement | null;
  count: number;
}

interface GameState {
  counter: number;
  growthRate: number;
  upgrades: Upgrade[];
}

const availableItems: Item[] = [
  {
    name: "Improved Irrigation",
    cost: 10,
    rate: 0.1,
    description: "Boosts growth by efficiently watering the plant roots.",
  },
  {
    name: "Soil Composition",
    cost: 100,
    rate: 2,
    description: "Rich and fertile soil to enhance plant growth.",
  },
  {
    name: "Organic Fertilizer",
    cost: 1000,
    rate: 50,
    description:
      "Premium mix that supercharges growth using natural ingredients.",
  },
  {
    name: "Helping Hands",
    cost: 5000,
    rate: 200,
    description: "Volunteer botanists help streamline grafting efforts.",
  },
  {
    name: "Genetic Similarities",
    cost: 20000,
    rate: 1000,
    description: "Host plants more easily accept grafts.",
  },
];

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Leaf Lovers";
document.title = gameName;
document.body.style.background = "#5a342c"; // https://github.com/tblagarrett/cmpm-121-demo-1/blob/main/src/main.ts I took inspiration from Garrett's project by changing the background color of my webpage.


const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const counterDiv = document.getElementById("counter") as HTMLDivElement;

const statusDiv = document.createElement("div");
const growthRateDisplay = document.createElement("p");
const purchasesDisplay = document.createElement("p");
statusDiv.appendChild(growthRateDisplay);
statusDiv.appendChild(purchasesDisplay);
app.append(statusDiv);

const manualButton = document.createElement("button");
manualButton.classList.add("giant-tree-button");
manualButton.innerHTML = "🌳";
manualButton.addEventListener("click", () => {
  gameState.counter++;
  counterDiv.innerHTML = `Grafts made: ${Math.floor(gameState.counter)}`;
});
app.append(manualButton);

const gameState: GameState = {
  counter: 0,
  growthRate: 0,
  upgrades: availableItems.map((item) => ({
    ...item,
    baseCost: item.cost,
    currentCost: item.cost,
    button: null,
    count: 0,
  })),
};

function updateButtonDisplay(upgrade: Upgrade) {
  if (upgrade.button) {
    upgrade.button.innerHTML = `${upgrade.name} - Cost: ${upgrade.currentCost.toFixed(2)}<br>${upgrade.description}`;
    upgrade.button.disabled = gameState.counter < upgrade.currentCost;
  }
}

gameState.upgrades.forEach((upgrade) => {
  const button = document.createElement("button");
  upgrade.button = button;

  updateButtonDisplay(upgrade);

  button.addEventListener("click", () => {
    if (gameState.counter >= upgrade.currentCost) {
      gameState.counter -= upgrade.currentCost;
      gameState.growthRate += upgrade.rate;
      upgrade.count += 1;
      upgrade.currentCost = upgrade.baseCost * Math.pow(1.15, upgrade.count);

      updateButtonDisplay(upgrade);
      updateStatus(gameState);
    }
  });

  app.append(button);
});

function updateStatus(state: GameState) {
  growthRateDisplay.innerHTML = `Current Growth Rate: ${state.growthRate.toFixed(1)} grafts/sec`;
  purchasesDisplay.innerHTML =
    "Purchased Items: " +
    state.upgrades
      .map((upgrade) => `${upgrade.name}: ${upgrade.count}`)
      .join(", ");
}

function calculateIncrement(deltaTime: number, rate: number): number {
  return (deltaTime / 1000) * rate;
}

function updateCounter(deltaTime: number, state: GameState) {
  const incrementAmount = calculateIncrement(deltaTime, state.growthRate);
  state.counter += incrementAmount;
  counterDiv.innerHTML = `Grafts made: ${Math.floor(state.counter)}`;
}

function refreshUI(state: GameState) {
  state.upgrades.forEach(updateButtonDisplay);
  updateStatus(state);
}

let lastTimestamp: number = 0;

function updateLoop(timestamp: number) {
  if (lastTimestamp !== 0) {
    const deltaTime = timestamp - lastTimestamp;
    updateCounter(deltaTime, gameState);
    refreshUI(gameState);
  }
  lastTimestamp = timestamp;
  requestAnimationFrame(updateLoop);
}

requestAnimationFrame(updateLoop);
