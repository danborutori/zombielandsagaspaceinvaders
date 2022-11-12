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

            // this.enemyWave = new EnemyWave(
            //     this.stage,
            //     this.wave,
            //     ()=>{
            //         this.resetEnemies( playerFlight, scoreAndCredit)
            //         playerFlight.paused = true
            //         playerFlight.invincibleTime = 9000 // a large enough number
            //         this.enemyWave && (this.enemyWave.pause = true)
        
            //         const waveScreen = new WaveScreen(
            //             ++this.wave+1,
            //             ()=>{
            //                 playerFlight.paused = false
            //                 playerFlight.invincibleTime = 0
            //                 this.enemyWave && (this.enemyWave.pause = false)
            //             }
            //         )    
            //         this.gameObjectManager.add(waveScreen)
            //     }
            // )
            this.enemyWave = new Zombie3Wave( onWaveEnd )
            this.enemyWave.init(scoreAndCredit,gameObjectManager,playerFlight)
        }

    }

}