namespace zlsSpaceInvader {

    const v1 = new Vector2

    const defalutMaxHp = 1000
    const epsilon = 0.0001

    const collisionShape = new ColliderBox(new Vector2(250,250))
    const rotateSpeed = Math.PI/16

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
            this.rotateStep = 0.0001
        }

        protected resetRotation(deltaTime: number): void {}

        async turn( targetAngle: number, speed: number ){
            while( Math.abs(this.rotate-targetAngle)>epsilon ){
                const dt = await this.wait(0)
                const d = targetAngle-this.rotate
                this.rotate += Math.sign(d)*Math.min(Math.abs(d), speed*dt)
            }
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
                this.startAttack()
            ])
        }

        private async startAttack(){
            this.attackPhase1().catch(e=>{
                // do nothing
            })
            while( this.hp>defalutMaxHp*3/4 ){
                await this.wait(0)
            }
            this.terminateAllWaiting()
            
            this.attackPhase2().catch(e=>{
                // do nothing
            })
            while( this.hp>defalutMaxHp*2/4 ){
                await this.wait(0)
            }
            this.terminateAllWaiting()

            this.attackPhase3().catch(e=>{
                // do nothing
            })
            while( this.hp>defalutMaxHp/4 ){
                await this.wait(0)
            }
            this.terminateAllWaiting()

            this.attackPhase4().catch(e=>{
                // do nothing
            })
            while( this.hp>0 ){
                await this.wait(0)
            }
        }

        private async normalShot(
            shotPos: Vector2,
            sinPeroid: number = 0.5,
            bulletSpeed: number = 30,
            duration: number = 3,
            interval: number = 0.4
        ){
            const shotCtx = FlightShootPatternControl.shoot(
                this,
                new IntervalNode(
                    new ConstantNode(interval),
                    new RingNode(
                        new ConstantNode(5),
                        new ConstantNode(16),
                        new EnemyBulletNode(
                            new ConstantNode(shotPos),
                            new SineNode(
                                new ConstantNode(sinPeroid),
                                new ConstantNode(Math.PI/6)
                            ),
                            new ConstantNode(bulletSpeed)
                        )
                    )
                )
            ) 

            try{
                await this.wait(duration)
            }catch(e){
                throw e
            }finally{
                shotCtx.stop()
            }
        }
        
        private shootLaser(
            angle: number
        ){
            if( this.manager ){
                const laser = new UFOLaser(
                    this,
                    -this.rotate+angle
                )
                this.manager.add(laser)
                Audio.play(Audio.sounds.eyeLaser)
            }
        }

        private async rotatingShootLaser(
            clockwise: number
        ){
            await Promise.all([
                this.turn(
                    this.rotate+Math.PI/2*clockwise,
                    Math.PI/5
                ),
                (async ()=>{
                    for( let i=0; i<6; i++ ){
                        if( i%2==0 )
                            this.shootLaser(-10*Math.PI/180*clockwise)
                        else
                            this.shootLaser(-40*Math.PI/180*clockwise)
                        await this.wait(0.3)
                    }
                })()
            ])
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

        private async attackPhase2(){
            await this.turn(Math.PI/5,rotateSpeed)

            this.shootLaser(0)
            await this.wait(2)

            this.shootLaser(15*Math.PI/180)
            await this.wait(2)

            this.shootLaser(-15*Math.PI/180)
            await this.wait(2)

            while(true){
                for( let i=0; i<2; i++){
                    const sign = i%2==0?1:-1

                    for( let j=0; j<6; j++ ){
                        this.shootLaser(
                            mix(
                                -30*Math.PI/180,
                                30*Math.PI/180,
                                j/6
                            )*sign)
                        await this.wait(0.5)
                    }
                    await this.wait(2)
                }

                for( let i=0; i<8; i++ ){
                    const sign = i%2==0?1:-1
                    this.shootLaser(
                        mix(
                            30*Math.PI/180,
                            0/180,
                            i/8
                        )*sign)
                    await this.wait(0.5)
                }
                await this.wait(2)
            }
        }

        private async attackPhase3(){
            const v1 = new Vector2
            const v2 = new Vector2
            const v3 = new Vector2

            await this.turn(Math.PI*2/5,rotateSpeed)

            for( let j=0; ; j++ ){

                for( let i=0; i<2; i++){
                    await this.rotatingShootLaser((i+j)%2==0?1:-1)
                    await this.wait(1)
                }

                await Promise.all([
                    this.normalShot(
                        v1.set(0,150).rotateAround(0),
                        10,
                        50,
                        6,
                        0.3
                    ),
                    this.normalShot(
                        v2.set(0,150).rotateAround(15*Math.PI/180),
                        10,
                        50,
                        6,
                        0.3
                    ),
                    this.normalShot(
                        v3.set(0,150).rotateAround(-15*Math.PI/180),
                        10,
                        50,
                        6,
                        0.3
                    )
                ])
                
                await this.wait(1)
                
            }
        }

        private async attackPhase4(){
            const v1 = new Vector2

            await this.turn(Math.PI*3/5,rotateSpeed)

            
        }
    }

    const laserEmptyCollisionShape = new ColliderCompoundShape()
    const laserCollisionShape = new ColliderBox( new Vector2(6,223) )

    class UFOLaser extends EnemyBullet {

        private animation: AnimatedSpriteObject
        private cooldown = 0

        constructor(
            shooter: UFO,
            readonly angle: number
        ){
            super(shooter.scorer.stage,v1.set(0,1),shooter,0)
            this.collisionShape = laserEmptyCollisionShape

            this.anchorPos()

            this.animation = new AnimatedSpriteObject([
                Sprites.shared.images.blaser0,
                Sprites.shared.images.blaser1,
                Sprites.shared.images.blaser2,
                Sprites.shared.images.blaser3,
                Sprites.shared.images.blaser4,
                Sprites.shared.images.blaser5,
                Sprites.shared.images.blaser6,
                Sprites.shared.images.blaser5,
                Sprites.shared.images.blaser6,
                Sprites.shared.images.blaser5,
                Sprites.shared.images.blaser6,
                Sprites.shared.images.blaser5,
                Sprites.shared.images.blaser6,
                Sprites.shared.images.blaser5,
                Sprites.shared.images.blaser6,
                Sprites.shared.images.blaser5,
                Sprites.shared.images.blaser6,
                Sprites.shared.images.blaser7,
                Sprites.shared.images.blaser8,
            ], 0.05)
            ;(this.animation as any).pos = this.pos
            this.animation.removeFromManager = ()=>{
                this.removeFromManager()
            }
        }

        private anchorPos(){
            this.pos.set( 0, 180 ).rotateAround( this.angle+this.shooter.rotate ).add( this.shooter.pos)
        }

        protected offscreenCheck(): void {}

        protected onHitPlayer(): void {}

        update(deltaTime: number): void {
            super.update(deltaTime)
            this.animation.update( deltaTime )
            this.anchorPos()
            this.cooldown -= deltaTime

            if( this.animation.frame>=5 && this.animation.frame<17 && this.cooldown<=0 ){
                this.collisionShape = laserCollisionShape
            }else{
                this.collisionShape = laserEmptyCollisionShape
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            ctx.save()
            ctx.translate(-4,0)
            ctx.translate(
                Math.floor(this.pos.x),
                Math.floor(this.pos.y)
            )
            ctx.rotate(Math.PI)
            ctx.translate(
                Math.floor(-this.pos.x),
                Math.floor(-this.pos.y)
            )
            this.animation.render( deltaTime, ctx )
            ctx.restore()
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
                powerupCtx.stop()

                await waiter.wait(5)
                waiter.removeFromManager()

                this.onWaveEnd()
            })
        }
    }

}