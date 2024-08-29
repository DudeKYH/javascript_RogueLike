// 일정 시간(timeDelay) 기다리는 함수
export function wait(timeDelay) {
    return new Promise((resolve) => {
        setTimeout(resolve, timeDelay);
    });
}

// Func를 호출하고 일정 시간(timeDelay) 기다리는 함수
export function waitDelay(callBackFuncName, timeDelay) {
    callBackFuncName();
    return new Promise((resolve) => {
        setTimeout(resolve, timeDelay);
    });
}

// 일정 시간 간격(timeInterval) 마다 Func를 호출하고
// 일정 시간 후(timeDelay) 종료하는 함수
export async function waitInterval(callBackFuncName, timeInterval, timeDelay) {
    const timeID = setInterval(callBackFuncName, timeInterval);

    return new Promise((resolve) => setTimeout(resolve, timeDelay)).then(() => {
        clearInterval(timeID);
    });
}
