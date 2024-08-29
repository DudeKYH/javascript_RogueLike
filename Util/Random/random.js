export function getRandomInt(start, end) {
    // Math.random() : 0 이상 1 미난의 난수 return
    return start + Math.round(Math.random() * (end - start));
}

export function getRandomFloat(start, end) {
    return parseFloat((start + Math.random() * (end - start)).toFixed(1));
}

export function checkObbs(obbs) {
    const randomObbsNumber = getRandomInt(0, 100);

    console.log(randomObbsNumber, obbs);

    return randomObbsNumber <= obbs ? true : false;
}
