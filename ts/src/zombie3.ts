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

    function getDefaultMaxHp(){
        switch(DifficultyManager.shared.difficulty){
        case "normal":
            return 500
        case "easy":
            return 300
        }
    }

    function getBulletIntervalScale(){
        switch(DifficultyManager.shared.difficulty){
        case "normal":
            return 1
        case "easy":
            return 1.5
        }
    }

    function getBulletSegmentScale(){
        switch(DifficultyManager.shared.difficulty){
        case "normal":
            return 1
        case "easy":
            return 0.5
        }
    }

    const phase2HpRatio = 0.2
    const totalScore = 10000

    class ProgressCounter extends GameObject {

        progress = 0
        private semiProgress = 0

        private zombies: {
            zombie3: Zombie3,
            defaultHp: number
        }[] = []
        

        add( zombie3: Zombie3 ){
            this.zombies.push({
                zombie3: zombie3,
                defaultHp: zombie3.hp
            })
            for(let z of this.zombies)z.defaultHp = z.zombie3.hp
            this.semiProgress = this.progress
        }

        update( deltaTime: number ){
            super.update( deltaTime )
            let p = 0
            for( let z of this.zombies ){
                p += 1-z.zombie3.hp/z.defaultHp
            }
            p /= this.zombies.length
            this.progress = this.semiProgress+(1-this.semiProgress)*p
            console.log( {
                p: p,
                semiProgress: this.semiProgress,
                progress: this.progress
            })
        }
    }

    class Zombie3 extends EnemyFlight {

        hp!: number

        constructor(
            scorer: ScoreAndCredit,
            maxHp: number = getDefaultMaxHp(),
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

        async playAttackSequence(enemies: EnemyFlight[], progressCounter: ProgressCounter){
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
                    this.phase1(),
                    this.phase2(enemies, progressCounter)
                ])

            }catch(e){
                // do nothing
            }
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
                            new ConstantNode(0.3*getBulletIntervalScale()),
                            new RingNode(
                                new ConstantNode(5),
                                new ConstantNode(16*getBulletSegmentScale()),
                                new EnemyBulletNode(
                                    new ConstantNode(new Vector2(0,-33)),
                                    undefined,
                                    new ConstantNode(60)
                                )
                            )
                        )
                    )

                    await ObjectMotionControl.moveTo(
                        this,
                        v.set(
                            stage.left+20,
                            this.pos.y
                        ),
                        20
                    )
                    await this.wait(0.5)

                    await ObjectMotionControl.moveTo(
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

                    await ObjectMotionControl.moveTo(
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
                            new ConstantNode(0.4*getBulletIntervalScale()),
                            new RingNode(
                                new ConstantNode(5),
                                new ConstantNode(16*getBulletSegmentScale()),
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

                    await ObjectMotionControl.moveCircle(
                        this,
                        v.set(0,0),
                        50,
                        i*30*Math.PI/180,
                        i%2==0,
                        20
                    )
                    await this.wait(3)
                }
            }catch(e){
                // do nothing
            }
            finally{
                shotCtx && shotCtx.stop()
            }
        }

        async phase2(enemies: EnemyFlight[], progressCounter: ProgressCounter){
            const v = new Vector2
            
            while( this.hp>getDefaultMaxHp()*phase2HpRatio ){
                await this.wait(0, 1)
            }
            this.terminateAllWaiting()

            await this.wait(2)

            await ObjectMotionControl.moveTo(
                this,
                v.set(0,-30),
                50
            )

            await this.wait(1)

            this.renderOrder += 0.1
            const newZombies = await Promise.all([0, 1].map( async i=>{
                const newZombie3 = new Zombie3(this.scorer, getDefaultMaxHp()*phase2HpRatio, totalScore/4)
                newZombie3.pos.copy( this.pos )
                this.manager && this.manager.add( newZombie3 )
                enemies.push(newZombie3)
                progressCounter.add( newZombie3 )

                try{
                    await ObjectMotionControl.moveTo(
                        newZombie3,
                        new Vector2(
                            this.pos.x+30*(i==0?1:-1),
                            this.pos.y
                        ),
                        10
                    )
                }catch(e){
                    // do nothing
                }

                return newZombie3
            }))

            newZombies.push( this )

            try{
                await this.wait(1)
            }catch(e){
                // do nothing
            }

            await Promise.all(
                newZombies.map( async (z,i)=>{
                    try{
                        await z.wait(i*1)
                        await z.phase2_2()
                    }catch(e){
                        // do nothing
                    }
                })
            )
        }

        async phase2_2(){
            const v = new Vector2

            const shotCtx = FlightShootPatternControl.shoot(
                this,
                new IntervalNode(
                    new ConstantNode(0.4*getBulletIntervalScale()),
                    new RingNode(
                        new ConstantNode(5),
                        new ConstantNode(16*getBulletSegmentScale()),
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

                    await ObjectMotionControl.moveCircle(
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
            }catch(e){
                // do nothing
            }
            finally{
                shotCtx.stop()
            }
        }
    }

    export class Zombie3Wave extends BossEnemyWave {
        constructor(
            readonly onWaveEnd: ()=>void,            
            nextMember: ()=>FlightUnit | null
        ){
            super(nextMember)
        }

        init(scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight): void {

            const waiter = new GameObject()
            gameObjectManager.add(waiter)
            
            const boss = new Zombie3( scoreAndCredit )
            boss.pos.set( 0, scoreAndCredit.stage.top-40 )
            this.enemies.push( boss )
            gameObjectManager.add( boss )

            const progressCounter = new ProgressCounter()
            progressCounter.add( boss )
            gameObjectManager.add( progressCounter )

            const bossHp = new BossProgressMeter(
                "DANCER",
                ()=>{
                    return progressCounter.progress
                }
            )
            gameObjectManager.add(bossHp)

            const powerupCtx = this.dropPowerUp( scoreAndCredit, gameObjectManager )
            boss.playAttackSequence(this.enemies, progressCounter).then(async ()=>{

                powerupCtx.stop()

                await waiter.wait(5)
                waiter.removeFromManager()

                bossHp.removeFromManager()
                progressCounter.removeFromManager()
                this.onWaveEnd()
            })
        }
    }

}