namespace zlsSpaceInvader {

    const v1 = new Vector2

    export interface ShotCtx{
        stop(): void
    }

    export class FlightShootPatternControl {

        static shootRing(
            flight: EnemyFlight,
            offset: Vector2,
            radius: number,
            segment: number,
            interval: number
        ): ShotCtx {
            let stop = false

            const coroutine = async ()=>{
                let cooldown = 0
                while(!stop){
                    const deltaTime = await flight.wait(0)
                    cooldown -= deltaTime

                    if( cooldown<=0 ){
                        for( let i=0; i<segment; i++ ){
                            v1.set(1,0).rotateAround( Math.PI*2*i/segment )

                            const b = new EnemyBullet(
                                flight.scorer.stage,
                                v1,
                                flight
                            )
                            b.pos.add(flight.pos, offset).add(v1.multiply(radius))
                            flight.manager && flight.manager.add(b)
                        }

                        cooldown += interval
                    }
                }
            }
            coroutine()

            return {
                stop: ()=>{
                    stop = true
                }
            }
        }

    }

}