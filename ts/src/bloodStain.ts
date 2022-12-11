namespace zlsSpaceInvader {
    const v1 = new Vector2

    const sprites = [
        Sprites.shared.images.blood0,
        Sprites.shared.images.blood1,
        Sprites.shared.images.blood2
    ]

    class BloodStain extends SpriteObject {

        private time = 0

        constructor(
            size: number
        ){
            super(sprites[size])
            this.renderOrder = -1
        }

        update(deltaTime: number): void {
            super.update( deltaTime )

            this.time += deltaTime

            if( this.time>=2 ){
                this.removeFromManager()
            }
        }

    }

    export class BloodStainOverAnyWhere extends GameObject {
        async drop(
            radius: number,
            density: number = 1
        ){
            const interval = 0.0125
            let time = 0
            Audio.play(Audio.sounds.explosion)
            for( let i=0; i<30; i++ ){
                time += await this.wait(0)

                while( time>=interval ){
                    for( let j=0; j<density; j++ ){
                        const bs = new BloodStain( Math.floor(Math.random()*sprites.length) )
                        bs.pos.copy( this.pos ).add(
                            v1.random().multiply(2).add(-1).normalize().multiply(Math.random()*radius)
                        )
                        this.manager && this.manager.add(bs)
                    }
                    time -= interval
                }
            }
        }
    }

}