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

    function getDefaultMaxHp(){
        switch(DifficultyManager.shared.difficulty){
        case "normal":
            return 500
        case "easy":
            return 400
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

    class Kaijin extends EnemyFlight {

        hp!: number

        constructor(
            scorer: ScoreAndCredit,
            maxHp: number = getDefaultMaxHp(),
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
                

            }catch(e){
                // do nothing
            }

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

            }catch(e){
                // do nothing
            }

        }

        private async attackPhase2(
            stage: Stage
        ){
            const v1 = new Vector2

            try{
                while( this.hp>=getDefaultMaxHp()*phase2HpRatio){
                    await this.wait(0, 1)
                }

                this.terminateAllWaiting()

                await ObjectMotionControl.moveTo(
                    this,
                    v1.set(0,-30),
                    50
                )    
                await this.wait(2)

                let laserCnt = 0
                for( let i=0; true; i++ ){
                    for( let v of [
                        new Vector2(0,this.pos.y),
                        new Vector2(stage.left+40,this.pos.y),
                        new Vector2(0,this.pos.y),
                        new Vector2(stage.right-40,this.pos.y),
                    ]){
                        if( i%2==1 ){
                            switch( (laserCnt+i)%4 ){
                            case 1:
                                this.throwGrenade(0.15)
                                break
                            case 3:
                                this.simpleShoot(0.4)
                                break
                            }
                            laserCnt++
                        }
                        await ObjectMotionControl.moveTo(
                            this,
                            v,
                            200
                        )
                        this.shotLaser()
                        await this.wait(1)
                    }

                    if( i>2 ){
                        if( i%2==0 ){
                            await ObjectMotionControl.moveTo(
                                this,
                                v1.set(10,-30),
                                100
                            )
                            await this.wait(2)
                            await this.movingLaser(v1.set(
                                stage.left+40, this.pos.y
                            ))
                        }else{
                            await ObjectMotionControl.moveTo(
                                this,
                                v1.set(-10,-30),
                                100
                            )
                            await this.wait(2)
                            await this.movingLaser(v1.set(
                                stage.right-40, this.pos.y
                            ))
                        }
                        await this.wait(1)
                    }
                }
            }catch(e){
                // do nothing
            }
        }

        private async simpleShoot( duration: number = 0.2 ){
            const shotCtx = FlightShootPatternControl.shoot(
                this,
                new IntervalNode(
                    new ConstantNode(0.05*getBulletIntervalScale()),
                    new RingNode(
                        new ConstantNode(3),
                        new ConstantNode(12*getBulletSegmentScale()),
                        new EnemyBulletNode(
                            new ConstantNode(new Vector2(0,-20)),
                            undefined,
                            new ConstantNode(50)
                        )
                    )
                )
            )
            await this.wait(duration)
            shotCtx.stop()
        }

        private async throwGrenade( duration: number = 0.2 ){
            const shotCtxes = [
                FlightShootPatternControl.shoot(
                    this,
                    new IntervalNode(
                        new ConstantNode(0.06*getBulletIntervalScale()),
                        new RingNode(
                            new ConstantNode(10),
                            new ConstantNode(6*getBulletSegmentScale()),
                            new GrendaeNode(
                                new ConstantNode(new Vector2(-28,-21)),
                                undefined,
                                new ConstantNode(50),
                                {
                                    getValue: time=>{
                                        return time/0.06*60*Math.PI/180
                                    }
                                }
                            )
                        )
                    )
                ),
                FlightShootPatternControl.shoot(
                    this,
                    new IntervalNode(
                        new ConstantNode(0.06*getBulletIntervalScale()),
                        new RingNode(
                            new ConstantNode(10),
                            new ConstantNode(6*getBulletSegmentScale()),
                            new GrendaeNode(
                                new ConstantNode(new Vector2(33,8)),
                                undefined,
                                new ConstantNode(50),
                                {
                                    getValue: time=>{
                                        return time/0.06*60*Math.PI/180
                                    }
                                }
                            )
                        )
                    )
                ),
            ]
            await this.wait(duration)
            for( let ctx of shotCtxes ) ctx.stop()
        }

        private shotLaser(){
            if( this.manager ){
                const l = new Laser(
                    this.scorer.stage,
                    this
                )
                this.manager.add(l)
                Audio.play(Audio.sounds.eyeLaser)
            }
        }

        private async movingLaser(
            to: Vector2
        ){
            this.shotLaser()
            await this.wait(0.25)
            await ObjectMotionControl.moveTo(
                this,
                to,
                100
            )
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


    const laserEmptyCollisionShape = new ColliderCompoundShape()
    const laserCollisionShape = new ColliderCompoundShape()
    laserCollisionShape.shapes.push({
        shape: new ColliderBox(v1.set(7,167)),
        pos: new Vector2(12,28)
    })
    laserCollisionShape.shapes.push({
        shape: new ColliderBox(v1.set(7,167)),
        pos: new Vector2(-12,28)
    })

    class Laser extends EnemyBullet {
        private animation: AnimatedSpriteObject

        constructor(
            stage: Stage,
            shooter: EnemyFlight
        ){
            super(
                stage,
                v1.set(0,0),
                shooter,
                0
            )

            this.collisionShape = laserEmptyCollisionShape
            this.shouldCollidePlayerBullet = ()=>false

            this.animation = new AnimatedSpriteObject([
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
            ;(this.animation as any).pos = this.pos
            this.animation.removeFromManager = ()=>{
                this.removeFromManager()
            }

            this.pos.add(
                this.shooter.pos,
                v1.set(2,56)
            )
        }

        protected onHitPlayer(): void {}

        update(deltaTime: number): void {
            super.update( deltaTime )
            this.animation.update( deltaTime )
            this.pos.add(
                this.shooter.pos,
                v1.set(2,56)
            )
            if( this.animation.frame>=5 && this.animation.frame<17 ){
                this.collisionShape = laserCollisionShape
            }else{
                this.collisionShape = laserEmptyCollisionShape
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render( deltaTime, ctx )
            this.animation.render( deltaTime, ctx )
        }
    }

    export class KaijinWave extends BossEnemyWave {
        constructor(
            readonly onWaveEnd: ()=>void,
            nextMember: ()=>FlightUnit | null
        ){
            super(nextMember)
        }

        init(scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight): void {

            const waiter = new GameObject()
            gameObjectManager.add(waiter)
            
            const boss = new Kaijin( scoreAndCredit )
            boss.pos.set( 0, scoreAndCredit.stage.top-40 )
            this.enemies.push( boss )
            gameObjectManager.add( boss )

            const bossHp = new BossProgressMeter(
                "KAIJIN",
                ()=>{
                    return 1-boss.hp/getDefaultMaxHp()
                }
            )
            gameObjectManager.add(bossHp)

            const powerupCtx = this.dropPowerUp( scoreAndCredit, gameObjectManager )
            boss.playAttackSequence(
                scoreAndCredit.stage
            ).then(async ()=>{
                powerupCtx.stop()

                await waiter.wait(5)
                waiter.removeFromManager()

                bossHp.removeFromManager()
                this.onWaveEnd()
            })
        }
    }

}