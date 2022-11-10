namespace zlsSpaceInvader {

    const v1 = new Vector2
    const zero2 = new Vector2(0,0)
    const unitY = new Vector2(0,1)
    const t1 = new Transform

    const identity = new Transform()    

    export interface ShotCtx{
        stop(): void
    }

    interface OutputNode {
        update( time: number, shooter: EnemyFlight, transform: Transform ): void
    }

    interface Input<T> {
        getValue(time: number, shooter: EnemyFlight): T
    }

    export class ConstantNode<T> implements Input<T>{
        constructor( readonly value: T){}

        getValue(time: number, shooter: EnemyFlight): T {
            return this.value
        }
    }

    export class IntervalNode implements OutputNode {
        private cooldown = 0

        constructor(
            readonly interval: Input<number>,
            readonly next: OutputNode
        ){}

        update(time: number, shooter: EnemyFlight, transform: Transform ): void {
            while( time-this.cooldown>=this.interval.getValue(time, shooter) ){
                this.next.update( time, shooter, transform )
                this.cooldown += this.interval.getValue(time, shooter)
            }
        }
    }

    export class EnemyBulletNode implements OutputNode {
        constructor(
            readonly offset: Input<Vector2> = {getValue: ()=>zero2},
            readonly directon: Input<Vector2> = {getValue: ()=>unitY}
        ){}

        update( deltaTime: number, shooter: EnemyFlight, transform: Transform ){
            if( shooter.manager ){
                const b = new EnemyBullet(
                    shooter.scorer.stage,
                    v1.copy(this.directon.getValue( deltaTime, shooter)).rotateAround(transform.rotation),
                    shooter
                )
                b.pos.add( shooter.pos, this.offset.getValue( deltaTime, shooter)).add(transform.translation)
                shooter.manager.add(b)
            }
        }
    }
    
    export class RingNode implements OutputNode {
        private t = new Transform

        constructor(
            readonly radius: Input<number>,
            readonly segment: Input<number>,
            readonly next: OutputNode
        ){}

        update(time: number, shooter: EnemyFlight, transform: Transform): void {            
            for( let i=0, end=this.segment.getValue(time, shooter); i<end; i++ ){
                this.t.rotation = Math.PI*2*i/end
                this.t.translation.set(0,this.radius.getValue(time,shooter)).rotateAround(this.t.rotation)
                this.t.multiply( transform )
                this.next.update( time, shooter, this.t )
            }
        }
    }

    export class FlightShootPatternControl {

        static shoot(
            enemyFlight: EnemyFlight,
            root: OutputNode
        ): ShotCtx {

            let stop = false

            const coroutine = async ()=>{
                try{
                    let time = 0
                    while( !stop ){                    
                        time += await enemyFlight.wait(0)

                        root && root.update( time, enemyFlight, identity )
                    }
                }catch(e){}
                finally{}
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