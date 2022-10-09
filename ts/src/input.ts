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
    }

}