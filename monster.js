export class Monster {
    constructor(stage) {
        this.hp = 30 + (stage - 1) * 10;
        this.attackPower = 5 + (stage - 1) * 5;
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
