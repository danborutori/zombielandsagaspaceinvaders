namespace zlsSpaceInvader {

    class EmptyWave extends BaseEnemyWave {
        readonly isBoss = false

        constructor( readonly onWaveEnd: ()=>void ){
            super()
        }

        init(scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight): void {
            playerFlight.wait(1).then(this.onWaveEnd)
        }

    }

    export class WaveManager {

        private enemyWave?: IEnemyWave

        set pause( b: boolean ){
            this.enemyWave && (this.enemyWave.pause = b)
        }

        get isBoss(){
            return this.enemyWave ? this.enemyWave.isBoss : false
        }

        init(
            wave: number,
            scoreAndCredit: ScoreAndCredit,
            gameObjectManager: GameObjectManager,
            playerFlight: PlayerFlight,
            onWaveEnd: ()=>void
        ){
            //clear old enemies
            this.enemyWave && this.enemyWave.clear()

            switch( wave ){
            // case 0:
            //     this.enemyWave = new EmptyWave( onWaveEnd )
            //     break
            case 14:
                this.enemyWave = new Zombie3Wave( onWaveEnd )
                break
            case 29:
                this.enemyWave = new KaijinWave( onWaveEnd )
                break
            default:
                this.enemyWave = new EnemyWave(
                    scoreAndCredit.stage,
                    wave,
                    onWaveEnd
                )
                break
            }
            this.enemyWave.init(scoreAndCredit,gameObjectManager,playerFlight)
        }

    }

}