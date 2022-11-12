namespace zlsSpaceInvader {

    function generateUUID() { // Public Domain/MIT
        var d = new Date().getTime();//Timestamp
        var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16;//random number between 0 and 16
            if(d > 0){//Use timestamp until depleted
                r = (d + r)%16 | 0;
                d = Math.floor(d/16);
            } else {//Use microseconds since page-load if supported
                r = (d2 + r)%16 | 0;
                d2 = Math.floor(d2/16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }

    export class Main{

        private allowUpdate = true
        private gameObjectManager = new GameObjectManager
        private ctx: CanvasRenderingContext2D | null = null
        private halfRenderContext: CanvasRenderingContext2D | null = null

        private stage: Stage = {
            left: 0,
            right: 0,
            top: 0,
            bottom : 0
        }
        
        private waveManager = new WaveManager()
        private wave = 0

        constructor(){}

        async init(
            canvas: HTMLCanvasElement,
        ){
            this.ctx = canvas.getContext("2d")
            if( this.ctx ){
                this.ctx.imageSmoothingEnabled = false
            }

            const lowresCanvas = document.createElement( "canvas" )
            lowresCanvas.width = canvas.width/2
            lowresCanvas.height = canvas.height/2
            this.halfRenderContext = lowresCanvas.getContext("2d")
            if( this.halfRenderContext ){
                this.halfRenderContext.imageSmoothingEnabled = false
            }

            await Promise.all([
                Sprites.shared.load(),
                Audio.preload()
            ])
            this.initGame()

            return this
        }

        private initGame(){
            const scoreAndCredit = new ScoreAndCredit(
                this.stage,
                {
                    get remainingMember(){
                        return franchouchou.remainingMember+playerFlight.flightUnits.length
                    }
                }
            )

            if( this.ctx ){
                this.stage.left = -this.ctx.canvas.width/4
                this.stage.right = this.ctx.canvas.width/4
                this.stage.top = -this.ctx.canvas.height/4
                this.stage.bottom = this.ctx.canvas.height/4
            }

            this.gameObjectManager.add( new StarNight(this.stage) )

            const runOutOfMember = ()=>{
                this.showContinue(
                    scoreAndCredit,
                    playerFlight,
                    franchouchou
                )
            }

            const playerFlight = new PlayerFlight(
                this.stage,
                ()=>{
                    return franchouchou.nextMember
                },
                runOutOfMember
            )
            playerFlight.pos.y = this.stage.bottom-35
            this.gameObjectManager.add(playerFlight)

            this.resetEnemies( playerFlight, scoreAndCredit )

            const franchouchou = new Franchouchou( this.stage, this.gameObjectManager)
            this.gameObjectManager.add( franchouchou )

            this.gameObjectManager.add( scoreAndCredit )

            playerFlight.paused = true
            this.waveManager.pause = true
            const startScreen = new StartScreen(scoreAndCredit,()=>{
                playerFlight.paused = false
                this.waveManager.pause = false
            })
            this.gameObjectManager.add( startScreen )
            this.gameObjectManager.add( startScreen.leaderboard )
        }

        private resetEnemies(
            playerFlight: PlayerFlight,
            scoreAndCredit: ScoreAndCredit
        ){
            this.waveManager.init(
                this.wave,
                scoreAndCredit,
                this.gameObjectManager,
                playerFlight,
                ()=>{
                    this.wave += 1
                    this.resetEnemies( playerFlight, scoreAndCredit )
                    playerFlight.paused = true
                    playerFlight.invincibleTime = 9000 // a large enough number
                    this.waveManager.pause = true
        
                    const waveScreen = new WaveScreen(
                        this.wave+1,
                        ()=>{
                            playerFlight.paused = false
                            playerFlight.invincibleTime = 0
                            this.waveManager.pause = false
                        }
                    )    
                    this.gameObjectManager.add(waveScreen)
                }
            )
        }

        private showContinue(
            scoreAndCredit: ScoreAndCredit,
            playerFlight: PlayerFlight,
            franchouchou: Franchouchou
        ){
            if( knockdownMembers.length>0 ){
                if( scoreAndCredit.credit>0 ){

                    playerFlight.paused = true
                    this.waveManager.pause = true

                    const continueScreen =  new ContinueScreen(b=>{
                        if( b ){
                            scoreAndCredit.credit--

                            playerFlight.paused = false
                            this.waveManager.pause = false

                            playerFlight.reset(knockdownMembers[0])
                            franchouchou.reset(knockdownMembers.slice(1))
                            knockdownMembers.length = 0
                            playerFlight.invincibleTime = 1
                        }else{
                            this.showHighestScore(scoreAndCredit)
                        }
                    })
                    this.gameObjectManager.add( continueScreen)

                }else{
                    playerFlight.paused = true
                    this.waveManager.pause = true
                    
                    this.showHighestScore(scoreAndCredit)
                }
            }else{
                playerFlight.paused = true
                this.waveManager.pause = true

                const t = new FloatingText(
                    "ALL MEMBERS CAPTURED",
                    ()=>{
                        this.showHighestScore(scoreAndCredit)
                    }
                )
                this.gameObjectManager.add(t)
            }
        }

        private async showHighestScore(scorer: ScoreAndCredit){
            try{
                const records = await Leaderboard.shared.getRecords()
                const canPostScore = records.length<8 || scorer.score>=records[7].score

                if( canPostScore ){
                    while( true ){
                        const int = window.prompt("POST YOU SCORE ON LEADERBOARD. PLEASE ENTER YOU INITIAL( 3 CAPITAL LETTERS):")

                        if( int==undefined ){
                            const b = window.confirm("DON'T POST YOU SCORE?")
                            if( b )
                                break
                        }else if( int.length!=3 || !int.match(/[A-Z]{3}/) ){
                            window.alert("INITIAL MUST BE 3 CAPITAL LETTERS (A-Z)")
                        }else{

                            await Leaderboard.shared.post(int,scorer.score,this.wave+1,generateUUID())

                            break
                        }
                    }
                }
            }catch(e){
                console.error(e)
            }

            const leaderboard = new LeaderboardScreen(scorer, ()=>{
                location.reload()
            })
            this.gameObjectManager.add( leaderboard )
        }

        onMute( button: HTMLInputElement ){
            if(Audio.volume!=0 ){
                Audio.volume = 0
                button.value = "SOUND ON"
            }else{
                Audio.volume = Constant.volume
                button.value = "SOUND OFF"
            }
        }

        run(){
            let prevTime = performance.now()
            setInterval(()=>{
                if( this.allowUpdate ){
                    const curTime = performance.now()
                    const deltaTime = Math.min(Constant.maxTimeStep,(curTime-prevTime)/1000)
    
                    this.update( deltaTime )
                    prevTime = curTime
                }
            }, 10)
        }

        private update( deltaTime: number ){
            this.render( deltaTime )

            this.gameObjectManager.update(deltaTime)
            Input.shared.update()
        }

        private render( deltaTime: number ){
            this.allowUpdate = false
            requestAnimationFrame(()=>{
                if(  this.halfRenderContext){
                    const w = this.halfRenderContext.canvas.width
                    const h = this.halfRenderContext.canvas.height

                    this.halfRenderContext.fillStyle = Palette.bgColor
                    this.halfRenderContext.fillRect(0,0,w,h)

                    this.halfRenderContext.save()
                    this.halfRenderContext.translate(w/2, h/2)

                    this.gameObjectManager.renderHalf(
                        deltaTime,
                        this.halfRenderContext
                    )

                    this.halfRenderContext.restore()

                    if( this.ctx ){
                        this.ctx.drawImage(this.halfRenderContext.canvas,
                        0, 0, w, h,
                        0, 0, this.ctx.canvas.width, this.ctx.canvas.height )

                        this.ctx.save()
                        this.ctx.translate(this.ctx.canvas.width/2, this.ctx.canvas.height/2)
                        this.ctx.scale(2,2)

                        this.gameObjectManager.render(
                            deltaTime,
                            this.ctx
                        )

                        this.ctx.restore()
                    }

                }
                this.allowUpdate = true
            })
        }
    }
}