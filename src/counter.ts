export {};

const canvas = document.querySelector<HTMLCanvasElement>("#counter-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#counter-readout",
)!;
const host = document.querySelector<HTMLDivElement>("#counter-panel-host")!;
const diagnostic = document.querySelector<HTMLParagraphElement>(
  "#counter-diagnostic",
)!;
let count = 0;
let panel: HTMLParagraphElement | null = null;
let panelUpdates = 0;

interface ShieldSnapshot {
  charge: number;
  capacity: number;
  missingCharge: number;
}
function snapshotShield(charge: number): ShieldSnapshot {
  const capacity = 10;
  return { charge, capacity, missingCharge: capacity - charge };
}
function drawMeter(snapshot: ShieldSnapshot) {
  const { charge, capacity } = snapshot;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < capacity; i++) {
    ctx.fillStyle = i < charge ? "#27766b" : "#c9d2c9";
    ctx.fillRect(12 + i * 28, 24, 24, 48);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "16px system-ui";
  ctx.fillText(`${charge} / ${capacity} shield`, 12, 100);
  readout.textContent = `Shield charge: ${charge} / ${capacity}`;
}

function updateStats() {
  const snapshot = snapshotShield(count);
  panelUpdates++;
  diagnostic.textContent = `Inspector deliveries: ${panelUpdates}`;
  renderStats(snapshot);
}

function renderStats(snapshot: ShieldSnapshot) {
  if (!panel) return;
  panel.textContent =
    `Shield charge: ${snapshot.charge} · Missing charge: ${snapshot.missingCharge}`;
}

const shieldEvents = new EventTarget();
shieldEvents.addEventListener("change", () => drawMeter(snapshotShield(count)));

function setCount(next: number) {
  const bounded = Math.max(0, Math.min(10, next));
  if (bounded === count) return;
  count = bounded;
  shieldEvents.dispatchEvent(new Event("change"));
}

document.querySelector<HTMLButtonElement>("#counter-less")!.onclick = () => {
  setCount(count - 1);
};
document.querySelector<HTMLButtonElement>("#counter-more")!.onclick = () => {
  setCount(count + 1);
};
document.querySelector<HTMLButtonElement>("#counter-reset")!.onclick = () => {
  setCount(0);
};
document.querySelector<HTMLButtonElement>("#counter-open")!.onclick = () => {
  if (panel) return;
  panel = document.createElement("p");
  host.append(panel);
  renderStats(snapshotShield(count));
  shieldEvents.addEventListener("change", updateStats);
};
document.querySelector<HTMLButtonElement>("#counter-close")!.onclick = () => {
  if (!panel) return;
  shieldEvents.removeEventListener("change", updateStats);
  panel.remove();
  panel = null;
};
drawMeter(snapshotShield(count));
