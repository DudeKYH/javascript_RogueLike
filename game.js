import { Player } from './player.js';
import { Stage } from './stage.js';

// chcp 65001

export function getRandomNumber(size, startNum) {
    // Math.random() : 0 이상 1 미난의 난수 return
    return startNum + parseInt(Math.random() * size);
}

export async function startGame() {
    console.clear();
    const player = new Player();
    let stageNum = 1;

    while (stageNum <= 10) {
        const stage = new Stage(player, stageNum);
        stage.battle();

        // 스테이지 클리어, 도망가기 : true
        // 스테이지 패배 : false
        const stageResult = await stage.end();

        stageNum = stageResult ? stageNum + 1 : 1;
    }
}
