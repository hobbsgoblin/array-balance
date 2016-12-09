function findBalance(arr, getClosest = false) {
  const sum = sumRange(arr, 0, arr.length);
  const avg = sum / 2;

  // Finds the exact balance point, if there is one
  const trueBalance = arr.reduce((balance, next, index, array) => {
    if (balance) return balance;
    if (sumLeft(array, index) === sumRight(array, index)) {
      return index;
    }
    return undefined;
  }, undefined);

  if (trueBalance) {
    return {
      exact: true,
      index: trueBalance,
    }
  }

  if (getClosest === false) return undefined;

  // Finds the index that is closest to the balance point
  const closestBalance = arr.reduce((best, next, index, array) => {
    const diffSides = Math.abs(sumLeft(array, index) - sumRight(array, index));
    const diffFromAvg = Math.abs(diffSides - avg);
    if (diffFromAvg < best.diffFromAvg) {
      return {
        index: index,
        diffFromAvg: diffFromAvg,
      }
    }
    return best;
  }, {index: 0, diffFromAvg: sum});

  return {
    exact: false,
    index: closestBalance.index,
  };
}

function sumRange(arr, start = 0, end) {
  return arr
    .slice(start, end + 1)
    .reduce((sum, num) => sum + num, 0);
}

function sumLeft(arr, index) {
  const indexLeftOfCurrent = index - 1 < 0 ? 0 : index - 1;  // Prevent negative index
  return sumRange(arr, 0, indexLeftOfCurrent);
}

function sumRight(arr, index) {
  return sumRange(arr, index + 1, arr.length);
}

/* App */
// Application state
const arrays = [
  [1, 1, 2, 3, 1, 1, 4, 1, 1],
  [2, 1, 0, 3],
  [6, 4, 2],
  [12, 1, 1, 3, 4, 2, 1, 1],
];

let submitButton = document.getElementById('submit');
let arrayInput = document.getElementById('array-input');
let arrSelect = document.getElementById('select-array');
let answerText = document.getElementById('answer-text');
let answerDisplay = document.getElementById('answer-display');
let approxCheckbox = document.getElementById('allow-approximate');

// function _renderResult(result) {
//   let resultStr = result ? result.index : 'No balance point';
//   if (approxCheckbox.checked) {
//     resultStr = (result.exact ? 'exactly ' : 'approximately ') + result.index;
//   }
//   answerText.textContent = "The balance point is: " + resultStr;
// }

function _renderResult(arr) {
  const balResult = findBalance(arr, approxCheckbox.checked);
  console.log(balResult);
  const balIndex = balResult.index;
  let resultStr = balResult ? balResult.index : 'No balance point';
  if (approxCheckbox.checked) {
    resultStr = (balResult.exact ? 'exactly ' : 'approximately ') + balResult.index;
  }
  answerText.textContent = "The balance point is: " + resultStr;

  let leftContainer = document.createElement('div');
  let rightContainer = document.createElement('div');
  let balIndexContainer = document.createElement('div');
  leftContainer.className = 'result-left-container';
  rightContainer.className = 'result-right-container';
  balIndexContainer.className = 'result-bal-container';

  arr
    .slice(0, balIndex)
    .forEach((element) => {
      let leftItem = document.createElement('span');
      leftItem.textContent = element;
      leftContainer.appendChild(leftItem);
    });
  arr
    .slice(balIndex + 1, arr.length + 1)
    .forEach((element) => {
      let rightItem = document.createElement('span');
      rightItem.textContent = element;
      rightContainer.appendChild(rightItem);
    });
  let balItem = document.createElement('span');
  balItem.textContent = arr[balIndex];
  balIndexContainer.appendChild(balItem);

  answerDisplay.innerHTML = '';
  answerDisplay.appendChild(leftContainer);
  answerDisplay.appendChild(balIndexContainer);
  answerDisplay.appendChild(rightContainer);
}

function _handleArrSelect(index) {
  _renderResult(arrays[index]);
}

function _render() {
  // Empty the container before rendering new results
  let emptyContainer = arrSelect.cloneNode(false);
  arrSelect.parentNode.replaceChild(emptyContainer, arrSelect);
  arrSelect = document.getElementById("select-array");

  let arrContainer = document.createElement('div');
  arrContainer.id = "arrays-container";
  let arrSelectMarkup = arrays.reduce((container, arr, index) => {
    let label = document.createElement('label');
    let labelText = document.createTextNode("[" + arr.toString() + "]");
    let input = document.createElement('input');
    input.name = "array";
    input.value = index;
    input.type = "radio";
    label.appendChild(input);
    label.appendChild(labelText);
    label.addEventListener('click', function() {
      _handleArrSelect(index);
    });
    container.appendChild(label);
    return container;
  }, arrContainer);
  arrSelect.appendChild(arrSelectMarkup);
  answerText.textContent = "No array selected yet...";
}

submitButton.addEventListener('click', function(e) {
  e.preventDefault();
  const newArray = cleanArrayInput(arrayInput.value);
  if (newArray) {
    addArray(newArray, true);
  } else {
    alert("Invalid input :(");
  }
});

function addArray(array, clickNewArray = false) {
  arrays.push(array);
  _render();
  if (clickNewArray) {
    document
      .getElementById("arrays-container")
      .lastChild
      .dispatchEvent((new MouseEvent('click')));
  }
}

function cleanArrayInput(input) {
  const regexNotNumbersOrCommas = /[^0-9,]/g;
  const cleanedInput = input
    .replace(regexNotNumbersOrCommas, '')
    .split(',')
    .map((element) => parseInt(element))
    .filter((element) => !isNaN(element));
  if (Array.isArray(cleanedInput) && cleanedInput.length) {
    return cleanedInput;
  }
  return false;
}

_render();
