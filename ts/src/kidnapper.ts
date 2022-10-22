namespace zlsSpaceInvader {

    const v1 = new Vector2

    class KidnapperFlyOff extends EnemyFlyOff<Kidnapper> {

        private kidnapBeamState:
            "canShot" |
            "shootingBeam" |
            "beamEnd"
            = "canShot"
        private beamTime = 0

        constructor( enemy: Kidnapper, regroupPos: Vector2 ){
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

                try {
                    await this.enemy.wait(1)

                    let time = 0
                    let captured = false
                    while( time<2 ){
                        time -= await this.enemy.wait(0)
                        if(Math.abs(playerFlight.pos.x-this.enemy.pos.x)<9
                        ){
                            await this.capture(playerFlight, wave)
                            captured = true
                            break
                        }
                    }

                    if( !captured ){
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
            this.state = "stop"
            this.beamTime = 0

            if( this.enemy.manager ){
                const rotFlight = new RotatingPlayerFlight( player, this.enemy )

                this.enemy.manager.add( rotFlight )
                this.enemy.kidnapped = rotFlight

                try{

                    await this.enemy.wait(1)
                    wave.state = "shorten"

                    await this.enemy.wait(0.5)
                    
                    this.enemy.kidnapped.state = "stop"
            
                    await this.enemy.wait(3)

                }catch(e){
                }finally{
                    this.kidnapBeamState = "beamEnd"
                    this.state = "regroup"
                }

                // TODO: hide player flight and invincible, player flight next, capturing enemy invincible
            }
        }
    }

    class RotatingPlayerFlight extends SpriteObject {

        private rotate = 0
        state: "rotating" | "stop" | "followBack" | "stickBack" = "rotating"

        constructor(
            player: PlayerFlight,
            readonly enemy: Kidnapper
        ){
            super( player.sprite )
            this.pos.copy(player.pos)
        }

        update( deltaTime: number ){
            super.update( deltaTime )

            switch(this.state){
            case "rotating":
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

    }

    export class Kidnapper extends EnemyFlight {

        kidnapped?: RotatingPlayerFlight

        startFlyOff(regroupPos: Vector2): void {
            if( !this.flyOff ){
                if( !this.kidnapped )
                    this.flyOff = new KidnapperFlyOff(this, regroupPos )
                else
                    this.flyOff = new EnemyFlyOff(this, regroupPos )
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