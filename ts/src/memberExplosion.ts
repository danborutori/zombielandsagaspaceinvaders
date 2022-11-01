namespace zlsSpaceInvader {

    const sprites = [
        Sprites.shared.images.explosion0,
        Sprites.shared.images.explosion1,
        Sprites.shared.images.explosion2
    ]

    export class MemberExplosion extends SpriteObject{

        private time = 0

        constructor(){
            super(sprites[0])
        }
     
        update(deltaTime: number): void {
            this.time += deltaTime

            this.sprite = sprites[ Math.floor(this.time/0.1) ]

            if( this.time>=0.3 ) this.removeFromManager()
        }
        
    }

}