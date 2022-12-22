namespace zlsSpaceInvader {

    export class ImageButton{

        onStart = ()=>{}
        onEnd = ()=>{}

        constructor(
            input: HTMLInputElement,
            upSrc: string,
            downSrc: string
        ){
            input.src = upSrc

            input.addEventListener( "touchstart", e=>{
                input.src = downSrc
                e.preventDefault()
                this.onStart()
            } )
            input.addEventListener( "touchmove", e=>e.preventDefault() )
            input.addEventListener( "touchend", e=>{
                input.src = upSrc
                e.preventDefault()
                this.onEnd()
            } )
            input.addEventListener( "touchcancel", e=>{
                input.src = upSrc
                e.preventDefault()
                this.onEnd()
            } )
        }

    }

}