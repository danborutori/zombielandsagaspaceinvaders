namespace zlsSpaceInvader {

    const soundAudios: {[name:string]: HTMLAudioElement} = {}

    function loadAudio( url: string ){
        return new Promise<void>( (resolve, reject)=>{
            const dom = document.createElement("audio")

            dom.src = url
            dom.autoplay = false
            dom.volume = Constant.volume
            dom.oncanplay = ()=>resolve()
            dom.onerror = e=>reject(e)

            soundAudios[url] = dom
        })
    }

    export class Audio {
        static sounds = {
            explosion: "./sound/explosion.wav",
            invaderkilled: "./sound/invaderkilled.wav",
            shoot: "./sound/shoot.wav",
            shipFly: "./sound/Galaxian Sound.mp3",
            bonus: "./sound/Galaxian.mp3",
            captureBeam: "./sound/capture_beam.mp3",
            captureBeam2: "./sound/capture_beam2.mp3",
            captured: "./sound/captured.mp3",
            capturedSuccess: "./sound/captured_success.mp3",
            credit: "./sound/8d82b5_Galaga_Coin_Sound_Effect.mp3",
            enemyShooting: "./sound/8d82b5_Galaga_Firing_Sound_Effect.mp3",
            eyeLaser: "./sound/8-bit-cannon-fire-96505.mp3",
            fingerLaser: "./sound/268168__shaun105__laser.wav",
            alienShip: "./sound/257219__javierzumer__8bit-wc.wav"
        }

        static preload(){
            const urls: string[] = []
            for( let n in Audio.sounds ){
                urls.push( (Audio.sounds as any)[n] )
            }
            return Promise.all(
                urls.map( url=>loadAudio(url))
            )
        }

        static play(
            sound: string,
            volume: number = Constant.volume
        ){
            soundAudios[sound].currentTime = 0
            soundAudios[sound].volume = volume
            soundAudios[sound].play()
        }

        static stop(
            sound: string
        ){
            soundAudios[sound].pause()
        }

        static get volume(){
            return soundAudios[this.sounds.bonus].volume
        }

        static set volume( n: number ){
            for( let name in soundAudios ){
                soundAudios[name].volume = n
            }
        }
    }

    const _sort = new Constant
}