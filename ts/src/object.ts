namespace zlsSpaceInvader {

    export class GameObject {

        readonly pos = new Vector2
        manager?: GameObjectManager
        paused: boolean = false
        renderHalf = true
        renderOrder = 0

        update( deltaTime: number ){}

        render( deltaTime: number, ctx: CanvasRenderingContext2D ){}

        removeFromManager(){
            this.manager && this.manager.remove(this)
        }
    }

    export class SpriteObject extends GameObject {

        readonly pos = new Vector2
        
        constructor(
            public sprite: HTMLImageElement | HTMLCanvasElement
        ){
            super()
        }

        update( deltaTime: number ){}

        render( deltaTime: number, ctx: CanvasRenderingContext2D ){
            super.render( deltaTime, ctx )
            ctx.drawImage(this.sprite,
                Math.floor(this.pos.x-this.sprite.width/2),
                Math.floor(this.pos.y-this.sprite.height/2)
            )
        }
    }

    export class GameObjectManager {
        gameObjects: GameObject[] = []

        add( o: GameObject ){
            o.removeFromManager()
            this.gameObjects.push(o)
            o.manager = this
        }

        remove( o: GameObject ){
            if( o.manager===this ){
                this.gameObjects = this.gameObjects.filter(_o=>_o!==o)
                o.manager = undefined
            }
        }

        update( deltaTime: number ){
            for( let o of Array.from(this.gameObjects) )
                if( !o.paused )
                    o.update(deltaTime)
        }

        render( deltaTime: number, ctx: CanvasRenderingContext2D ){
            for( let o of this.gameObjects.filter(o=>!o.renderHalf).sort((a,b)=>a.renderOrder-b.renderOrder) )
                o.render(deltaTime, ctx)
        }

        renderHalf( deltaTime: number, ctx: CanvasRenderingContext2D ){
            for( let o of this.gameObjects.filter(o=>o.renderHalf).sort((a,b)=>a.renderOrder-b.renderOrder) )
                o.render(deltaTime, ctx)
        }

    }

}