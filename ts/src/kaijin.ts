namespace zlsSpaceInvader {

    const collisionShape = new ColliderCompoundShape()
    collisionShape.shapes.push({   
        shape: new ColliderBox(
            new Vector2(
                62,75
            )
        ),
        pos: new Vector2(11,-1)
    })
    collisionShape.shapes.push({   
        shape: new ColliderBox(
            new Vector2(
                34,39
            )
        ),
        pos: new Vector2(-28,-6)
    })

    const defalutMaxHp = 500
    const totalScore = 10000

    class Kaijin extends EnemyFlight {
        constructor(
            scorer: ScoreAndCredit,
            maxHp: number = defalutMaxHp,
            score: number = totalScore/2
        ){
            super(
                Sprites.shared.images.kaijin,
                scorer,
                score,
                maxHp
            )

            this.collisionShape = collisionShape
        }

        protected wrapAround(){
            // don't wrapAround
        }

        protected playExplosionAnimation(): void {
            if( this.manager ){
                const bs = new BloodStainOverAnyWhere()
                bs.pos.copy(this.pos)
                this.manager.add(bs)
                bs.drop(80)
            }
        }

        async playAttackSequence(
            stage: Stage
        ){

            const v = new Vector2
            
            try{

                // on stage
                await ObjectMotionControl.moveTo(
                    this,
                    v.set(
                        0,
                        -30
                    ),
                    50
                )
                await this.wait(3)

                await this.attackPhase1( stage )
                

            }catch(e){}

        }

        private async attackPhase1( stage: Stage ){
            const v1 = new Vector2

            try{
                
                while( true ){

                    for( let j=0; j<3; j++ ){
                        for( let i=0; i<3; i++ ){
                            let xStart = stage.left+40
                            let xEnd = stage.right-40
                            if( j%2==1 ){
                                const tmp = xStart
                                xStart = xEnd
                                xEnd = tmp
                            }
                            const y = mix( stage.top+40, stage.bottom-50, i/3 )
                            this.simpleShoot()
                            await ObjectMotionControl.moveTo(
                                this,
                                v1.set( xStart, y ),
                                200
                            )

                            await this.wait(0.5)

                            this.simpleShoot()
                            await ObjectMotionControl.moveTo(
                                this,
                                v1.set( xEnd, y ),
                                200
                            )

                            await this.wait(0.5)
                        }
                    }

                    await this.dash(stage)
                }

            }catch(e){}

        }

        private async simpleShoot(){
            const shotCtx = FlightShootPatternControl.shoot(
                this,
                new IntervalNode(
                    new ConstantNode(0.05),
                    new RingNode(
                        new ConstantNode(3),
                        new ConstantNode(12),
                        new EnemyBulletNode(
                            new ConstantNode(new Vector2(0,-20)),
                            undefined,
                            new ConstantNode(50)
                        )
                    )
                )
            )
            await this.wait(0.2)
            shotCtx.stop()
        }

        private async dash(
            stage: Stage
        ){
            const v1 = new Vector2

            await ObjectMotionControl.moveTo(
                this,
                v1.set( 0, -30 ),
                50
            )
            await this.wait(2)

            await ObjectMotionControl.moveTo(
                this,
                v1.set( 0, stage.top+40 ),
                200
            )
            await this.wait(0.1)

            await ObjectMotionControl.moveTo(
                this,
                v1.set( 0, stage.bottom-40 ),
                200
            )
            await this.wait(1)

            await ObjectMotionControl.moveTo(
                this,
                v1.set( 0, -30 ),
                200
            )
            await this.wait(1)
        }
    }

    export class KaijinWave extends BaseEnemyWave {
        readonly isBoss = true

        constructor(readonly onWaveEnd: ()=>void){
            super()
        }

        init(scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight): void {

            const waiter = new GameObject()
            gameObjectManager.add(waiter)
            
            const boss = new Kaijin( scoreAndCredit )
            boss.pos.set( 0, scoreAndCredit.stage.top-40 )
            this.enemies.push( boss )
            gameObjectManager.add( boss )

            boss.playAttackSequence(
                scoreAndCredit.stage
            ).then(async ()=>{

                await waiter.wait(5)
                waiter.removeFromManager()

                this.onWaveEnd()
            })
        }
    }

}