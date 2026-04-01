let arr = [];
let speed = 500;

const barsContainer = document.getElementById("bars");
const stepsDiv = document.getElementById("steps");
const complexityDiv = document.getElementById("complexity");
const theoryDiv = document.getElementById("theory");
const codeDisplay = document.getElementById("codeDisplay");
const targetInput = document.getElementById("targetInput");

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

function updateTheory() {
    const algo = document.getElementById("algorithm").value;

    if (algo === "bubble") {
        targetInput.style.display = "none";
        theoryDiv.innerHTML = "<b>Bubble Sort:</b> Bubble sort repeatedly Compares adjacent elements and swaps them if they are in the wrong order.This process continues for multiple passes until the entire list is sorted.";
        complexityDiv.innerHTML = "Time Complexity: O(n²)";
        codeDisplay.textContent = "for i in range(n):\n  for j in range(n-i-1):\n    if arr[j] > arr[j+1]: swap";
    } else if (algo === "quick") {
        targetInput.style.display = "none";
        theoryDiv.innerHTML = "<b>Quick Sort:</b> Quick sort works by selecting a pivot element,then partitioning the array so elements smaller go left and larger go right.It then recursively applies the same process to the left and right subarrays until the array is sorted.";
        complexityDiv.innerHTML = "Time Complexity: O(n log n)";
        codeDisplay.textContent = "quickSort(arr, low, high):\n  if low < high:\n    pi = partition(arr)\n    quickSort(left)\n    quickSort(right)";
    } else if (algo === "dp") {
        targetInput.style.display = "block";
        theoryDiv.innerHTML = "<b>Dynamic Programming (Subset Sum):</b>DP is an optimization technique that solves complex problems by breaking them into smaller overlapping subproblems and storing their results, and it Build table of achievable sums.";
        complexityDiv.innerHTML = "Time Complexity: O(n * target)";
        codeDisplay.textContent = "subsetSum(arr, target):\n  dp[0][0] = true\n  for i in 1..n:\n    for t in 0..target:\n      dp[i][t] = dp[i-1][t] OR dp[i-1][t-arr[i]]";
    } else if (algo === "graph") {
        targetInput.style.display = "none";
        theoryDiv.innerHTML = "<b>Graph Traversal (BFS):</b> BFS explores a graph level by level,visiting all neighbours of a node before moving deeper.";
        complexityDiv.innerHTML = "Time Complexity: O(V+E)";
        codeDisplay.textContent = "BFS(graph, start):\n  queue = [start]\n  while queue not empty:\n    node = dequeue()\n    visit(node)\n    enqueue(neighbors)";
    }
}

function sleep() {
    return new Promise(r => setTimeout(r, speed));
}

async function startSort() {
    const algo = document.getElementById("algorithm").value;
    if (algo === "bubble") await bubbleSort();
    else if (algo === "quick") await quickSort(0, arr.length - 1);
    else if (algo === "dp") await dpSubsetSum();
    else if (algo === "graph") await bfsTraversal();
}

/* Bubble Sort */
async function bubbleSort() {
    let bars = document.getElementsByClassName("bar");
    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
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

/* Quick Sort */
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

/* DP Subset Sum */
async function dpSubsetSum() {
    const target = parseInt(document.getElementById("targetInput").value);
    let n = arr.length;
    let dp = Array.from({length: n+1}, () => Array(target+1).fill(false));
    dp[0][0] = true;
    barsContainer.innerHTML = "";
    for (let i = 1; i <= n; i++) {
        for (let t = 0; t <= target; t++) {
            dp[i][t] = dp[i-1][t] || (t >= arr[i-1] && dp[i-1][t - arr[i-1]]);
            if (dp[i][t]) {
                addStep(`Sum ${t} achievable using first ${i} numbers`);
                const bar = document.createElement("div");
                bar.classList.add("bar");
                bar.style.height = t * 2 + "px";
                bar.style.background = "#ffa500";
                bar.innerText = t;
                barsContainer.appendChild(bar);
                await sleep();
            }
        }
    }
    if (dp[n][target]) addStep(`✅ Target sum ${target} is achievable`);
    else addStep(`❌ Target sum ${target} is NOT achievable`);
}

/* Graph Traversal (BFS) */
async function bfsTraversal() {
    let graph = {0:[1,2],1:[3],2:[4],3:[],4:[]};
    let visited = new Set();
    let queue = [0];
    barsContainer.innerHTML = "";
    Object.keys(graph).forEach(node => {
        const bar = document.createElement("div");
        bar.classList.add("bar");
        bar.style.height = 50 + "px";
        bar.innerText = node;
        bar.style.background = "#00c6ff";
        barsContainer.appendChild(bar);
    });
    let bars = document.getElementsByClassName("bar");
    while (queue.length > 0) {
        let node = queue.shift();
        if (!visited.has(node)) {
            visited.add(node);
            addStep(`Visited node ${node}`);
            bars[node].style.background = "green";
            await sleep();
            for (let neighbor of graph[node]) queue.push(neighbor);
        }
    }
}

function addStep(text) {
    const p = document.createElement("div");
    p.innerText = text;
    stepsDiv.appendChild(p);
    stepsDiv.scrollTop = stepsDiv.scrollHeight;
}