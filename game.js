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

        // stageResult : 스테이지 종료 후 결과
        // 스테이지 클리어, 도망가기, 강제 스킵 : true
        // 스테이지 패배 : false
        const stageResult = await stage.end();

        stageNum = stageResult ? stageNum + 1 : 1;

        // 모든 스테이지 클리어 시,
        // AllClaer Display 후, 로비로 이동
        if(stageNum > 10)
            await stage.animateAllClear();
    }
}
