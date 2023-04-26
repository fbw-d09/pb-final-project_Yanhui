const readlineSync = require("readline-sync")
console.clear();

class Player{
    #hp;
    #maxHp = 1000;
    #en;
    #maxEn = 1000;
    name;
    armor;
    static beschreibung ={
        damage: 'Pure Schaden ohne Penetration Zurechnung',
        description: 'Beschreibung zur Skills',
        penetration:' Rüstungsdurchdringungswerte',
        cost: 'Mana zur Verwendung der gelernten Skills',
        heal: 'Optionale Heilung, einige Skills heilen beim Schaden'
    };
    static count = 0;

    constructor(name,health,energy,armor){
        this.name = name;
        this.#hp = health;
        this.#en = energy;
        this.armor = armor;
        this.skills ={};
        Player.count = 0;
    }
    setHealth(num){
        if(num > this.#maxHp){
            return this.#hp = this.#maxHp;
        }else if(num <= 0){
            this.setEnergy(0)
            this.#hp = 0;
        }else if(!Number(num)){
            return console.log('Invalid Input')
        }else if(this.#hp < 1){
            this.#hp=0;
        }
        return this.#hp = num ;
    }
    setEnergy(num){
        if(num > this.#maxEn){
            return this.#en = this.#maxEn ;
        }else if(num <1){
            return this.#en = 0;
        }else if(!Number(num)){
            return console.log('Invalid Input')
        }
        return this.#en = num ;
    }
    getHealth(){
        let restHp =this.#hp.toFixed(2);
        return parseFloat(restHp) ;
    }
    getEnergy(){
        let restEn = this.#en.toFixed(2);
        return parseFloat(restEn);
    }
    hpPerc(){
        let percent = this.#hp / this.#maxHp *100;

        return percent.toFixed(2)+"%"
    }
    restart(health,mana){
        this.setHealth(health)
        this.setEnergy(mana)
    }

    static reset(){

        return Player.count = 0;
    }
      
    learnSkill(skillname,skillDetails){
        this.skills[skillname] = skillDetails;
        this[skillname] = function(target){
            if(target instanceof Player){
                if(this.skills.hasOwnProperty(skillname)){
                    const skill = this.skills[skillname];
                    let damage = skill.damage;
 

                    //Penetration berechnen
                    let realArmor = skill.penetration - target.armor;
                    if(realArmor === 0){
                        damage = damage;
                    }else if(realArmor > 0){

                        damage += damage * (realArmor /100);
                    }else if(realArmor < 0){
                        damage += damage * (realArmor/100)
                    }
                    damage = Math.max(damage,1).toFixed(2);

                    //Mana berechnen
                    if(this.getHealth() === 0){
                        return console.log(`${this.name} is dead`)
                    }else if(this.#en-skill.cost < 0){
                        if(target.getHealth() === 0){
                            return console.log(`${this.name} is dead`);
                        }
                        return console.log(`${this.name} attempted to use ${skillname}, but didn't have enough energy!`)
                    }
                    this.#en -= skill.cost;

                    //Leben Aktualisieren 

                    target.setHealth(target.getHealth() - damage);
                    if(target.getHealth() <= 0) {
                        target.setHealth(0);

                    }
                    
                    
                    let dmgHeal = parseInt(damage * (skill.heal / 100));
                    this.setHealth(this.#hp+dmgHeal)


                    return console.log(`${this.name} used ${skillname} on ${target.name} for ${damage} damage! ${this.name} healed for ${dmgHeal} health! ${target.getHealth() < 1 ? `${target.name} died! Game End` : `${target.name} is at ${target.hpPerc()} health!`} ${Player.count++ } Runde `);
                }else{
                    return console.log(`${this.name} does not know the skill ${skillname}`)
                }
            }else{
                return console.log(`${target} is not a valid target.`)
            }
        }
    }


}






const fireball = {
    damage: 250,
    penetration: 15,
    heal: 10,
    cost: 50,
    desc: "a firey magical attack"
}
const iceball = {
    damage: 200,
    penetration: 20,
    heal: 5,
    cost: 50,
    desc: "a icy magical attack"
}
const superbeam = {
    
        damage:500,
        penetration:50,
        heal:20,
        cost:175,
        desc: "an overpowered attack, pls nerf"
}
const suicide = {
    damage:800,
    penetration:100,
    heal:-100,
    cost:995,
    desc: "You are not alone!"
}
const attack = {
    damage : 50,
    penetration : 0,
    heal : 0,
    cost : 1,
    desc : "normal attack, im serious."
}
const gebetsGottes = {
    damage : Math.round(Math.random()*800),
    penetration : 80,
    heal : 50,
    cost : 950,
    desc : "You are almost Lucky, trust me.(Random DMG)"
}

const skillList = {"fireball":fireball,
"iceball":iceball,
"superbeam":superbeam,
"attack":attack,
"suicide":suicide,
"gebetsGottes": gebetsGottes}

const voldemort = new Player("spieler1",1000,1000,60)

const harrypotter = new Player("spieler2",1000,1000,60);



const newSkillList = Object.keys(skillList);
console.log(newSkillList);

console.log('Welcome to my Game!');
console.log('Regel: Jede Spieler hat einen Leben:1000, Mana:1000, Rüstung:60, und lernt von dem oben angegebenen\n 4Skills 2 davon (einmal normal attack. einmal ulti)und kämpfen miteinander. Wer zuerst stirbt, verliert.');
console.log(skillList)
const player1skill1 = readlineSync.question('Player1: Was für Fähigkeit(skill1) willst du lernen?\n');
const player1skill2 = readlineSync.question('Player1: Was für Fähigkeit(skill2) willst du lernen?\n');
const player2skill1 = readlineSync.question('Player2: Was für Fähigkeit(skill1) willst du lernen?\n');
const player2skill2 = readlineSync.question('Player2: Was für Fähigkeit(skill2) willst du lernen?\n');

voldemort.learnSkill(player1skill1,skillList[player1skill1]);
voldemort.learnSkill(player1skill2,skillList[player1skill2]);
harrypotter.learnSkill(player2skill1,skillList[player2skill1]);
harrypotter.learnSkill(player2skill2,skillList[player2skill2]);

console.log("Player1",voldemort.skills);
console.log("Player2",harrypotter.skills);


const p1round1 = readlineSync.question('Player1: Greife player2 mit einer Fähigkeit an: \n');

newSkillList.includes(p1round1) ? voldemort[p1round1](harrypotter) : console.log('invalid Input');

const p2round1 = readlineSync.question('Player2: Greife player1 mit einer Fähigkeit and: \n');

newSkillList.includes(p2round1) ? harrypotter[p2round1](voldemort) : console.log('invalid Input'); 

const p1round2 = readlineSync.question('Player1: Greife player2 mit einer Fähigkeit an: \n');

newSkillList.includes(p1round2) ? voldemort[p1round2](harrypotter) : console.log('invalid Input');

const p2round2 = readlineSync.question('Player1: Greife player2 mit einer Fähigkeit an: \n');

newSkillList.includes(p2round2) ? harrypotter[p2round2](voldemort) : console.log('invalid Input');













