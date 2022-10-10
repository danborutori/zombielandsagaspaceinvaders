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

    export class Audio {
        static dom = document.createElement("audio")

        static preload(){
            return Promise.all([
                "./sound/explosion.wav",
                "./sound/invaderkilled.wav",
                "./sound/shoot.wav"
            ].map( url=>loadAudio(url)))
        }
    }

    Audio.dom.volume = Constant.volume
    Audio.dom.autoplay = true

}