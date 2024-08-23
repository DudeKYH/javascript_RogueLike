import { getRandomInt } from '../../Random/random.js';

const MONSTER = {
    HP: 30,
    ATTACKPOWER: 5,
};
Object.freeze(MONSTER);

export class Monster {
    constructor(stage) {
        this.hp = MONSTER.HP * stage;
        if (stage !== 1) this.hp += getRandomInt(0, 10);

        this.attackPower = MONSTER.ATTACKPOWER * stage;
        if (stage !== 1) this.attackPower += getRandomInt(0, 5);
    }

    // 몬스터의 공격
    attack() {
        const damage = this.attackPower;
        return damage;
    }

    // 몬스터가 공격받음
    // => return : 죽으면 true / 살아있으면 false
    hitted(damage) {
        const remainHP = this.hp - damage;

        if (remainHP > 0) {
            this.hp = remainHP;
            return false;
        } else {
            return true;
        }
    }
}
