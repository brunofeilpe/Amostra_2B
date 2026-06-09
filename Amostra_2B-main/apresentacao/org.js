document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("calculator-form");
    const calcType = document.getElementById("calc-type");
    const dynamicFields = document.getElementById("dynamic-fields");
    const resultBox = document.getElementById("result");
    const subtitle = document.getElementById("subtitle");

    if (!form || !calcType || !dynamicFields || !resultBox || !subtitle) {
        console.error("Elementos da interface não encontrados.");
        return;
    }

    const labels = {
        sum: "Soma",
        subtract: "Subtração",
        multiply: "Multiplicação",
        divide: "Divisão",
        bhaskara: "Bhaskara",
        hypotenuse: "Hipotenusa",
        electrical: "Grandezas elétricas",
        physics: "Física",
        progression: "Progressões matemáticas",
        log: "Logaritmo",
        finance: "Cálculos financeiros"
    };

    const financeOptions = {
        JS: {
            title: "Juros Simples",
            fields: [
                { name: "capital", label: "Capital inicial", type: "number" },
                { name: "taxa", label: "Taxa (ex: 0.05)", type: "number" },
                { name: "tempo", label: "Tempo", type: "number" }
            ]
        },
        MS: {
            title: "Montante Simples",
            fields: [
                { name: "capital", label: "Capital inicial", type: "number" },
                { name: "taxa", label: "Taxa (ex: 0.05)", type: "number" },
                { name: "tempo", label: "Tempo", type: "number" }
            ]
        },
        JC: {
            title: "Juros Compostos",
            fields: [
                { name: "capital", label: "Capital inicial", type: "number" },
                { name: "taxa", label: "Taxa (ex: 0.05)", type: "number" },
                { name: "tempo", label: "Tempo", type: "number" }
            ]
        },
        MC: {
            title: "Montante Composto",
            fields: [
                { name: "capital", label: "Capital inicial", type: "number" },
                { name: "taxa", label: "Taxa (ex: 0.05)", type: "number" },
                { name: "tempo", label: "Tempo", type: "number" }
            ]
        },
        TJ: {
            title: "Taxa de Juros",
            fields: [
                { name: "juros", label: "Juros", type: "number" },
                { name: "capital", label: "Capital", type: "number" },
                { name: "tempo", label: "Tempo", type: "number" }
            ]
        },
        TP: {
            title: "Tempo",
            fields: [
                { name: "juros", label: "Juros", type: "number" },
                { name: "capital", label: "Capital", type: "number" },
                { name: "taxa", label: "Taxa (ex: 0.05)", type: "number" }
            ]
        },
        DS: {
            title: "Desconto Simples",
            fields: [
                { name: "nominal", label: "Valor nominal", type: "number" },
                { name: "taxa", label: "Taxa (ex: 0.05)", type: "number" },
                { name: "tempo", label: "Tempo", type: "number" }
            ]
        },
        PR: {
            title: "Parcela (PRICE)",
            fields: [
                { name: "valor", label: "Valor financiado", type: "number" },
                { name: "taxa", label: "Taxa (ex: 0.05)", type: "number" },
                { name: "parcelas", label: "Número de parcelas", type: "number" }
            ]
        },
        VP: {
            title: "Valor Presente",
            fields: [
                { name: "futuro", label: "Valor futuro", type: "number" },
                { name: "taxa", label: "Taxa (ex: 0.05)", type: "number" },
                { name: "tempo", label: "Tempo", type: "number" }
            ]
        },
        VF: {
            title: "Valor Futuro",
            fields: [
                { name: "presente", label: "Valor presente", type: "number" },
                { name: "taxa", label: "Taxa (ex: 0.05)", type: "number" },
                { name: "tempo", label: "Tempo", type: "number" }
            ]
        }
    };

    const electricalOptions = {
        R: {
            title: "Resistência",
            fields: [
                { name: "corrente", label: "Corrente (A) — use 0 se não souber", type: "number" },
                { name: "voltagem", label: "Voltagem (V) — use 0 se não souber", type: "number" },
                { name: "potencia", label: "Potência (W) — use 0 se não souber", type: "number" }
            ]
        },
        I: {
            title: "Corrente",
            fields: [
                { name: "potencia", label: "Potência (W) — use 0 se não souber", type: "number" },
                { name: "voltagem", label: "Voltagem (V) — use 0 se não souber", type: "number" },
                { name: "resistencia", label: "Resistência (Ω) — use 0 se não souber", type: "number" }
            ]
        },
        P: {
            title: "Potência",
            fields: [
                { name: "voltagem", label: "Voltagem (V) — use 0 se não souber", type: "number" },
                { name: "resistencia", label: "Resistência (Ω) — use 0 se não souber", type: "number" },
                { name: "corrente", label: "Corrente (A) — use 0 se não souber", type: "number" }
            ]
        },
        V: {
            title: "Voltagem",
            fields: [
                { name: "corrente", label: "Corrente (A) — use 0 se não souber", type: "number" },
                { name: "resistencia", label: "Resistência (Ω) — use 0 se não souber", type: "number" },
                { name: "potencia", label: "Potência (W) — use 0 se não souber", type: "number" }
            ]
        }
    };

    const physicsOptions = {
        velocity: {
            title: "Velocidade média",
            fields: [
                { name: "distancia", label: "Distância", type: "number" },
                { name: "tempo", label: "Tempo", type: "number" }
            ]
        },
        acceleration: {
            title: "Aceleração",
            fields: [
                { name: "velocidadeInicial", label: "Velocidade inicial", type: "number" },
                { name: "velocidadeFinal", label: "Velocidade final", type: "number" },
                { name: "tempo", label: "Tempo", type: "number" }
            ]
        },
        force: {
            title: "Força",
            fields: [
                { name: "massa", label: "Massa", type: "number" },
                { name: "aceleracao", label: "Aceleração", type: "number" }
            ]
        },
        work: {
            title: "Trabalho",
            fields: [
                { name: "forca", label: "Força", type: "number" },
                { name: "distancia", label: "Distância", type: "number" }
            ]
        },
        pressure: {
            title: "Pressão",
            fields: [
                { name: "forca", label: "Força", type: "number" },
                { name: "area", label: "Área", type: "number" }
            ]
        },
        density: {
            title: "Densidade",
            fields: [
                { name: "massa", label: "Massa", type: "number" },
                { name: "volume", label: "Volume", type: "number" }
            ]
        },
        power: {
            title: "Potência física",
            fields: [
                { name: "trabalho", label: "Trabalho", type: "number" },
                { name: "tempo", label: "Tempo", type: "number" }
            ]
        },
        kinetic: {
            title: "Energia cinética",
            fields: [
                { name: "massa", label: "Massa", type: "number" },
                { name: "velocidade", label: "Velocidade", type: "number" }
            ]
        }
    };

    const progressionOptions = {
        paTerm: {
            title: "PA - termo geral",
            fields: [
                { name: "a1", label: "Primeiro termo", type: "number" },
                { name: "r", label: "Razão", type: "number" },
                { name: "n", label: "Número do termo", type: "number" }
            ]
        },
        paSum: {
            title: "PA - soma dos termos",
            fields: [
                { name: "a1", label: "Primeiro termo", type: "number" },
                { name: "r", label: "Razão", type: "number" },
                { name: "n", label: "Quantidade de termos", type: "number" }
            ]
        },
        pgTerm: {
            title: "PG - termo geral",
            fields: [
                { name: "a1", label: "Primeiro termo", type: "number" },
                { name: "q", label: "Razão", type: "number" },
                { name: "n", label: "Número do termo", type: "number" }
            ]
        },
        pgSum: {
            title: "PG - soma finita",
            fields: [
                { name: "a1", label: "Primeiro termo", type: "number" },
                { name: "q", label: "Razão", type: "number" },
                { name: "n", label: "Quantidade de termos", type: "number" }
            ]
        },
        pgInfinite: {
            title: "PG - soma infinita",
            fields: [
                { name: "a1", label: "Primeiro termo", type: "number" },
                { name: "q", label: "Razão", type: "number" }
            ]
        }
    };

    function numberInput(name, label, placeholder = "", step = "any") {
        return `
            <label class="field">
                <span>${label}</span>
                <input name="${name}" type="number" step="${step}" placeholder="${placeholder}">
            </label>
        `;
    }

    function textInput(name, label, placeholder = "") {
        return `
            <label class="field">
                <span>${label}</span>
                <input name="${name}" type="text" placeholder="${placeholder}">
            </label>
        `;
    }

    function selectInput(name, label, options) {
        return `
            <label class="field">
                <span>${label}</span>
                <select name="${name}">
                    ${options.map((option) => `<option value="${option.value}">${option.label}</option>`).join("")}
                </select>
            </label>
        `;
    }

    function renderFieldSet(html, hint = "") {
        dynamicFields.innerHTML = `
            <div class="field-grid">
                ${html}
            </div>
            ${hint ? `<p class="hint">${hint}</p>` : ""}
        `;
    }

    function renderFields() {
        resultBox.textContent = "";
        const type = calcType.value;
        subtitle.textContent = labels[type] || "Calculadora";

        if (type === "finance") {
            const financeType = form.elements.financeType?.value || "JS";
            const config = financeOptions[financeType];
            renderFieldSet(
                [
                    selectInput(
                        "financeType",
                        "Cálculo financeiro",
                        Object.entries(financeOptions).map(([value, configItem]) => ({
                            value,
                            label: `${value} — ${configItem.title}`
                        }))
                    ),
                    ...config.fields.map((field) => numberInput(field.name, field.label))
                ].join(""),
                "Use valores decimais com ponto, por exemplo 0.05 para 5%."
            );
            return;
        }

        if (type === "electrical") {
            const electricalType = form.elements.electricalType?.value || "R";
            const config = electricalOptions[electricalType];
            renderFieldSet(
                [
                    selectInput(
                        "electricalType",
                        "Grandeza desejada",
                        Object.entries(electricalOptions).map(([value, configItem]) => ({
                            value,
                            label: `${value} — ${configItem.title}`
                        }))
                    ),
                    ...config.fields.map((field) => numberInput(field.name, field.label, "0"))
                ].join(""),
                "Coloque 0 no campo que deve ser calculado."
            );
            return;
        }

        if (type === "physics") {
            const physicsType = form.elements.physicsType?.value || "velocity";
            const config = physicsOptions[physicsType];
            renderFieldSet(
                [
                    selectInput(
                        "physicsType",
                        "Fórmula física",
                        Object.entries(physicsOptions).map(([value, configItem]) => ({
                            value,
                            label: `${value} — ${configItem.title}`
                        }))
                    ),
                    ...config.fields.map((field) => numberInput(field.name, field.label))
                ].join(""),
                "As fórmulas físicas foram organizadas para uso direto na tela."
            );
            return;
        }

        if (type === "progression") {
            const progressionType = form.elements.progressionType?.value || "paTerm";
            const config = progressionOptions[progressionType];
            renderFieldSet(
                [
                    selectInput(
                        "progressionType",
                        "Tipo de progressão",
                        Object.entries(progressionOptions).map(([value, configItem]) => ({
                            value,
                            label: `${value} — ${configItem.title}`
                        }))
                    ),
                    ...config.fields.map((field) => numberInput(field.name, field.label))
                ].join(""),
                "PA e PG usam fórmulas de termo e soma."
            );
            return;
        }

        if (type === "log") {
            renderFieldSet(
                [
                    textInput("base", "Base do logaritmo", "Digite 10, 2 ou e"),
                    numberInput("logaritmando", "Logaritmando", "", "any")
                ].join(""),
                "Para logaritmo natural, use a base e."
            );
            return;
        }

        if (type === "bhaskara") {
            renderFieldSet(
                [
                    numberInput("a", "Coeficiente A"),
                    numberInput("b", "Coeficiente B"),
                    numberInput("c", "Coeficiente C")
                ].join(""),
                "A fórmula retorna as duas raízes, quando existem."
            );
            return;
        }

        if (type === "hypotenuse") {
            renderFieldSet(
                [
                    numberInput("cateto1", "Primeiro cateto"),
                    numberInput("cateto2", "Segundo cateto")
                ].join(""),
                "O resultado é calculado por Pitágoras."
            );
            return;
        }

        if (type === "sum" || type === "subtract") {
            renderFieldSet(
                [
                    textInput("numbers", "Números", "Ex: 1, 2, 3, 4")
                ].join(""),
                type === "sum"
                    ? "Separe os valores por vírgula, espaço ou quebra de linha."
                    : "A subtração é feita em sequência: primeiro número menos os demais."
            );
            return;
        }

        renderFieldSet(
            [
                numberInput("value1", "Primeiro número"),
                numberInput("value2", "Segundo número")
            ].join(""),
            type === "divide" ? "A divisão será feita como primeiro ÷ segundo." : ""
        );
    }

    function parseNumbers(rawValue) {
        return rawValue
            .split(/[\s,;]+/)
            .map((value) => Number(value))
            .filter((value) => !Number.isNaN(value));
    }

    function getFormValue(name) {
        const field = form.elements[name];
        if (!field) {
            return "";
        }
        return field.value;
    }

    function readNumber(name) {
        const value = Number(getFormValue(name));
        return Number.isNaN(value) ? null : value;
    }

    function formatNumber(value) {
        return Number(value).toLocaleString("pt-BR", { maximumFractionDigits: 10 });
    }

    function calculateFinance(operation) {
        const config = financeOptions[operation];
        const values = Object.fromEntries(config.fields.map((field) => [field.name, readNumber(field.name)]));

        if (Object.values(values).some((value) => value === null)) {
            return "Preencha todos os campos numéricos.";
        }

        const { capital, taxa, tempo, juros, nominal, valor, futuro, presente, parcelas } = values;

        switch (operation) {
            case "JS":
                return `Juros: ${formatNumber(capital * taxa * tempo)}`;
            case "MS":
                return `Montante: ${formatNumber(capital * (1 + taxa * tempo))}`;
            case "JC": {
                const montante = capital * (1 + taxa) ** tempo;
                return `Juros: ${formatNumber(montante - capital)}`;
            }
            case "MC":
                return `Montante: ${formatNumber(capital * (1 + taxa) ** tempo)}`;
            case "TJ":
                if (capital === 0 || tempo === 0) {
                    return "Capital e tempo devem ser diferentes de zero.";
                }
                return `Taxa: ${formatNumber(juros / (capital * tempo))}`;
            case "TP":
                if (capital === 0 || taxa === 0) {
                    return "Capital e taxa devem ser diferentes de zero.";
                }
                return `Tempo: ${formatNumber(juros / (capital * taxa))}`;
            case "DS":
                return `Desconto: ${formatNumber(nominal * taxa * tempo)}\nValor atual: ${formatNumber(nominal - nominal * taxa * tempo)}`;
            case "PR":
                if (taxa === 0) {
                    return "A taxa deve ser diferente de zero.";
                }
                return `Parcela: ${formatNumber((valor * taxa) / (1 - (1 + taxa) ** (-parcelas)))}`;
            case "VP":
                return `Valor presente: ${formatNumber(futuro / (1 + taxa) ** tempo)}`;
            case "VF":
                return `Valor futuro: ${formatNumber(presente * (1 + taxa) ** tempo)}`;
            default:
                return "Operação financeira inválida.";
        }
    }

    function calculateElectrical(operation) {
        const values = {
            corrente: readNumber("corrente"),
            voltagem: readNumber("voltagem"),
            potencia: readNumber("potencia"),
            resistencia: readNumber("resistencia")
        };

        if (Object.values(values).some((value) => value === null)) {
            return "Preencha todos os campos numéricos.";
        }

        const { corrente, voltagem, potencia, resistencia } = values;

        switch (operation) {
            case "R":
                if (potencia === 0) {
                    return `Resistência: ${formatNumber(voltagem / corrente)} Ω`;
                }
                if (corrente === 0) {
                    return `Resistência: ${formatNumber((voltagem ** 2) / potencia)} Ω`;
                }
                if (voltagem === 0) {
                    return `Resistência: ${formatNumber(potencia / (corrente ** 2))} Ω`;
                }
                return "Deixe um dos campos como 0 para calcular a resistência.";
            case "I":
                if (resistencia === 0) {
                    return `Corrente: ${formatNumber(potencia / voltagem)} A`;
                }
                if (voltagem === 0) {
                    return `Corrente: ${formatNumber(Math.sqrt(potencia / resistencia))} A`;
                }
                if (potencia === 0) {
                    return `Corrente: ${formatNumber(voltagem / resistencia)} A`;
                }
                return "Deixe um dos campos como 0 para calcular a corrente.";
            case "P":
                if (voltagem === 0) {
                    return `Potência: ${formatNumber((corrente ** 2) * resistencia)} W`;
                }
                if (resistencia === 0) {
                    return `Potência: ${formatNumber(voltagem * corrente)} W`;
                }
                if (corrente === 0) {
                    return `Potência: ${formatNumber((voltagem ** 2) / resistencia)} W`;
                }
                return "Deixe um dos campos como 0 para calcular a potência.";
            case "V":
                if (potencia === 0) {
                    return `Voltagem: ${formatNumber(resistencia * corrente)} V`;
                }
                if (corrente === 0) {
                    return `Voltagem: ${formatNumber(Math.sqrt(potencia * resistencia))} V`;
                }
                if (resistencia === 0) {
                    return `Voltagem: ${formatNumber(potencia / corrente)} V`;
                }
                return "Deixe um dos campos como 0 para calcular a voltagem.";
            default:
                return "Grandeza elétrica inválida.";
        }
    }

    function calculatePhysics(operation) {
        const values = {
            distancia: readNumber("distancia"),
            tempo: readNumber("tempo"),
            velocidadeInicial: readNumber("velocidadeInicial"),
            velocidadeFinal: readNumber("velocidadeFinal"),
            massa: readNumber("massa"),
            aceleracao: readNumber("aceleracao"),
            forca: readNumber("forca"),
            area: readNumber("area"),
            volume: readNumber("volume"),
            trabalho: readNumber("trabalho"),
            velocidade: readNumber("velocidade")
        };

        if (Object.values(values).some((value) => value === null)) {
            return "Preencha todos os campos numéricos.";
        }

        switch (operation) {
            case "velocity":
                if (values.tempo === 0) {
                    return "O tempo deve ser diferente de zero.";
                }
                return `Velocidade média: ${formatNumber(values.distancia / values.tempo)} m/s`;
            case "acceleration":
                if (values.tempo === 0) {
                    return "O tempo deve ser diferente de zero.";
                }
                return `Aceleração: ${formatNumber((values.velocidadeFinal - values.velocidadeInicial) / values.tempo)} m/s²`;
            case "force":
                return `Força: ${formatNumber(values.massa * values.aceleracao)} N`;
            case "work":
                return `Trabalho: ${formatNumber(values.forca * values.distancia)} J`;
            case "pressure":
                if (values.area === 0) {
                    return "A área deve ser diferente de zero.";
                }
                return `Pressão: ${formatNumber(values.forca / values.area)} Pa`;
            case "density":
                if (values.volume === 0) {
                    return "O volume deve ser diferente de zero.";
                }
                return `Densidade: ${formatNumber(values.massa / values.volume)} kg/m³`;
            case "power":
                if (values.tempo === 0) {
                    return "O tempo deve ser diferente de zero.";
                }
                return `Potência: ${formatNumber(values.trabalho / values.tempo)} W`;
            case "kinetic":
                return `Energia cinética: ${formatNumber((values.massa * (values.velocidade ** 2)) / 2)} J`;
            default:
                return "Fórmula física inválida.";
        }
    }

    function calculateProgression(operation) {
        const values = {
            a1: readNumber("a1"),
            r: readNumber("r"),
            q: readNumber("q"),
            n: readNumber("n")
        };

        if (Object.values(values).some((value) => value === null)) {
            return "Preencha todos os campos numéricos.";
        }

        switch (operation) {
            case "paTerm":
                if (values.n === 0) {
                    return "O número do termo deve ser diferente de zero.";
                }
                return `PA termo geral: ${formatNumber(values.a1 + ((values.n - 1) * values.r))}`;
            case "paSum": {
                if (values.n === 0) {
                    return "A quantidade de termos deve ser diferente de zero.";
                }
                const an = values.a1 + ((values.n - 1) * values.r);
                return `PA soma: ${formatNumber((values.n * (values.a1 + an)) / 2)}`;
            }
            case "pgTerm":
                if (values.n === 0) {
                    return "O número do termo deve ser diferente de zero.";
                }
                return `PG termo geral: ${formatNumber(values.a1 * (values.q ** (values.n - 1)))}`;
            case "pgSum":
                if (values.n === 0) {
                    return "A quantidade de termos deve ser diferente de zero.";
                }
                if (values.q === 1) {
                    return `PG soma: ${formatNumber(values.a1 * values.n)}`;
                }
                return `PG soma: ${formatNumber((values.a1 * ((values.q ** values.n) - 1)) / (values.q - 1))}`;
            case "pgInfinite":
                if (Math.abs(values.q) >= 1) {
                    return "A razão precisa ter módulo menor que 1 para soma infinita.";
                }
                return `PG soma infinita: ${formatNumber(values.a1 / (1 - values.q))}`;
            default:
                return "Progressão inválida.";
        }
    }

    function calculateArithmetic(type) {
        if (type === "sum" || type === "subtract") {
            const numbers = parseNumbers(getFormValue("numbers"));
            if (numbers.length === 0) {
                return "Digite pelo menos um número.";
            }

            const total = type === "sum"
                ? numbers.reduce((accumulator, number) => accumulator + number, 0)
                : numbers.slice(1).reduce((accumulator, number) => accumulator - number, numbers[0]);

            return type === "sum"
                ? `Soma: ${formatNumber(total)}`
                : `Subtração: ${formatNumber(total)}`;
        }

        const first = readNumber("value1");
        const second = readNumber("value2");

        if (first === null || second === null) {
            return "Preencha os dois números.";
        }

        switch (type) {
            case "multiply":
                return `Multiplicação: ${formatNumber(first * second)}`;
            case "divide":
                if (second === 0) {
                    return "Não é possível dividir por zero.";
                }
                return `Divisão: ${formatNumber(first / second)}`;
            default:
                return "Operação inválida.";
        }
    }

    function calculateBhaskara() {
        const a = readNumber("a");
        const b = readNumber("b");
        const c = readNumber("c");

        if (a === null || b === null || c === null) {
            return "Preencha os três coeficientes.";
        }
        if (a === 0) {
            return "O coeficiente A deve ser diferente de zero.";
        }

        const delta = (b ** 2) - (4 * a * c);

        if (delta < 0) {
            return `Delta: ${formatNumber(delta)}. Não existem raízes reais.`;
        }

        const x1 = (-b + Math.sqrt(delta)) / (2 * a);
        const x2 = (-b - Math.sqrt(delta)) / (2 * a);

        return `x1: ${formatNumber(x1)} | x2: ${formatNumber(x2)}`;
    }

    function calculateHypotenuse() {
        const cateto1 = readNumber("cateto1");
        const cateto2 = readNumber("cateto2");

        if (cateto1 === null || cateto2 === null) {
            return "Preencha os dois catetos.";
        }

        return `Hipotenusa: ${formatNumber(Math.sqrt((cateto1 ** 2) + (cateto2 ** 2)))}`;
    }

    function calculateLog() {
        const baseInput = String(getFormValue("base")).trim().toLowerCase();
        const logaritmando = readNumber("logaritmando");

        if (logaritmando === null || logaritmando <= 0) {
            return "O logaritmando deve ser maior que zero.";
        }

        const base = baseInput === "e" ? Math.E : Number(baseInput);

        if (Number.isNaN(base) || base <= 0 || base === 1) {
            return "A base deve ser um número positivo diferente de 1 ou a letra e.";
        }

        const resultado = Math.log(logaritmando) / Math.log(base);
        return `log_${baseInput}(${logaritmando}) = ${formatNumber(resultado)}`;
    }

    function calculate() {
        const type = calcType.value;

        if (type === "finance") {
            const financeType = form.elements.financeType?.value || "JS";
            return calculateFinance(financeType);
        }

        if (type === "electrical") {
            const electricalType = form.elements.electricalType?.value || "R";
            return calculateElectrical(electricalType);
        }

        if (type === "physics") {
            const physicsType = form.elements.physicsType?.value || "velocity";
            return calculatePhysics(physicsType);
        }

        if (type === "progression") {
            const progressionType = form.elements.progressionType?.value || "paTerm";
            return calculateProgression(progressionType);
        }

        if (type === "log") {
            return calculateLog();
        }

        if (type === "bhaskara") {
            return calculateBhaskara();
        }

        if (type === "hypotenuse") {
            return calculateHypotenuse();
        }

        return calculateArithmetic(type);
    }

    calcType.addEventListener("change", renderFields);

    form.addEventListener("change", (event) => {
        if (
            event.target.name === "financeType" ||
            event.target.name === "electricalType" ||
            event.target.name === "physicsType" ||
            event.target.name === "progressionType"
        ) {
            renderFields();
        }
    });

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        resultBox.textContent = calculate();
    });

    renderFields();
});
