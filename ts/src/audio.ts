namespace zlsSpaceInvader {

    export class Audio {
        static dom = document.createElement("audio")
    }

    Audio.dom.volume = Constant.volume
    Audio.dom.autoplay = true

}