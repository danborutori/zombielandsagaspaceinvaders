namespace zlsSpaceInvader {

    const enemyEdgePadding = 9

    export class EnemyCooperator extends GameObject {

        private cooldown = 0
        private moveDir: "left" | "right" = "left"
        private enemies: {
            enemy: EnemyFlight
            initPos: Vector2
            targetPos: Vector2
        }[]

        constructor(
            readonly stage: Stage,
            enemies: EnemyFlight[],
            readonly waveEnd: ()=>void
        ){
            super()

            this.enemies = enemies.map(e=>{
                return {
                    enemy: e,
                    initPos: e.pos.clone(),
                    targetPos: e.pos.clone()
                }
            })
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.cooldown -= deltaTime

            if( this.cooldown<=0 ){
                const lifeEnemyRatio = this.enemies.reduce((a,b)=>a+(b.enemy.manager?1:0),0)/(this.enemies.length-1)
                const interval = 0.01+0.49*lifeEnemyRatio
                const enemyMoveSpeed = 3+(1-lifeEnemyRatio)*6

                let deltaX = 0
                switch( this.moveDir ){
                case "left":
                    let minX = Number.MAX_VALUE
                    for( let e of this.enemies )
                        if( e.enemy.manager )
                            minX = Math.min(e.targetPos.x, minX)
                    if( minX<=this.stage.left+enemyEdgePadding ){
                        this.moveDir = "right"
                    }
                    break
                case "right":
                    let maxX = Number.MIN_VALUE
                    for( let e of this.enemies )
                        if( e.enemy.manager )
                            maxX = Math.max(e.targetPos.x, maxX)
                    if( maxX>=this.stage.right-enemyEdgePadding ){
                        this.moveDir = "left"
                    }
                    break
                }
    
                switch( this.moveDir ){
                case "left":
                    deltaX = -enemyMoveSpeed
                    break
                case "right":
                    deltaX = enemyMoveSpeed
                    break
                }
    
                for( let e of this.enemies ){
                    e.targetPos.x += deltaX
                    if( !e.enemy.isFlyingOff &&
                        Math.random()<0.005
                    ){
                        e.enemy.startFlyOff( e.targetPos )
                    }
                }

                this.cooldown += interval
            }

            for( let e of this.enemies ){
                if( !e.enemy.isFlyingOff ){
                    
                    e.enemy.vel.sub( e.targetPos, e.enemy.pos )

                    const speed = Math.min( e.enemy.vel.length()/deltaTime, 1000 )
                    e.enemy.vel.normalize().multiply(speed)
                }
            }


            const anyAlive = this.enemies.reduce( (a, b)=>{
                return a || b.enemy.manager!==undefined
            }, false)
            if( !anyAlive ){
                this.waveEnd()
            }
        }
    }

}