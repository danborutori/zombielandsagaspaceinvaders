namespace zlsSpaceInvader {
    const v1 = new Vector2

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
    const phase2HpRatio = 0.99//0.2
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

        // update(deltaTime: number): void {
        //     super.update(deltaTime*10)
        // }

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

                await Promise.all([
                    this.attackPhase1( stage ),
                    this.attackPhase2( stage )
                ])
                

            }catch(e){}

        }

        private async attackPhase1( stage: Stage ){
            const v1 = new Vector2

            try{
                
                for( let k=0; true; k++ ){

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

                    await this.dash(
                        stage,
                        (stage.left+40)*Math.sin(k*Math.PI*2/3),
                        k%2==1
                    )
                }

            }catch(e){}

        }

        private async attackPhase2(
            stage: Stage
        ){
            const v1 = new Vector2

            try{
                while( this.hp>=defalutMaxHp*phase2HpRatio){
                    await this.wait(0)
                }

                this.terminateAllWaiting()

                ObjectMotionControl.moveTo(
                    this,
                    v1.set(0,-30),
                    50
                )

                while( true ){
                    await this.wait(2)
                    this.shotLaser()
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

        private async throwGrenade(){
            const shotCtxes = [
                FlightShootPatternControl.shoot(
                    this,
                    new IntervalNode(
                        new ConstantNode(0.06),
                        new RingNode(
                            new ConstantNode(10),
                            new ConstantNode(6),
                            new GrendaeNode(
                                new ConstantNode(new Vector2(-28,-21)),
                                undefined,
                                new ConstantNode(50)
                            )
                        )
                    )
                ),
                FlightShootPatternControl.shoot(
                    this,
                    new IntervalNode(
                        new ConstantNode(0.06),
                        new RingNode(
                            new ConstantNode(10),
                            new ConstantNode(6),
                            new GrendaeNode(
                                new ConstantNode(new Vector2(33,8)),
                                undefined,
                                new ConstantNode(50)
                            )
                        )
                    )
                ),
            ]
            await this.wait(0.2)
            for( let ctx of shotCtxes ) ctx.stop()
        }

        private shotLaser(){
            if( this.manager ){
                const l = new Laser()
                l.pos.copy( this.pos ).add(
                    v1.set(2,56)
                )
                this.manager.add(l)
            }
        }

        private async dash(
            stage: Stage,
            x: number,
            backoffShot: boolean
        ){
            const v1 = new Vector2

            await ObjectMotionControl.moveTo(
                this,
                v1.set( x, -30 ),
                50
            )
            await this.wait(2)

            this.throwGrenade()
            await ObjectMotionControl.moveTo(
                this,
                v1.set( x, stage.top+40 ),
                200
            )
            await this.wait(0.1)

            await ObjectMotionControl.moveTo(
                this,
                v1.set( x, stage.bottom-40 ),
                200
            )
            await this.wait(1)

            if(backoffShot)
                this.simpleShoot()

            await ObjectMotionControl.moveTo(
                this,
                v1.set( x, -30 ),
                200
            )
            await this.wait(1)
        }
    }

    class Laser extends AnimatedSpriteObject {
        constructor(){
            super([
                Sprites.shared.images.laser0,
                Sprites.shared.images.laser1,
                Sprites.shared.images.laser2,
                Sprites.shared.images.laser3,
                Sprites.shared.images.laser4,
                Sprites.shared.images.laser5,
                Sprites.shared.images.laser6,
                Sprites.shared.images.laser5,
                Sprites.shared.images.laser6,
                Sprites.shared.images.laser5,
                Sprites.shared.images.laser6,
                Sprites.shared.images.laser5,
                Sprites.shared.images.laser6,
                Sprites.shared.images.laser5,
                Sprites.shared.images.laser6,
                Sprites.shared.images.laser5,
                Sprites.shared.images.laser6,
                Sprites.shared.images.laser7,
                Sprites.shared.images.laser8,
            ], 0.05)
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