namespace zlsSpaceInvader {
    export class Main{

        private allowUpdate = true
        private gameObjectManager = new GameObjectManager
        private ctx: CanvasRenderingContext2D | null = null

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

            const stage = {
                left: this.ctx?-this.ctx.canvas.width/2:0,
                right: this.ctx?this.ctx.canvas.width/2:0,
                up: this.ctx?-this.ctx.canvas.height/2:0,
                bottom: this.ctx?this.ctx.canvas.height/2:0,
            }

            this.gameObjectManager.add( new StarNight(stage) )

            const playerFlight = new PlayerFlight(stage)
            playerFlight.pos.y = stage.bottom-35
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
            const enemies: EnemyFlight[] = []

            for( let i=0; i<enemyColumn; i++ ){

                for( let j=0; j<enemyRows.length; j++ ){
                    const e = new enemyRows[j](scoreAndCredit)
                    e.pos.x = (-enemyColumn/2+i+0.5)*enemySpacing
                    e.pos.y = j*enemySpacing+enemyYOffset
                    this.gameObjectManager.add( e )
                    enemies.push(e)
                }

            }

            const p = new Producer(scoreAndCredit)
            p.pos.y = enemyYOffset-enemySpacing
            this.gameObjectManager.add( p )
            enemies.push(p)

            this.gameObjectManager.add( new EnemyCooperator(stage, enemies))

            const franchouchou = new Franchouchou( stage, this.gameObjectManager)

            this.gameObjectManager.add( scoreAndCredit )
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