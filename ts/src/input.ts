namespace zlsSpaceInvader {

    export class Input {
        static shared = new Input()

        left: boolean = false
        right: boolean = false
        fire: boolean = false
        pressAnyKey: boolean = false

        constructor(){
            addEventListener("keydown", e=>{
                switch( e.code ){
                case "ArrowLeft":
                case "KeyA":
                    this.left = true
                    this.pressAnyKey = true
                    break
                case "ArrowRight":
                case "KeyD":
                    this.right = true
                    this.pressAnyKey = true
                    break
                case "ArrowUp":
                case "KeyW":
                    this.fire = true
                    this.pressAnyKey = true
                    break
                }
            })
            addEventListener("keyup", e=>{
                switch( e.code ){
                    case "ArrowLeft":
                    case "KeyA":
                        this.left = false
                        break
                    case "ArrowRight":
                    case "KeyD":
                        this.right = false
                        break
                    case "ArrowUp":
                    case "KeyW":
                        this.fire = false
                        break
                    }
            })
        }

        init(
            controllerRoot: HTMLElement,
            leftButton: ImageButton,
            rightButton: ImageButton,
            fireButton: ImageButton
        ){
            const updateButton = ()=>{
                if( touches ){
                    const zoom: number = parseFloat((document.body.style as any).zoom || "1")
                    for( let b of [
                        leftButton,
                        rightButton,
                        fireButton
                    ]){
                        const rect = b.input.getBoundingClientRect()
                        let down = false
                        for( let i=0; i<touches.length; i++  ){
                            const t = touches.item(i)!
                            if(
                                t.clientX/zoom>rect.left &&
                                t.clientX/zoom<rect.right &&
                                t.clientY/zoom<rect.bottom &&
                                t.clientY/zoom>rect.top
                            ){
                                down = true
                            }
                        }

                        if(down && !b.down)
                            this.pressAnyKey = true
                        b.down = down
                    }
                }

                this.left = leftButton.down
                this.right = rightButton.down
                this.fire = fireButton.down
            }
            let touches: TouchList | undefined

            controllerRoot.addEventListener( "touchstart", e=>{
                touches = e.touches
                updateButton()
                e.preventDefault() 
                e.stopPropagation()               
            }, {
                passive: false
            })
            controllerRoot.addEventListener( "touchmove", e=>{
                touches = e.touches
                updateButton()
                e.preventDefault() 
                e.stopPropagation()               
            }, {
                passive: false
            })
            controllerRoot.addEventListener( "touchend", e=>{
                touches = e.touches
                updateButton()
                e.preventDefault()                
                e.stopPropagation()
            }, {
                passive: false
            })
            controllerRoot.addEventListener( "touchcancel", e=>{
                touches = e.touches
                updateButton()
                e.preventDefault()
                e.stopPropagation()
            }, {
                passive: false
            })
        }

        update(){
            this.pressAnyKey = false
        }
    }

}