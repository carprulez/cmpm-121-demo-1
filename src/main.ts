import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Leaf Lovers";
const buttonName = "🌳";
const upgradeButtonName = "🌱 Purchase Upgrade";
document.title = gameName;

const header = document.createElement("h1");
const button = document.createElement("button");
const upgradeButton = document.createElement("button");
header.innerHTML = gameName;
button.innerHTML = buttonName;
upgradeButton.innerHTML = upgradeButtonName;

// Initial setup: disable upgrade button
upgradeButton.disabled = true;

app.append(header);
app.append(button);
app.append(upgradeButton);

const counterDiv = document.getElementById("counter") as HTMLDivElement;

let counter: number = 0;
let growthRate: number = 0;

// Time management variables
let lastTimestamp: number = 0;

function updateCounter(timestamp: number) {
  if (lastTimestamp !== 0) {
    const delta = timestamp - lastTimestamp;
    const incrementAmount = (delta / 1000) * growthRate;
    counter += incrementAmount;
    counterDiv.innerHTML = `Grafts made: ${Math.floor(counter)}`;

    // Check if purchase is affordable
    upgradeButton.disabled = counter < 10;
  }
  lastTimestamp = timestamp;
  requestAnimationFrame(updateCounter);
}

// Increment counter whenever the button is clicked
button.addEventListener("click", () => {
  counter++;
  counterDiv.innerHTML = `Grafts made: ${Math.floor(counter)}`;
});

// Purchase upgrade logic
upgradeButton.addEventListener("click", () => {
  if (counter >= 10) {
    counter -= 10;
    growthRate += 1; // Increase the growth rate
  }
});

// Start animation loop
requestAnimationFrame(updateCounter);