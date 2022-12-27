namespace zlsSpaceInvader {

    export class GameObject {

        readonly pos = new Vector2
        manager?: GameObjectManager
        paused: boolean = false
        renderHalf = true
        renderOrder = 0
        visible = true

        private waitPromises: {
            label?: string
            time: number
            priority: number
            resolve: (n: number)=>void
            reject: (e: Error)=>void
            state: "running" | "resolved" | "rejected"
        }[] = []

        update( deltaTime: number ){
            for( let w of Array.from(this.waitPromises)
                .sort((a,b)=>a.priority-b.priority)
            ){
                if( w.state=="running" ){
                    w.time -= deltaTime
                    if( w.time<=0 ){
                        w.state = "resolved"
                        w.resolve(-w.time)
                    }
                }
            }
            this.waitPromises = this.waitPromises.filter(w=>w.state=="running")
        }

        render( deltaTime: number, ctx: CanvasRenderingContext2D ){}

        removeFromManager(){
            const manager = this.manager
            manager && manager.remove(this)
            this.terminateAllWaiting(new Error("Object removed."))
        }

        wait( time: number, priority: number = 0, label?: string ){
            if( this.manager ){
                return new Promise<number>( (resolve, reject)=>{
                    this.waitPromises.push({
                        label: label,
                        time: time,
                        priority: priority,
                        resolve: resolve,
                        reject: reject,
                        state: "running"
                    })
                })
            }else{
                return Promise.reject(new Error("Manager is undefined"))
            }
        }

        terminateAllWaiting( reason: Error = new Error("Terminated")){
            const tasks = Array.from(this.waitPromises)
            this.waitPromises.length = 0
            for( let w of tasks ){
                if( w.state=="running" ){
                    w.state = "rejected"
                    w.reject(reason)
                }
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

    export class AnimatedSpriteObject extends SpriteObject {

        time = 0
        get frame() {
            return Math.floor(this.time/this.secondPerSprite)
        }

        constructor(
            readonly sprites: (HTMLImageElement | HTMLCanvasElement)[],
            readonly secondPerSprite: number,
            readonly duration?: number
        ){
            super(sprites[0])
        }

        protected onAnimationEnd(){
            this.removeFromManager()
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.time += deltaTime

            const i =  this.frame
            if( i<this.sprites.length ){
                this.sprite = this.sprites[i]
            }else if( this.duration===undefined){
                this.onAnimationEnd()
            }
            if( this.duration!==undefined && this.time>=this.duration ){
                this.onAnimationEnd()
            }
        }
    }

    export class GameObjectManager {
        readonly gameObjects: GameObject[] = []
        readonly playerBullets: Set<PlayerBullet> = new Set
        readonly playerFlights: Set<PlayerFlight> = new Set
        readonly enemyFlights: Set<EnemyFlight> = new Set

        add( o: GameObject ){
            o.removeFromManager()
            this.gameObjects.push(o)
            o.manager = this
            if( (o as PlayerBullet).isPlayerBullet ){
                this.playerBullets.add(o as PlayerBullet)
            }else if( (o as PlayerFlight).isPlayerFlight ){
                this.playerFlights.add(o as PlayerFlight)
            }else if( (o as EnemyFlight).isEnemyFlight ){
                this.enemyFlights.add(o as EnemyFlight)
            }
        }

        remove( o: GameObject ){
            const i = this.gameObjects.indexOf(o)
            if( i>=0 ){
                this.gameObjects.splice( i, 1 )
                o.manager = undefined
                this.playerBullets.delete( o as PlayerBullet )
                this.playerFlights.delete(o as PlayerFlight)
                this.enemyFlights.delete(o as EnemyFlight)
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