namespace zlsSpaceInvader {

    class KidnapperFlyOff extends EnemyFlyOff {

        private wave = new CaptureWave()

        private kidnapBeamState:
            "canShhot" |
            "shootingBeam" |
            "capturingFlight" |
            "beamEnd"
            = "canShhot"
        private beamTime = 0

        update(deltaTime: number, playerFlight: PlayerFlight): void {
            super.update( deltaTime, playerFlight )

            this.beamTime += deltaTime

            switch( this.kidnapBeamState ){
            case "shootingBeam":
                if( this.beamTime>=1 &&
                    Math.abs(playerFlight.pos.x-this.enemy.pos.x)<9
                ){
                    this.capture(playerFlight)
                }else{
                    if( this.beamTime>=3 ){
                        this.kidnapBeamState = "beamEnd"
                        this.state = "goStraight"
                        this.beamTime = 0
                        this.wave.removeFromManager()
                    }
                }
                break
            case "capturingFlight":
                if( this.beamTime>1 ){
                    this.kidnapBeamState = "beamEnd"
                    this.state = "regroup"
                    this.wave.removeFromManager()
                }
            }

            switch( this.state ){
            case "goStraight":
            case "homing":
                switch( this.kidnapBeamState ){
                case "canShhot":
                    if( this.enemy.pos.y>playerFlight.pos.y-40)
                        this.shotBeam()
                    break
                }
                break
            }
        }

        onDie(): void {
            super.onDie()

            this.wave.removeFromManager()
        }

        private shotBeam(){
            this.state = "stop"
            this.kidnapBeamState = "shootingBeam"
            this.beamTime = 0
            if( this.enemy.manager ){
                this.wave.pos.copy( this.enemy.pos )
                this.wave.pos.y += 4.5
                this.enemy.manager.add(this.wave)
            }
        }

        private capture( player: PlayerFlight ){
            this.kidnapBeamState = "capturingFlight"
            this.state = "stop"
            this.beamTime = 0

            // TODO:
        }
    }

    export class Kidnapper extends EnemyFlight {

        startFlyOff(regroupPos: Vector2): void {
            if( !this.flyOff ){
                this.flyOff = new KidnapperFlyOff(this, regroupPos )
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

        constructor(){
            super()
        }

        update(deltaTime: number): void {
            super.update( deltaTime )

            this.time += deltaTime
        }

        render(deltaTime: number, ctx: CanvasRenderingContext2D): void {
            super.render(deltaTime, ctx)

            const frame = this.frames[Math.floor(this.time/0.1)%this.frames.length]

            let h = Math.floor(Math.min(1,this.time)/0.2)*0.2
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