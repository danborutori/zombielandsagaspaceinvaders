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

        async showTitle(
            manager: GameObjectManager,
            wave: number
        ){
            await (this.enemyWave && this.enemyWave.showTitle(manager,wave))
        }

        init(
            wave: number,
            scoreAndCredit: ScoreAndCredit,
            gameObjectManager: GameObjectManager,
            playerFlight: PlayerFlight,            
            nextMember: ()=>FlightUnit | null,
            onWaveEnd: ()=>void,
            showHighestScore: ()=>void
        ){
            //clear old enemies
            this.enemyWave && this.enemyWave.clear()

            switch( wave ){
            // case 0:
            //     this.enemyWave = new EmptyWave( onWaveEnd )
            //     break
            case 9:
                this.enemyWave = new Zombie3Wave( onWaveEnd, nextMember )
                break
            case 19:
                this.enemyWave = new KaijinWave( onWaveEnd, nextMember )
                break
            case 29:
                this.enemyWave = new UFOWave( scoreAndCredit.stage, onWaveEnd, nextMember )
                break
            case 30:
                this.enemyWave = new EndingWave(showHighestScore)
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