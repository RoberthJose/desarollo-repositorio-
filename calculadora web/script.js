const result = document.getElementById("result");
const history = document.getElementById("history");
const historyList = document.getElementById("historyList");
const themeToggle = document.getElementById("themeToggle");
const clearHistoryBtn = document.querySelector(".clear-history");

let currentInput = "";
let calculated = false;
let memory = 0;

// ===== DISPLAY =====
function updateDisplay(){
    result.innerText = currentInput || "0";
}

// ===== INPUT =====
function appendValue(value){

    // 🔥 COMPORTAMIENTO TIPO CASIO
    if(calculated){

        // Si escribe número, empieza nueva operación
        if(!isNaN(value)){
            currentInput = "";
        }

        calculated = false;
    }

    currentInput += value;
    updateDisplay();
}

// ===== LIMPIAR =====
function clearDisplay(){
    currentInput = "";
    history.innerText = "";
    updateDisplay();
}

// ===== BORRAR =====
function deleteLast(){
    currentInput = currentInput.slice(0,-1);
    updateDisplay();
}

// ===== GRADOS A RADIANES =====
const toRad = (deg) => deg * Math.PI / 180;

// ===== FORMATO CASIO =====
function formatExpression(expr){

    return expr
        .replace(/÷/g,"/")
        .replace(/×/g,"*")
        .replace(/π/g,"Math.PI")
        .replace(/e/g,"Math.E")

        // 🔥 RAÍZ
        .replace(/√\(?(\d+(\.\d+)?)\)?/g,"Math.sqrt($1)")

        .replace(/\^/g,"**");
}

// ===== CALCULAR =====
function calculate(){

    try{

        if(currentInput === "") return;

        let expr = currentInput;

        // ===== SIN =====
        if(expr.startsWith("sin(")){

            let num = parseFloat(
                expr.replace("sin(","")
            );

            return finishCalc(
                expr,
                Math.sin(toRad(num))
            );
        }

        // ===== COS =====
        if(expr.startsWith("cos(")){

            let num = parseFloat(
                expr.replace("cos(","")
            );

            return finishCalc(
                expr,
                Math.cos(toRad(num))
            );
        }

        // ===== TAN =====
        if(expr.startsWith("tan(")){

            let num = parseFloat(
                expr.replace("tan(","")
            );

            return finishCalc(
                expr,
                Math.tan(toRad(num))
            );
        }

        // ===== LOG =====
        if(expr.startsWith("log(")){

            let num = parseFloat(
                expr.replace("log(","")
            );

            return finishCalc(
                expr,
                Math.log10(num)
            );
        }

        // ===== LN =====
        if(expr.startsWith("ln(")){

            let num = parseFloat(
                expr.replace("ln(","")
            );

            return finishCalc(
                expr,
                Math.log(num)
            );
        }

        // ===== PORCENTAJE =====
        expr = expr.replace(
            /(\d+)%/g,
            "($1/100)"
        );

        // ===== EXPRESIÓN NORMAL =====
        let expression = formatExpression(expr);

        let calculation = eval(expression);

        if(!isFinite(calculation)){

            result.innerText = "Error";
            return;
        }

        finishCalc(expr, calculation);

    }catch(error){

        console.log(error);

        result.innerText = "Error";

        currentInput = "";
    }
}

// ===== FINALIZAR =====
function finishCalc(expression, value){

    value = parseFloat(
        value.toFixed(10)
    );

    history.innerText = expression + " =";

    result.innerText = value;

    addToHistory(
        expression + " = " + value
    );

    currentInput = value.toString();

    calculated = true;
}

// ===== FUNCIONES CIENTÍFICAS =====

function sinFunction(){

    if(calculated){
        currentInput = "";
        calculated = false;
    }

    currentInput += "sin(";

    updateDisplay();
}

function cosFunction(){

    if(calculated){
        currentInput = "";
        calculated = false;
    }

    currentInput += "cos(";

    updateDisplay();
}

function tanFunction(){

    if(calculated){
        currentInput = "";
        calculated = false;
    }

    currentInput += "tan(";

    updateDisplay();
}

function logFunction(){

    if(calculated){
        currentInput = "";
        calculated = false;
    }

    currentInput += "log(";

    updateDisplay();
}

function lnFunction(){

    if(calculated){
        currentInput = "";
        calculated = false;
    }

    currentInput += "ln(";

    updateDisplay();
}

// ===== RAÍZ =====
function squareRoot(){

    if(calculated){
        currentInput = "";
        calculated = false;
    }

    currentInput += "√";

    updateDisplay();
}

// ===== POTENCIA =====
function powerTwo(){

    currentInput += "^2";

    updateDisplay();
}

function powerFunction(){

    currentInput += "^";

    updateDisplay();
}

// ===== FACTORIAL =====
function factorialFunction(){

    let num = parseInt(currentInput);

    if(isNaN(num)) return;

    let fact = 1;

    for(let i = 1; i <= num; i++){

        fact *= i;
    }

    currentInput = fact.toString();

    updateDisplay();
}

// ===== RANDOM =====
function randomFunction(){

    currentInput = Math.random().toFixed(4);

    updateDisplay();
}

// ===== MEMORIA =====
function memoryClear(){

    memory = 0;
}

function memoryAdd(){

    memory += parseFloat(
        currentInput || 0
    );
}

function memorySubtract(){

    memory -= parseFloat(
        currentInput || 0
    );
}

function memoryRecall(){

    currentInput = memory.toString();

    updateDisplay();
}

// ===== HISTORIAL =====
function addToHistory(operation){

    const item =
        document.createElement("div");

    item.classList.add("history-item");

    item.innerText = operation;

    historyList.prepend(item);
}

// ===== LIMPIAR HISTORIAL =====
clearHistoryBtn.addEventListener(
    "click",
    ()=>{

        historyList.innerHTML = "";
    }
);

// ===== TEMA =====
themeToggle.addEventListener(
    "click",
    ()=>{

        document.body.classList.toggle(
            "light-mode"
        );

        themeToggle.innerText =
            document.body.classList.contains(
                "light-mode"
            )
            ? "☀️"
            : "🌙";
    }
);

// ===== TECLADO =====
document.addEventListener(
    "keydown",
    (event)=>{

        const key = event.key;

        if(!isNaN(key))
            appendValue(key);

        if("+-*/.%".includes(key))
            appendValue(key);

        if(key === "Enter")
            calculate();

        if(key === "Backspace")
            deleteLast();

        if(key === "Escape")
            clearDisplay();
    }
);