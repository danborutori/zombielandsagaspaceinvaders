namespace zlsSpaceInvader {

    export interface IEnemyWave{
        pause: boolean
        init( scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight ): void
        clear(): void
    }

    export abstract class BaseEnemyWave implements IEnemyWave {
        protected enemies: EnemyFlight[] = []

        set pause(b: boolean){
            for( let e of this.enemies ) e.paused = b
        }

        abstract init( scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight ): void

        clear(){
            //clear old enemies
            for( let e of this.enemies ) e.removeFromManager()
        }
    }

    export class EnemyWave extends BaseEnemyWave {

        private enemyCooperator: EnemyCooperator

        set pause(b: boolean){
            super.pause = b
            this.enemyCooperator.paused = b
        }

        constructor(
            readonly stage: Stage,
            readonly wave: number,
            readonly onWaveEnd: ()=>void
        ){
            super()
            this.enemyCooperator = new EnemyCooperator(1,stage,[],()=>{})
        }

        init( scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight ){
            const enemyColumn = 9
            const enemySpacing = 14
            const enemyRows = [
                Zombie1,
                Zombie2,
                Hand,
                Dog
            ]
            const enemyYOffset = -46
            
            for( let i=0; i<enemyColumn; i++ ){

                for( let j=0; j<enemyRows.length; j++ ){
                    const e = new enemyRows[j](
                        this.enemyCooperator.difficultyProfile.hp,
                        scoreAndCredit,
                        (e, p, i)=>{
                            const ex = new MemberExplosion()
                            ex.pos.add( p.pos, p.flightUnits[i].pos )
                            gameObjectManager.add(ex)
                            p.remove( i )
                            Audio.play( Audio.sounds.explosion )
                        }
                    )
                    e.pos.x = (-enemyColumn/2+i+0.5)*enemySpacing
                    e.pos.y = j*enemySpacing+enemyYOffset
                    gameObjectManager.add( e )
                    this.enemies.push(e)
                }

            }

            this.enemyCooperator = new EnemyCooperator(
                this.wave,
                this.stage,
                this.enemies,
                this.onWaveEnd
            )
            gameObjectManager.add( this.enemyCooperator )

            if( missingMembers.length>0 && (this.wave%5)==3 )
                (this.enemies[enemyRows.length*4] as Zombie1).setCapture(
                    playerFlight,
                    missingMembers.splice(0,1)[0],
                    this.enemyCooperator
                )
        }

        clear(){
            super.clear()
            this.enemyCooperator.removeFromManager()
        }
    }

}