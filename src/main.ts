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

// Increment counter every time the user clicks the button
button.addEventListener("click", () => {
    incrementCounter();
  });
  
  // Increment counter every second using setInterval
  setInterval(() => {
    incrementCounter();
  }, 1000);
  
  function incrementCounter() {
    counter++;
    counterDiv.innerHTML = `Grafts made: ${counter}`;
  }