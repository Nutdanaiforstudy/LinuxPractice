
const MEMORY_SIZE = 32;
const STEPS = [
  {
    name: "Step 0 – Program not started",
    phaseType: "Initialisation",
    usedBlocks: [],
    description:
      "No data structures have been allocated yet. The process occupies only a minimal amount of memory for the runtime itself.",
    breakdown:
      "All 32 conceptual blocks are free. In a real system, you would see only a small baseline RSS value for the Python process.",
    colabTip:
      "This corresponds to the first call to show_process_memory('start') before any large data structures are created.",
    monitorTip:
      "In free -h and top, used memory is close to the baseline of the system; the Python process uses relatively little."
  },
  {
    name: "Step 1 – Code and small data",
    phaseType: "Code + small data",
    usedBlocks: [...Array(4).keys()],
    description:
      "The program code and a few small objects (integers, short strings) are resident in memory.",
    breakdown:
      "Blocks 0–3 represent the code segment and small runtime data. The majority of memory remains free for future allocations.",
    colabTip:
      "This matches the phase after x, msg, and a small list are created but before any large array is allocated.",
    monitorTip:
      "Expect a moderate increase in the Python process RSS; system-wide memory usage increases slightly."
  },
  {
    name: "Step 2 – Input buffer allocated",
    phaseType: "I/O buffer",
    usedBlocks: [...Array(8).keys()],
    description:
      "An input buffer is allocated to hold user or file data. The footprint grows as more elements are stored.",
    breakdown:
      "Blocks 0–3: program code. Blocks 4–7: input buffer. Memory is still far from saturated, but usage is clearly higher than at start.",
    colabTip:
      "In Colab, this is comparable to extending the list of values (numbers) or reading input into a buffer.",
    monitorTip:
      "free -h and top will show another step up in used memory. Watch how the process RSS increases compared with Step 1."
  },
  {
    name: "Step 3 – Main processing array",
    phaseType: "Main computation",
    usedBlocks: [...Array(24).keys()],
    description:
      "A large array used for the core computation is allocated. This is a major contributor to total memory usage.",
    breakdown:
      "Blocks 0–3: code. 4–7: input buffer. 8–23: main processing array. Most of the conceptual memory is now occupied by long-lived data.",
    colabTip:
      "This corresponds to creating main_array = np.ones((4000, 3000), dtype=np.float64) in the Colab program.",
    monitorTip:
      "You should see a significant jump in memory consumption. In top, the Python process grows by tens or hundreds of MB."
  },
  {
    name: "Step 4 – Temporary scratch space",
    phaseType: "Peak usage (scratch)",
    usedBlocks: [...Array(28).keys()],
    description:
      "A temporary scratch buffer is allocated in addition to the existing structures. This is the peak memory usage.",
    breakdown:
      "Blocks 0–3: code. 4–7: input buffer. 8–23: processing array. 24–27: temporary scratch space. Only a few conceptual blocks remain free.",
    colabTip:
      "This maps to creating scratch = np.zeros((3000, 3000), dtype=np.float32) on top of the main_array.",
    monitorTip:
      "System memory usage and the process RSS are at their highest. This is the critical point when estimating whether the program fits in RAM."
  },
  {
    name: "Step 5 – Scratch freed",
    phaseType: "Cleanup (partial)",
    usedBlocks: [...Array(24).keys()],
    description:
      "The scratch buffer is released. The program still keeps its main array and input data, but temporary space is reclaimed.",
    breakdown:
      "Blocks 0–3: code. 4–7: input buffer. 8–23: processing array. Blocks 24–27 are free again, reducing the total usage.",
    colabTip:
      "This mirrors del scratch followed by gc.collect() in the Colab program.",
    monitorTip:
      "You should see a decrease in RSS, although garbage collection and allocator behaviour may cause it to be gradual rather than immediate."
  },
  {
    name: "Step 6 – Program finished",
    phaseType: "Shutdown",
    usedBlocks: [...Array(4).keys()],
    description:
      "The program has finished its main work. Most data structures are freed; only essential code structures remain.",
    breakdown:
      "Blocks 0–3: code. All other blocks are free. In reality, the operating system may release most memory back to the system when the process exits.",
    colabTip:
      "This phase corresponds to deleting the main_array, numbers, and other variables and forcing a final garbage collection.",
    monitorTip:
      "After termination, top will no longer show the process. If you stay in the same Python process, you should still see a much lower RSS than at peak."
  }
];

let currentStepIndex = 0;
let playInterval = null;

const sliderEl = document.getElementById("step-slider");
const stepNumberEl = document.getElementById("step-number");
const stepTitleEl = document.getElementById("step-title");
const stepDescEl = document.getElementById("step-desc");
const usedCountEl = document.getElementById("used-count");
const phaseTypeEl = document.getElementById("phase-type");
const memoryGridEl = document.getElementById("memory-grid");
const breakdownTextEl = document.getElementById("breakdown-text");
const colabTipEl = document.getElementById("colab-tip");
const monitorTipEl = document.getElementById("monitor-tip");
const usageChartEl = document.getElementById("usage-chart");

const btnPrev = document.getElementById("btn-prev");
const btnNext = document.getElementById("btn-next");
const btnPlay = document.getElementById("btn-play");
const btnPause = document.getElementById("btn-pause");
const btnReset = document.getElementById("btn-reset");

function initMemoryGrid() {
  memoryGridEl.innerHTML = "";
  for (let i = 0; i < MEMORY_SIZE; i++) {
    const block = document.createElement("div");
    block.className = "memory-block";
    const inner = document.createElement("div");
    inner.className = "memory-block-inner";
    const label = document.createElement("div");
    label.className = "memory-block-index";
    label.textContent = i.toString();
    inner.appendChild(label);
    block.appendChild(inner);
    memoryGridEl.appendChild(block);
  }
}

function renderMemoryBlocks(stepIndex) {
  const step = STEPS[stepIndex];
  const used = new Set(step.usedBlocks);
  const blocks = memoryGridEl.getElementsByClassName("memory-block");
  for (let i = 0; i < blocks.length; i++) {
    blocks[i].classList.toggle("used", used.has(i));
  }
  usedCountEl.textContent = `${step.usedBlocks.length} / ${MEMORY_SIZE}`;
}

function renderAnnotations(stepIndex) {
  const step = STEPS[stepIndex];
  stepTitleEl.textContent = step.name;
  stepDescEl.textContent = step.description;
  phaseTypeEl.textContent = step.phaseType;
  breakdownTextEl.textContent = step.breakdown;
  colabTipEl.textContent = step.colabTip;
  monitorTipEl.textContent = step.monitorTip;
  stepNumberEl.textContent = stepIndex.toString();
}

function drawUsageChart(currentIndex) {
  const usedCounts = STEPS.map((s) => s.usedBlocks.length);
  const width = 380;
  const height = 200;
  usageChartEl.innerHTML = "";

  const maxUsed = Math.max(...usedCounts) || 1;
  const stepCount = STEPS.length;
  const margin = { left: 34, right: 10, top: 16, bottom: 24 };
  const chartWidth = width - margin.left - margin.right;
  const chartHeight = height - margin.top - margin.bottom;

  function xForStep(stepIdx) {
    if (stepCount === 1) return margin.left + chartWidth / 2;
    return margin.left + (chartWidth * stepIdx) / (stepCount - 1);
  }

  function yForUsed(used) {
    const ratio = used / maxUsed;
    return margin.top + chartHeight * (1 - ratio);
  }

  for (let i = 0; i <= 4; i++) {
    const y = margin.top + (chartHeight * i) / 4;
    const grid = document.createElementNS("http://www.w3.org/2000/svg", "line");
    grid.setAttribute("x1", margin.left);
    grid.setAttribute("y1", y);
    grid.setAttribute("x2", margin.left + chartWidth);
    grid.setAttribute("y2", y);
    grid.setAttribute("stroke", "#111827");
    grid.setAttribute("stroke-width", "0.8");
    usageChartEl.appendChild(grid);
  }

  const axisX = document.createElementNS("http://www.w3.org/2000/svg", "line");
  axisX.setAttribute("x1", margin.left);
  axisX.setAttribute("y1", margin.top + chartHeight);
  axisX.setAttribute("x2", margin.left + chartWidth);
  axisX.setAttribute("y2", margin.top + chartHeight);
  axisX.setAttribute("stroke", "#4b5563");
  axisX.setAttribute("stroke-width", "1");
  usageChartEl.appendChild(axisX);

  const axisY = document.createElementNS("http://www.w3.org/2000/svg", "line");
  axisY.setAttribute("x1", margin.left);
  axisY.setAttribute("y1", margin.top);
  axisY.setAttribute("x2", margin.left);
  axisY.setAttribute("y2", margin.top + chartHeight);
  axisY.setAttribute("stroke", "#4b5563");
  axisY.setAttribute("stroke-width", "1");
  usageChartEl.appendChild(axisY);

  STEPS.forEach((_, idx) => {
    const x = xForStep(idx);
    const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
    label.setAttribute("x", x);
    label.setAttribute("y", margin.top + chartHeight + 14);
    label.setAttribute("text-anchor", "middle");
    label.setAttribute("font-size", "9");
    label.setAttribute("fill", "#9ca3af");
    label.textContent = idx.toString();
    usageChartEl.appendChild(label);
  });

  const peakLabel = document.createElementNS("http://www.w3.org/2000/svg", "text");
  peakLabel.setAttribute("x", margin.left - 6);
  peakLabel.setAttribute("y", margin.top - 4);
  peakLabel.setAttribute("text-anchor", "end");
  peakLabel.setAttribute("font-size", "9");
  peakLabel.setAttribute("fill", "#9ca3af");
  peakLabel.textContent = `${maxUsed} blocks (peak)`;
  usageChartEl.appendChild(peakLabel);

  let pathData = "";
  usedCounts.forEach((used, idx) => {
    const x = xForStep(idx);
    const y = yForUsed(used);
    pathData += (idx === 0 ? "M" : "L") + x + " " + y + " ";
  });

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData.trim());
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#38bdf8");
  path.setAttribute("stroke-width", "2");
  usageChartEl.appendChild(path);

  usedCounts.forEach((used, idx) => {
    const x = xForStep(idx);
    const y = yForUsed(used);
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("r", idx === currentIndex ? 6 : 4);
    circle.setAttribute("fill", idx === currentIndex ? "#0ea5e9" : "#1e40af");
    usageChartEl.appendChild(circle);
  });
}

function renderStep(stepIndex) {
  sliderEl.value = stepIndex;
  currentStepIndex = stepIndex;
  renderMemoryBlocks(stepIndex);
  renderAnnotations(stepIndex);
  drawUsageChart(stepIndex);
}

function goToPrev() {
  const next = Math.max(0, currentStepIndex - 1);
  renderStep(next);
}

function goToNext() {
  const next = Math.min(STEPS.length - 1, currentStepIndex + 1);
  renderStep(next);
}

function startPlay() {
  if (playInterval != null) return;
  playInterval = setInterval(() => {
    let next = currentStepIndex + 1;
    if (next >= STEPS.length) next = 0;
    renderStep(next);
  }, 1100);
}

function pausePlay() {
  if (playInterval != null) {
    clearInterval(playInterval);
    playInterval = null;
  }
}

function resetSimulation() {
  pausePlay();
  renderStep(0);
}

sliderEl.addEventListener("input", (e) => {
  const value = parseInt(e.target.value, 10) || 0;
  renderStep(value);
});

btnPrev.addEventListener("click", goToPrev);
btnNext.addEventListener("click", goToNext);
btnPlay.addEventListener("click", startPlay);
btnPause.addEventListener("click", pausePlay);
btnReset.addEventListener("click", resetSimulation);

initMemoryGrid();
renderStep(0);
