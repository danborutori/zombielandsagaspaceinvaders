namespace zlsSpaceInvader {

    const v1 = new Vector2
    const v2 = new Vector2

    class ShakingSprite extends SpriteObject {

        shake = true
        
        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {

            v1.copy(this.pos)
            if( this.shake)
                this.pos.add(v2.random().multiply(2).add(-1).multiply(2))

            super.render(deltaTime, ctx)

            this.pos.copy(v1)
        }
    }


    export class BossTitle extends GameObject {

        async show(){            
            if( this.manager ){
                await this.wait(2)
            
                const text1 = new ShakingSprite(Sprites.shared.images.bossTitle0)
                text1.pos.copy(this.pos)
                this.manager.add(text1)

                await this.wait(2)
                const text2 = new ShakingSprite(Sprites.shared.images.bossTitle1)
                text1.pos.copy(this.pos)
                this.manager.add(text2)

                await this.wait(3)
                text1.shake = false
                text2.shake = false
                this.wait(2).then(()=>{
                    text1.removeFromManager()
                    text2.removeFromManager()
                    this.removeFromManager()
                })
            }
        }

    }

}