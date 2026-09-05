var allWords = "";
(async () => {
    var f = await fetch("Greek Dictionary TXT [Aug 2026].txt");
    var txt = await f.text();

    allWords = txt.split("\r\n");
    allWords = Object.assign({}, ...allWords.map(e => (e = e.split(" ="),
    {
        [e[0]]: {
            meaning: (e = e[1].replaceAll("\t", "").split("["), removePadding(e[0]?.split(" # ")[0]) || "[various]"),
            notes: e[0].split(" # ")[1] || "",
            alternateUsages: (e[1]?.split("]")[0]?.split(" | ")?.map(u => (u = u.split(": "), { usage: u[0], meaning: u[1].split(" # ")[0], notes: u[1].split(" # ")[1] || "" })) || []) || {}
        }
    })));
})();

/* Object.assign({},
...(e[1]?.split("]")[0]?.split(" | ")
?.map(u => (u = u.split(": "), { [u[0]]: { meaning: u[1].split(" # ")[0], notes: u[1].split(" # ")[1] || "" } })) || []) || {}) */

function displayWord(word) {
    if (!Object.keys(allWords).includes(word)) return false;

    word = word.toLowerCase();

    const defCard = Utility.qs(".def-card");

    Utility.qs(".word").textContent = word.substring(0, 1).toUpperCase() + word.slice(1);
    Utility.qs(".meaning-header").textContent = allWords[word].meaning;
    defCard.innerHTML = "";
    defCard.append(document.createTextNode((allWords[word].notes || "") && Utility.qs(".def-card").append(document.createElement("hr"))));
    if (Object.keys(allWords[word].alternateUsages).length) {
        const altUses = document.createElement("div");
        const altUsesHeader = document.createElement("h4");


        altUses.classList.add("alt-uses");
        altUsesHeader.textContent = "Alternate Usages";
        altUsesHeader.classList.add("alt-uses-head");
        altUses.append(altUsesHeader);

        allWords[word].alternateUsages.forEach(e => {
            const usage = document.createElement("span");
            const meaning = document.createElement("span");
            usage.textContent = e.usage;
            usage.classList.add("usage");
            meaning.textContent = e.meaning;
            meaning.classList.add("meaning");
            altUses.append(usage, meaning, document.createElement("br"));
        });

        defCard.append(altUses);

        document.fonts.ready.then(() => {
            for (let meaning of defCard.querySelectorAll("span.meaning")) {
                const box = meaning.getBoundingClientRect();
                const fontSize = fitTextInContainer(meaning.textContent, "Postea", box.width, box.height);
                fontSize < 14 && (meaning.style.fontSize = fontSize + "px");
            }
        });


        // Utility.qs(".def-card").innerHTML += "<div class=\"alt-uses\"><h4 class=\"alt-uses-head\">Alternate Usages</h4>" + allWords[word].alternateUsages.map(e => `<span>${e.usage}:</span><span>${e.meaning}</span>`).join("<br>") + "</div>";
        allWords[word].notes && defCard.append(document.createElement("hr"));
    }
    // (document.createTextNode("Alternate Usages:\n" + Object.entries(allWords[word].alternateUsages || {}).map(e => `${e[0]}:${stringRep("\t", 5 - (e[0].length + 1) / 4)} ${e[1].meaning}`).join("\n")));
}

const stringRep = (e, i, spl = "") => {
    var res = [];
    for (let x = 0; x < i; x++) res.push(e);
    return res.join(spl);
}

const removePadding = string => {
    while (string.startsWith(" ")) string = string.slice(1);
    while (string.endsWith(" ")) string = string.slice(0, -1);
    return string;
}

function fitTextInContainer(text, fontName, containerWidth, containerHeight) {
    // 1. Create an offscreen canvas to perform the math
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // 2. Set a large baseline font size to ensure precision
    const baselineSize = 100;
    ctx.font = `${baselineSize}px ${fontName}`;

    // 3. Measure the exact geometry of the specific string
    const metrics = ctx.measureText(text);

    // Width is straightforward
    const actualWidthAtBaseline = metrics.width;

    // Height requires measuring the actual bounding box of the glyphs
    const actualHeightAtBaseline = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    // console.log(actualWidthAtBaseline, actualHeightAtBaseline);

    // 4. Calculate the maximum font size that will fit the width and height restrictions
    const maxFontByWidth = (containerWidth / actualWidthAtBaseline) * baselineSize;
    const maxFontByHeight = (containerHeight / actualHeightAtBaseline) * baselineSize;

    // 5. Return the smaller of the two to guarantee it fits both dimensions
    return Math.min(maxFontByWidth, maxFontByHeight);
}