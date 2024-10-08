import "./style.css";

interface Item {
  name: string;
  cost: number;
  rate: number;
  description: string;
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

let counter: number = 0;
let growthRate: number = 0;

// Basic button for manual count increment
const manualButton = document.createElement("button");
manualButton.classList.add("giant-tree-button");
manualButton.innerHTML = "🌳";
manualButton.addEventListener("click", () => {
  counter++;
  counterDiv.innerHTML = `Grafts made: ${Math.floor(counter)}`;
});
app.append(manualButton);

type Upgrade = Item & {
  baseCost: number;
  currentCost: number;
  button: HTMLButtonElement | null;
  count: number;
};

// Initialize upgrades using availableItems
const upgrades: Upgrade[] = availableItems.map((item) => ({
  ...item,
  baseCost: item.cost,
  currentCost: item.cost,
  button: null,
  count: 0,
}));

// Create a purchase button for each upgrade
upgrades.forEach((upgrade) => {
  const button = document.createElement("button");
  button.innerHTML = `${upgrade.name} - Cost: ${upgrade.currentCost.toFixed(2)}<br>${upgrade.description}`;
  button.disabled = true;

  button.addEventListener("click", () => {
    if (counter >= upgrade.currentCost) {
      counter -= upgrade.currentCost;
      growthRate += upgrade.rate;
      upgrade.count += 1;
      upgrade.currentCost = upgrade.baseCost * Math.pow(1.15, upgrade.count);
      button.innerHTML = `${upgrade.name} - Cost: ${upgrade.currentCost.toFixed(2)}<br>${upgrade.description}`;
      updateStatus();
      button.disabled = true;
    }
  });

  app.append(button);

  // Save button reference
  upgrade.button = button;
});

// Update status display
function updateStatus() {
  growthRateDisplay.innerHTML = `Current Growth Rate: ${growthRate.toFixed(1)} grafts/sec`;
  purchasesDisplay.innerHTML =
    "Purchased Items: " +
    upgrades.map((upgrade) => `${upgrade.name}: ${upgrade.count}`).join(", ");
}

let lastTimestamp: number = 0;

function updateCounter(timestamp: number) {
  if (lastTimestamp !== 0) {
    const delta = timestamp - lastTimestamp;
    const incrementAmount = (delta / 1000) * growthRate;
    counter += incrementAmount;
    counterDiv.innerHTML = `Grafts made: ${Math.floor(counter)}`;

    upgrades.forEach((upgrade) => {
      if (upgrade.button) {
        upgrade.button.disabled = counter < upgrade.currentCost;
      }
    });
  }
  lastTimestamp = timestamp;
  requestAnimationFrame(updateCounter);
}

requestAnimationFrame(updateCounter);

updateStatus();
