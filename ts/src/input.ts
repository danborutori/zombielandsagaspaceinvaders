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
            leftButton: HTMLInputElement,
            rightButton: HTMLInputElement,
            fireButton: HTMLInputElement
        ){
            const updateButton = ()=>{
                this.left = (leftTouch || leftPointer)
                this.right = (rightTouch || rightPointer)
                this.fire = (fireTouch || firePointer)
            }

            let leftTouch = false
            let leftPointer = false
            let rightTouch = false
            let rightPointer = false
            let fireTouch = false
            let firePointer = false
            leftButton.addEventListener("touchstart", e=>{
                leftTouch = true
                this.pressAnyKey = true
                updateButton()
            })
            leftButton.addEventListener("pointerdown", e=>{
                leftPointer = true
                this.pressAnyKey = true
                updateButton()
            })

            rightButton.addEventListener("touchstart", e=>{
                rightTouch = true
                this.pressAnyKey = true
                updateButton()
            })
            rightButton.addEventListener("pointerdown", e=>{
                rightPointer = true
                this.pressAnyKey = true
                updateButton()
            })

            fireButton.addEventListener("touchstart", e=>{
                fireTouch = true                
                this.pressAnyKey = true
                updateButton()
            })
            fireButton.addEventListener("pointerdown", e=>{
                firePointer = true
                this.pressAnyKey = true
                updateButton()
            })

            leftButton.addEventListener("touchend", e=>{
                leftTouch = false
                updateButton()
            })
            leftButton.addEventListener("touchcancel", e=>{
                leftTouch = false
                updateButton()
            })
            leftButton.addEventListener("pointerup", e=>{
                leftPointer = false
                updateButton()
            })
            leftButton.addEventListener("pointerout", e=>{
                leftPointer = false
                updateButton()
            })

            rightButton.addEventListener("touchend", e=>{
                rightTouch = false
                updateButton()
            })
            rightButton.addEventListener("touchcancel", e=>{
                rightTouch = false
                updateButton()
            })
            rightButton.addEventListener("pointerup", e=>{
                rightPointer = false
                updateButton()
            })
            rightButton.addEventListener("pointerout", e=>{
                rightPointer = false
                updateButton()
            })

            fireButton.addEventListener("touchend", e=>{
                fireTouch = false
                updateButton()
            })
            fireButton.addEventListener("touchcancel", e=>{
                fireTouch = false
                updateButton()
            })
            fireButton.addEventListener("pointerup", e=>{
                firePointer = false
                updateButton()
            })
            fireButton.addEventListener("pointerout", e=>{
                firePointer = false
                updateButton()
            })
        }

        update(){
            this.pressAnyKey = false
        }
    }

}