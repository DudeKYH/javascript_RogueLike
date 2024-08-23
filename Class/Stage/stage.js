import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { getRandomInt } from '../../Random/random.js';
import { Monster } from '../Monster/monster.js';

// stage의 상태
// PlAYING(1)   : 배틀
// LOSE(2)      : 플레이어 사망
// CLEAR(3)     : 몬스터 처치
// ESCAPE(4)    : 도망(스테이지 강제 Pass)
const stageStatusObjects = {
    PLAYING: 1,
    LOSE: 2,
    CLEAR: 3,
    ESCAPE: 4,
    SKIP: 5,
};
Object.freeze(stageStatusObjects);

export class Stage {
    constructor(player, stageNum) {
        this.player = player;
        this.monster = new Monster(stageNum);
        this.stageNum = stageNum;
        this.stageStatus = stageStatusObjects.PLAYING;

        // 화면에 출력할 로그를 담을 array
        this.logs = [];
        this.logCount = 1;
    }

    // 일정 시간(timeDelay)동안 기다리는 함수
    wait(timeDelay) {
        return new Promise((resolve) => setTimeout(resolve, timeDelay));
    }

    // Stage, Player, Monster 정보를 출력하는 함수
    displayStatus() {
        const minPlayerDamage = this.player.baseAttackPower;
        const maxPlayerDamage = Math.floor(this.player.baseAttackPower * this.player.powerRatio);

        let hpStr = '';

        for (let i = 0; i < 20; i++) {
            if (parseInt((this.player.hp / this.player.maxHP) * 20) > i) hpStr += '■';
            else hpStr += '□';
        }

        let mpStr = '';

        for (let i = 0; i < 20; i++) {
            if (parseInt((this.player.mp / this.player.maxMP) * 20) > i) mpStr += '■';
            else mpStr += '□';
        }

        console.log(chalk.magentaBright(`\n=== Current Status ===`));
        console.log(
            chalk.cyanBright(`| Stage: ${this.stageNum} |\n`) +
                chalk.blueBright(
                    `| 플레이어 HP   => [${hpStr}] ${this.player.hp}/${this.player.maxHP} |\n`,
                ) +
                chalk.blueBright(
                    `| 플레이어 MP   => [${mpStr}] ${this.player.mp}/${this.player.maxMP} |\n`,
                ) +
                chalk.blueBright(
                    `| 플레이어 정보 => ATTACK: ${minPlayerDamage}~${maxPlayerDamage} / DOUBLE_ATTACK: ${this.player.doubleAttackObbs}% / DEFENSE: ${this.player.defenseObbs}% / ESCAPE: ${this.player.escapeObbs}% \n|`,
                ) +
                chalk.redBright(
                    `| 몬스터 정보 => HP:${this.monster.hp}, Attack: ${this.monster.attackPower} |`,
                ),
        );
        console.log(chalk.magentaBright(`=====================\n`));
    }

    // Stage를 Clear(몬스터 처치)했을 때 출력하는 함수
    displayClear() {
        console.clear();

        const red = getRandomInt(0, 255);
        const green = getRandomInt(0, 255);
        const blue = getRandomInt(0, 255);

        console.log(
            chalk.rgb(red, green, blue).bold(
                figlet.textSync(`Stage    ${this.stageNum}`, {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );
        console.log(
            chalk.rgb(blue, red, green).bold(
                figlet.textSync(`              Clear!!!`, {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );
    }

    // Stage를 Lose(플레이어 사망)했을 때 출력하는 함수
    displayLose() {
        console.clear();

        const red = getRandomInt(0, 255);
        const green = getRandomInt(0, 255);
        const blue = getRandomInt(0, 255);

        console.log(
            chalk.rgb(red, green, blue).bold(
                figlet.textSync(`Game Over`, {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );
        console.log(
            chalk.rgb(blue, red, green).bold(
                figlet.textSync(`     Restart!!!`, {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );
    }

    // Stage를 Escape 성공했을 때 출력하는 함수
    displayEscape() {
        console.clear();

        const red = getRandomInt(0, 255);
        const green = getRandomInt(0, 255);
        const blue = getRandomInt(0, 255);

        console.log(
            chalk.rgb(red, green, blue).bold(
                figlet.textSync(`Escape`, {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );
        console.log(
            chalk.rgb(blue, red, green).bold(
                figlet.textSync(`    Success~~~`, {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );
    }

    // displayClear에 애니메이션 기능 추가
    async animateClear() {
        for (let i = 0; i < 10; i++) {
            this.displayClear();
            await this.wait(100);
        }
    }

    // displayLose에 애니메이션 기능 추가
    async animateLose() {
        for (let i = 0; i < 10; i++) {
            this.displayLose();
            await this.wait(100);
        }
    }

    // displayEsacpe에 애니메이션 기능 추가
    async animateEscape() {
        for (let i = 0; i < 10; i++) {
            this.displayEscape();
            await this.wait(100);
        }
    }

    // clear 시, 수행할 Logic
    async clear() {
        console.clear();
        await this.animateClear();

        // player 레벨 업
        this.player.levelUp();
    }

    // lose 시, 수행할 Logic
    async lose() {
        console.clear();
        await this.animateLose();

        // player 레벨 1로 초기화
        this.player.init();
    }

    // escape 시, 수행할 Logic
    async escape() {
        console.clear();
        await this.animateEscape();

        this.player.levelUp();
    }

    async end() {
        switch (this.stageStatus) {
            // 스테이지 실패
            case stageStatusObjects.LOSE:
                await this.lose();
                return false;

            // 스테이지 클리어
            case stageStatusObjects.CLEAR:
                await this.clear();
                return true;
            // 스테이지 도망 성공
            case stageStatusObjects.ESCAPE:
                await this.escape();
                return true;

            // 스테이지 강제 스킵
            case stageStatusObjects.SKIP:
                return true;

            default:
                break;
        }
    }

    // 플레이어와 몬스터 전투 중의 Logic
    async battle() {
        // 스테이지(2이상) 시작 전, 플레이어 회복
        if (this.stageNum > 1) {
            const revorHPAmount = this.player.recoverHP();
            this.logs.push(chalk.green(`체력이 ${revorHPAmount} 회복되었습니다.`));
        }

        while (this.stageStatus === stageStatusObjects.PLAYING) {
            console.clear();
            this.displayStatus(this.stageNum, this.player, this.monster);

            this.logs.forEach((log) => console.log(log));

            console.log(
                chalk.cyanBright(
                    `\n1. 공격한다 / 2. 연속 공격 / 3. 필살기 / 4. 방어하기 / 5. 도망친다 / 6. 강제 스킵`,
                ),
            );
            const choice = readlineSync.question('당신의 선택은? ');

            // 플레이어의 선택에 따라 다음 Logic 처리
            this.logic(choice);
            this.logCount++;
        }

        // stage가 끝나면 클라이언트에게 1초 동안 그동안의 전투 로그들을 출력해주고
        // 스테이지 결과에 따른 Animation으로 넘어간다.
        console.clear();
        this.displayStatus(this.stageNum, this.player, this.monster);

        this.logs.forEach((log) => console.log(log));

        await this.wait(1000);
    }

    // 일반 공격 이벤트
    eventNormalAttack() {
        // 1. 플레이어 선공격
        const playerDamage = this.player.attack();

        const monsterDie = this.monster.hitted(playerDamage);

        this.logs.push(
            chalk.green(`[${this.logCount}] 몬스터에게 ${playerDamage}의 피해를 입혔습니다.`),
        );

        // 몬스터 사망
        if (monsterDie) {
            this.stageStatus = stageStatusObjects.CLEAR;
            this.logs.push(chalk.red(`[${this.logCount}] 몬스터를 처치했습니다!`));
            return;
        }
    }

    // 연속 공격 이벤트
    eventDoubleAttack() {
        // 1. 플레이어 연속 공격
        const playerDamageArr = this.player.doubleAttack();
        let totalPlayerDamage = 0;

        // 연속 공격 실패 시
        if (playerDamageArr === null) {
            this.logs.push(chalk.blue(`[${this.logCount}] 연속 공격에 실패했습니다...`));
            return;
        }

        const monsterDie = this.monster.hitted(totalPlayerDamage);

        // 연속 공격 성공 시
        playerDamageArr.forEach((playerDamage) => {
            totalPlayerDamage += playerDamage;
            this.logs.push(
                chalk.green(`[${this.logCount}] 몬스터에게 ${playerDamage}의 피해를 입혔습니다.`),
            );
        });

        // 몬스터 사망
        if (monsterDie) {
            this.stageStatus = stageStatusObjects.CLEAR;
            this.logs.push(chalk.red(`[${this.logCount}] 몬스터를 처치했습니다!`));
            return;
        }
    }

    // 필살기 이벤트
    eventSpecialAttack() {
        const spcialAttackDamage = this.player.specialAttack();

        // 필살기 실패 (마나 부족)
        if (spcialAttackDamage === null) {
            this.logs.push(chalk.blue(`[${this.logCount}] 필살기에 사용할 MP가 부족합니다!`));
            return;
        }

        const monsterDie = this.monster.hitted(spcialAttackDamage);

        this.logs.push(
            chalk.bgRed(
                `[${this.logCount}] 필살기!!! 몬스터에게 ${spcialAttackDamage}의 피해를 입혔습니다.`,
            ),
        );

        // 몬스터 사망
        if (monsterDie) {
            this.stageStatus = stageStatusObjects.CLEAR;
            this.logs.push(chalk.red(`[${this.logCount}] 몬스터를 처치했습니다!`));
            return;
        }
    }

    // 방어 이벤트
    eventDefense() {
        const defenseDamage = this.player.defense();

        // 도망 실패 시
        if (defenseDamage === null) {
            this.logs.push(chalk.blue(`[${this.logCount}] 플레이어가 방어에 실패했습니다...`));
            return;
        }

        const monsterDie = this.monster.hitted(defenseDamage);

        this.logs.push(chalk.greenBright(`[${this.logCount}] 플레이어가 방어에 성공했습니다!`));
        this.logs.push(
            chalk.green(
                `[${this.logCount}] 반격으로 몬스터에게 ${defenseDamage}의 피해를 입혔습니다.`,
            ),
        );

        // 몬스터 사망
        if (monsterDie) {
            this.stageStatus = stageStatusObjects.CLEAR;
            this.logs.push(chalk.red(`[${this.logCount}] 몬스터를 처치했습니다!`));
            return;
        }
    }

    // 도망가기 이벤트
    eventEscape() {
        const escapeResult = this.player.escape();

        // 도망 실패 시
        if (!escapeResult) {
            this.logs.push(chalk.blue(`[${this.logCount}] 플레이어가 도망에 실패했습니다...`));
            return;
        }

        // 도망 성공 시
        this.stageStatus = stageStatusObjects.ESCAPE;
        this.logs.push(chalk.red(`[${this.logCount}] 플레이어가 도망쳤습니다!`));
    }

    // 강제 스킵 이벤트
    eventSkip() {
        this.stageStatus = stageStatusObjects.SKIP;
    }

    // 몬스터 공격 이벤트
    eventMosterAttack() {
        // 만약 몬스터가 이전 플레이어 턴에 죽었다면 return
        if (this.stageStatus !== stageStatusObjects.PLAYING) return;

        // 플레이어가 방어하기 성공(player.defenseStatus가 true) 시
        // 몬스터 공격 턴 무효화
        if (this.player.defenseState === true) {
            this.player.defenseState = false;
            return;
        }

        const monsterDamage = this.monster.attack();
        const playerDie = this.player.hitted(monsterDamage);
        this.logs.push(
            chalk.yellow(`[${this.logCount}] 몬스터가 ${monsterDamage}의 피해를 입혔습니다.`),
        );

        // 플레이어 사망
        if (playerDie) {
            this.stageStatus = stageStatusObjects.LOSE;
            this.logs.push(chalk.red(`[${this.logCount}] 플레이어가 사망했습니다!`));
            return;
        }
    }

    logic(action) {
        // 플레이어 Event

        let defenseResult;

        switch (action) {
            // 일반 공격
            case '1':
                this.eventNormalAttack();
                break;

            // 연속공격
            case '2':
                this.eventDoubleAttack();
                break;

            // 필살기
            case '3':
                this.eventSpecialAttack();
                break;

            // 방어
            case '4':
                this.eventDefense();
                break;

            // 도망치기
            case '5':
                this.eventEscape();
                break;

            // 강제스킵
            case '6':
                this.eventSkip();
                break;

            default:
                break;
        }

        // 플레이어 공격 턴이 끝나면,
        // 몬스터 공격 Event
        this.eventMosterAttack();
    }
}
