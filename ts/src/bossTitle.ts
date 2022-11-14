namespace zlsSpaceInvader {

    const v1 = new Vector2

    export class BossTitle extends GameObject {

        async show(){            
            if( this.manager ){
                await this.wait(2)
            
                const text1 = new SpriteObject(Sprites.shared.images.bossTitle0)
                text1.pos.copy(this.pos)
                text1.pos.x += 200
                this.manager.add(text1)

                await ObjectMotionControl.moveTo(text1, v1.set(0,0), 1000)

                await this.wait(0.5)
                const text2 = new SpriteObject(Sprites.shared.images.bossTitle1)
                text2.pos.copy(this.pos)
                text2.pos.x += 200
                this.manager.add(text2)

                await ObjectMotionControl.moveTo(text2, v1.set(0,0), 1000)

                await this.wait(3)
                this.wait(2).then(()=>{
                    text1.removeFromManager()
                    text2.removeFromManager()
                    this.removeFromManager()
                })
            }
        }

    }

}