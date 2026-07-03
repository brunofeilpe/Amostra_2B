// Aguarda que todo o esqueleto HTML esteja carregado e analisado pelo navegador antes de executar o script
document.addEventListener("DOMContentLoaded", () => {
    // Captura o elemento do formulário principal de cálculos
    const form = document.getElementById("calculator-form");
    // Captura o elemento de seleção (dropdown) que define o tipo de fórmula/categoria
    const calcType = document.getElementById("calc-type");
    // Captura o contentor HTML onde os campos de texto e inputs específicos serão gerados dinamicamente
    const dynamicFields = document.getElementById("dynamic-fields");
    // Captura o elemento de texto onde o resultado final da fórmula será impresso
    const resultBox = document.getElementById("result");
    // Captura o elemento de cabeçalho que exibe o subtítulo ou nome da operação atual
    const subtitle = document.getElementById("subtitle");

    // Verifica se algum dos elementos cruciais da interface está em falta na página
    if (!form || !calcType || !dynamicFields || !resultBox || !subtitle) {
        // Regista uma mensagem de erro no painel de desenvolvimento do navegador
        console.error("Elementos da interface não encontrados.");
        // Interrompe a inicialização do script para evitar falhas em cascata
        return;
    }

    // Objeto de mapeamento que associa as chaves internas aos nomes legíveis de cada categoria
    const labels = {
        sum: "Soma", subtract: "Subtração", multiply: "Multiplicação", divide: "Divisão",
        bhaskara: "Bhaskara", hypotenuse: "Hipotenusa", electrical: "Grandezas elétricas",
        physics: "Física", progression: "Progressões matemáticas", log: "Logaritmo",
        finance: "Cálculos financeiros", geometry: "Geometria", engineering: "Engenharia"
    };

    // Estrutura de dados com todas as suboperações financeiras, os seus títulos e os campos necessários
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

    // Dicionário com fórmulas e subopções de eletricidade e eletrónica, mapeando variáveis e inputs
    const electricalOptions = {
        R: { title: "Resistência", fields: [{name:"corrente",label:"Corrente (A) — 0 se não souber"},{name:"voltagem",label:"Voltagem (V) — 0 se não souber"},{name:"potencia",label:"Potência (W) — 0 se não souber"}] },
        I: { title: "Corrente",    fields: [{name:"potencia",label:"Potência (W) — 0 se não souber"},{name:"voltagem",label:"Voltagem (V) — 0 se não souber"},{name:"resistencia",label:"Resistência (Ω) — 0 se não souber"}] },
        P: { title: "Potência",    fields: [{name:"voltagem",label:"Voltagem (V) — 0 se não souber"},{name:"resistencia",label:"Resistência (Ω) — 0 se não souber"},{name:"corrente",label:"Corrente (A) — 0 se não souber"}] },
        V: { title: "Voltagem",    fields: [{name:"corrente",label:"Corrente (A) — 0 se não souber"},{name:"resistencia",label:"Resistência (Ω) — 0 se não souber"},{name:"potencia",label:"Potência (W) — 0 se não souber"}] },
        RS: { title: "Resistores em Série (Req)", fields: [{name:"valores",label:"Resistores (Ω)",type:"text"}] },
        RP: { title: "Resistores em Paralelo (Req)", fields: [{name:"valores",label:"Resistores (Ω)",type:"text"}] },
        CS: { title: "Capacitores em Série (Ceq)", fields: [{name:"valores",label:"Capacitores (F)",type:"text"}] },
        CP: { title: "Capacitores em Paralelo (Ceq)", fields: [{name:"valores",label:"Capacitores (F)",type:"text"}] },
        LS: { title: "Indutores em Série (Leq)", fields: [{name:"valores",label:"Indutores (H)",type:"text"}] },
        LP: { title: "Indutores em Paralelo (Leq)", fields: [{name:"valores",label:"Indutores (H)",type:"text"}] }
    };

    // Subopções focadas em cinemática e mecânica clássica na área da física
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

    // Mapeamento de cálculos de sequências numéricas (Progressão Aritmética e Geométrica)
    const progressionOptions = {
        paTerm:     { title: "PA — termo geral",   fields: [{name:"a1",label:"Primeiro termo"},{name:"r",label:"Razão"},{name:"n",label:"Número do termo"}] },
        paSum:      { title: "PA — soma",          fields: [{name:"a1",label:"Primeiro termo"},{name:"r",label:"Razão"},{name:"n",label:"Qtd. de termos"}] },
        pgTerm:     { title: "PG — termo geral",   fields: [{name:"a1",label:"Primeiro termo"},{name:"q",label:"Razão"},{name:"n",label:"Número do termo"}] },
        pgSum:      { title: "PG — soma finita",   fields: [{name:"a1",label:"Primeiro termo"},{name:"q",label:"Razão"},{name:"n",label:"Qtd. de termos"}] },
        pgInfinite: { title: "PG — soma infinita", fields: [{name:"a1",label:"Primeiro termo"},{name:"q",label:"Razão (|q| < 1)"}] }
    };

    // Opções detalhadas de geometria plana e espacial contendo os dados necessários para áreas e volumes
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

    // Extensa lista de fórmulas científicas e de engenharias (estruturas, fluidos, termodinâmica)
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
        convPressao:      { title: "Conversão de Pressure (entrada em Pa)",   fields: [{name:"valor",label:"Valor (Pa)"}] }
    };

    // ── funções auxiliares (helpers) ──────────────────────────────────────────

    // Gera o código HTML para um campo de entrada do tipo numérico com rótulo
    function numberInput(name, label, placeholder = "") {
        return `<label class="field"><span>${label}</span><input name="${name}" type="number" step="any" placeholder="${placeholder}"></label>`;
    }

    // Gera o código HTML para um campo de entrada de texto comum com rótulo
    function textInput(name, label, placeholder = "") {
        return `<label class="field"><span>${label}</span><input name="${name}" type="text" placeholder="${placeholder}"></label>`;
    }

    // Gera o código HTML para uma caixa de seleção (dropdown select) com base num array de opções
    function selectInput(name, label, options) {
        return `<label class="field"><span>${label}</span><select name="${name}">${options.map(o=>`<option value="${o.value}">${o.label}</option>`).join("")}</select></label>`;
    }

    // Injeta o HTML gerado dentro do contentor de campos dinâmicos da página e anexa uma dica, se existir
    function renderFieldSet(html, hint = "") {
        dynamicFields.innerHTML = `<div class="field-grid">${html}</div>${hint?`<p class="hint">${hint}</p>`:""}`;
    }

    // Constrói um menu dropdown secundário focado nas subcategorias de uma operação
    function buildSubSelect(name, label, options) {
        return selectInput(name, label, Object.entries(options).map(([v,c])=>({value:v,label:c.title})));
    }

    // ── renderização de campos dinâmicos ──────────────────────────────────────

    function renderFields() {
        resultBox.textContent = "";
        const type = calcType.value;
        subtitle.textContent = labels[type] || "Calculadora";

        const subMap = {
            finance:     ["financeType",     financeOptions,     "Use ponto decimal, ex: 0.05 para 5%."],
            electrical:  ["electricalType",  electricalOptions,  "Para Leis de Ohm: coloque 0 no campo a calcular. Para associações: informe valores separados por vírgula."],
            physics:     ["physicsType",     physicsOptions,     "Preencha todos os campos com as unidades indicadas."],
            progression: ["progressionType", progressionOptions, "PA e PG usam fórmulas de termo e soma."],
            geometry:    ["geometryType",    geometryOptions,    "Áreas em unidades², volumes em unidades³."],
            engineering: ["engineeringType", engineeringOptions, "Use o SI — Pa, N, m, kg, s."]
        };

        if (subMap[type]) {
            const [selName, opts, hint] = subMap[type];
            const selVal = form.elements[selName]?.value || Object.keys(opts)[0];
            const config = opts[selVal];
            const fieldHtml = config.fields.map(f => {
                if (f.type === "text") return textInput(f.name, f.label, "Ex: 10, 20, 30");
                return numberInput(f.name, f.label);
            });
            renderFieldSet([buildSubSelect(selName, labels[type], opts), ...fieldHtml].join(""), hint);
            return;
        }

        if (type === "log") { renderFieldSet([textInput("base","Base do logaritmo","10, 2 ou e"), numberInput("logaritmando","Logaritmando")].join(""), "Para logaritmo natural, use a base e."); return; }
        if (type === "bhaskara") { renderFieldSet([numberInput("a","Coeficiente A"),numberInput("b","Coeficiente B"),numberInput("c","Coeficiente C")].join(""), "Retorna as duas raízes quando existem."); return; }
        if (type === "hypotenuse") { renderFieldSet([numberInput("cateto1","Primeiro cateto"),numberInput("cateto2","Segundo cateto")].join(""), "Calculado por Pitágoras."); return; }
        if (type === "sum" || type === "subtract") { renderFieldSet([textInput("numbers","Números","Ex: 1, 2, 3, 4")].join(""), type==="sum"?"Separe por vírgula, espaço ou quebra de linha.":"Subtração em sequência."); return; }
        renderFieldSet([numberInput("value1","Primeiro número"),numberInput("value2","Segundo número")].join(""), type==="divide"?"primeiro ÷ segundo":"");
    }

    // ── utilitários internos de processamento ──────────────────────────────────

    function parseNumbers(raw) { return raw.split(/[\s,;]+/).map(Number).filter(v=>!Number.isNaN(v)); }
    function getFormValue(name) { return form.elements[name]?.value ?? ""; }
    function rn(name) { const v=Number(getFormValue(name)); return Number.isNaN(v)?null:v; }
    function fmt(v) { return Number(v).toLocaleString("pt-BR",{maximumFractionDigits:10}); }

    // ── submotores de cálculo por categoria ──────────────────────────────────

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
    }

    function calculateElectrical(op) {
        if (["RS","RP","CS","CP","LS","LP"].includes(op)) {
            const raw = String(getFormValue("valores"));
            const nums = parseNumbers(raw);
            if (nums.length < 2) return "Informe ao menos 2 valores separados por vírgula.";
            switch(op) {
                case "RS": { const req = nums.reduce((a, v) => a + v, 0); return `Req (série): ${fmt(req)} Ω\nValores: ${nums.map(fmt).join(", ")} Ω`; }
                case "RP": { const req = 1 / nums.reduce((a, v) => a + 1 / v, 0); return `Req (paralelo): ${fmt(req)} Ω\nValores: ${nums.map(fmt).join(", ")} Ω`; }
                case "CS": { const ceq = 1 / nums.reduce((a, v) => a + 1 / v, 0); return `Ceq (série): ${fmt(ceq)} F\nValores: ${nums.map(fmt).join(", ")} F`; }
                case "CP": { const ceq = nums.reduce((a, v) => a + v, 0); return `Ceq (paralelo): ${fmt(ceq)} F\nValores: ${nums.map(fmt).join(", ")} F`; }
                case "LS": { const leq = nums.reduce((a, v) => a + v, 0); return `Leq (série): ${fmt(leq)} H\nValores: ${nums.map(fmt).join(", ")} H`; }
                case "LP": { const leq = 1 / nums.reduce((a, v) => a + 1 / v, 0); return `Leq (paralelo): ${fmt(leq)} H\nValores: ${nums.map(fmt).join(", ")} H`; }
                default: return "Associação inválida.";
            }
        }
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

    function calculatePhysics(op) {
        const g=(n)=>rn(n);
        switch(op){
            case "velocity":     { const d=g("distancia"),t=g("tempo");           if(t===0) return "Tempo ≠ 0."; return `Velocidade média: ${fmt(d/t)} m/s`; }
            case "acceleration": { const vi=g("velocidadeInicial"),vf=g("velocidadeFinal"),t=g("tempo"); if(t===0) return "Tempo ≠ 0."; return `Aceleração: ${fmt((vf-vi)/t)} m/s²`; }
            case "force":        { const m=g("massa"),a=g("aceleracao");           return `Força: ${fmt(m*a)} N`; }
            case "work":         { const f=g("forca"), d=g("distancia");            return `Trabalho: ${fmt(f*d)} J`; }
            case "pressure":     { const f=g("forca"),a=g("area");                 if(a===0) return "Área ≠ 0."; return `Pressão: ${fmt(f/a)} Pa`; }
            case "density":      { const m=g("massa"),v=g("volume");               if(v===0) return "Volume ≠ 0."; return `Densidade: ${fmt(m/v)} kg/m³`; }
            case "power":        { const tr=g("trabalho"),t=g("tempo");            if(t===0) return "Tempo ≠ 0."; return `Potência: ${fmt(tr/t)} W`; }
            case "kinetic":      { const m=g("massa"),v=g("velocidade");           return `Energia cinética: ${fmt((m*v**2)/2)} J`; }
            default: return "Fórmula física inválida.";
        }
    }

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

    // ── sub-motor de geometria ────────────────────────────────────

    function calculateGeometry(op) {
        const g = (n) => rn(n);
        switch(op) {
            case "circleArea": {
                const r = g("raio");
                if(r===null) return "Preencha o campo.";
                return `Área: ${fmt(Math.PI*r*r)}\nCircunferência: ${fmt(2*Math.PI*r)}`;
            }
            case "squareArea": {
                const l = g("lado");
                if(l===null) return "Preencha o campo.";
                return `Área: ${fmt(l*l)}\nPerímetro: ${fmt(4*l)}\nDiagonal: ${fmt(l*Math.SQRT2)}`;
            }
            case "rectArea": {
                const b=g("base"), a=g("altura");
                if(b===null||a===null) return "Preencha todos os campos.";
                return `Área: ${fmt(b*a)}\nPerímetro: ${fmt(2*(b+a))}\nDiagonal: ${fmt(Math.sqrt(b*b+a*a))}`;
            }
            case "triangleArea": {
                const b=g("base"), a=g("altura");
                if(b===null||a===null) return "Preencha todos os campos.";
                return `Área: ${fmt((b*a)/2)}`;
            }
            case "triangleHeron": {
                const a=g("ladoA"), b=g("ladoB"), c=g("ladoC");
                if(a===null||b===null||c===null) return "Preencha todos os campos.";
                const p=(a+b+c)/2;
                const area=Math.sqrt(p*(p-a)*(p-b)*(p-c));
                return `Área (Heron): ${fmt(area)}`;
            }
            case "trapezoid": {
                const B=g("baseMaior"), b=g("baseMenor"), a=g("altura");
                if(B===null||b===null||a===null) return "Preencha todos os campos.";
                return `Área: ${fmt(((B+b)*a)/2)}`;
            }
            case "rhombus": {
                const d1=g("d1"), d2=g("d2");
                if(d1===null||d2===null) return "Preencha todos os campos.";
                return `Área: ${fmt((d1*d2)/2)}\nLado: ${fmt(Math.sqrt((d1/2)**2+(d2/2)**2))}`;
            }
            case "regularPolygon": {
                const n=g("lados"), l=g("lado");
                if(n===null||l===null||n<3) return "Informe nº de lados ≥ 3.";
                const ap=l/(2*Math.tan(Math.PI/n));
                return `Área: ${fmt((n*l*ap)/2)}\nPerímetro: ${fmt(n*l)}`;
            }
            case "ellipseArea": {
                const a=g("semiEixoA"), b=g("semiEixoB");
                if(a===null||b===null) return "Preencha todos os campos.";
                return `Área: ${fmt(Math.PI*a*b)}`;
            }
            case "sectorArea": {
                const r=g("raio"), ang=g("angulo");
                if(r===null||ang===null) return "Preencha todos os campos.";
                const rad=ang*Math.PI/180;
                return `Área: ${fmt((rad*r*r)/2)}\nArco: ${fmt(r*rad)}`;
            }
            case "sphereVol": {
                const r=g("raio");
                if(r===null) return "Preencha o campo.";
                return `Volume: ${fmt((4/3)*Math.PI*r**3)}\nÁrea: ${fmt(4*Math.PI*r*r)}`;
            }
            case "cubeVol": {
                const a=g("aresta");
                if(a===null) return "Preencha o campo.";
                return `Volume: ${fmt(a**3)}\nÁrea: ${fmt(6*a*a)}\nDiagonal: ${fmt(a*Math.sqrt(3))}`;
            }
            case "boxVol": {
                const c=g("comprimento"), l=g("largura"), a=g("altura");
                if(c===null||l===null||a===null) return "Preencha todos os campos.";
                return `Volume: ${fmt(c*l*a)}\nÁrea: ${fmt(2*(c*l+c*a+l*a))}`;
            }
            case "cylinderVol": {
                const r=g("raio"), a=g("altura");
                if(r===null||a===null) return "Preencha todos os campos.";
                return `Volume: ${fmt(Math.PI*r*r*a)}\nÁrea: ${fmt(2*Math.PI*r*(r+a))}`;
            }
            case "coneVol": {
                const r=g("raio"), a=g("altura");
                if(r===null||a===null) return "Preencha todos os campos.";
                const g_=Math.sqrt(r*r+a*a);
                return `Volume: ${fmt((1/3)*Math.PI*r*r*a)}\nGeratriz: ${fmt(g_)}\nÁrea: ${fmt(Math.PI*r*(r+g_))}`;
            }
            case "pyramidVol": {
                const l=g("ladoBase"), a=g("altura");
                if(l===null||a===null) return "Preencha todos os campos.";
                return `Volume: ${fmt((1/3)*l*l*a)}`;
            }
            case "torusVol": {
                const R=g("R"), r=g("r");
                if(R===null||r===null) return "Preencha todos os campos.";
                return `Volume: ${fmt(2*Math.PI*Math.PI*R*r*r)}\nÁrea: ${fmt(4*Math.PI*Math.PI*R*r)}`;
            }
            default: return "Geometria inválida.";
        }
    }

    // ── sub-motor de engenharia ──────────────────────────────────

    function calculateEngineering(op) {
        const g=(n)=>rn(n);
        switch(op){
            case "tensao": {
                const f=g("forca"), a=g("area");
                if(f===null||a===null||a===0) return "Área ≠ 0.";
                return `Tensão σ: ${fmt(f/a)} Pa`;
            }
            case "deformacao": {
                const d=g("deltaL"), L=g("L");
                if(d===null||L===null||L===0) return "L ≠ 0.";
                return `Deformação ε: ${fmt(d/L)} (adimensional)`;
            }
            case "modElastico": {
                const t=g("tensao"), d=g("deformacao");
                if(t===null||d===null||d===0) return "Deformação ≠ 0.";
                return `Módulo E: ${fmt(t/d)} Pa`;
            }
            case "momentoFletor": {
                const M=g("momento"), c=g("c"), I=g("inercia");
                if(M===null||c===null||I===null||I===0) return "I ≠ 0.";
                return `σ = M·c/I: ${fmt(M*c/I)} Pa`;
            }
            case "cisalhamento": {
                const f=g("forca"), a=g("area");
                if(f===null||a===null||a===0) return "Área ≠ 0.";
                return `τ: ${fmt(f/a)} Pa`;
            }
            case "torque": {
                const T=g("torque"), r=g("raio"), J=g("J");
                if(T===null||r===null||J===null||J===0) return "J ≠ 0.";
                return `τ = T·r/J: ${fmt(T*r/J)} Pa`;
            }
            case "flambagem": {
                const E=g("E"), I=g("I"), Le=g("Le");
                if(E===null||I===null||Le===null||Le===0) return "Le ≠ 0.";
                return `Carga crítica: ${fmt((Math.PI*Math.PI*E*I)/(Le*Le))} N`;
            }
            case "calorQ": {
                const m=g("massa"), c=g("calor_esp"), dT=g("deltaT");
                if(m===null||c===null||dT===null) return "Preencha todos os campos.";
                return `Q = m·c·ΔT: ${fmt(m*c*dT)} J`;
            }
            case "dilatacao": {
                const al=g("alfa"), L=g("L"), dT=g("deltaT");
                if(al===null||L===null||dT===null) return "Preencha todos os campos.";
                return `ΔL = α·L·ΔT: ${fmt(al*L*dT)} m`;
            }
            case "rendimento": {
                const u=g("potUtil"), t=g("potTotal");
                if(u===null||t===null||t===0) return "Potência total ≠ 0.";
                return `Rendimento: ${fmt((u/t)*100)} %`;
            }
            case "vazao": {
                const a=g("area"), v=g("velocidade");
                if(a===null||v===null) return "Preencha todos os campos.";
                return `Vazão Q = A·v: ${fmt(a*v)} m³/s`;
            }
            case "reynolds": {
                const rho=g("rho"), v=g("v"), D=g("D"), mu=g("mu");
                if(rho===null||v===null||D===null||mu===null||mu===0) return "Viscosidade ≠ 0.";
                return `Re = ρ·v·D/μ: ${fmt((rho*v*D)/mu)}`;
            }
            case "bernoulli": {
                const p1=g("p1"), rho=g("rho"), v1=g("v1"), v2=g("v2");
                if(p1===null||rho===null||v1===null||v2===null) return "Preencha todos os campos.";
                return `p2 ≈ p1 + ½·ρ·(v1²−v2²): ${fmt(p1+0.5*rho*(v1*v1-v2*v2))} Pa`;
            }
            case "pressHidro": {
                const rho=g("rho"), h=g("h");
                if(rho===null||h===null) return "Preencha todos os campos.";
                return `p = ρ·g·h: ${fmt(rho*9.80665*h)} Pa`;
            }
            case "capacitor": {
                const C=g("C"), V=g("V");
                if(C===null||V===null) return "Preencha todos os campos.";
                return `E = ½·C·V²: ${fmt(0.5*C*V*V)} J`;
            }
            case "indutor": {
                const L=g("L_ind"), I=g("I");
                if(L===null||I===null) return "Preencha todos os campos.";
                return `E = ½·L·I²: ${fmt(0.5*L*I*I)} J`;
            }
            case "reatorLC": {
                const L=g("L_ind"), C=g("C");
                if(L===null||C===null||L===0||C===0) return "L e C ≠ 0.";
                return `f₀ = 1/(2π√LC): ${fmt(1/(2*Math.PI*Math.sqrt(L*C)))} Hz`;
            }
            case "divisorTensao": {
                const Vin=g("Vin"), R1=g("R1"), R2=g("R2");
                if(Vin===null||R1===null||R2===null) return "Preencha todos os campos.";
                return `Vout = Vin·R2/(R1+R2): ${fmt(Vin*R2/(R1+R2))} V`;
            }
            case "cargaDistribuida": {
                const w=g("w"), L=g("L");
                if(w===null||L===null) return "Preencha todos os campos.";
                return `Reações: R = R = ${fmt((w*L)/2)} N (cada apoio)`;
            }
            case "momentoMax": {
                const w=g("w"), L=g("L");
                if(w===null||L===null) return "Preencha todos os campos.";
                return `Mmáx = w·L²/8: ${fmt((w*L*L)/8)} N·m`;
            }
            case "inerciRetangulo": {
                const b=g("base"), h=g("altura");
                if(b===null||h===null) return "Preencha todos os campos.";
                return `I = b·h³/12: ${fmt((b*h**3)/12)} m⁴`;
            }
            case "inerciCirculo": {
                const r=g("raio");
                if(r===null) return "Preencha o campo.";
                return `I = π·r⁴/4: ${fmt((Math.PI*r**4)/4)} m⁴`;
            }
            case "convTemp": {
                const v=g("valor"), d=g("de");
                if(v===null||d===null) return "Preencha todos os campos.";
                if(d===0) return `${v} °C = ${fmt(v*9/5+32)} °F = ${fmt(v+273.15)} K`;
                if(d===1) return `${v} °F = ${fmt((v-32)*5/9)} °C = ${fmt((v-32)*5/9+273.15)} K`;
                if(d===2) return `${v} K = ${fmt(v-273.15)} °C = ${fmt((v-273.15)*9/5+32)} °F`;
                return "De: 0=°C  1=°F  2=K";
            }
            case "convPressao": {
                const v=g("valor");
                if(v===null) return "Preencha o campo.";
                return `${fmt(v)} Pa\n= ${fmt(v/1000)} kPa\n= ${fmt(v/1e5)} bar\n= ${fmt(v/101325)} atm\n= ${fmt(v/6894.76)} psi`;
            }
            default: return "Engenharia inválida.";
        }
    }

    // ── dispatcher principal ──────────────────────────────────────

    function calculate() {
        const type = calcType.value;
        const subtypeKey = {
            finance:     "financeType",
            electrical:  "electricalType",
            physics:     "physicsType",
            progression: "progressionType",
            geometry:    "geometryType",
            engineering: "engineeringType"
        };
        const sub = subtypeKey[type];
        const op = sub ? (form.elements[sub]?.value || "") : "";

        let result;
        // get operation description for history
        let opDesc = labels[type] || type;
        if (op) {
            const optMap = {
                finance: financeOptions,
                electrical: electricalOptions,
                physics: physicsOptions,
                progression: progressionOptions,
                geometry: geometryOptions,
                engineering: engineeringOptions
            };
            const map = optMap[type];
            if (map && map[op]) opDesc = map[op].title;
        }

        switch (type) {
            case "sum": {
                const raw = getFormValue("numbers");
                const nums = parseNumbers(raw);
                if (nums.length < 2) result = "Informe ao menos 2 números.";
                else result = `Soma: ${fmt(nums.reduce((a,v)=>a+v,0))}`;
                break;
            }
            case "subtract": {
                const raw = getFormValue("numbers");
                const nums = parseNumbers(raw);
                if (nums.length < 2) result = "Informe ao menos 2 números.";
                else result = `Subtração: ${fmt(nums.reduce((a,v)=>a-v))}`;
                break;
            }
            case "multiply": {
                const a=rn("value1"), b=rn("value2");
                if(a===null||b===null) result = "Preencha ambos os campos.";
                else result = `Multiplicação: ${fmt(a*b)}`;
                break;
            }
            case "divide": {
                const a=rn("value1"), b=rn("value2");
                if(a===null||b===null) result = "Preencha ambos os campos.";
                else if(b===0) result = "Divisão por zero!";
                else result = `Divisão: ${fmt(a/b)}`;
                break;
            }
            case "bhaskara": {
                const a=rn("a"), b=rn("b"), c_=rn("c");
                if(a===null||b===null||c_===null) result = "Preencha todos os coeficientes.";
                else if(a===0) result = "A não pode ser 0 (equação de 1º grau).";
                else {
                    const delta = b*b - 4*a*c_;
                    if(delta < 0) result = "Δ < 0 — sem raízes reais.";
                    else {
                        const x1 = (-b + Math.sqrt(delta))/(2*a);
                        const x2 = (-b - Math.sqrt(delta))/(2*a);
                        result = `Δ = ${fmt(delta)}\nx' = ${fmt(x1)}\nx'' = ${fmt(x2)}`;
                    }
                }
                break;
            }
            case "hypotenuse": {
                const c1=rn("cateto1"), c2=rn("cateto2");
                if(c1===null||c2===null) result = "Preencha ambos os catetos.";
                else result = `Hipotenusa: ${fmt(Math.sqrt(c1*c1+c2*c2))}`;
                break;
            }
            case "log": {
                const base = getFormValue("base");
                const val = rn("logaritmando");
                if(val===null||val<=0) result = "Logaritmando > 0.";
                else if(base==="e") result = `ln(${fmt(val)}) = ${fmt(Math.log(val))}`;
                else {
                    const b = Number(base);
                    if(Number.isNaN(b)||b<=0||b===1) result = "Base inválida.";
                    else result = `log_{${base}}(${fmt(val)}) = ${fmt(Math.log(val)/Math.log(b))}`;
                }
                break;
            }
            case "finance":     result = calculateFinance(op); break;
            case "electrical":  result = calculateElectrical(op); break;
            case "physics":     result = calculatePhysics(op); break;
            case "progression": result = calculateProgression(op); break;
            case "geometry":    result = calculateGeometry(op); break;
            case "engineering": result = calculateEngineering(op); break;
            default: result = "Tipo de cálculo desconhecido.";
        }

        // Save to localStorage history
        saveToHistory(opDesc, result);

        return result;
    }

    // ── sistema de histórico (localStorage) ──────────────────────

    const HISTORY_KEY = "calcHistory";

    function loadHistory() {
        try {
            const data = localStorage.getItem(HISTORY_KEY);
            return data ? JSON.parse(data) : [];
        } catch { return []; }
    }

    function saveToHistory(type, result) {
        const history = loadHistory();
        const entry = {
            id: Date.now(),
            date: new Date().toLocaleString("pt-BR"),
            type: type,
            result: result
        };
        history.unshift(entry); // most recent first
        // keep max 100 entries
        if (history.length > 100) history.length = 100;
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
        renderHistory();
    }

    function renderHistory() {
        const listEl = document.getElementById("history-list");
        if (!listEl) return;
        const history = loadHistory();
        if (history.length === 0) {
            listEl.innerHTML = '<p class="history-empty">Nenhum cálculo realizado ainda.</p>';
            return;
        }
        listEl.innerHTML = history.map(e => `
            <div class="history-item">
                <div class="h-date">${e.date}</div>
                <div class="h-type">${escapeHtml(e.type)}</div>
                <div class="h-result">${escapeHtml(e.result)}</div>
            </div>
        `).join("");
    }

    function clearHistory() {
        localStorage.removeItem(HISTORY_KEY);
        renderHistory();
    }

    function escapeHtml(str) {
        const div = document.createElement("div");
        div.textContent = str;
        return div.innerHTML;
    }

    // ── event listeners ──────────────────────────────────────────

    calcType.addEventListener("change", renderFields);
    form.addEventListener("change", (e) => {
        if(["financeType","electricalType","physicsType","progressionType","geometryType","engineeringType"].includes(e.target.name)) renderFields();
    });
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        resultBox.textContent = calculate();
    });

    // clear history button
    document.addEventListener("click", (e) => {
        if (e.target.id === "clear-history") clearHistory();
    });

    // load history on page load
    renderHistory();
    renderFields();
});
