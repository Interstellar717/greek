const qs = q => { return document.querySelector(q) };
const qsa = q => { return document.querySelectorAll(q) };
const crel = e => { return document.createElement(e) };
const arrayRandom = (arr, c = () => true) => {
    var res;

    do {
        res = arr[Math.floor(Math.random() * arr.length)];
    } while (!c(res))

    return res;
};
const random = (min, max) => { return Math.floor(Math.random() * (max - min)) + min };


function shuffle(arr, n = 100) {
    for (let i = 0; i < n; i++) {
        var [a, b] = [random(0, arr.length), random(0, arr.length)];
        [arr[a], arr[b]] = [arr[b], arr[a]];
    } return arr;
}

function comprehension(length, func, array = [], shuffleIt = false, noDupes = false) {
    for (let i = array.length; i < length; i = array.length) {
        array.push(func(i));
        noDupes && (array = array.filter((e, i) => array.indexOf(e) == i));
    } return shuffleIt ? shuffle(array) : array;
}