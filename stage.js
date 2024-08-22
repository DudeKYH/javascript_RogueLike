import chalk from 'chalk';
import figlet from 'figlet';
import readlineSync from 'readline-sync';
import { getRandomNumber } from './game.js';
import { Monster } from './monster.js';

const stageStatusObjects = new Map();
stageStatusObjects.set('playing', 1);
stageStatusObjects.set('lose', 2);
stageStatusObjects.set('clear', 3);
stageStatusObjects.set('escape', 4);

export class Stage {
    constructor(player, stageNum) {
        this.player = player;
        this.monster = new Monster(stageNum);
        this.stageNum = stageNum;
        this.stageStatus = stageStatusObjects.get('playing');

        // 화면에 출력할 로그를 담을 array
        this.logs = [];
        this.logCount = 1;
    }

    displayStatus() {
        console.log(chalk.magentaBright(`\n=== Current Status ===`));
        console.log(
            chalk.cyanBright(`| Stage: ${this.stageNum} `) +
                chalk.blueBright(
                    `| 플레이어 정보 => HP: ${this.player.hp}, ATTACK: ${this.player.baseAttackPower} `,
                ) +
                chalk.redBright(
                    `| 몬스터 정보 => HP:${this.monster.hp}, Attack: ${this.monster.attackPower}|`,
                ),
        );
        console.log(chalk.magentaBright(`=====================\n`));
    }

    displayClear() {
        console.clear();

        const red = getRandomNumber(255, 0);
        const green = getRandomNumber(255, 0);
        const blue = getRandomNumber(255, 0);

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
            chalk.rgb(red, green, blue).bold(
                figlet.textSync(`              Clear!!!`, {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );
    }

    async animateClear() {
        for (let i = 0; i < 10; i++) {
            this.displayClear();
            await this.wait(100);
        }
    }

    displayLose() {
        console.clear();

        const red = getRandomNumber(255, 0);
        const green = getRandomNumber(255, 0);
        const blue = getRandomNumber(255, 0);

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
            chalk.rgb(red, green, blue).bold(
                figlet.textSync(`     Restart!!!`, {
                    font: 'Standard',
                    horizontalLayout: 'default',
                    verticalLayout: 'default',
                }),
            ),
        );
    }

    async animateLose() {
        for (let i = 0; i < 10; i++) {
            this.displayLose();
            await this.wait(100);
        }
    }

    wait(timeDelay) {
        return new Promise((resolve) => setTimeout(resolve, timeDelay));
    }

    async clear() {
        console.clear();
        await this.animateClear();

        // player 레벨 업
        this.player.levelUp();
    }

    async lose() {
        console.clear();
        await this.animateLose();

        // player 레벨 1로 초기화
        this.player.init();
    }

    async escape() {
        console.clear();
    }

    async end() {
        switch (this.stageStatus) {
            case stageStatusObjects.get('lose'):
                await this.lose();
                return false;
            case stageStatusObjects.get('clear'):
                await this.clear();
                return true;
            case stageStatusObjects.get('escape'):
                await this.escape();
                return true;
            default:
                break;
        }

        return true;
    }

    async battle() {
        while (this.stageStatus === stageStatusObjects.get('playing')) {
            console.clear();
            this.displayStatus(this.stageNum, this.player, this.monster);

            this.logs.forEach((log) => console.log(log));

            console.log(chalk.green(`\n1. 공격한다 2. 도망친다.`));
            const choice = readlineSync.question('당신의 선택은? ');

            // 플레이어의 선택에 따라 다음 Logic 처리
            this.logic(choice);
            this.logCount++;
        }
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
            this.stageStatus = stageStatusObjects.get('clear');
            this.logs.push(chalk.white(`[${this.logCount}] 몬스터를 처치했습니다!`));
        }

        // 2. 몬스터 후공격
        const monsterDamage = this.monster.attack();
        const playerDie = this.player.hitted(monsterDamage);
        this.logs.push(
            chalk.yellow(`[${this.logCount}] 몬스터가 ${monsterDamage}의 피해를 입혔습니다.`),
        );

        // 플레이어 사망
        if (playerDie) {
            this.stageStatus = stageStatusObjects.get('lose');
            this.logs.push(chalk.red(`[${this.logCount}] 플레이어가 사망했습니다!`));
        }
    }

    // 도망가기 이벤트
    eventEscape() {
        this.stageStatus = stageStatusObjects.get('escape');
        this.logs.push(chalk.red(`[${this.logCount}] 플레이어가 도망쳤습니다!`));
    }

    logic(action) {
        switch (action) {
            // 일반 공격
            case '1':
                this.eventNormalAttack();
                break;

            // 도망치기
            case '2':
                this.eventEscape();
                break;

            case '3':
                break;

            case '4':
                break;

            case '5':
                break;

            default:
                break;
        }
    }
}
