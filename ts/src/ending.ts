namespace zlsSpaceInvader {

    const creditTexts = [
        "INSPIRED BY",
        "ZOMBIELAND SAGE THE BEST REVENGE",
        "",
        "",
        "",
        "-GAME DESIGNER-",
        "ANMC",
        "",
        "-PROGRAMMER-",
        "ANMC",
        "",
        "-PIXEL GRAPHICS DESIGNER-",
        "ANMC",
        "",
        "ACKNOWLEDGEMENT",
        "",
        "-SOUND EFFECT-",
        "CLASSIC GAMING.CC",
        "SOUND FX CENTER",
        "SHAUN105",
        "",
        "-SPRITES-",
        "THE SPRITES RESOURCE",
        "",
        "",
        "",
        "AND YOU",
        "",
        "",
        "",
        "PRESENTED BY DANBORUTORI"
    ]

    class EndingScreen extends GameObject {
        constructor(
            readonly showHighestScore: ()=>void
        ){
            super()
        }

        private async showCredits(
            stage: Stage
        ) {
            if(!this.manager)return
            const starNight = this.manager.gameObjects.find( ((o: StarNight)=>o.isStarNight) as (o:GameObject)=>boolean ) as StarNight

            starNight.state = "starSky"

            const startY = stage.bottom+11
            const endY = stage.top-11
            const speed = 10
            const duration = (startY-endY)/speed
            for( let i=0; i<creditTexts.length; i++ ){
                const s = creditTexts[i]

                const text = new FloatingText(s, undefined, duration )
                text.pos.set(0, startY)
                this.manager.add(text)
                ObjectMotionControl.moveTo(
                    text,
                    new Vector2(0,endY),
                    speed
                )

                await this.wait(1)
            }

            await this.wait(duration+2)
        }

        async start( scoreAndCredit: ScoreAndCredit ){
            if( !this.manager ) return

            await this.wait(3)

            this.manager.add( new FloatingText("THE CURSE OF SAGA...", undefined, 3) )
            await this.wait(3)
            this.manager.add( new FloatingText("IS DEFEATED.", undefined, 5) )
            await this.wait(5)

            this.manager.add( new FloatingText("YOU SAVED SAGA...", undefined, 3) )
            await this.wait(3)
            this.manager.add( new FloatingText("JUST A LITTLE BIT.", undefined, 5) )
            await this.wait(5)

            this.manager.add( new FloatingText("THANK YOU FOR PLAYING.", undefined, 5) )
            await this.wait(5)

            scoreAndCredit.nextCredit = Number.MAX_SAFE_INTEGER
            while( scoreAndCredit.credit>0 ){
                scoreAndCredit.score += 5000
                scoreAndCredit.credit--

                const text = new FloatingText("5000")
                text.pos.set( scoreAndCredit.stage.right-12, scoreAndCredit.stage.bottom-20 )
                this.manager.add(text)

                ObjectMotionControl.moveTo(
                    text,
                    new Vector2(0,-5).add(text.pos),
                    50
                )

                Audio.play(Audio.sounds.credit)
                await this.wait(0.5)
            }

            await this.wait(2)

            await this.showCredits(scoreAndCredit.stage)

            this.showHighestScore()
        }
    }

    export class EndingWave implements IEnemyWave {
        pause = false

        constructor(
            readonly showHighestScore: ()=>void
        ){}

        async showTitle(manager: GameObjectManager, wave: number): Promise<void> {}

        init(scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight): void {
            const endingScreen = new EndingScreen(this.showHighestScore)
            gameObjectManager.add( endingScreen )
            endingScreen.start( scoreAndCredit )
        }

        clear() {}

    }

}