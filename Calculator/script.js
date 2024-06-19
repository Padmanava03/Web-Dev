const maxLength = 30;
let equalTo = 0;
let equationHistory = '';
let result = '';

function calculate(button) {
    const x = button.value || button.textContent;
    const inputText = document.getElementsByTagName("input")[0];
    const historyDiv = document.querySelector('.history');

    if (isNumberOrOperator(x) && isCommonError(inputText.value)) {
        handleInput(x, inputText);
    } else {
        handleSpecialCases(x, inputText, historyDiv);
    }
}

function isNumberOrOperator(x) {
    const regex = /^[0-9+−×÷().]$/;
    return regex.test(x);
}

function isCommonError(inputValue) {
    return inputValue !== "Syntax error" && inputValue !== "Cannot divide by 0" && inputValue !== "Result is undefined";
}

function handleInput(x, inputText) {
    const inputLastIndex = inputText.value.charAt(inputText.value.length - 1);

    if (inputText.value.length >= maxLength) {
        inputText.style.border = "2px solid red";
        return;
    }

    if (inputText.value === "0" || equalTo) {
        handleEqualToCase(x, inputText);
    } else {
        handleRegularInput(x, inputLastIndex, inputText);
    }
}

function handleEqualToCase(x, inputText) {
    const historyDiv = document.querySelector('.history');
    historyDiv.textContent = result;

    if (/[+−×÷]/.test(x)) {
        inputText.value += x;
    } else {
        historyDiv.textContent = '';
        inputText.value = (x === ".") ? "0" + x : x;
    }

    inputText.style.border = "";
    equalTo = 0;
}

function handleRegularInput(x, inputLastIndex, inputText) {
    if (x === ".") {
        inputText.value += (/[+−×÷]/.test(inputLastIndex)) ? "0" + x : x;
    } else if (/[+−×÷]/.test(x)) {
        handleOperatorInput(x, inputLastIndex, inputText);
    } else {
        inputText.value += x;
    }

    inputText.style.border = "";
}

function handleOperatorInput(x, inputLastIndex, inputText) {
    if (/[+−×÷]/.test(inputLastIndex) || inputLastIndex === ".") {
        inputText.value = inputText.value.slice(0, -1) + x;
    } else {
        inputText.value += x;
    }
}

function handleSpecialCases(x, inputText, historyDiv) {
    if (x === "=") {
        handleEquals(inputText, historyDiv);
    } else if (x === "AC") {
        handleAC(inputText, historyDiv);
    } else if (x === "Del" && isCommonError(inputText.value)) {
        handleDelete(inputText, historyDiv);
    }
}

function handleEquals(inputText, historyDiv) {
    if (isCommonError(inputText.value) && equalTo !== 1 && !/[+−×÷]/.test(inputText.value.charAt(inputText.value.length - 1))) {
        evaluateExpression(inputText, historyDiv);
    } else {
        inputText.style.border = "2px solid red";
    }
}

function evaluateExpression(inputText, historyDiv) {
    let temp = inputText.value;
    equationHistory = (temp.charAt(temp.length - 1) === ".") ? temp.slice(0, -1) + "=" : temp + " = ";
    historyDiv.textContent = equationHistory;

    try {
        result = eval(temp.replace(/−/g, "-").replace(/×/g, "*").replace(/÷/g, "/"));

        if (result === Infinity) {
            handleErrors("Cannot divide by 0", inputText);
        } else if (isNaN(result)) {
            handleErrors("Result is undefined", inputText);
        } else {
            inputText.style.border = "";
            inputText.value = result;
        }

        equalTo = 1;
    } catch (e) {
        handleErrors("Syntax error", inputText);
    }
}

function handleAC(inputText, historyDiv) {
    if (historyDiv.textContent !== "" || inputText.value !== "0") {
        inputText.style.textAlign = "right";
        inputText.value = 0;
        inputText.style.border = "";
        equalTo = 0;
        historyDiv.textContent = '';
        result = '';
    } else {
        inputText.style.border = "2px solid red";
    }
}

function handleDelete(inputText, historyDiv) {
    if (inputText.value !== "0" && equalTo !== 1) {
        inputText.value = (inputText.value.length > 1) ? inputText.value.slice(0, -1) : 0;
        inputText.style.border = '';
    } else {
        if (historyDiv.textContent !== '') {
            historyDiv.textContent = '';
            inputText.style.border = '';
        } else {
            inputText.style.border = "2px solid red";
        }
    }
}

function handleErrors(errorMsg, inputText) {
    inputText.style.border = "2px solid red";
    inputText.style.textAlign = "center";
    inputText.value = errorMsg;
}

document.addEventListener('keydown', function(event) {
    const key = event.key;
    const button = document.querySelector(`[data-key="${key}"]`);
    
    if (button) {
        button.classList.add('active-effect');
        button.click();
        setTimeout(() => {
            button.classList.remove('active-effect');
        }, 200);
        event.preventDefault();
    }
});
