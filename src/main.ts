import "./style.css";

const app: HTMLDivElement = document.querySelector("#app")!;

const gameName = "Leaf Lovers";
const buttonName = "🌳";
document.title = gameName;

const header = document.createElement("h1");
const button = document.createElement("b1");
header.innerHTML = gameName;
button.innerHTML = buttonName;
app.append(header);
app.append(button);
