namespace zlsSpaceInvader {

    const defalutMaxHp = 1000

    const collisionShape = new ColliderBox(new Vector2(250,250))

    class UFO extends EnemyFlight{

        constructor(
            scorer: ScoreAndCredit,
        ){
            super(
                Sprites.shared.images.ufo,
                scorer,
                10000,
                defalutMaxHp
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

        async playAttackSequence(){
            const v1 = new Vector2

            const stage = this.scorer.stage

            await ObjectMotionControl.moveTo(
                this,
                v1.set(0, stage.top-60),
                10
            )

            await this.wait(2)

            await Promise.all([
                this.attackPhase1()
            ])
        }

        private async normalShot(
            shotPos: Vector2
        ){
            const shotCtx = FlightShootPatternControl.shoot(
                this,
                new IntervalNode(
                    new ConstantNode(0.4),
                    new RingNode(
                        new ConstantNode(5),
                        new ConstantNode(16),
                        new EnemyBulletNode(
                            new ConstantNode(shotPos),
                            new SineNode(
                                new ConstantNode(0.5),
                                new ConstantNode(Math.PI/6)
                            ),
                            new ConstantNode(30)
                        )
                    )
                )
            ) 

            try{
                await this.wait(3)
            }catch(e){
                // do nothing
            }finally{
                shotCtx.stop()
            }
        }

        private async attackPhase1(){
            const v1 = new Vector2
            const v2 = new Vector2
            const v3 = new Vector2

            await this.normalShot(
                v1.set(0,150).rotateAround(15*Math.PI/180)
            )
            await this.wait(1)

            await this.normalShot(
                v1.set(0,150).rotateAround(-15*Math.PI/180)
            )
            await this.wait(1)

            await this.normalShot(
                v1.set(0,150)
            )
            await this.wait(1)

            for( let i=0; true; i++ ){

                await Promise.all([
                    this.normalShot(
                        v1.set(0,150).rotateAround(15*Math.PI/180)
                    ),
                    this.normalShot(
                        v2.set(0,150).rotateAround(-15*Math.PI/180)
                    )
                ])
                await this.wait(1)

                await Promise.all([
                    this.normalShot(
                        v1.set(0,150).rotateAround(0)
                    ),
                    this.normalShot(
                        v2.set(0,150).rotateAround(-15*Math.PI/180)
                    )
                ])
                await this.wait(1)

                await Promise.all([
                    this.normalShot(
                        v1.set(0,150).rotateAround(0)
                    ),
                    this.normalShot(
                        v2.set(0,150).rotateAround(15*Math.PI/180)
                    )
                ])
                await this.wait(1)

                await Promise.all([
                    this.normalShot(
                        v1.set(0,150).rotateAround(0)
                    ),
                    this.normalShot(
                        v2.set(0,150).rotateAround(15*Math.PI/180)
                    ),
                    this.normalShot(
                        v3.set(0,150).rotateAround(-15*Math.PI/180)
                    )
                ])
                await this.wait(1)

            }
        }
    }

    export class UFOWave extends BossEnemyWave {
        constructor(
            readonly stage: Stage,
            readonly onWaveEnd: ()=>void,
            nextMember: ()=>FlightUnit | null
        ){
            super(nextMember)
        }

        private async ufoFlyOver(
            manager: GameObjectManager
        ){
            const v1 = new Vector2

            const videoNoise = new VideoNoise()
            videoNoise.renderHalf = false
            videoNoise.renderOrder = 3
            videoNoise.strength = 0
            manager.add( videoNoise )

            const ufo = new SpriteObject( Sprites.shared.images.ufo )
            ufo.renderHalf = false
            ufo.renderOrder = 2
            ufo.pos.set(0,this.stage.bottom+200)
            manager.add( ufo )

            await Promise.all([
                ObjectMotionControl.moveTo(
                    ufo,
                    v1.set(0,this.stage.top-200),
                    50
                ),
                (async ()=>{
                    Audio.play(Audio.sounds.alienShip)
                    const distance = this.stage.bottom+200
                    while( Math.abs(ufo.pos.y-(this.stage.top-200))>1){
                        await videoNoise.wait(0)
                        videoNoise.strength = 1-Math.abs(ufo.pos.y/distance)
                    }
                })()
            ])

            ufo.removeFromManager()
            videoNoise.removeFromManager()
        }

        async showTitle(manager: GameObjectManager, wave: number) {
            // await this.ufoFlyOver( manager )
            await super.showTitle( manager, wave )
        }

        init(scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight): void {
            
            const waiter = new GameObject()
            gameObjectManager.add(waiter)

            const boss = new UFO( scoreAndCredit )
            boss.pos.set( 0, scoreAndCredit.stage.top-180 )
            this.enemies.push( boss )
            gameObjectManager.add( boss )

            const powerupCtx = this.dropPowerUp(scoreAndCredit, gameObjectManager)
            boss.playAttackSequence().then(async ()=>{

                await waiter.wait(5)
                waiter.removeFromManager()

                this.onWaveEnd()
            })
        }
    }

}