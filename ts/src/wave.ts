namespace zlsSpaceInvader {

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
            case 14:
                this.enemyWave = new Zombie3Wave( onWaveEnd )
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