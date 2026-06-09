const display = document.getElementById("display");

function appendToDisplay(value) {
    if (!display) {
        return;
    }

    display.value += value;
    display.scrollLeft = display.scrollWidth;
}

function clearDisplay() {
    if (!display) {
        return;
    }

    display.value = "";
}

function deleteLast() {
    if (!display) {
        return;
    }

    display.value = display.value.slice(0, -1);
}

function calcular() {
    if (!display) {
        return;
    }

    try {
        let expression = display.value.replace(/,/g, "");
        expression = expression.replace(/\^/g, "**");
        expression = expression.replace(/√\(/g, "Math.sqrt(");
        expression = expression.replace(/√(\d+(\.\d+)?)/g, "Math.sqrt($1)");
        expression = expression.replace(/%(\d+(\.\d+)?)/g, "/100*$1");
        expression = expression.replace(/%/g, "/100");

        const result = eval(expression);

        if (typeof result !== "number" || Number.isNaN(result) || !Number.isFinite(result)) {
            display.value = "Erro";
            return;
        }

        display.value = Number(result).toLocaleString("en-US", { maximumFractionDigits: 10 });
    } catch (error) {
        display.value = "Erro";
    }
}

document.addEventListener("keydown", (event) => {
    if (!display) {
        return;
    }

    const { key } = event;

    if (/^[0-9]$/.test(key) || ["+", "-", "*", "/", ".", "(", ")", "%"].includes(key)) {
        event.preventDefault();
        appendToDisplay(key);
        return;
    }

    if (key === "^") {
        event.preventDefault();
        appendToDisplay("^");
        return;
    }

    if (key === "Enter") {
        event.preventDefault();
        calcular();
        return;
    }

    if (key === "Escape") {
        event.preventDefault();
        clearDisplay();
        return;
    }

    if (key === "Backspace") {
        event.preventDefault();
        deleteLast();
    }
});
