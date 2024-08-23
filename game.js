import { Player } from './Class/Player/player.js';
import { Stage } from './Class/Stage/stage.js';

// chcp 65001

export async function startGame() {
    console.clear();
    const player = new Player();
    let stageNum = 1;

    while (stageNum <= 10) {
        const stage = new Stage(player, stageNum);
        await stage.battle();

        // 스테이지 클리어, 도망가기 : true
        // 스테이지 패배 : false
        const stageResult = await stage.end();

        stageNum = stageResult ? stageNum + 1 : 1;
    }
}
