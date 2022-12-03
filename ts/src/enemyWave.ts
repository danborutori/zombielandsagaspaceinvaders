namespace zlsSpaceInvader {

    export interface IEnemyWave{
        pause: boolean
        readonly isBoss: boolean
        init( scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight ): void
        clear(): void
    }

    export abstract class BaseEnemyWave implements IEnemyWave {
        protected enemies: EnemyFlight[] = []
        abstract readonly isBoss: boolean

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
        readonly isBoss = false

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
            this.enemyCooperator = new EnemyCooperator(wave,stage,[],()=>{})
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
                        scoreAndCredit
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

    export abstract class BossEnemyWave extends BaseEnemyWave {

        constructor(
            readonly nextMember: ()=>FlightUnit | null
        ){
            super()
        }

        protected dropPowerUp(
            scoreAndCredit: ScoreAndCredit,
            gameObjectManager: GameObjectManager
        ){
            let end = false

            const coroutine = async () => {
                const waiter = new GameObject
                gameObjectManager.add( waiter )
    
                while(true){
                    await waiter.wait(20)
                    const powerup = new PowerUp(
                        scoreAndCredit,
                        this.nextMember
                    )
                    powerup.pos.set(
                        mix(scoreAndCredit.stage.left+4.5,scoreAndCredit.stage.right-4.5,Math.random()),
                        scoreAndCredit.stage.top-4.5
                    )
                    gameObjectManager.add(powerup)
                    if(end)break
                }
    
                waiter.removeFromManager()
            }
            coroutine()

            return {
                stop: ()=>end=true
            }
        }

    }    

}