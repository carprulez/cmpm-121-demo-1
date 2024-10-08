import "./style.css";

interface Item {
  name: string;
  cost: number;
  rate: number;
}

const availableItems: Item[] = [
  { name: "Improved Irrigation", cost: 10, rate: 0.1 },
  { name: "Soil", cost: 100, rate: 2 },
  { name: "Organic Fertilizer", cost: 1000, rate: 50 },
];

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Leaf Lovers";
document.title = gameName;

const header = document.createElement("h1");
header.innerHTML = gameName;
app.append(header);

const counterDiv = document.getElementById("counter") as HTMLDivElement;

// Create a new div for displaying the status
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

// Upgrade logic using availableItems and restructuring it to include dynamic properties
const upgrades: Upgrade[] = availableItems.map((item) => ({
  ...item,
  baseCost: item.cost, // Maintain a separate baseCost reference
  currentCost: item.cost,
  button: null,
  count: 0,
}));

// Create a purchase button for each upgrade
upgrades.forEach((upgrade) => {
  const button = document.createElement("button");
  button.innerHTML = `${upgrade.name} - Cost: ${upgrade.currentCost.toFixed(2)}`;
  button.disabled = true;

  button.addEventListener("click", () => {
    if (counter >= upgrade.currentCost) {
      counter -= upgrade.currentCost;
      growthRate += upgrade.rate;
      upgrade.count += 1; // Increment the count of purchased items
      upgrade.currentCost = upgrade.baseCost * Math.pow(1.15, upgrade.count); // Recalculate the new cost
      button.innerHTML = `${upgrade.name} - Cost: ${upgrade.currentCost.toFixed(2)}`; // Update cost display
      updateStatus(); // Update status display
      button.disabled = true; // Immediately disable until further checks
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

// Time management variables
let lastTimestamp: number = 0;

function updateCounter(timestamp: number) {
  if (lastTimestamp !== 0) {
    const delta = timestamp - lastTimestamp;
    const incrementAmount = (delta / 1000) * growthRate;
    counter += incrementAmount;
    counterDiv.innerHTML = `Grafts made: ${Math.floor(counter)}`;

    // Enable buttons where sufficient units exist
    upgrades.forEach((upgrade) => {
      if (upgrade.button) {
        upgrade.button.disabled = counter < upgrade.currentCost;
      }
    });
  }
  lastTimestamp = timestamp;
  requestAnimationFrame(updateCounter);
}

// Start the animation loop
requestAnimationFrame(updateCounter);

// Initialize status display
updateStatus();
