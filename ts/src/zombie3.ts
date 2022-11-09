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

    class Zombie3 extends EnemyFlight {
        constructor(
            scorer: ScoreAndCredit
        ){
            super(
                Sprites.shared.images.bigZombie,
                scorer,
                10000,
                10000,
                ()=>{
                    // never collide player
                }
            )

            this.collisionShape = collisionShape
        }

        protected wrapAround(){
            // don't wrapAround
        }

        // update(deltaTime: number): void {
        //     super.update(deltaTime*10)
        // }

        async playAttackSequence(){
            const v = new Vector2
            const stage = this.scorer.stage
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

                for( let i=0; true; i++  ){
                    await FlightMotionControl.moveTo(
                        this,
                        v.set(
                            stage.left+20,
                            this.pos.y
                        ),
                        10
                    )
                    await this.wait(0.5)

                    await FlightMotionControl.moveTo(
                        this,
                        v.set(
                            stage.right-20,
                            this.pos.y
                        ),
                        10
                    )
                    await this.wait(0.5)

                    await FlightMotionControl.moveTo(
                        this,
                        v.set(
                            0,
                            this.pos.y
                        ),
                        10
                    )
                    await this.wait(3)

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

            }
        }
    }

    export class Zombie3Wave extends BaseEnemyWave {
        init(scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight): void {
            
            const boss = new Zombie3( scoreAndCredit )
            boss.pos.set( 0, scoreAndCredit.stage.top-40 )
            this.enemies.push( boss )
            gameObjectManager.add( boss )

            boss.playAttackSequence()
        }
    }

}