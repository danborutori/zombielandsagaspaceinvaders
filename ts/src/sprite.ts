namespace zlsSpaceInvader {

    const paths: {[name: string]: string} = {
        0: "./images/0.png",
        1: "./images/1.png",
        2: "./images/2.png",
        3: "./images/3.png",
        4: "./images/4.png",
        5: "./images/5.png",
        6: "./images/6.png",
        7: "./images/7.png",
        dog: "./images/dog.png",
        explod: "./images/explod.png",
        hand: "./images/hand.png",
        p: "./images/p.png",
        zombie1: "./images/zombie1.png",
        zombie2: "./images/zombie2.png",
        bullet: "./images/bullet.png",
        font: "./images/font.png",
        captureWave0: "./images/capture_wave0.png",
        captureWave1: "./images/capture_wave1.png",
        captureWave2: "./images/capture_wave2.png",
        grenade: "./images/grenade.png",
        explosion0: "./images/explosion0.png",
        explosion1: "./images/explosion1.png",
        explosion2: "./images/explosion2.png",
        bigZombie: "./images/bigZombie.png",
        blood0: "./images/blood0.png",
        blood1: "./images/blood1.png",
        blood2: "./images/blood2.png",
        heart0: "./images/heart0.png",
        heart1: "./images/heart1.png",
        bossTitle0: "./images/boss_title0.png",
        bossTitle1: "./images/boss_title1.png",
        kaijin: "./images/kaijin.png",
        laser0: "./images/laser0.png",
        laser1: "./images/laser1.png",
        laser2: "./images/laser2.png",
        laser3: "./images/laser3.png",
        laser4: "./images/laser4.png",
        laser5: "./images/laser5.png",
        laser6: "./images/laser6.png",
        laser7: "./images/laser7.png",
        laser8: "./images/laser8.png",
        blaser0: "./images/blaser0.png",
        blaser1: "./images/blaser1.png",
        blaser2: "./images/blaser2.png",
        blaser3: "./images/blaser3.png",
        blaser4: "./images/blaser4.png",
        blaser5: "./images/blaser5.png",
        blaser6: "./images/blaser6.png",
        blaser7: "./images/blaser7.png",
        blaser8: "./images/blaser8.png",
        powerup: "./images/powerup.png",
        ufo: "./images/ufo.png",
        cloud0: "./images/cloud0.png",
        cloud1: "./images/cloud1.png",
        cloud2: "./images/cloud2.png",
        cloud3: "./images/cloud3.png",
        bossHp: "./images/boss_hp.png",
        bossHpYellow: "./images/boss_hp_yellow.png",
        bossHpBorder: "./images/boss_hp_border.png",
    }

    function loadImage( img: HTMLImageElement, url: string ){
        return new Promise<void>( (resolve, reject)=>{
            img.src = url
            img.onload = ()=>resolve()
            img.onerror = e=>reject(e)
        })
    }

    export class Sprites {
        static readonly shared = new Sprites

        readonly images: {[name: string]: HTMLImageElement} = {
            0: new Image,
            1: new Image,
            2: new Image,
            3: new Image,
            4: new Image,
            5: new Image,
            6: new Image,
            7: new Image,
            dog: new Image,
            explod: new Image,
            hand: new Image,
            p: new Image,
            zombie1: new Image,
            zombie2: new Image,
            bullet: new Image,
            font: new Image,
            captureWave0: new Image,
            captureWave1: new Image,
            captureWave2: new Image,
            grenade: new Image,
            explosion0: new Image,
            explosion1: new Image,
            explosion2: new Image,
            bigZombie: new Image,
            blood0: new Image,
            blood1: new Image,
            blood2: new Image,
            heart0: new Image,
            heart1: new Image,
            bossTitle0: new Image,
            bossTitle1: new Image,
            kaijin: new Image,
            laser0: new Image,
            laser1: new Image,
            laser2: new Image,
            laser3: new Image,
            laser4: new Image,
            laser5: new Image,
            laser6: new Image,
            laser7: new Image,
            laser8: new Image,
            blaser0: new Image,
            blaser1: new Image,
            blaser2: new Image,
            blaser3: new Image,
            blaser4: new Image,
            blaser5: new Image,
            blaser6: new Image,
            blaser7: new Image,
            blaser8: new Image,
            powerup: new Image,
            ufo: new Image,
            cloud0: new Image,
            cloud1: new Image,
            cloud2: new Image,
            cloud3: new Image,
            bossHp: new Image,
            bossHpYellow: new Image,
            bossHpBorder: new Image,
        }

        load(){
            return Promise.all(Object.getOwnPropertyNames(paths).map(n=>loadImage(this.images[n], paths[n])))
        }
    }

}