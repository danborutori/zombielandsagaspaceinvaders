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
            leftButton: ImageButton,
            rightButton: ImageButton,
            fireButton: ImageButton
        ){
            const updateButton = ()=>{
                this.left = leftTouch
                this.right = rightTouch
                this.fire = fireTouch
            }

            let leftTouch = false
            let rightTouch = false
            let fireTouch = false

            leftButton.onStart = ()=>{
                leftTouch = true
                this.pressAnyKey = true                
                updateButton()
            }
            leftButton.onEnd = ()=>{
                leftTouch = false
                updateButton()
            }

            rightButton.onStart = ()=>{
                rightTouch = true
                this.pressAnyKey = true                
                updateButton()
            }
            rightButton.onEnd = ()=>{
                rightTouch = false
                updateButton()
            }

            fireButton.onStart = ()=>{
                fireTouch = true
                this.pressAnyKey = true                
                updateButton()
            }
            fireButton.onEnd = ()=>{
                fireTouch = false
                updateButton()
            }
        }

        update(){
            this.pressAnyKey = false
        }
    }

}