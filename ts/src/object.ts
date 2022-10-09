namespace zlsSpaceInvader {

    export class GameObject {

        readonly pos = new Vector2
        manager?: GameObjectManager

        update( deltaTime: number ){}

        render( deltaTime: number, ctx: CanvasRenderingContext2D ){}
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
                Math.floor(this.pos.y+this.sprite.height/2)
            )
        }
    }

    export class GameObjectManager {
        gameObjects: GameObject[] = []

        add( o: GameObject ){
            o.manager && o.manager.remove(o)
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
                o.update(deltaTime)
        }

        render( deltaTime: number, ctx: CanvasRenderingContext2D ){
            for( let o of this.gameObjects )
                o.render(deltaTime, ctx)
        }

    }

}