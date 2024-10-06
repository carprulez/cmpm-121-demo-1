import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Leaf Lovers";
const buttonName = "🌳";
document.title = gameName;

const header = document.createElement("h1");
const button = document.createElement("button");
header.innerHTML = gameName;
button.innerHTML = buttonName;
app.append(header);
app.append(button);

const counterDiv = document.getElementById("counter") as HTMLDivElement;

let counter: number = 0;

// Time management variables
let lastTimestamp: number = 0;
const incrementsPerSecond: number = 1;

function updateCounter(timestamp: number) {
  if (lastTimestamp !== 0) {
    const delta = timestamp - lastTimestamp;
    const incrementAmount = (delta / 1000) * incrementsPerSecond;
    counter += incrementAmount;
    counterDiv.innerHTML = `Grafts made: ${Math.floor(counter)}`;
  }
  lastTimestamp = timestamp;
  requestAnimationFrame(updateCounter);
}

// Start the animation loop
requestAnimationFrame(updateCounter);

// Increment counter every time the user clicks the button
button.addEventListener("click", () => {
  counter++;
  counterDiv.innerHTML = `Grafts made: ${Math.floor(counter)}`;
});