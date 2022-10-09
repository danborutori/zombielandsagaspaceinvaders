namespace zlsSpaceInvader {
    export class Main{

        private allowUpdate = true
        private gameObjectManager = new GameObjectManager
        private ctx: CanvasRenderingContext2D | null = null

        private enemies: EnemyFlight[] = []
        private stage: Stage = {
            left: 0,
            right: 0,
            up: 0,
            bottom : 0
        }

        constructor(){}

        async init( canvas: HTMLCanvasElement ){
            this.ctx = canvas.getContext("2d")
            if( this.ctx ){
                this.ctx.imageSmoothingEnabled = false
            }

            await Sprites.shared.load()
            this.initGame()

            return this
        }

        private initGame(){
            const scoreAndCredit = new ScoreAndCredit({
                get remainingMember(){
                    return franchouchou.remainingMember
                }
            })

            if( this.ctx ){
                this.stage.left = -this.ctx.canvas.width/2
                this.stage.right = this.ctx.canvas.width/2
                this.stage.up = -this.ctx.canvas.height/2
                this.stage.bottom = this.ctx.canvas.height/2
            }

            this.gameObjectManager.add( new StarNight(this.stage) )

            const enemyBackOff = ()=>{
                for( let e of this.enemies ){
                    e.pos.y += this.stage.up
                }
            }
            const runOutOfMember = ()=>{
                this.showContinue(
                    scoreAndCredit,
                    playerFlight,
                    franchouchou,
                    enemyCooperator
                )
            }

            const playerFlight = new PlayerFlight(
                this.stage,
                ()=>{
                    return franchouchou.nextSprite
                },
                enemyBackOff,
                runOutOfMember
            )
            playerFlight.pos.y = this.stage.bottom-35
            this.gameObjectManager.add(playerFlight)

            const enemyColumn = 9
            const enemySpacing = 14
            const enemyRows = [
                Zombie1,
                Zombie2,
                Hand,
                Dog
            ]
            const enemyYOffset = -55
            
            for( let i=0; i<enemyColumn; i++ ){

                for( let j=0; j<enemyRows.length; j++ ){
                    const e = new enemyRows[j](
                        scoreAndCredit,
                        (e, p)=>{
                            p.next = true
                            e.manager && e.manager.remove(e)
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
                    p.next = true
                    e.manager && e.manager.remove(e)
                }
            )
            p.pos.y = enemyYOffset-enemySpacing
            this.gameObjectManager.add( p )
            this.enemies.push(p)

            const enemyCooperator = new EnemyCooperator(this.stage, this.enemies)
            this.gameObjectManager.add( enemyCooperator )

            const franchouchou = new Franchouchou( this.stage, this.gameObjectManager)

            this.gameObjectManager.add( scoreAndCredit )
        }

        private enemyBackOff(){
            for( let e of this.enemies ){
                e.pos.y += this.stage.up
            }
        }

        private showContinue(
            scoreAndCredit: ScoreAndCredit,
            playerFlight: PlayerFlight,
            franchouchou: Franchouchou,
            enemyCooperator: EnemyCooperator
        ){
            if( scoreAndCredit.credit>0 ){

                playerFlight.paused = true
                for( let e of this.enemies ) e.paused = true
                enemyCooperator.paused = true

                const continueScreen =  new ContinueScreen(b=>{
                    if( b ){
                        scoreAndCredit.credit--

                        playerFlight.paused = false
                        for( let e of this.enemies ) e.paused = false
                        enemyCooperator.paused = false

                        playerFlight.reset()
                        franchouchou.reset()
                        this.enemyBackOff()
                    }else{
                        this.showHighestScore( scoreAndCredit )
                    }
                })
                this.gameObjectManager.add( continueScreen)

            }else{
                this.showHighestScore( scoreAndCredit )
            }
        }

        private showHighestScore( scoreAndCredit: ScoreAndCredit ){
            scoreAndCredit.hiScore = Math.max( scoreAndCredit.hiScore, scoreAndCredit.score )
            const hiScoreScr = new HiScoreScreen( scoreAndCredit.hiScore )
            this.gameObjectManager.add( hiScoreScr )
        }

        run(){
            let prevTime = performance.now()
            setInterval(()=>{
                const curTime = performance.now()
                const deltaTime = Math.min(Constant.maxTimeStep,(curTime-prevTime)/1000)

                if( this.allowUpdate )
                    this.update( deltaTime )

                prevTime = curTime
            }, 10)
        }

        private update( deltaTime: number ){

            this.gameObjectManager.update(deltaTime)
            Input.shared.pressAnyKey = false

            this.render( deltaTime )
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

                    this.gameObjectManager.render( deltaTime, this.ctx )

                    this.ctx.restore()
                }
                this.allowUpdate = true
            })
        }
    }
}