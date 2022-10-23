namespace zlsSpaceInvader {

    const v1 = new Vector2

    class KidnapperFlyOff extends EnemyFlyOff<Kidnapper> {

        private kidnapBeamState:
            "canShot" |
            "shootingBeam" |
            "beamEnd"
            = "canShot"
        private beamTime = 0

        constructor(
            readonly cooperator: EnemyCooperator,
            enemy: Kidnapper,
            regroupPos: Vector2
        ){
            super(enemy, regroupPos)
        }

        update(deltaTime: number, playerFlight: PlayerFlight): void {
            super.update( deltaTime, playerFlight )

            this.beamTime += deltaTime

            switch( this.state ){
            case "goStraight":
            case "homing":
                switch( this.kidnapBeamState ){
                case "canShot":
                    if( this.enemy.pos.y>playerFlight.pos.y-40)
                        this.shotBeam(playerFlight)
                    break
                }
                break
            }
        }

        private async shotBeam( playerFlight: PlayerFlight ){
            if( this.enemy.manager ){

                this.state = "stop"
                this.kidnapBeamState = "shootingBeam"
                this.beamTime = 0
                const wave = new CaptureWave()
                wave.pos.copy( this.enemy.pos )
                wave.pos.y += 4.5
                this.enemy.manager.add(wave)

                Audio.play( Audio.sounds.captureBeam, 1 )

                try {
                    await this.enemy.wait(1)

                    let time = 0
                    let captured = false
                    while( time<2 && !captured ){
                        time += await this.enemy.wait(0)
                        if(
                            Math.abs(playerFlight.pos.x-this.enemy.pos.x)<9 &&
                            playerFlight.invincibleTime<=0
                        ){
                            captured = true
                        }
                    }

                    if( captured ){
                        await this.capture(playerFlight, wave)
                    }else{
                        wave.state = "shorten"
                        await this.enemy.wait(1.5)

                        this.kidnapBeamState = "beamEnd"
                        this.state = "goStraight"
                        this.beamTime = 0
                    }

                }catch(e){}
                finally{
                    wave.removeFromManager()
                }
            }
        }

        private async capture( player: PlayerFlight, wave: CaptureWave ){
            if( this.enemy.manager ){
                this.cooperator.allowFlyOff = false
                this.state = "stop"
                this.beamTime = 0
                this.enemy.invincible = true
    
                const rotFlight = new RotatingPlayerFlight(
                    player,
                    player.flightUnits[0],  // FIXME: flight unit index
                    this.enemy,
                    this.cooperator )

                this.enemy.manager.add( rotFlight )
                this.enemy.kidnapped = rotFlight

                Audio.stop(1)
                Audio.play( Audio.sounds.captureBeam2, 2 )

                player.invincibleTime = 9000 // large enough interval
                player.visible = false
                player.paused = true

                try{

                    await this.enemy.wait(1)
                    wave.state = "shorten"

                    await this.enemy.wait(0.5)
                    
                    this.enemy.kidnapped.state = "stop"
            
                    await this.enemy.wait(3)

                    this.kidnapBeamState = "beamEnd"
                    this.state = "regroup"
                    Audio.play( Audio.sounds.capturedSuccess, 2 )

                    const txt = new FloatingText("MEMBER CAPTURED")
                    this.enemy.manager.add(txt)

                    await this.enemy.wait(5)
    
                }catch(e){
                    throw e
                }finally{
                    this.cooperator.allowFlyOff = true

                    player.invincibleTime = 0
                    // player.visible = true
                    player.paused = false
                    player.next = true
                    this.enemy.invincible = false
                }
            }
        }

    }

    class RotatingPlayerFlight extends SpriteObject {

        private rotate = 0
        state: "rotating" | "stop" | "followBack" | "stickBack" | "free" = "rotating"

        constructor(
            readonly player: PlayerFlight,
            readonly flightUnit: FlightUnit,
            readonly enemy: Kidnapper,
            readonly cooperator: EnemyCooperator            
        ){
            super( flightUnit.sprite )
            this.pos.copy(player.pos)
        }

        update( deltaTime: number ){
            super.update( deltaTime )

            switch(this.state){
            case "rotating":
            case "free":
                this.rotate += deltaTime * Math.PI * 8
                break
            case "stop":
            case "followBack":
                this.rotate = 0
                break
            case "stickBack":
                this.rotate = this.enemy.rotate
                break
            }

            switch( this.state ){
            case "stickBack":
                this.pos.copy(this.enemy.pos)
                this.pos.y -= 14
                break
            case "free":
                break
            default:
                v1.copy( this.enemy.pos )
                switch( this.state ){
                case "followBack":
                    v1.y -= 14
                    break
                default:
                    v1.y += 10
                    break
                }
                v1.sub( this.pos )
                const l = v1.length() 
                if( l<1 && this.state=="followBack" ){
                    this.state = "stickBack"
                }
                v1.normalize()
                v1.multiply( Math.min(l, 50*deltaTime) )
                this.pos.add( v1 )
                break
            }
        }

        followBack(){
            this.state = "followBack"
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            ctx.save()
            const x = Math.floor(this.pos.x)
            const y = Math.floor(this.pos.y)
            ctx.translate(x, y)
            const rotateStep = Math.PI/8
            ctx.rotate(Math.round(this.rotate/rotateStep)*rotateStep)
            ctx.translate(-x, -y)
            super.render(deltaTime,ctx)
            ctx.restore()
        }

        async setFree(){

            this.state = "free"

            this.player.invincibleTime = 9000 // large enough number
            this.player.canShoot = false
            this.cooperator.allowFlyOff = false
            this.cooperator.invincible = true

            Audio.play( Audio.sounds.capturedSuccess, 2 )

            try{
                await this.wait(3)

                this.player.paused = true

                let posXSet = false
                while( !posXSet ){
                    const dt = await this.wait(0)

                    const numFlight = 1
                    const targetX = -9*numFlight/2
                    const dx = targetX-this.player.pos.x
                    this.player.pos.x += Math.sign( dx )*Math.min( 100*dt, Math.abs( dx) )
                    
                    const targetX2 = 9*numFlight/2
                    const dx2 = targetX2-this.pos.x
                    this.pos.x += Math.sign( dx2 )*Math.min( 100*dt, Math.abs( dx2) )

                    posXSet = dx==0 && dx2==0
                }

                let posYSet = false
                while( !posYSet ){
                    const dt = await this.wait(0)                    

                    const dy = this.player.pos.y-this.pos.y
                    this.pos.y += Math.sign( dy )*Math.min( 100*dt, Math.abs( dy) )

                    posYSet = dy == 0
                }

                this.visible = false

                // TODO: append player flight

                await this.wait(2)

            }catch(e){
            }finally{
                this.player.invincibleTime = 0
                this.player.paused = false
                this.player.canShoot = true
                this.cooperator.allowFlyOff = true
                this.cooperator.invincible = false
                this.removeFromManager()
            }
        }
    }

    export class Kidnapper extends EnemyFlight {

        kidnapped?: RotatingPlayerFlight

        startFlyOff( cooperator: EnemyCooperator, regroupPos: Vector2): void {
            if( !this.flyOff ){
                if( !this.kidnapped )
                    this.flyOff = new KidnapperFlyOff(cooperator, this, regroupPos )
                else
                    super.startFlyOff(cooperator, regroupPos )
            }
        }

        endFlyOff(): void {
            super.endFlyOff()

            if( this.kidnapped &&
                this.kidnapped.state == "stop"
            ){
                this.kidnapped.followBack()
            }
        }

        protected onDie(): void {

            if( this.kidnapped ){
                this.kidnapped.setFree()
            }

            super.onDie()
        }

        setCapture( player: PlayerFlight, sprite: HTMLImageElement, cooperator: EnemyCooperator ){

            if( this.manager ){
                const rotFlight = new RotatingPlayerFlight(
                    player,
                    new FlightUnit( sprite, Palette.BulletColor1 ),  // FIXME: bullet color
                    this,
                    cooperator
                )
                rotFlight.state = "stickBack"

                this.manager.add( rotFlight )
                this.kidnapped = rotFlight
            }

        }
        
    }

    class CaptureWave extends GameObject {

        private frames = [
            Sprites.shared.images.captureWave0,
            Sprites.shared.images.captureWave1,
            Sprites.shared.images.captureWave2,
        ]

        private time = 0
        private height = 0
        state: "elongate" | "shorten" = "elongate"

        constructor(){
            super()
            this.renderOrder = 1
        }

        update(deltaTime: number): void {
            super.update( deltaTime )

            this.time += deltaTime

            switch( this.state ){
            case "elongate":
                this.height = Math.min(1,this.height+deltaTime)
                break
            case "shorten":
                this.height = Math.max(0,this.height-deltaTime)
                break
            }
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime, ctx)

            const frame = this.frames[Math.floor(this.time/0.1)%this.frames.length]

            let h = Math.floor(this.height/0.2)*0.2
            h = Math.floor(frame.height*h)

            ctx.drawImage( 
                frame,
                0,0,
                frame.width, h,
                Math.floor(this.pos.x-frame.width/2),
                this.pos.y,
                frame.width, h
            )
        }
    }
}