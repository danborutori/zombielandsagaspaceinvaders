namespace zlsSpaceInvader {

    const v1 = new Vector2

    class KidnapperFlyOff extends EnemyFlyOff<Kidnapper> {

        private kidnapBeamState:
            "canShot" |
            "shootingBeam" |
            "beamEnd"
            = "canShot"

        constructor(
            readonly cooperator: EnemyCooperator,
            enemy: Kidnapper,
            regroupPos: Vector2,
            shootInterval: number,
            bulletCount: number
        ){
            super(enemy, regroupPos, shootInterval, bulletCount)
        }

        update(deltaTime: number, playerFlight: PlayerFlight): void {
            super.update( deltaTime, playerFlight )

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
                const wave = new CaptureWave()
                wave.pos.copy( this.enemy.pos )
                wave.pos.y += 4.5
                this.enemy.manager.add(wave)

                Audio.play( Audio.sounds.captureBeam )

                try {
                    await this.enemy.wait(1)

                    let time = 0
                    let captured = false
                    while( time<2 && !captured ){
                        time += await this.enemy.wait(0)
                        let padding = 4.5+playerFlight.flightUnits.length*9/2
                        if(
                            Math.abs(playerFlight.pos.x-this.enemy.pos.x)<padding &&
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
                this.cooperator.invincible = true
    
                const rotFlight = new RotatingPlayerFlight(
                    player,
                    player.flightUnits,
                    this.enemy,
                    this.cooperator )

                this.enemy.manager.add( rotFlight )
                this.enemy.kidnapped = rotFlight

                Audio.stop( Audio.sounds.captureBeam )
                Audio.play( Audio.sounds.captureBeam2 )

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
                    Audio.play( Audio.sounds.capturedSuccess )

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
                    player.flightUnits.length = 0
                    player.next = true
                    this.cooperator.invincible = false
                }
            }
        }

    }

    class RotatingPlayerFlight extends GameObject {

        private rotate = 0
        state: "rotating" | "stop" | "followBack" | "stickBack" | "free" | "combine" = "rotating"

        private units: FlightUnit[]
        private spacing = 9

        constructor(
            readonly player: PlayerFlight,
            units: FlightUnit[],
            readonly enemy: Kidnapper,
            readonly cooperator: EnemyCooperator            
        ){
            super()
            this.units = Array.from( units )
            this.pos.copy(player.pos)
        }

        update( deltaTime: number ){
            super.update( deltaTime )

            switch( this.state ){
            case "stop":
            case "followBack":
            case "stickBack":
                this.spacing = Math.max(0,this.spacing-deltaTime*50)
                break
            case "free":
            case "combine":
                this.spacing = Math.min(9,this.spacing+deltaTime*50)
                break
            }
    
            switch(this.state){
            case "rotating":
            case "free":
                this.rotate += deltaTime * Math.PI * 8
                break
            case "stop":
            case "followBack":
            case "combine":
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
            case "combine":
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
            super.render(deltaTime,ctx)

            for( let i=this.spacing>0?0:this.units.length-1; i<this.units.length; i++ ){
                const u = this.units[i]

                ctx.save()
                ctx.translate(
                    Math.floor((-(this.units.length-1)/2+i)*this.spacing+this.pos.x),
                    Math.floor(this.pos.y) )
                ctx.rotate( this.rotate )
                ctx.drawImage(
                    u.sprite,
                    Math.floor(-u.sprite.width/2),
                    Math.floor(-u.sprite.height/2)
                )
                ctx.restore()
            }
        }

        async setFree(){

            if( this.state!="free"){
                this.state = "free"

                this.player.invincibleTime = 9000 // large enough number
                this.player.canShoot = false
                this.cooperator.allowFlyOff = false
                this.cooperator.invincible = true
                this.cooperator.allowEnd = false

                Audio.play( Audio.sounds.capturedSuccess )

                try{
                    await this.wait(3)


                    this.state = "combine"

                    this.player.paused = true

                    let posXSet = false
                    while( !posXSet ){
                        const dt = await this.wait(0)

                        const numFlight = this.player.flightUnits.length+this.units.length
                        const leftMost = -9*(numFlight-1)/2
                        const targetX = leftMost-this.player.flightUnits[0].pos.x
                        const dx = targetX-this.player.pos.x
                        this.player.pos.x += Math.sign( dx )*Math.min( 100*dt, Math.abs( dx) )
                        
                        const targetX2 = targetX+(this.player.flightUnits.length+this.units.length)*9/2
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

                    this.player.add( this.units )

                    await this.wait(2)

                }catch(e){
                }finally{
                    this.player.invincibleTime = 0
                    this.player.paused = false
                    this.player.canShoot = true
                    this.cooperator.allowFlyOff = true
                    this.cooperator.invincible = false
                    this.cooperator.allowEnd = true
                    this.removeFromManager()
                }
            }
        }
    }

    export class Kidnapper extends EnemyFlight {

        kidnapped?: RotatingPlayerFlight

        startFlyOff(
            cooperator: EnemyCooperator,
            regroupPos: Vector2,
            shootInterval: number,
            bulletCount: number
        ): void {
            if( !this.flyOff ){
                if( !this.kidnapped )
                    this.flyOff = new KidnapperFlyOff(
                        cooperator,
                        this,
                        regroupPos,
                        shootInterval,
                        bulletCount
                    )
                else
                    super.startFlyOff(
                        cooperator,
                        regroupPos,
                        shootInterval,
                        bulletCount
                    )
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

        setCapture(
            player: PlayerFlight,
            flightUnit: FlightUnit,
            cooperator: EnemyCooperator ){

            if( this.manager ){
                const rotFlight = new RotatingPlayerFlight(
                    player,
                    [flightUnit],  // FIXME: bullet color
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