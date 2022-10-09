namespace zlsSpaceInvader {

    export class Input {
        static shared = new Input()

        left: boolean = false
        right: boolean = false
        fire: boolean = false

        constructor(){
            addEventListener("keydown", e=>{
                switch( e.code ){
                case "ArrowLeft":
                case "KeyA":
                    this.left = true
                    break
                case "ArrowRight":
                case "KeyD":
                    this.right = true
                    break
                case "ArrowUp":
                case "KeyW":
                    this.fire = true
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