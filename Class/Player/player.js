import { checkObbs, getRandomFloat, getRandomInt } from '../../Random/random.js';

const PLAYER = {
    HP: 100,
    ATTACK_POWER: 10,
    POWER_RATIO: 1,
    ESCAPE_OBBS: 5,
    DOUBLE_ATTACK_OBBS: 50,
    DEFENSE_OBBS: 50,
};
Object.freeze(PLAYER);

export class Player {
    constructor() {
        this.hp = PLAYER.HP;
        this.baseAttackPower = PLAYER.ATTACK_POWER;
        this.powerRatio = PLAYER.POWER_RATIO;
        this.escapeObbs = PLAYER.ESCAPE_OBBS;
        this.doubleAttackObbs = PLAYER.DOUBLE_ATTACK_OBBS;
        this.defenseObbs = PLAYER.DEFENSE_OBBS;
    }

    init() {
        this.hp = PLAYER.HP;
        this.baseAttackPower = PLAYER.ATTACK_POWER;
        this.powerRatio = PLAYER.POWER_RATIO;
        this.escapeObbs = PLAYER.ESCAPE_OBBS;
        this.doubleAttackObbs = PLAYER.DOUBLE_ATTACK_OBBS;
    }

    // 플레이어 Level Up
    levelUp() {
        this.hp += getRandomInt(20, 50);
        this.baseAttackPower += getRandomInt(5, 15);
        this.powerRatio += getRandomFloat(0.1, 0.3);
        this.escapeObbs += getRandomInt(3, 7);
        this.doubleAttackObbs += getRandomInt(3, 7);
        this.defenseObbs += getRandomInt(3, 7);
    }

    // 플레이어의 공격
    attack() {
        const minDamage = this.baseAttackPower;
        const maxDamage = Math.floor(this.baseAttackPower * this.powerRatio);
        const damage = getRandomInt(minDamage, maxDamage);

        return damage;
    }

    // 플레이어의 연속(더블) 공격
    doubleAttack() {
        const damageArr = [];

        if (!checkObbs(this.doubleAttackObbs)) {
            return null;
        }

        for (let i = 0; i < 2; i++) {
            const damage = this.attack();
            damageArr.push(damage);
        }

        return damageArr;
    }

    // 플레이어가 공격받음
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

    // 플레이어의 도망
    escape() {
        return checkObbs(this.escapeObbs);
    }
}
