// State toggle switch for filtering letter list items
let isExpanded = false;

function processText() {
    const textInput = document.getElementById("textAreaInput").value;
    const excludeSpaces = document.getElementById("excludeSpaces").checked;
    const setLimit = document.getElementById("setLimit").checked;
    const limitInput = document.getElementById("limitInput");
    const warningBanner = document.getElementById("warningBanner");
    const textAreaElement = document.getElementById("textAreaInput");

    // 1. Calculate Standard Document Metrics
    let charCount = textInput.length;
    if (excludeSpaces) {
        charCount = textInput.replace(/\s/g, "").length;
    }

    const words = textInput.trim().split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    const sentences = textInput.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const sentenceCount = sentences.length;

    const readingTimeMins = Math.ceil(wordCount / 200);
    const readingTimeStr = wordCount === 0 ? "<1 minute" : (readingTimeMins <= 1 ? "<1 minute" : `${readingTimeMins} minutes`);

    // 2. Bound Constraints Warnings Check
    if (setLimit && limitInput.value) {
        const maxThreshold = parseInt(limitInput.value, 10);
        if (charCount > maxThreshold) {
            warningBanner.classList.remove("hidden");
            textAreaElement.classList.add("input-error");
        } else {
            warningBanner.classList.add("hidden");
            textAreaElement.classList.remove("input-error");
        }
    } else {
        warningBanner.classList.add("hidden");
        textAreaElement.classList.remove("input-error");
    }

    // 3. Update DOM Text Content Values
    document.getElementById("charCount").innerText = charCount;
    document.getElementById("wordCount").innerText = wordCount;
    document.getElementById("sentenceCount").innerText = sentenceCount < 10 && sentenceCount > 0 ? `0${sentenceCount}` : sentenceCount;
    document.getElementById("readingTime").innerText = readingTimeStr;

    // 4. Calculate Density Maps
    renderLetterDensity(textInput);
}

function renderLetterDensity(text) {
    const letterCounts = {};
    let totalAlphaChars = 0;

    // Parse frequencies for alphabetical characters
    for (let char of text.toUpperCase()) {
        if (char >= 'A' && char <= 'Z') {
            letterCounts[char] = (letterCounts[char] || 0) + 1;
            totalAlphaChars++;
        }
    }

    const sortedLetters = Object.entries(letterCounts).sort((a, b) => b[1] - a[1]);
    const listContainer = document.getElementById("letterDensityList");
    const seeMoreBtn = document.getElementById("seeMoreBtn");
    
    listContainer.innerHTML = "";

    if (sortedLetters.length === 0) {
        listContainer.innerHTML = `<li style="color: var(--text-secondary); font-style: italic;">No characters entered yet</li>`;
        seeMoreBtn.classList.add("hidden");
        return;
    }

    // Split items conditionally based on the "See more / See less" toggle choice state
    const displayLimit = isExpanded ? sortedLetters.length : 5;
    const itemsToRender = sortedLetters.slice(0, displayLimit);

    // Show button only if there are more than 5 distinct character classes
    if (sortedLetters.length > 5) {
        seeMoreBtn.classList.remove("hidden");
    } else {
        seeMoreBtn.classList.add("hidden");
    }

    // Build the structural bar graphs dynamically
    itemsToRender.forEach(([letter, count]) => {
        const percentage = ((count / totalAlphaChars) * 100).toFixed(2);

        const li = document.createElement("li");
        li.className = "density-row";

        const charSpan = document.createElement("span");
        charSpan.className = "density-char";
        charSpan.innerText = letter;

        const progressContainer = document.createElement("div");
        progressContainer.className = "progress-container";

        const progressFill = document.createElement("div");
        progressFill.className = "progress-fill";
        progressFill.style.width = `${percentage}%`;
        progressContainer.appendChild(progressFill);

        const statsSpan = document.createElement("span");
        statsSpan.className = "density-stats";
        statsSpan.innerText = `${count} (${percentage}%)`;

        li.appendChild(charSpan);
        li.appendChild(progressContainer);
        li.appendChild(statsSpan);
        listContainer.appendChild(li);
    });
}

function toggleDensityView() {
    const seeMoreBtn = document.getElementById("seeMoreBtn");
    isExpanded = !isExpanded;
    
    if (isExpanded) {
        seeMoreBtn.querySelector("span").innerText = "See less";
        seeMoreBtn.classList.add("expanded");
    } else {
        seeMoreBtn.querySelector("span").innerText = "See more";
        seeMoreBtn.classList.remove("expanded");
    }
    
    // Refresh display view map
    const textInput = document.getElementById("textAreaInput").value;
    renderLetterDensity(textInput);
}

function toggleLimitField() {
    const setLimit = document.getElementById("setLimit").checked;
    const limitInput = document.getElementById("limitInput");
    
    if (setLimit) {
        limitInput.classList.remove("hidden");
        limitInput.focus();
    } else {
        limitInput.classList.add("hidden");
        limitInput.value = "";
    }
    processText();
}

function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById("themeIcon");
    const logoImg = document.getElementById("logoImg");
    
    body.classList.toggle("light-theme");
    
    if (body.classList.contains("light-theme")) {
        themeIcon.src = "./assets/images/icon-moon.svg";
        logoImg.src = "./assets/images/logo-light-theme.svg";
    } else {
        themeIcon.src = "./assets/images/icon-sun.svg";
        logoImg.src = "./assets/images/logo-dark-theme.svg";
    }
}