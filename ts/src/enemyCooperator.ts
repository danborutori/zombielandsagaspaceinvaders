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
        allowFlyOff = true
        allowEnd = true

        set invincible( b: boolean ){
            for( let e of this.enemies ) e.enemy.invincible = b
        }

        readonly difficultyProfile: DifficultyProfile

        constructor(
            wave: number,
            readonly stage: Stage,
            enemies: EnemyFlight[],
            readonly waveEnd: ()=>void
        ){
            super()

            this.difficultyProfile = DifficultyManager.shared.getProfile(wave)

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
                const interval = (0.01+0.49*lifeEnemyRatio)/0.6
                const enemyMoveSpeed = (3+(1-lifeEnemyRatio)*6)*0.6
                const flyOffRate = 0.005+(1-lifeEnemyRatio)*0.1+this.difficultyProfile.extraFlyOffRate

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
    
                if( this.allowFlyOff ){
                    for( let e of this.enemies ){
                        e.targetPos.x += deltaX
                        if( !e.enemy.isFlyingOff &&
                            Math.random()<flyOffRate
                        ){
                            e.enemy.startFlyOff(
                                this,
                                e.targetPos,
                                this.difficultyProfile.bulletInterval,
                                this.difficultyProfile.bulletCount
                            )
                        }
                    }
                }

                this.cooldown += interval
            }

            for( let e of this.enemies ){
                if( !e.enemy.isFlyingOff ){
                    e.enemy.pos.copy(e.targetPos)
                    e.enemy.vel.set(0,0)
                }
            }


            if( this.allowEnd ){
                const anyAlive = this.enemies.reduce( (a, b)=>{
                    return a || b.enemy.manager!==undefined
                }, false)
                if( !anyAlive ){
                    this.waveEnd()
                }
            }
        }
    }

}