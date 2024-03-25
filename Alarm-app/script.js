let timer = document.querySelector(".timer");
const hourInput = document.getElementById("hourInput");
const minInput = document.getElementById("minInput");
const activeAlarm = document.querySelector(".activeAlarm");
const setAlarm = document.getElementById("set");
let alarmArray = [];
let alarmSound = new Audio("alarm.wav");

let initialHr = 0, initialMin = 0, alarmIndex = 0;

const appendZero = (value) => (value < 10 ? "0" + value : value);

const searchObj = (parameter, value) => {
    let alarmObj, objIndex, exists = false;
    alarmArray.forEach((alarm, index) => {
        if (alarm[parameter] == value) {
            exists = true;
            alarmObj = alarm;
            objIndex = index;
            return false;
        }
    });
    return [exists, alarmObj, objIndex];
};

function display() {
    let date = new Date();
    let [hours, minutes, seconds] = [appendZero(date.getHours()), appendZero(date.getMinutes()), appendZero(date.getSeconds())];
    timer.innerHTML = `${hours}:${minutes}:${seconds}`;

    alarmArray.forEach((alarm, index) => {
        if (alarm.isActive) {
            if (`${alarm.alarmHours}:${alarm.alarmMinutes}` === `${hours}:${minutes}`) {
                alarmSound.play();
                alarmSound.loop = true;
            }
        }
    });
}

const inputCheck = (inputValue) => {
    inputValue = parseInt(inputValue);
    if (inputValue < 10) {
        inputValue = appendZero(inputValue);
    }
    return inputValue;
}
hourInput.addEventListener("input", () => {
    hourInput.value = inputCheck(hourInput.value);
});
minInput.addEventListener("input", () => {
    minInput.value = inputCheck(minInput.value);
});

//create alarn div
const createAlarm = (alarmObj) => {
    const { id, alarmHours, alarmMinutes } = alarmObj;
    let alarmDiv = document.createElement("div");
    alarmDiv.classList.add("alarm");
    alarmDiv.setAttribute("data-id", id);
    alarmDiv.innerHTML = `<span>${alarmHours}:${alarmMinutes}</span>`;

    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.addEventListener("click", (e) => {
        if (e.target.checked) {
            startAlarm(e);
        } else {
            stopAlarm(e);
        }
    });
    alarmDiv.appendChild(checkbox);
    let deleteButton = document.createElement("button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    deleteButton.classList.add("deleteButton");
    deleteButton.addEventListener("click", (e) => {
        deleteAlarm(e);
    });
    alarmDiv.appendChild(deleteButton);
    activeAlarm.appendChild(alarmDiv);
};

setAlarm.addEventListener("click", () => {
    alarmIndex += 1;
    let alarmObj = {};
    alarmObj.id = `${alarmIndex}_${hourInput.value}_${minInput.value}`;
    alarmObj.alarmHours = hourInput.value;
    alarmObj.alarmMinutes = minInput.value;
    alarmObj.isActive = false;
    alarmArray.push(alarmObj);
    createAlarm(alarmObj);
    hourInput.value = appendZero(initialHr);
    minInput.value = appendZero(initialMin);
});

const startAlarm = (e) => {
	let searchId = e.target.parentElement.getAttribute("data-id");
	let [exists, obj, index] = searchObj("id", searchId);
	if (exists){
		alarmArray[index].isActive = true;
	}
};

const stopAlarm = (e) => {
	let searchId = e.target.parentElement.getAttribute("data-id");
	let [exists, obj, index] = searchObj("id", searchId);
	if(exists){
		alarmArray[index].isActive = false;
		alarmSound.pause();
		alarmSound.loop = false;
	}
};

const deleteAlarm = (e) => {
	let searchId = e.target.parentElement.parentElement.getAttribute("data-id");
	let [exists, obj, index] = searchObj("id", searchId);
	if(exists){
		e.target.parentElement.parentElement.remove();
		alarmArray.splice(index, 1);
	}
};

window.onload = () => {
    setInterval(display, 1000);
    initialHr = 0;
    initialMin = 0;
    alarmIndex = 0;
    alarmArray = [];
    hourInput.value = appendZero(initialHr);
    minInput.value = appendZero(initialMin);
}
