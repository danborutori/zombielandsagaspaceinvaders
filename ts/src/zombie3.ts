namespace zlsSpaceInvader {

    const collisionShape = new ColliderCompoundShape()
    collisionShape.shapes.push({   
        shape: new ColliderBox(
            new Vector2(
                20,71
            )
        ),
        pos: new Vector2(0,9)
    })
    collisionShape.shapes.push({   
        shape: new ColliderBox(
            new Vector2(
                39,26
            )
        ),
        pos: new Vector2(0,-13)
    })

    const defalutMaxHp = 50
    const phase2HpRatio = 0.2
    const totalScore = 10000

    class Zombie3 extends EnemyFlight {
        constructor(
            scorer: ScoreAndCredit,
            maxHp: number = defalutMaxHp,
            score: number = totalScore/2
        ){
            super(
                Sprites.shared.images.bigZombie,
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

        // update(deltaTime: number): void {
        //     super.update(deltaTime*10)
        // }

        async playAttackSequence(enemies: EnemyFlight[]){
            const v = new Vector2
            
            try{

                // on stage
                await FlightMotionControl.moveTo(
                    this,
                    v.set(
                        0,
                        -30
                    ),
                    50
                )
                await this.wait(3)

                await Promise.all([
                    this.phase1(),
                    this.phase2(enemies)
                ])

            }catch(e){}
        }

        async phase1(){
            const stage = this.scorer.stage
            const v = new Vector2
            let shotCtx: ShotCtx | undefined

            try{
                for( let i=0; true; i++  ){

                    shotCtx && shotCtx.stop()
                    shotCtx = FlightShootPatternControl.shoot(
                        this,
                        new IntervalNode(
                            new ConstantNode(0.3),
                            new RingNode(
                                new ConstantNode(5),
                                new ConstantNode(16),
                                new EnemyBulletNode(
                                    new ConstantNode(new Vector2(0,-33)),
                                    undefined,
                                    new ConstantNode(60)
                                )
                            )
                        )
                    )

                    await FlightMotionControl.moveTo(
                        this,
                        v.set(
                            stage.left+20,
                            this.pos.y
                        ),
                        20
                    )
                    await this.wait(0.5)

                    await FlightMotionControl.moveTo(
                        this,
                        v.set(
                            stage.right-20,
                            this.pos.y
                        ),
                        20
                    )
                    await this.wait(0.5)

                    shotCtx.stop()

                    shotCtx = undefined

                    await FlightMotionControl.moveTo(
                        this,
                        v.set(
                            0,
                            this.pos.y
                        ),
                        20
                    )
                    await this.wait(3)

                    shotCtx = FlightShootPatternControl.shoot(
                        this,
                        new IntervalNode(
                            new ConstantNode(0.4),
                            new RingNode(
                                new ConstantNode(5),
                                new ConstantNode(16),
                                new EnemyBulletNode(
                                    new ConstantNode(new Vector2(0,-33)),
                                    new SineNode(
                                        new ConstantNode(0.5),
                                        new ConstantNode(Math.PI/6)
                                    ),
                                    new ConstantNode(30)
                                )
                            )
                        )
                    )

                    await FlightMotionControl.moveCircle(
                        this,
                        v.set(0,0),
                        50,
                        i*30*Math.PI/180,
                        i%2==0,
                        20
                    )
                    await this.wait(3)
                }
            }catch(e){}
            finally{
                shotCtx && shotCtx.stop()
            }
        }

        async phase2(enemies: EnemyFlight[]){
            const v = new Vector2
            
            while( this.hp>defalutMaxHp*phase2HpRatio ){
                await this.wait(0)
            }
            this.terminateAllWaiting()

            await this.wait(2)

            await FlightMotionControl.moveTo(
                this,
                v.set(0,-30),
                50
            )

            await this.wait(1)

            this.renderOrder += 0.1
            const newZombies = await Promise.all([0, 1].map( async i=>{
                const newZombie3 = new Zombie3(this.scorer, defalutMaxHp*phase2HpRatio, totalScore/4)
                newZombie3.pos.copy( this.pos )
                this.manager && this.manager.add( newZombie3 )
                enemies.push(newZombie3)

                try{
                    await FlightMotionControl.moveTo(
                        newZombie3,
                        new Vector2(
                            this.pos.x+30*(i==0?1:-1),
                            this.pos.y
                        ),
                        10
                    )
                }catch(e){}

                return newZombie3
            }))

            newZombies.push( this )

            try{
                await this.wait(1)
            }catch(e){}

            await Promise.all(
                newZombies.map( async (z,i)=>{
                    try{
                        await z.wait(i*1)
                        await z.phase2_2()
                    }catch(e){}
                })
            )
        }

        async phase2_2(){
            const v = new Vector2

            const shotCtx = FlightShootPatternControl.shoot(
                this,
                new IntervalNode(
                    new ConstantNode(0.4),
                    new RingNode(
                        new ConstantNode(5),
                        new ConstantNode(16),
                        new EnemyBulletNode(
                            new ConstantNode(new Vector2(0,-33)),
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
                for( let i=0; true; i++ ){

                    await FlightMotionControl.moveCircle(
                        this,
                        v.set(
                            Math.sin(i*Math.PI*2/20)*50,
                            -30
                        ),
                        20,
                        0,
                        true,
                        60
                    )

                }
            }catch(e){}
            finally{
                shotCtx.stop()
            }
        }
    }

    export class Zombie3Wave extends BaseEnemyWave {
        constructor(readonly onWaveEnd: ()=>void){
            super()
        }

        init(scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight): void {

            const waiter = new GameObject()
            gameObjectManager.add(waiter)
            
            const boss = new Zombie3( scoreAndCredit )
            boss.pos.set( 0, scoreAndCredit.stage.top-40 )
            this.enemies.push( boss )
            gameObjectManager.add( boss )

            boss.playAttackSequence(this.enemies).then(async ()=>{

                await waiter.wait(5)
                waiter.removeFromManager()

                this.onWaveEnd()
            })
        }
    }

}