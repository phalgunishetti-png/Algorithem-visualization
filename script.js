let arr = [];
let speed = 500;

const barsContainer = document.getElementById("bars");
const stepsDiv = document.getElementById("steps");
const complexityDiv = document.getElementById("complexity");
const theoryDiv = document.getElementById("theory");
const codeDisplay = document.getElementById("codeDisplay");

document.getElementById("speed").addEventListener("input", e => {
    speed = e.target.value;
});

function generateBars() {
    const input = document.getElementById("arrayInput").value;
    arr = input.split(',').map(Number);

    barsContainer.innerHTML = "";
    stepsDiv.innerHTML = "";

    arr.forEach(value => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = value * 3 + "px";

        const label = document.createElement("span");
        bar.appendChild(label);

        barsContainer.appendChild(bar);
    });

    updateTheory();
}

/* THEORY + CODE */
function updateTheory() {
    const algo = document.getElementById("algorithm").value;

    if (algo === "bubble") {
        theoryDiv.innerHTML = `
        <b>Bubble Sort:</b><br>
        • Compare adjacent elements<br>
        • Swap if left > right<br>
        • Largest element moves to end each pass<br>
        <br>
        ✔ Easy to understand<br>
        ❌ Slow for large data
        `;
        complexityDiv.innerHTML = "Time Complexity: O(n²)";

        codeDisplay.textContent = `
for i in range(n):
  for j in range(n-i-1):
    if arr[j] > arr[j+1]:
      swap(arr[j], arr[j+1])
`;
    } else {
        theoryDiv.innerHTML = `
        <b>Quick Sort:</b><br>
        • Pick a pivot element<br>
        • Place smaller elements left, larger right<br>
        • Recursively sort both sides<br>
        <br>
        ✔ Very fast in practice<br>
        ❌ Slightly complex logic
        `;
        complexityDiv.innerHTML = "Time Complexity: O(n log n)";

        codeDisplay.textContent = `
quickSort(arr, low, high):
  if low < high:
    pi = partition(arr)
    quickSort(left)
    quickSort(right)
`;
    }
}

function sleep() {
    return new Promise(r => setTimeout(r, speed));
}

async function startSort() {
    const algo = document.getElementById("algorithm").value;

    if (algo === "bubble") {
        await bubbleSort();
    } else {
        await quickSort(0, arr.length - 1);
    }
}

function updateLabels(i, j) {
    let bars = document.getElementsByClassName("bar");

    for (let b of bars) b.children[0].innerText = "";

    if (bars[i]) bars[i].children[0].innerText = "i";
    if (bars[j]) bars[j].children[0].innerText = "j";
}

/* BUBBLE SORT */
async function bubbleSort() {
    let bars = document.getElementsByClassName("bar");

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {

            updateLabels(j, j+1);
            addStep(`Comparing ${arr[j]} and ${arr[j+1]}`);

            bars[j].style.background = "red";
            bars[j+1].style.background = "red";

            await sleep();

            if (arr[j] > arr[j+1]) {
                addStep(`Swapping ${arr[j]} and ${arr[j+1]}`);
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];

                bars[j].style.height = arr[j] * 3 + "px";
                bars[j+1].style.height = arr[j+1] * 3 + "px";
            }

            bars[j].style.background = "#00c6ff";
            bars[j+1].style.background = "#00c6ff";
        }
        bars[arr.length - i - 1].style.background = "green";
    }
}

/* QUICK SORT */
async function quickSort(low, high) {
    if (low < high) {
        let pi = await partition(low, high);
        await quickSort(low, pi - 1);
        await quickSort(pi + 1, high);
    }
}

async function partition(low, high) {
    let bars = document.getElementsByClassName("bar");
    let pivot = arr[high];
    let i = low - 1;

    addStep(`Pivot selected: ${pivot}`);

    for (let j = low; j < high; j++) {

        updateLabels(i, j);
        addStep(`Comparing ${arr[j]} with pivot ${pivot}`);

        bars[j].style.background = "red";
        await sleep();

        if (arr[j] < pivot) {
            i++;
            addStep(`Swapping ${arr[i]} and ${arr[j]}`);

            [arr[i], arr[j]] = [arr[j], arr[i]];

            bars[i].style.height = arr[i] * 3 + "px";
            bars[j].style.height = arr[j] * 3 + "px";
        }

        bars[j].style.background = "#00c6ff";
    }

    addStep(`Placing pivot in correct position`);

    [arr[i+1], arr[high]] = [arr[high], arr[i+1]];

    bars[i+1].style.height = arr[i+1] * 3 + "px";
    bars[high].style.height = arr[high] * 3 + "px";

    return i + 1;
}

function addStep(text) {
    const p = document.createElement("div");
    p.innerText = text;
    stepsDiv.appendChild(p);
    stepsDiv.scrollTop = stepsDiv.scrollHeight;
}