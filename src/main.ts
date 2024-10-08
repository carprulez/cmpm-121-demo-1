import "./style.css";

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
manualButton.innerHTML = "🌳";
manualButton.addEventListener("click", () => {
  counter++;
  counterDiv.innerHTML = `Grafts made: ${Math.floor(counter)}`;
});
app.append(manualButton);

// Upgrade definitions
const upgrades = [
  { id: "a", name: "Item A", baseCost: 10, rateIncrease: 0.1, button: null as HTMLButtonElement | null, count: 0 },
  { id: "b", name: "Item B", baseCost: 100, rateIncrease: 2.0, button: null as HTMLButtonElement | null, count: 0 },
  { id: "c", name: "Item C", baseCost: 1000, rateIncrease: 50, button: null as HTMLButtonElement | null, count: 0 },
];

// Create a purchase button for each upgrade
upgrades.forEach((upgrade) => {
  const button = document.createElement("button");
  button.innerHTML = `${upgrade.name} - Cost: ${upgrade.baseCost.toFixed(2)}`;
  button.disabled = true;

  button.addEventListener("click", () => {
    const currentCost = upgrade.baseCost * Math.pow(1.15, upgrade.count);

    if (counter >= currentCost) {
      counter -= currentCost;
      growthRate += upgrade.rateIncrease;
      upgrade.count += 1; // Increment the count of purchased items
      button.innerHTML = `${upgrade.name} - Cost: ${(upgrade.baseCost * Math.pow(1.15, upgrade.count)).toFixed(2)}`; // Update cost display
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
  purchasesDisplay.innerHTML = 'Purchased Items: ' + upgrades.map(upgrade => `${upgrade.name}: ${upgrade.count}`).join(', ');
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
      const currentCost = upgrade.baseCost * Math.pow(1.15, upgrade.count);
      if (upgrade.button) {
        upgrade.button.disabled = counter < currentCost;
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
