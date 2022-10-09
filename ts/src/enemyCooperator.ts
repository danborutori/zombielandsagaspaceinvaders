namespace zlsSpaceInvader {

    const enemyEdgePadding = 9

    export class EnemyCooperator extends GameObject {

        private cooldown = 0
        private moveDir: "left" | "right" = "left"

        constructor(
            readonly stage: Stage,
            private enemies: EnemyFlight[],
            readonly waveEnd: ()=>void
        ){
            super()
        }

        update(deltaTime: number): void {
            super.update(deltaTime)

            this.cooldown -= deltaTime

            if( this.cooldown<=0 ){
                const lifeEnemyRatio = this.enemies.reduce((a,b)=>a+(b.manager?1:0),0)/(this.enemies.length-1)
                const interval = 0.01+0.49*lifeEnemyRatio
                const enemyMoveSpeed = 3+(1-lifeEnemyRatio)*6
                const enemyYMoveSpeed = 7+(1-lifeEnemyRatio)*7

                let deltaX = 0
                let deltaY = 0
                switch( this.moveDir ){
                case "left":
                    let minX = Number.MAX_VALUE
                    for( let e of this.enemies )
                        if( e.manager )
                            minX = Math.min(e.pos.x, minX)
                    if( minX<=this.stage.left+enemyEdgePadding ){
                        deltaY = enemyYMoveSpeed
                        this.moveDir = "right"
                    }
                    break
                case "right":
                    let maxX = Number.MIN_VALUE
                    for( let e of this.enemies )
                        if( e.manager )
                            maxX = Math.max(e.pos.x, maxX)
                    if( maxX>=this.stage.right-enemyEdgePadding ){
                        deltaY = enemyYMoveSpeed
                        this.moveDir = "left"
                    }
                    break
                }
    
                if( deltaY==0 ){

                    switch( this.moveDir ){
                    case "left":
                        deltaX = -enemyMoveSpeed
                        break
                    case "right":
                        deltaX = enemyMoveSpeed
                        break
                    }
                }
    
                for( let e of this.enemies ){
                    e.pos.x += deltaX
                    e.pos.y += deltaY
                }

                this.cooldown += interval
            }

            const anyAlive = this.enemies.reduce( (a, b)=>{
                return a || (b.manager!==undefined && b.pos.y<this.stage.bottom)
            }, false)
            if( !anyAlive ){
                this.waveEnd()
            }
        }
    }

}