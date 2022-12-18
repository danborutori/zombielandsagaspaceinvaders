namespace zlsSpaceInvader {

    export class ImageButton{

        constructor(
            input: HTMLInputElement,
            upSrc: string,
            downSrc: string
        ){
            input.src = upSrc

            input.addEventListener( "touchstart", e=>{
                input.src = downSrc
                e.preventDefault()
            } )
            input.addEventListener( "touchmove", e=>e.preventDefault() )
            input.addEventListener( "touchend", e=>{
                input.src = upSrc
                e.preventDefault()
            } )
            input.addEventListener( "touchcancel", e=>{
                input.src = upSrc
                e.preventDefault()
            } )
        }

    }

}