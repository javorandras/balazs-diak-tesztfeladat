let fruits = ["apple", "banana", "cherry", "lemon", "melon", "orange", "peach", "pineapple", "plum", "strawberry"];
let occupiedIndexes = new Map();
let selectedFruitIndex = -1;
let containerFruits = new Map();

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function checkProgress() {
    if(containerFruits.size == 6) {
        $(".win").toggleClass("active");
    }
}

function getFruitName(index) {
    let fruitName = "";
    occupiedIndexes.forEach((v, k) => {
        if (parseInt(v) == index) {
            fruitName = fruits[k];
        }
    });
    return fruitName;
}

function createFruitBoxes() {
    for (let i = 0; i < 6; i++) {
        let rnd = getRandomInt(fruits.length);
        while (occupiedIndexes.has(rnd)) {
            rnd = getRandomInt(fruits.length);
        }
        $(".pool").append(`<div class='fruitBox' id='${i}'></div>`);
        $(`#${i}`).css({
            'background-image': `url('assets/images/${fruits[rnd]}_group.png')`,
        });
        occupiedIndexes.set(rnd, i);
    }
}

function createContainers() {
    for (let j = 0; j < 3; j++) {
        $(".displayArea").append(`<div class="container" id="container_${j}" containerid="${j}"></div>`)
    }
}

let selectedContainerFruit = -1;
function handleFruitBoxClick(e) {
    let element = e.target;
    if(selectedContainerFruit > -1) {
        $(`#fruit_${selectedContainerFruit}`).toggleClass("selected", false);
        selectedContainerFruit = -1;
    }
    if ($(element).hasClass("deactivated")) return;
    if (selectedFruitIndex != $(element).attr('id') && selectedFruitIndex > -1) {
        $(`#${selectedFruitIndex}`).toggleClass("selected", false);
    }
    $(element).toggleClass("selected", true);
    selectedFruitIndex = parseInt($(element).attr('id'));
}

function getContainerFruits(container) {
    let fruits = [];
    containerFruits.forEach((v, k) => {
        if(v == container) {
            fruits.push(k);
        }
    });
    return fruits;
}

function handleContainerClick(e) {
    let element = $(e.target);
    if (selectedFruitIndex > -1) {
        if (element.hasClass("containerFruit")) element = $(`#container_${element.attr('parentid')}`);
        let id = parseInt(element.attr('containerid'));
        if(!containerFruits.has(selectedFruitIndex)) {
            containerFruits.set(selectedFruitIndex, id);
        }
        $(`#${selectedFruitIndex}`).toggleClass("deactivated", true);
        $(`#${selectedFruitIndex}`).toggleClass("selected", false);
        element.append(`<div class="containerFruit" id="fruit_${selectedFruitIndex}" fruitid="${selectedFruitIndex}" parentid="${id}"></div>`);
        let fruitName = getFruitName(selectedFruitIndex);
        $(`#fruit_${selectedFruitIndex}`).css({
            'background-image': `url('assets/images/${fruitName}_1.png')`,
        });
        selectedFruitIndex = -1;
    } else {
        if(element.hasClass("containerFruit")) {
            let fruitId = parseInt(element.attr('fruitid'));
            if(selectedContainerFruit > -1) {
                let containerId = parseInt(element.attr('parentid'));
                let fruitsInContainer = getContainerFruits(containerId);
                if(fruitsInContainer.length < 2) {
                    if(containerFruits.has(selectedContainerFruit)) {
                        containerFruits.set(selectedContainerFruit, containerId);
                    }
                    let child = $(`#fruit_${selectedContainerFruit}`);
                    child.detach().appendTo($(`#container_${containerId}`));
                    child.toggleClass("selected", false);
                    selectedContainerFruit = -1;
                } 
                return;
            }
            selectedContainerFruit = fruitId;
            $(`#fruit_${fruitId}`).toggleClass("selected", true);
        } else {
            let containerId = parseInt(element.attr('containerid'));
            let fruitsInContainer = getContainerFruits(containerId);
            if(fruitsInContainer.length < 2) {
                if(containerFruits.has(selectedContainerFruit)) {
                    containerFruits.set(selectedContainerFruit, containerId);
                }
                let child = $(`#fruit_${selectedContainerFruit}`);
                child.detach().appendTo(element);
                child.toggleClass("selected", false);
                selectedContainerFruit = -1;
            } 
        }
    }
    checkProgress();
}

$(document).ready(() => {

    createFruitBoxes();
    createContainers();

    $(".fruitBox").on("click", handleFruitBoxClick);
    $(".container").on("click", handleContainerClick);

});