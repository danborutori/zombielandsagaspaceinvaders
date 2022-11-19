namespace zlsSpaceInvader {

    const epislon = 0.1

    export class ObjectMotionControl {

        static async moveTo(
            flight: GameObject,
            dst: Vector2,
            speed: number
        ){
            const v = new Vector2            
            while( v.sub(dst, flight.pos).length()>epislon ){
                const deltaTime = await flight.wait(0, undefined, "move to")
                const l = v.length()
                v.normalize().multiply( Math.min(speed*deltaTime,l) )
                flight.pos.add(v)
            }
        }

        static async moveCircle(
            flight: EnemyFlight,
            origin: Vector2,
            radius: number,
            phase: number,
            clockwise: boolean,
            speed: number
        ){
            const v = new Vector2
            for( let i=0; i<64; i++ ){
                v.set(0,-radius).rotateAround(Math.PI*2*i/64*(clockwise?1:-1)+phase).add(origin)
                await this.moveTo(
                    flight,
                    v,
                    speed
                )
            }
        }

    }

}