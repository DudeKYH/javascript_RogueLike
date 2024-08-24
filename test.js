function print() {
    console.log('hello');
}

function waitInterval(func, interval, timeout) {
    const id = setInterval(func, interval);

    return new Promise((resolve) => {
        setTimeout(resolve, timeout);
    }).then(() => {
        clearInterval(id);
    });
}

await waitInterval(print, 200, 1000);
console.log('end');
