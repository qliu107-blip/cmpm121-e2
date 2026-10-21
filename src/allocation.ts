export {};

const canvas = document.querySelector<HTMLCanvasElement>("#allocation-canvas")!;
const ctx = canvas.getContext("2d")!;
const readout = document.querySelector<HTMLParagraphElement>(
  "#allocation-readout",
)!;
let supplyProducers = 2;

interface ShiftResults {
  supplyProducers: number;
  crewSize: number;
  production: number;
  consumption: number;
  balance: number;
}

function calculateShift(supplyProducers: number): ShiftResults {
  const crewSize = 6;
  const production = supplyProducers * 3;
  const consumption = crewSize;
  return {
    supplyProducers,
    crewSize,
    production,
    consumption,
    balance: production - consumption,
  };
}

function renderAllocation() {
  const shift = calculateShift(supplyProducers);
  drawAllocation(shift);
  renderShiftReadout(shift);
}

interface SupplyRow {
  label: string;
  amount: number;
  color: string;
}

function drawAllocation(shift: ShiftResults) {
  const { supplyProducers, crewSize, production, consumption } = shift;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = 0; i < crewSize; i++) {
    ctx.fillStyle = i < supplyProducers ? "#27766b" : "#c9d2c9";
    ctx.fillRect(18 + i * 45, 16, 36, 36);
    ctx.fillStyle = i < supplyProducers ? "#ffffff" : "#233e43";
    ctx.font = "16px system-ui";
    ctx.fillText(String(i + 1), 31 + i * 45, 40);
  }
  ctx.fillStyle = "#233e43";
  ctx.font = "14px system-ui";
  ctx.fillText(`Producers: ${supplyProducers} / ${crewSize}`, 18, 76);
  const rows: SupplyRow[] = [
    { label: "Production", amount: production, color: "#27766b" },
    { label: "Consumption", amount: consumption, color: "#a44d23" },
  ];
  rows.forEach((row, index) => {
    const labelY = 102 + index * 52;
    ctx.fillStyle = "#233e43";
    ctx.fillText(`${row.label}: ${row.amount}`, 18, labelY);
    ctx.fillStyle = row.color;
    ctx.fillRect(18, labelY + 8, row.amount * 14, 20);
  });
}

function renderShiftReadout(shift: ShiftResults) {
  const { supplyProducers, crewSize, production, consumption, balance } = shift;
  readout.textContent =
    `Assigned: ${supplyProducers}/${crewSize} · Production: ${production} · Consumption: ${consumption} · Balance: ${
      balance > 0 ? "+" : ""
    }${balance}`;
}

document.querySelector<HTMLButtonElement>("#allocation-less")!.onclick = () => {
  supplyProducers = Math.max(0, supplyProducers - 1);
  renderAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-more")!.onclick = () => {
  supplyProducers = Math.min(6, supplyProducers + 1);
  renderAllocation();
};
document.querySelector<HTMLButtonElement>("#allocation-reset")!.onclick =
  () => {
    supplyProducers = 2;
    renderAllocation();
  };
renderAllocation();
