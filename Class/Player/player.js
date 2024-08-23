import { checkObbs, getRandomFloat, getRandomInt } from '../../Random/random.js';

const PLAYER = {
    HP: 100,
    MP: 100,
    ATTACK_POWER: 10,
    POWER_RATIO: 1,
    ESCAPE_OBBS: 5,
    DOUBLE_ATTACK_OBBS: 5,
    DEFENSE_OBBS: 5,
    RECOVER_HP: 30,
};
Object.freeze(PLAYER);

export class Player {
    constructor() {
        this.hp = PLAYER.HP;
        this.maxHP = PLAYER.HP;
        this.mp = 0;
        this.maxMP = PLAYER.MP;
        this.baseAttackPower = PLAYER.ATTACK_POWER;
        this.powerRatio = PLAYER.POWER_RATIO;
        this.escapeObbs = PLAYER.ESCAPE_OBBS;
        this.doubleAttackObbs = PLAYER.DOUBLE_ATTACK_OBBS;
        this.defenseObbs = PLAYER.DEFENSE_OBBS;
        this.defenseState = false;
    }

    init() {
        this.hp = PLAYER.HP;
        this.maxHP = PLAYER.HP;
        this.mp = 0;
        this.maxMP = PLAYER.MP;
        this.baseAttackPower = PLAYER.ATTACK_POWER;
        this.powerRatio = PLAYER.POWER_RATIO;
        this.escapeObbs = PLAYER.ESCAPE_OBBS;
        this.doubleAttackObbs = PLAYER.DOUBLE_ATTACK_OBBS;
        this.defenseState = false;
    }

    // 플레이어 Level Up
    levelUp() {
        this.maxHP += getRandomInt(20, 50);
        this.baseAttackPower += getRandomInt(5, 10);
        this.powerRatio += getRandomFloat(0.1, 0.2);
        this.escapeObbs += getRandomInt(3, 7);
        this.doubleAttackObbs += getRandomInt(3, 7);
        this.defenseObbs += getRandomInt(3, 7);
    }

    // 플레이어 MP 획득
    gainMP(damage) {
        // 플레이너는 입힌 데미지 중 일부를 마나로 획득한다.
        const gainManaPoint = getRandomInt(0, damage);
        this.mp = this.mp + gainManaPoint > 100 ? 100 : this.mp + gainManaPoint;
    }

    // 스테이지 클리어 시, 플레이어 HP 20 회복
    recoverHP() {
        this.hp =
            this.hp + PLAYER.RECOVER_HP > this.maxHP ? this.maxHP : this.hp + PLAYER.RECOVER_HP;

        return PLAYER.RECOVER_HP;
    }

    // 플레이어의 공격
    attack() {
        const minDamage = this.baseAttackPower;
        const maxDamage = Math.floor(this.baseAttackPower * this.powerRatio);
        const damage = getRandomInt(minDamage, maxDamage);

        this.gainMP(damage);

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
            this.gainMP(damage);
        }

        return damageArr;
    }

    // 플레이어의 필살기 : 강력한 한방(기본공격 10배의 데미지)
    specialAttack() {
        // 마나가 100 미만이면 필살기 사용 x : false 반환
        if (this.mp < 100) return null;

        const damage = this.baseAttackPower * 10;
        this.mp = 0;

        return damage;
    }

    // 플레이어의 방어
    // 방어 성공 시, 몬스터의 공격 무시하고 플레이어 공격력의 60% 피해를 입힌다.
    defense() {
        if (!checkObbs(this.defenseObbs)) {
            return null;
        }

        this.defenseState = true;
        const damage = parseInt(this.attack() * 0.6);

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
    escape() {
        return checkObbs(this.escapeObbs);
    }
}
