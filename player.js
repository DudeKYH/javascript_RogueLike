export class Player {
    constructor(hp = 100, baseAttackPower = 10, powerRatio = 1, escapeObbs = 5) {
        this.hp = hp;
        this.baseAttackPower = baseAttackPower;
        this.powerRatio = powerRatio;
        this.escapeObbs = escapeObbs;
    }

    init() {
        this.hp = 100;
        this.baseAttackPower = 10;
        this.powerRatio = 1;
        this.escapeObbs = 5;
    }

    // 플레이어 Level Up
    levelUp() {
        this.hp += 10;
        this.baseAttackPower += 10;
        this.powerRatio += 0.5;
        this.escapeObbs += 3;
    }

    // 플레이어의 공격
    attack() {
        const damage = this.baseAttackPower * this.powerRatio;
        return damage;
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
    escape() {}
}
