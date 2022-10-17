namespace zlsSpaceInvader {

    function loadAudio( url: string ){
        return new Promise<void>( (resolve, reject)=>{
            const dom = document.createElement("audio")

            dom.src = url
            dom.autoplay = false
            dom.oncanplay = ()=>resolve()
            dom.onerror = e=>reject(e)
        })
    }

    const channels: HTMLAudioElement[] = new Array(2)
    for( let i=0; i<channels.length; i++ ){
        const dom = document.createElement("audio")
        dom.volume = Constant.volume
        dom.autoplay = true
    
        channels[i] = dom
    }


    export class Audio {
        static sounds = {
            explosion: "./sound/explosion.wav",
            invaderkilled: "./sound/invaderkilled.wav",
            shoot: "./sound/shoot.wav",
            shipFly: "./sound/Galaxian Sound.mp3",
            bonus: "./sound/Galaxian.mp3",
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
            channel: number = 0
        ){
            channels[channel].src = sound
        }

        static get volume(){
            return channels[0].volume
        }

        static set volume( n: number ){
            for( let a of channels ) a.volume = n
        }
    }

    const _sort = new Constant
}