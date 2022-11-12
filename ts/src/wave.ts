namespace zlsSpaceInvader {

    export class WaveManager {

        private enemyWave?: IEnemyWave

        set pause( b: boolean ){
            this.enemyWave && (this.enemyWave.pause = b)
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
            case 19:
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