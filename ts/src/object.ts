namespace zlsSpaceInvader {

    export class GameObject {

        readonly pos = new Vector2
        manager?: GameObjectManager
        paused: boolean = false
        renderHalf = true
        renderOrder = 0
        visible = true

        private waitPromises: {
            time: number
            resolve: (n: number)=>void
            reject: (e: Error)=>void
            resolved: boolean
        }[] = []

        update( deltaTime: number ){
            for( let w of Array.from(this.waitPromises) ){
                w.time -= deltaTime
                if( w.time<=0 ){
                    w.resolve(-w.time)
                    w.resolved = true
                }
            }
            this.waitPromises = this.waitPromises.filter(w=>!w.resolved)
        }

        render( deltaTime: number, ctx: CanvasRenderingContext2D ){}

        removeFromManager(){
            for( let w of this.waitPromises ){
                w.reject(new Error("Object removed."))
            }
            this.waitPromises.length = 0
            this.manager && this.manager.remove(this)
        }

        wait( time: number ){
            if( this.manager ){
                return new Promise<number>( (resolve, reject)=>{
                    this.waitPromises.push({
                        time: time,
                        resolve: resolve,
                        reject: reject,
                        resolved: false
                    })
                })
            }else{
                return Promise.reject(new Error("Manager is undefined"))
            }
        }
    }

    export class SpriteObject extends GameObject {

        readonly pos = new Vector2
        
        constructor(
            public sprite: HTMLImageElement | HTMLCanvasElement
        ){
            super()
        }

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
            for( let o of this.gameObjects.filter(o=>!o.renderHalf && o.visible).sort((a,b)=>a.renderOrder-b.renderOrder) )
                o.render(deltaTime, ctx)
        }

        renderHalf( deltaTime: number, ctx: CanvasRenderingContext2D ){
            for( let o of this.gameObjects.filter(o=>o.renderHalf && o.visible).sort((a,b)=>a.renderOrder-b.renderOrder) )
                o.render(deltaTime, ctx)
        }

    }

}