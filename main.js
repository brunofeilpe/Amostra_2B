// Obtém a referência do elemento de entrada (input) que serve como o visor da calculadora
const display = document.getElementById("display");

// Função responsável por adicionar um caractere ou operador ao visor da calculadora
function appendToDisplay(value) {
    // Verifica se o elemento do visor existe na página antes de prosseguir
    if (!display) {
        // Interrompe a execução da função caso o visor não seja encontrado
        return;
    }

    // Adiciona o valor recebido como argumento ao final do texto atual do visor
    display.value += value;
    // Rola o conteúdo do visor automaticamente para a direita para mostrar o último caractere inserido
    display.scrollLeft = display.scrollWidth;
}

// Função responsável por limpar completamente o conteúdo do visor
function clearDisplay() {
    // Verifica se o elemento do visor existe na página antes de tentar limpá-lo
    if (!display) {
        // Interrompe a execução caso o visor não esteja acessível
        return;
    }

    // Atribui uma string vazia ao valor do visor, apagando tudo
    display.value = "";
}

// Função responsável por apagar apenas o último caractere digitado no visor
function deleteLast() {
    // Verifica se o visor existe na página antes de realizar a operação
    if (!display) {
        // Interrompe a execução se o visor não for encontrado
        return;
    }

    // Remove o último caractere extraindo uma fatia do texto do início até o penúltimo caractere
    display.value = display.value.slice(0, -1);
}

// Função principal que avalia e calcula a expressão matemática contida no visor
function calcular() {
    // Verifica se o visor está disponível para a leitura da expressão
    if (!display) {
        // Interrompe a execução se o visor for nulo
        return;
    }

    // Bloco try para capturar e tratar quaisquer erros durante a avaliação da fórmula
    try {
        // Remove as vírgulas da expressão (usadas como separadores de milhares) para não quebrar o cálculo
        let expression = display.value.replace(/,/g, "");
        // Substitui o símbolo de circunflexo '^' pelo operador de exponenciação '**' do JavaScript
        expression = expression.replace(/\^/g, "**");
        // Substitui o padrão de raiz quadrada com parênteses '√(' pela função nativa 'Math.sqrt('
        expression = expression.replace(/√\(/g, "Math.sqrt(");
        // Substitui o símbolo de raiz seguido diretamente por números '√X' por 'Math.sqrt(X)'
        expression = expression.replace(/√(\d+(\.\d+)?)/g, "Math.sqrt($1)");
        // Trata percentagens seguidas de números '%X' convertendo para o equivalente decimal '/100*X'
        expression = expression.replace(/%(\d+(\.\d+)?)/g, "/100*$1");
        // Substitui qualquer símbolo de percentagem isolado '%' por uma divisão por 100
        expression = expression.replace(/%/g, "/100");

        // Executa e avalia a string matemática modificada através da função global eval()
        const result = eval(expression);

        // Verifica se o resultado obtido é inválido, não é um número ou é uma divisão por zero (Infinity)
        if (typeof result !== "number" || Number.isNaN(result) || !Number.isFinite(result)) {
            // Define o texto do visor como "Erro" caso o resultado não seja computável
            display.value = "Erro";
            // Finaliza a função de cálculo
            return;
        }

        // Formata o número resultante para o padrão americano com até 10 casas decimais
        display.value = Number(result).toLocaleString("en-US", { maximumFractionDigits: 10 });
    } catch (error) {
        // Se ocorrer qualquer exceção na sintaxe ou execução, exibe "Erro" no visor
        display.value = "Erro";
    }
}

// Adiciona um ouvinte de eventos global para capturar as teclas pressionadas no teclado físico
document.addEventListener("keydown", (event) => {
    // Verifica se o visor está carregado antes de processar os comandos do teclado
    if (!display) {
        // Ignora o evento se o visor não estiver disponível
        return;
    }

    // Extrai o nome da tecla pressionada a partir do objeto do evento
    const { key } = event;

    // Verifica se a tecla é um número de 0 a 9 ou um dos operadores aritméticos básicos válidos
    if (/^[0-9]$/.test(key) || ["+", "-", "*", "/", ".", "(", ")", "%"].includes(key)) {
        // Impede o comportamento padrão do navegador para essa tecla
        event.preventDefault();
        // Adiciona a respetiva tecla diretamente ao ecrã da calculadora
        appendToDisplay(key);
        // Interrompe o processamento deste evento
        return;
    }

    // Verifica se a tecla pressionada foi o circunflexo (usado para potência)
    if (key === "^") {
        // Previne o comportamento padrão do sistema operacional
        event.preventDefault();
        // Insere o sinal de potência '^' no visor
        appendToDisplay("^");
        // Encerra a execução do bloco do evento
        return;
    }

    // Verifica se o utilizador pressionou a tecla 'Enter'
    if (key === "Enter") {
        // Evita a submissão de formulários ou comportamento padrão da tecla Enter
        event.preventDefault();
        // Dispara a função que executa o cálculo da expressão
        calcular();
        // Conclui o tratamento da tecla
        return;
    }

    // Verifica se a tecla pressionada foi o 'Escape' (ESC)
    if (key === "Escape") {
        // Evita ações padrão associadas à tecla Escape
        event.preventDefault();
        // Limpa totalmente o visor da calculadora
        clearDisplay();
        // Conclui o tratamento da tecla
        return;
    }

    // Verifica se o utilizador pressionou a tecla de apagar (Backspace)
    if (key === "Backspace") {
        // Previne o recuo de página ou comportamento padrão do Backspace
        event.preventDefault();
        // Remove o último dígito inserido no ecrã
        deleteLast();
    }
});