namespace zlsSpaceInvader {
    export class Main{

        private allowUpdate = true
        private gameObjectManager = new GameObjectManager
        private ctx: CanvasRenderingContext2D | null = null

        private stage: Stage = {
            left: 0,
            right: 0,
            top: 0,
            bottom : 0
        }
        private enemies: EnemyFlight[] = []
        private enemyCooperator: EnemyCooperator = new EnemyCooperator(this.stage,[],()=>{})
        private wave = 1

        constructor(){}

        async init(
            canvas: HTMLCanvasElement,
        ){
            this.ctx = canvas.getContext("2d")
            if( this.ctx ){
                this.ctx.imageSmoothingEnabled = false
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
                        return franchouchou.remainingMember
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
            for( let e of this.enemies ) e.paused = true
            this.enemyCooperator.paused = true
            const startScreen = new StartScreen(()=>{
                playerFlight.paused = false
                for( let e of this.enemies ) e.paused = false
                this.enemyCooperator.paused = false
            })
            this.gameObjectManager.add( startScreen )
        }

        private resetEnemies(
            playerFlight: PlayerFlight,
            scoreAndCredit: ScoreAndCredit
        ){
            //clear old enemies
            for( let e of this.enemies ) e.removeFromManager()
            this.enemies.length = 0
            this.enemyCooperator.removeFromManager()

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
                        scoreAndCredit,
                        (e, p)=>{
                            p.next = true
                        }
                    )
                    e.pos.x = (-enemyColumn/2+i+0.5)*enemySpacing
                    e.pos.y = j*enemySpacing+enemyYOffset
                    this.gameObjectManager.add( e )
                    this.enemies.push(e)
                }

            }

            const p = new Producer(
                scoreAndCredit,
                (e, p)=>{
                    const jai = new FloatingText("ジャイ")
                    jai.pos.copy(p.pos)
                    this.gameObjectManager.add(jai)
                    scoreAndCredit.score += 10000
                    e.removeFromManager()
                    Audio.play(Audio.sounds.bonus,1)
                }
            )
            p.pos.y = enemyYOffset-enemySpacing
            this.gameObjectManager.add( p )
            this.enemies.push(p)

            const waveEnd = ()=>{
                this.resetEnemies( playerFlight, scoreAndCredit)
                playerFlight.paused = true
                for( let e of this.enemies ) e.paused = true
                this.enemyCooperator.paused = true
    
                const waveScreen = new WaveScreen(
                    ++this.wave,
                    ()=>{
                        playerFlight.paused = false
                        for( let e of this.enemies ) e.paused = false
                        this.enemyCooperator.paused = false
                    }
                )    
                this.gameObjectManager.add(waveScreen)
            }

            this.enemyCooperator = new EnemyCooperator(
                this.stage,
                this.enemies,
                waveEnd
            )
            this.gameObjectManager.add( this.enemyCooperator )
        }

        private showContinue(
            scoreAndCredit: ScoreAndCredit,
            playerFlight: PlayerFlight,
            franchouchou: Franchouchou
        ){
            if( scoreAndCredit.credit>0 ){

                playerFlight.paused = true
                for( let e of this.enemies ) e.paused = true
                this.enemyCooperator.paused = true

                const continueScreen =  new ContinueScreen(b=>{
                    if( b ){
                        scoreAndCredit.credit--

                        playerFlight.paused = false
                        for( let e of this.enemies ) e.paused = false
                        this.enemyCooperator.paused = false

                        playerFlight.reset()
                        franchouchou.reset()
                    }else{
                        this.showHighestScore( scoreAndCredit )
                    }
                })
                this.gameObjectManager.add( continueScreen)

            }else{
                playerFlight.paused = true
                for( let e of this.enemies ) e.paused = true
                this.enemyCooperator.paused = true
                
                this.showHighestScore( scoreAndCredit )
            }
        }

        private showHighestScore( scoreAndCredit: ScoreAndCredit ){
            const hiScoreScr = new HiScoreScreen( scoreAndCredit.hiScore )
            this.gameObjectManager.add( hiScoreScr )
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
                if( this.ctx ){
                    const w = this.ctx.canvas.width
                    const h = this.ctx.canvas.height

                    this.ctx.fillStyle = Palette.bgColor
                    this.ctx.fillRect(0,0,w,h)

                    this.ctx.save()
                    this.ctx.translate(w/2, h/2)
                    this.ctx.scale(2,2)

                    this.gameObjectManager.render( deltaTime, this.ctx )

                    this.ctx.restore()
                }
                this.allowUpdate = true
            })
        }
    }
}