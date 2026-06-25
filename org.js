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
        sum: "Soma", subtract: "Subtração", multiply: "Multiplicação", divide: "Divisão",
        bhaskara: "Bhaskara", hypotenuse: "Hipotenusa", electrical: "Grandezas elétricas",
        physics: "Física", progression: "Progressões matemáticas", log: "Logaritmo",
        finance: "Cálculos financeiros", geometry: "Geometria", engineering: "Engenharia"
    };

    const financeOptions = {
        JS:     { title: "Juros Simples",              fields: [{name:"capital",label:"Capital inicial"},{name:"taxa",label:"Taxa (ex: 0.05)"},{name:"tempo",label:"Tempo"}] },
        MS:     { title: "Montante Simples",           fields: [{name:"capital",label:"Capital inicial"},{name:"taxa",label:"Taxa (ex: 0.05)"},{name:"tempo",label:"Tempo"}] },
        JC:     { title: "Juros Compostos",            fields: [{name:"capital",label:"Capital inicial"},{name:"taxa",label:"Taxa (ex: 0.05)"},{name:"tempo",label:"Tempo"}] },
        MC:     { title: "Montante Composto",          fields: [{name:"capital",label:"Capital inicial"},{name:"taxa",label:"Taxa (ex: 0.05)"},{name:"tempo",label:"Tempo"}] },
        TJ:     { title: "Taxa de Juros Simples",      fields: [{name:"juros",label:"Juros"},{name:"capital",label:"Capital"},{name:"tempo",label:"Tempo"}] },
        TP:     { title: "Tempo (Juros Simples)",      fields: [{name:"juros",label:"Juros"},{name:"capital",label:"Capital"},{name:"taxa",label:"Taxa (ex: 0.05)"}] },
        DS:     { title: "Desconto Simples",           fields: [{name:"nominal",label:"Valor nominal"},{name:"taxa",label:"Taxa (ex: 0.05)"},{name:"tempo",label:"Tempo"}] },
        DC:     { title: "Desconto Composto",          fields: [{name:"nominal",label:"Valor nominal"},{name:"taxa",label:"Taxa (ex: 0.05)"},{name:"tempo",label:"Tempo"}] },
        PR:     { title: "Parcela (Tabela PRICE)",     fields: [{name:"valor",label:"Valor financiado"},{name:"taxa",label:"Taxa mensal (ex: 0.02)"},{name:"parcelas",label:"Nº de parcelas"}] },
        SAC:    { title: "Amortização SAC (1ª parcela)", fields: [{name:"valor",label:"Valor financiado"},{name:"taxa",label:"Taxa mensal (ex: 0.02)"},{name:"parcelas",label:"Nº de parcelas"}] },
        VP:     { title: "Valor Presente",             fields: [{name:"futuro",label:"Valor futuro"},{name:"taxa",label:"Taxa (ex: 0.05)"},{name:"tempo",label:"Tempo"}] },
        VF:     { title: "Valor Futuro",               fields: [{name:"presente",label:"Valor presente"},{name:"taxa",label:"Taxa (ex: 0.05)"},{name:"tempo",label:"Tempo"}] },
        ROI:    { title: "ROI — Retorno s/ investimento", fields: [{name:"ganho",label:"Ganho obtido"},{name:"custo",label:"Custo do investimento"}] },
        BREAK:  { title: "Ponto de Equilíbrio",        fields: [{name:"fixos",label:"Custos fixos"},{name:"preco",label:"Preço unitário"},{name:"variavel",label:"Custo variável unitário"}] },
        MARGEM: { title: "Margem de Lucro",            fields: [{name:"receita",label:"Receita"},{name:"custo",label:"Custo"}] },
        MARKUP: { title: "Markup",                     fields: [{name:"custo",label:"Custo do produto"},{name:"markup",label:"Markup (%)"}] },
        DEPSL:  { title: "Depreciação Linear",         fields: [{name:"valorInicial",label:"Valor inicial"},{name:"valorResidual",label:"Valor residual"},{name:"vidaUtil",label:"Vida útil (anos)"}] },
        LUCROB: { title: "Lucro Bruto",                fields: [{name:"receita",label:"Receita total"},{name:"cmv",label:"CMV (custo das mercadorias)"}] }
    };

    const electricalOptions = {
        R: { title: "Resistência", fields: [{name:"corrente",label:"Corrente (A) — 0 se não souber"},{name:"voltagem",label:"Voltagem (V) — 0 se não souber"},{name:"potencia",label:"Potência (W) — 0 se não souber"}] },
        I: { title: "Corrente",    fields: [{name:"potencia",label:"Potência (W) — 0 se não souber"},{name:"voltagem",label:"Voltagem (V) — 0 se não souber"},{name:"resistencia",label:"Resistência (Ω) — 0 se não souber"}] },
        P: { title: "Potência",    fields: [{name:"voltagem",label:"Voltagem (V) — 0 se não souber"},{name:"resistencia",label:"Resistência (Ω) — 0 se não souber"},{name:"corrente",label:"Corrente (A) — 0 se não souber"}] },
        V: { title: "Voltagem",    fields: [{name:"corrente",label:"Corrente (A) — 0 se não souber"},{name:"resistencia",label:"Resistência (Ω) — 0 se não souber"},{name:"potencia",label:"Potência (W) — 0 se não souber"}] }
    };

    const physicsOptions = {
        velocity:     { title: "Velocidade média",   fields: [{name:"distancia",label:"Distância (m)"},{name:"tempo",label:"Tempo (s)"}] },
        acceleration: { title: "Aceleração",          fields: [{name:"velocidadeInicial",label:"Vel. inicial (m/s)"},{name:"velocidadeFinal",label:"Vel. final (m/s)"},{name:"tempo",label:"Tempo (s)"}] },
        force:        { title: "Força (F = m·a)",     fields: [{name:"massa",label:"Massa (kg)"},{name:"aceleracao",label:"Aceleração (m/s²)"}] },
        work:         { title: "Trabalho",            fields: [{name:"forca",label:"Força (N)"},{name:"distancia",label:"Distância (m)"}] },
        pressure:     { title: "Pressão",             fields: [{name:"forca",label:"Força (N)"},{name:"area",label:"Área (m²)"}] },
        density:      { title: "Densidade",           fields: [{name:"massa",label:"Massa (kg)"},{name:"volume",label:"Volume (m³)"}] },
        power:        { title: "Potência física",     fields: [{name:"trabalho",label:"Trabalho (J)"},{name:"tempo",label:"Tempo (s)"}] },
        kinetic:      { title: "Energia cinética",    fields: [{name:"massa",label:"Massa (kg)"},{name:"velocidade",label:"Velocidade (m/s)"}] }
    };

    const progressionOptions = {
        paTerm:     { title: "PA — termo geral",   fields: [{name:"a1",label:"Primeiro termo"},{name:"r",label:"Razão"},{name:"n",label:"Número do termo"}] },
        paSum:      { title: "PA — soma",          fields: [{name:"a1",label:"Primeiro termo"},{name:"r",label:"Razão"},{name:"n",label:"Qtd. de termos"}] },
        pgTerm:     { title: "PG — termo geral",   fields: [{name:"a1",label:"Primeiro termo"},{name:"q",label:"Razão"},{name:"n",label:"Número do termo"}] },
        pgSum:      { title: "PG — soma finita",   fields: [{name:"a1",label:"Primeiro termo"},{name:"q",label:"Razão"},{name:"n",label:"Qtd. de termos"}] },
        pgInfinite: { title: "PG — soma infinita", fields: [{name:"a1",label:"Primeiro termo"},{name:"q",label:"Razão (|q| < 1)"}] }
    };

    const geometryOptions = {
        circleArea:      { title: "Círculo — Área e Circunferência",       fields: [{name:"raio",label:"Raio"}] },
        squareArea:      { title: "Quadrado — Área, Perímetro e Diagonal", fields: [{name:"lado",label:"Lado"}] },
        rectArea:        { title: "Retângulo — Área, Perímetro e Diagonal",fields: [{name:"base",label:"Base"},{name:"altura",label:"Altura"}] },
        triangleArea:    { title: "Triângulo — Área (base × altura)",      fields: [{name:"base",label:"Base"},{name:"altura",label:"Altura"}] },
        triangleHeron:   { title: "Triângulo — Área (Fórmula de Heron)",   fields: [{name:"ladoA",label:"Lado A"},{name:"ladoB",label:"Lado B"},{name:"ladoC",label:"Lado C"}] },
        trapezoid:       { title: "Trapézio — Área",                       fields: [{name:"baseMaior",label:"Base maior"},{name:"baseMenor",label:"Base menor"},{name:"altura",label:"Altura"}] },
        rhombus:         { title: "Losango — Área e Lado",                 fields: [{name:"d1",label:"Diagonal maior"},{name:"d2",label:"Diagonal menor"}] },
        regularPolygon:  { title: "Polígono Regular — Área e Perímetro",   fields: [{name:"lados",label:"Nº de lados"},{name:"lado",label:"Comprimento do lado"}] },
        ellipseArea:     { title: "Elipse — Área",                         fields: [{name:"semiEixoA",label:"Semi-eixo maior (a)"},{name:"semiEixoB",label:"Semi-eixo menor (b)"}] },
        sectorArea:      { title: "Setor Circular — Área e Arco",          fields: [{name:"raio",label:"Raio"},{name:"angulo",label:"Ângulo central (graus)"}] },
        sphereVol:       { title: "Esfera — Volume e Área",                fields: [{name:"raio",label:"Raio"}] },
        cubeVol:         { title: "Cubo — Volume, Área e Diagonal",        fields: [{name:"aresta",label:"Aresta"}] },
        boxVol:          { title: "Paralelepípedo — Volume e Área",        fields: [{name:"comprimento",label:"Comprimento"},{name:"largura",label:"Largura"},{name:"altura",label:"Altura"}] },
        cylinderVol:     { title: "Cilindro — Volume e Área",              fields: [{name:"raio",label:"Raio da base"},{name:"altura",label:"Altura"}] },
        coneVol:         { title: "Cone — Volume, Geratriz e Área",        fields: [{name:"raio",label:"Raio da base"},{name:"altura",label:"Altura"}] },
        pyramidVol:      { title: "Pirâmide — Volume (base quadrada)",     fields: [{name:"ladoBase",label:"Lado da base"},{name:"altura",label:"Altura"}] },
        torusVol:        { title: "Toro — Volume e Área",                  fields: [{name:"R",label:"Raio maior (R)"},{name:"r",label:"Raio do tubo (r)"}] }
    };

    const engineeringOptions = {
        tensao:           { title: "Tensão Normal σ = F/A",                  fields: [{name:"forca",label:"Força (N)"},{name:"area",label:"Área da seção (m²)"}] },
        deformacao:       { title: "Deformação ε = ΔL/L",                   fields: [{name:"deltaL",label:"Variação de comprimento (m)"},{name:"L",label:"Comprimento original (m)"}] },
        modElastico:      { title: "Módulo de Elasticidade E = σ/ε",        fields: [{name:"tensao",label:"Tensão (Pa)"},{name:"deformacao",label:"Deformação (adimensional)"}] },
        momentoFletor:    { title: "Tensão de Flexão σ = M·c/I",            fields: [{name:"momento",label:"Momento fletor (N·m)"},{name:"c",label:"Distância neutra-borda (m)"},{name:"inercia",label:"Momento de inércia (m⁴)"}] },
        cisalhamento:     { title: "Tensão de Cisalhamento τ = F/A",        fields: [{name:"forca",label:"Força cortante (N)"},{name:"area",label:"Área de corte (m²)"}] },
        torque:           { title: "Tensão de Torção τ = T·r/J",            fields: [{name:"torque",label:"Torque (N·m)"},{name:"raio",label:"Raio (m)"},{name:"J",label:"Momento polar de inércia (m⁴)"}] },
        flambagem:        { title: "Carga Crítica de Euler",                 fields: [{name:"E",label:"Módulo de elasticidade (Pa)"},{name:"I",label:"Momento de inércia (m⁴)"},{name:"Le",label:"Comprimento efetivo (m)"}] },
        calorQ:           { title: "Calor Sensível Q = m·c·ΔT",             fields: [{name:"massa",label:"Massa (kg)"},{name:"calor_esp",label:"Calor específico (J/kg·K)"},{name:"deltaT",label:"ΔT (°C ou K)"}] },
        dilatacao:        { title: "Dilatação Linear ΔL = α·L·ΔT",          fields: [{name:"alfa",label:"Coef. dilatação (1/°C)"},{name:"L",label:"Comprimento inicial (m)"},{name:"deltaT",label:"ΔT (°C)"}] },
        rendimento:       { title: "Rendimento de Máquina (%)",              fields: [{name:"potUtil",label:"Potência útil (W)"},{name:"potTotal",label:"Potência total (W)"}] },
        vazao:            { title: "Vazão Q = A·v",                          fields: [{name:"area",label:"Área da seção (m²)"},{name:"velocidade",label:"Velocidade do fluido (m/s)"}] },
        reynolds:         { title: "Número de Reynolds",                     fields: [{name:"rho",label:"Densidade do fluido (kg/m³)"},{name:"v",label:"Velocidade (m/s)"},{name:"D",label:"Diâmetro hidráulico (m)"},{name:"mu",label:"Viscosidade dinâmica (Pa·s)"}] },
        bernoulli:        { title: "Pressão — Bernoulli simplificado",       fields: [{name:"p1",label:"Pressão 1 (Pa)"},{name:"rho",label:"Densidade (kg/m³)"},{name:"v1",label:"Velocidade 1 (m/s)"},{name:"v2",label:"Velocidade 2 (m/s)"}] },
        pressHidro:       { title: "Pressão Hidrostática ρ·g·h",            fields: [{name:"rho",label:"Densidade (kg/m³)"},{name:"h",label:"Profundidade (m)"}] },
        capacitor:        { title: "Energia no Capacitor ½·C·V²",           fields: [{name:"C",label:"Capacitância (F)"},{name:"V",label:"Tensão (V)"}] },
        indutor:          { title: "Energia no Indutor ½·L·I²",             fields: [{name:"L_ind",label:"Indutância (H)"},{name:"I",label:"Corrente (A)"}] },
        reatorLC:         { title: "Frequência de Ressonância LC",           fields: [{name:"L_ind",label:"Indutância (H)"},{name:"C",label:"Capacitância (F)"}] },
        divisorTensao:    { title: "Divisor de Tensão",                      fields: [{name:"Vin",label:"Tensão de entrada (V)"},{name:"R1",label:"Resistor R1 (Ω)"},{name:"R2",label:"Resistor R2 (Ω)"}] },
        cargaDistribuida: { title: "Reações — Viga Biapoiada Carga Uniforme",fields: [{name:"w",label:"Carga distribuída (N/m)"},{name:"L",label:"Comprimento da viga (m)"}] },
        momentoMax:       { title: "Momento Máximo — Viga Biapoiada",       fields: [{name:"w",label:"Carga distribuída (N/m)"},{name:"L",label:"Comprimento da viga (m)"}] },
        inerciRetangulo:  { title: "Momento de Inércia — Seção Retangular", fields: [{name:"base",label:"Base (m)"},{name:"altura",label:"Altura (m)"}] },
        inerciCirculo:    { title: "Momento de Inércia — Seção Circular",   fields: [{name:"raio",label:"Raio (m)"}] },
        convTemp:         { title: "Conversão de Temperatura",               fields: [{name:"valor",label:"Valor"},{name:"de",label:"De: 0=°C  1=°F  2=K"}] },
        convPressao:      { title: "Conversão de Pressão (entrada em Pa)",   fields: [{name:"valor",label:"Valor (Pa)"}] }
    };

    // ── helpers ──────────────────────────────────────────────────────────────
    function numberInput(name, label, placeholder = "") {
        return `<label class="field"><span>${label}</span><input name="${name}" type="number" step="any" placeholder="${placeholder}"></label>`;
    }
    function textInput(name, label, placeholder = "") {
        return `<label class="field"><span>${label}</span><input name="${name}" type="text" placeholder="${placeholder}"></label>`;
    }
    function selectInput(name, label, options) {
        return `<label class="field"><span>${label}</span><select name="${name}">${options.map(o=>`<option value="${o.value}">${o.label}</option>`).join("")}</select></label>`;
    }
    function renderFieldSet(html, hint = "") {
        dynamicFields.innerHTML = `<div class="field-grid">${html}</div>${hint?`<p class="hint">${hint}</p>`:""}`;
    }
    function buildSubSelect(name, label, options) {
        return selectInput(name, label, Object.entries(options).map(([v,c])=>({value:v,label:c.title})));
    }

    // ── render fields ────────────────────────────────────────────────────────
    function renderFields() {
        resultBox.textContent = "";
        const type = calcType.value;
        subtitle.textContent = labels[type] || "Calculadora";

        const subMap = {
            finance:     ["financeType",     financeOptions,     "Use ponto decimal, ex: 0.05 para 5%."],
            electrical:  ["electricalType",  electricalOptions,  "Coloque 0 no campo que deve ser calculado."],
            physics:     ["physicsType",     physicsOptions,     "Preencha todos os campos com as unidades indicadas."],
            progression: ["progressionType", progressionOptions, "PA e PG usam fórmulas de termo e soma."],
            geometry:    ["geometryType",    geometryOptions,    "Áreas em unidades², volumes em unidades³."],
            engineering: ["engineeringType", engineeringOptions, "Use o SI — Pa, N, m, kg, s."]
        };

        if (subMap[type]) {
            const [selName, opts, hint] = subMap[type];
            const selVal = form.elements[selName]?.value || Object.keys(opts)[0];
            const config = opts[selVal];
            renderFieldSet([buildSubSelect(selName, labels[type], opts), ...config.fields.map(f=>numberInput(f.name,f.label))].join(""), hint);
            return;
        }

        if (type === "log") { renderFieldSet([textInput("base","Base do logaritmo","10, 2 ou e"), numberInput("logaritmando","Logaritmando")].join(""), "Para logaritmo natural, use a base e."); return; }
        if (type === "bhaskara") { renderFieldSet([numberInput("a","Coeficiente A"),numberInput("b","Coeficiente B"),numberInput("c","Coeficiente C")].join(""), "Retorna as duas raízes quando existem."); return; }
        if (type === "hypotenuse") { renderFieldSet([numberInput("cateto1","Primeiro cateto"),numberInput("cateto2","Segundo cateto")].join(""), "Calculado por Pitágoras."); return; }
        if (type === "sum" || type === "subtract") { renderFieldSet([textInput("numbers","Números","Ex: 1, 2, 3, 4")].join(""), type==="sum"?"Separe por vírgula, espaço ou quebra de linha.":"Subtração em sequência."); return; }
        renderFieldSet([numberInput("value1","Primeiro número"),numberInput("value2","Segundo número")].join(""), type==="divide"?"primeiro ÷ segundo":"");
    }

    // ── utils ────────────────────────────────────────────────────────────────
    function parseNumbers(raw) { return raw.split(/[\s,;]+/).map(Number).filter(v=>!Number.isNaN(v)); }
    function getFormValue(name) { return form.elements[name]?.value ?? ""; }
    function rn(name) { const v=Number(getFormValue(name)); return Number.isNaN(v)?null:v; }
    function fmt(v) { return Number(v).toLocaleString("pt-BR",{maximumFractionDigits:10}); }

    // ── finance ──────────────────────────────────────────────────────────────
    function calculateFinance(op) {
        const cfg = financeOptions[op];
        const vals = Object.fromEntries(cfg.fields.map(f=>[f.name,rn(f.name)]));
        if (Object.values(vals).some(v=>v===null)) return "Preencha todos os campos.";
        const {capital,taxa,tempo,juros,nominal,valor,futuro,presente,parcelas,
               ganho,custo,fixos,preco,variavel,markup,receita,cmv,
               valorInicial,valorResidual,vidaUtil} = vals;
        switch(op) {
            case "JS":     return `Juros: ${fmt(capital*taxa*tempo)}`;
            case "MS":     return `Montante: ${fmt(capital*(1+taxa*tempo))}`;
            case "JC":   { const m=capital*(1+taxa)**tempo; return `Juros compostos: ${fmt(m-capital)}`; }
            case "MC":     return `Montante composto: ${fmt(capital*(1+taxa)**tempo)}`;
            case "TJ":     if(!capital||!tempo) return "Capital e tempo ≠ 0."; return `Taxa: ${fmt(juros/(capital*tempo))}`;
            case "TP":     if(!capital||!taxa)  return "Capital e taxa ≠ 0.";  return `Tempo: ${fmt(juros/(capital*taxa))}`;
            case "DS":     return `Desconto: ${fmt(nominal*taxa*tempo)}\nValor atual: ${fmt(nominal-nominal*taxa*tempo)}`;
            case "DC":   { const va=nominal/(1+taxa)**tempo; return `Desconto composto: ${fmt(nominal-va)}\nValor atual: ${fmt(va)}`; }
            case "PR":     if(!taxa) return "Taxa ≠ 0."; return `Parcela PRICE: ${fmt((valor*taxa)/(1-(1+taxa)**(-parcelas)))}`;
            case "SAC":  { if(!parcelas) return "Parcelas ≠ 0."; const a=valor/parcelas,j=valor*taxa; return `Amortização: ${fmt(a)}\nJuros (1ª parcela): ${fmt(j)}\n1ª parcela total: ${fmt(a+j)}`; }
            case "VP":     return `Valor presente: ${fmt(futuro/(1+taxa)**tempo)}`;
            case "VF":     return `Valor futuro: ${fmt(presente*(1+taxa)**tempo)}`;
            case "ROI":    if(!custo) return "Custo ≠ 0."; return `ROI: ${fmt(((ganho-custo)/custo)*100)} %`;
            case "BREAK":  if(preco===variavel) return "Preço e custo variável devem ser diferentes."; return `Ponto de equilíbrio: ${fmt(fixos/(preco-variavel))} unidades`;
            case "MARGEM": if(!receita) return "Receita ≠ 0."; return `Margem: ${fmt(((receita-custo)/receita)*100)} %\nLucro: ${fmt(receita-custo)}`;
            case "MARKUP": return `Preço de venda: ${fmt(custo*(1+markup/100))}`;
            case "DEPSL":  if(!vidaUtil) return "Vida útil ≠ 0."; return `Depreciação anual: ${fmt((valorInicial-valorResidual)/vidaUtil)}\nTaxa: ${fmt(((valorInicial-valorResidual)/vidaUtil/valorInicial)*100)} %`;
            case "LUCROB": if(!receita) return "Receita ≠ 0."; return `Lucro bruto: ${fmt(receita-cmv)}\nMargem bruta: ${fmt(((receita-cmv)/receita)*100)} %`;
            default: return "Operação financeira inválida.";
        }
    }55

    // ── electrical ───────────────────────────────────────────────────────────
    function calculateElectrical(op) {
        const corrente=rn("corrente"),voltagem=rn("voltagem"),potencia=rn("potencia"),resistencia=rn("resistencia");
        if([corrente,voltagem,potencia,resistencia].some(v=>v===null)) return "Preencha todos os campos.";
        switch(op) {
            case "R": if(potencia===0)    return `Resistência: ${fmt(voltagem/corrente)} Ω`; if(corrente===0) return `Resistência: ${fmt(voltagem**2/potencia)} Ω`; if(voltagem===0) return `Resistência: ${fmt(potencia/corrente**2)} Ω`; return "Deixe um campo como 0.";
            case "I": if(resistencia===0) return `Corrente: ${fmt(potencia/voltagem)} A`;    if(voltagem===0) return `Corrente: ${fmt(Math.sqrt(potencia/resistencia))} A`; if(potencia===0) return `Corrente: ${fmt(voltagem/resistencia)} A`; return "Deixe um campo como 0.";
            case "P": if(voltagem===0)    return `Potência: ${fmt(corrente**2*resistencia)} W`; if(resistencia===0) return `Potência: ${fmt(voltagem*corrente)} W`; if(corrente===0) return `Potência: ${fmt(voltagem**2/resistencia)} W`; return "Deixe um campo como 0.";
            case "V": if(potencia===0)    return `Voltagem: ${fmt(resistencia*corrente)} V`;  if(corrente===0) return `Voltagem: ${fmt(Math.sqrt(potencia*resistencia))} V`; if(resistencia===0) return `Voltagem: ${fmt(potencia/corrente)} V`; return "Deixe um campo como 0.";
            default: return "Grandeza inválida.";
        }
    }

    // ── physics ──────────────────────────────────────────────────────────────
    function calculatePhysics(op) {
        const g=(n)=>rn(n);
        switch(op){
            case "velocity":     { const d=g("distancia"),t=g("tempo");           if(t===0) return "Tempo ≠ 0."; return `Velocidade média: ${fmt(d/t)} m/s`; }
            case "acceleration": { const vi=g("velocidadeInicial"),vf=g("velocidadeFinal"),t=g("tempo"); if(t===0) return "Tempo ≠ 0."; return `Aceleração: ${fmt((vf-vi)/t)} m/s²`; }
            case "force":        { const m=g("massa"),a=g("aceleracao");           return `Força: ${fmt(m*a)} N`; }
            case "work":         { const f=g("forca"),d=g("distancia");            return `Trabalho: ${fmt(f*d)} J`; }
            case "pressure":     { const f=g("forca"),a=g("area");                 if(a===0) return "Área ≠ 0."; return `Pressão: ${fmt(f/a)} Pa`; }
            case "density":      { const m=g("massa"),v=g("volume");               if(v===0) return "Volume ≠ 0."; return `Densidade: ${fmt(m/v)} kg/m³`; }
            case "power":        { const tr=g("trabalho"),t=g("tempo");            if(t===0) return "Tempo ≠ 0."; return `Potência: ${fmt(tr/t)} W`; }
            case "kinetic":      { const m=g("massa"),v=g("velocidade");           return `Energia cinética: ${fmt((m*v**2)/2)} J`; }
            default: return "Fórmula física inválida.";
        }
    }

    // ── progression ──────────────────────────────────────────────────────────
    function calculateProgression(op) {
        const a1=rn("a1"),r=rn("r"),q=rn("q"),n=rn("n");
        switch(op){
            case "paTerm":     if(!n) return "N ≠ 0."; return `PA termo geral: ${fmt(a1+(n-1)*r)}`;
            case "paSum":    { if(!n) return "N ≠ 0."; const an=a1+(n-1)*r; return `PA soma: ${fmt((n*(a1+an))/2)}`; }
            case "pgTerm":     if(!n) return "N ≠ 0."; return `PG termo geral: ${fmt(a1*q**(n-1))}`;
            case "pgSum":      if(!n) return "N ≠ 0."; if(q===1) return `PG soma: ${fmt(a1*n)}`; return `PG soma: ${fmt((a1*(q**n-1))/(q-1))}`;
            case "pgInfinite": if(Math.abs(q)>=1) return "Razão |q| < 1 para soma infinita."; return `PG soma infinita: ${fmt(a1/(1-q))}`;
            default: return "Progressão inválida.";
        }
    }

    // ── geometry ─────────────────────────────────────────────────────────────
    function calculateGeometry(op) {
        const g=(n)=>rn(n), PI=Math.PI;
        switch(op){
            case "circleArea":     { const r=g("raio"); if(r===null) return "Preencha o raio."; return `Área: ${fmt(PI*r**2)}\nCircunferência: ${fmt(2*PI*r)}`; }
            case "squareArea":     { const l=g("lado"); if(l===null) return "Preencha o lado."; return `Área: ${fmt(l**2)}\nPerímetro: ${fmt(4*l)}\nDiagonal: ${fmt(l*Math.sqrt(2))}`; }
            case "rectArea":       { const b=g("base"),h=g("altura"); if(b===null||h===null) return "Preencha base e altura."; return `Área: ${fmt(b*h)}\nPerímetro: ${fmt(2*(b+h))}\nDiagonal: ${fmt(Math.sqrt(b**2+h**2))}`; }
            case "triangleArea":   { const b=g("base"),h=g("altura"); if(b===null||h===null) return "Preencha base e altura."; return `Área: ${fmt((b*h)/2)}`; }
            case "triangleHeron":  { const a=g("ladoA"),b=g("ladoB"),c=g("ladoC"); if(a===null||b===null||c===null) return "Preencha os três lados."; if(a+b<=c||a+c<=b||b+c<=a) return "Lados inválidos para um triângulo."; const s=(a+b+c)/2; return `Área: ${fmt(Math.sqrt(s*(s-a)*(s-b)*(s-c)))}\nPerímetro: ${fmt(a+b+c)}`; }
            case "trapezoid":      { const bM=g("baseMaior"),bm=g("baseMenor"),h=g("altura"); if(bM===null||bm===null||h===null) return "Preencha todos os campos."; return `Área: ${fmt(((bM+bm)*h)/2)}`; }
            case "rhombus":        { const d1=g("d1"),d2=g("d2"); if(d1===null||d2===null) return "Preencha as diagonais."; return `Área: ${fmt((d1*d2)/2)}\nLado: ${fmt(Math.sqrt((d1/2)**2+(d2/2)**2))}`; }
            case "regularPolygon": { const n=g("lados"),l=g("lado"); if(n===null||l===null) return "Preencha todos os campos."; if(n<3) return "Mínimo 3 lados."; return `Área: ${fmt((n*l**2)/(4*Math.tan(PI/n)))}\nPerímetro: ${fmt(n*l)}`; }
            case "ellipseArea":    { const a=g("semiEixoA"),b=g("semiEixoB"); if(a===null||b===null) return "Preencha os semi-eixos."; return `Área: ${fmt(PI*a*b)}`; }
            case "sectorArea":     { const r=g("raio"),ang=g("angulo"); if(r===null||ang===null) return "Preencha raio e ângulo."; const rad=ang*PI/180; return `Área do setor: ${fmt(r**2*rad/2)}\nComprimento do arco: ${fmt(r*rad)}`; }
            case "sphereVol":      { const r=g("raio"); if(r===null) return "Preencha o raio."; return `Volume: ${fmt((4/3)*PI*r**3)}\nÁrea superficial: ${fmt(4*PI*r**2)}`; }
            case "cubeVol":        { const a=g("aresta"); if(a===null) return "Preencha a aresta."; return `Volume: ${fmt(a**3)}\nÁrea total: ${fmt(6*a**2)}\nDiagonal: ${fmt(a*Math.sqrt(3))}`; }
            case "boxVol":         { const c=g("comprimento"),l=g("largura"),h=g("altura"); if(c===null||l===null||h===null) return "Preencha todos os campos."; return `Volume: ${fmt(c*l*h)}\nÁrea total: ${fmt(2*(c*l+c*h+l*h))}`; }
            case "cylinderVol":    { const r=g("raio"),h=g("altura"); if(r===null||h===null) return "Preencha raio e altura."; return `Volume: ${fmt(PI*r**2*h)}\nÁrea lateral: ${fmt(2*PI*r*h)}\nÁrea total: ${fmt(2*PI*r*(r+h))}`; }
            case "coneVol":        { const r=g("raio"),h=g("altura"); if(r===null||h===null) return "Preencha raio e altura."; const gen=Math.sqrt(r**2+h**2); return `Volume: ${fmt((PI*r**2*h)/3)}\nGeratriz: ${fmt(gen)}\nÁrea lateral: ${fmt(PI*r*gen)}\nÁrea total: ${fmt(PI*r*(r+gen))}`; }
            case "pyramidVol":     { const l=g("ladoBase"),h=g("altura"); if(l===null||h===null) return "Preencha todos os campos."; return `Volume: ${fmt((l**2*h)/3)}\nÁrea da base: ${fmt(l**2)}`; }
            case "torusVol":       { const R=g("R"),r=g("r"); if(R===null||r===null) return "Preencha R e r."; return `Volume: ${fmt(2*PI**2*R*r**2)}\nÁrea superficial: ${fmt(4*PI**2*R*r)}`; }
            default: return "Forma geométrica inválida.";
        }
    }

    // ── engineering ──────────────────────────────────────────────────────────
    function calculateEngineering(op) {
        const g=(n)=>rn(n);
        switch(op){
            case "tensao":           { const F=g("forca"),A=g("area");                     if(A===0) return "Área ≠ 0."; return `Tensão normal σ: ${fmt(F/A)} Pa`; }
            case "deformacao":       { const dL=g("deltaL"),L=g("L");                      if(L===0) return "L ≠ 0."; return `Deformação ε: ${fmt(dL/L)}`; }
            case "modElastico":      { const s=g("tensao"),e=g("deformacao");               if(e===0) return "Deformação ≠ 0."; return `Módulo de Elasticidade: ${fmt(s/e)} Pa`; }
            case "momentoFletor":    { const M=g("momento"),c=g("c"),I=g("inercia");        if(I===0) return "I ≠ 0."; return `Tensão de flexão σ: ${fmt((M*c)/I)} Pa`; }
            case "cisalhamento":     { const F=g("forca"),A=g("area");                     if(A===0) return "Área ≠ 0."; return `Tensão de cisalhamento τ: ${fmt(F/A)} Pa`; }
            case "torque":           { const T=g("torque"),r=g("raio"),J=g("J");            if(J===0) return "J ≠ 0."; return `Tensão de torção τ: ${fmt((T*r)/J)} Pa`; }
            case "flambagem":        { const E=g("E"),I=g("I"),Le=g("Le");                  if(Le===0) return "Le ≠ 0."; return `Carga crítica de Euler: ${fmt((Math.PI**2*E*I)/Le**2)} N`; }
            case "calorQ":           { const m=g("massa"),c=g("calor_esp"),dT=g("deltaT");  return `Calor: ${fmt(m*c*dT)} J`; }
            case "dilatacao":        { const a=g("alfa"),L=g("L"),dT=g("deltaT");           return `ΔL: ${fmt(a*L*dT)} m\nComp. final: ${fmt(L+a*L*dT)} m`; }
            case "rendimento":       { const u=g("potUtil"),t=g("potTotal");                if(t===0) return "Potência total ≠ 0."; return `Rendimento: ${fmt((u/t)*100)} %\nPerdas: ${fmt(t-u)} W`; }
            case "vazao":            { const A=g("area"),v=g("velocidade");                 return `Vazão Q: ${fmt(A*v)} m³/s`; }
            case "reynolds":         { const rho=g("rho"),v=g("v"),D=g("D"),mu=g("mu");    if(mu===0) return "Viscosidade ≠ 0."; const Re=(rho*v*D)/mu; return `Re: ${fmt(Re)}\nRegime: ${Re<2300?"Laminar":Re<4000?"Transição":"Turbulento"}`; }
            case "bernoulli":        { const p1=g("p1"),rho=g("rho"),v1=g("v1"),v2=g("v2"); return `Pressão 2: ${fmt(p1+0.5*rho*(v1**2-v2**2))} Pa`; }
            case "pressHidro":       { const rho=g("rho"),h=g("h");                         return `Pressão hidrostática: ${fmt(rho*9.81*h)} Pa`; }
            case "capacitor":        { const C=g("C"),V=g("V");                             return `Energia: ${fmt(0.5*C*V**2)} J\nCarga: ${fmt(C*V)} C`; }
            case "indutor":          { const L=g("L_ind"),I=g("I");                         return `Energia: ${fmt(0.5*L*I**2)} J`; }
            case "reatorLC":         { const L=g("L_ind"),C=g("C");                         if(!L||!C) return "L e C ≠ 0."; const f=1/(2*Math.PI*Math.sqrt(L*C)); return `Freq. ressonância: ${fmt(f)} Hz\nω: ${fmt(2*Math.PI*f)} rad/s`; }
            case "divisorTensao":    { const Vin=g("Vin"),R1=g("R1"),R2=g("R2");            if(R1+R2===0) return "R1+R2 ≠ 0."; return `Vout: ${fmt(Vin*R2/(R1+R2))} V`; }
            case "cargaDistribuida": { const w=g("w"),L=g("L");                             return `Reação em cada apoio: ${fmt((w*L)/2)} N\nCarga total: ${fmt(w*L)} N`; }
            case "momentoMax":       { const w=g("w"),L=g("L");                             return `Momento máximo (centro): ${fmt((w*L**2)/8)} N·m`; }
            case "inerciRetangulo":  { const b=g("base"),h=g("altura");                     return `Ix: ${fmt((b*h**3)/12)} m⁴\nIy: ${fmt((h*b**3)/12)} m⁴`; }
            case "inerciCirculo":    { const r=g("raio");                                   const I=(Math.PI*r**4)/4; return `Ix=Iy: ${fmt(I)} m⁴\nJ (polar): ${fmt(2*I)} m⁴`; }
            case "convTemp":       { const val=g("valor"),de=g("de"); let c,f,k; if(de===0){c=val;f=c*9/5+32;k=c+273.15;}else if(de===1){f=val;c=(f-32)*5/9;k=c+273.15;}else{k=val;c=k-273.15;f=c*9/5+32;} return `°C: ${fmt(c)}\n°F: ${fmt(f)}\nK: ${fmt(k)}`; }
            case "convPressao":    { const pa=g("valor"); return `Pa: ${fmt(pa)}\nkPa: ${fmt(pa/1000)}\nMPa: ${fmt(pa/1e6)}\nbar: ${fmt(pa/1e5)}\natm: ${fmt(pa/101325)}\nPSI: ${fmt(pa/6894.76)}\nmmHg: ${fmt(pa/133.322)}`; }
            default: return "Cálculo de engenharia inválido.";
        }
    }

    // ── arithmetic ───────────────────────────────────────────────────────────
    function calculateArithmetic(type) {
        if (type === "sum" || type === "subtract") {
            const numbers = parseNumbers(getFormValue("numbers"));
            if (!numbers.length) return "Digite pelo menos um número.";
            const total = type === "sum" ? numbers.reduce((a,n)=>a+n,0) : numbers.slice(1).reduce((a,n)=>a-n,numbers[0]);
            return type === "sum" ? `Soma: ${fmt(total)}` : `Subtração: ${fmt(total)}`;
        }
        const f=rn("value1"), s=rn("value2");
        if (f===null||s===null) return "Preencha os dois números.";
        if (type==="multiply") return `Multiplicação: ${fmt(f*s)}`;
        if (type==="divide") { if(s===0) return "Não é possível dividir por zero."; return `Divisão: ${fmt(f/s)}`; }
        return "Operação inválida.";
    }

    function calculateBhaskara() {
        const a=rn("a"),b=rn("b"),c=rn("c");
        if(a===null||b===null||c===null) return "Preencha os três coeficientes.";
        if(a===0) return "Coeficiente A ≠ 0.";
        const D=b**2-4*a*c;
        if(D<0) return `Δ: ${fmt(D)}. Sem raízes reais.`;
        return `Δ: ${fmt(D)}\nx1: ${fmt((-b+Math.sqrt(D))/(2*a))}\nx2: ${fmt((-b-Math.sqrt(D))/(2*a))}`;
    }

    function calculateHypotenuse() {
        const c1=rn("cateto1"),c2=rn("cateto2");
        if(c1===null||c2===null) return "Preencha os dois catetos.";
        return `Hipotenusa: ${fmt(Math.sqrt(c1**2+c2**2))}`;
    }

    function calculateLog() {
        const baseInput=String(getFormValue("base")).trim().toLowerCase();
        const log=rn("logaritmando");
        if(log===null||log<=0) return "Logaritmando deve ser > 0.";
        const base=baseInput==="e"?Math.E:Number(baseInput);
        if(Number.isNaN(base)||base<=0||base===1) return "Base inválida.";
        return `log_${baseInput}(${log}) = ${fmt(Math.log(log)/Math.log(base))}`;
    }

    // ── dispatcher ───────────────────────────────────────────────────────────
    function calculate() {
        const type = calcType.value;
        if(type==="finance")     return calculateFinance(form.elements.financeType?.value||"JS");
        if(type==="electrical")  return calculateElectrical(form.elements.electricalType?.value||"R");
        if(type==="physics")     return calculatePhysics(form.elements.physicsType?.value||"velocity");
        if(type==="progression") return calculateProgression(form.elements.progressionType?.value||"paTerm");
        if(type==="geometry")    return calculateGeometry(form.elements.geometryType?.value||"circleArea");
        if(type==="engineering") return calculateEngineering(form.elements.engineeringType?.value||"tensao");
        if(type==="log")         return calculateLog();
        if(type==="bhaskara")    return calculateBhaskara();
        if(type==="hypotenuse")  return calculateHypotenuse();
        return calculateArithmetic(type);
    }

    calcType.addEventListener("change", renderFields);
    form.addEventListener("change", (e) => {
        if(["financeType","electricalType","physicsType","progressionType","geometryType","engineeringType"].includes(e.target.name)) renderFields();
    });
    form.addEventListener("submit", (e) => { e.preventDefault(); resultBox.textContent = calculate(); });
    renderFields();
});
