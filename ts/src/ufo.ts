namespace zlsSpaceInvader {

    const defalutMaxHp = 1000

    const collisionShape = new ColliderBox(new Vector2(250,250))

    class UFO extends EnemyFlight{

        constructor(
            scorer: ScoreAndCredit,
        ){
            super(
                Sprites.shared.images.ufo,
                scorer,
                10000,
                defalutMaxHp
            )
            this.collisionShape = collisionShape
        }

        protected wrapAround(){
            // don't wrapAround
        }

        protected playExplosionAnimation(): void {
            if( this.manager ){
                const bs = new BloodStainOverAnyWhere()
                bs.pos.copy(this.pos)
                this.manager.add(bs)
                bs.drop(80)
            }
        }

        async playAttackSequence(){
            const v1 = new Vector2

            const stage = this.scorer.stage

            await ObjectMotionControl.moveTo(
                this,
                v1.set(0, stage.top-60),
                10
            )

            while(true){
                await this.wait(0)
            }
        }
    }

    export class UFOWave extends BossEnemyWave {
        constructor(
            readonly stage: Stage,
            readonly onWaveEnd: ()=>void
        ){
            super()
        }

        private async ufoFlyOver(
            manager: GameObjectManager
        ){
            const v1 = new Vector2

            const ufo = new SpriteObject( Sprites.shared.images.ufo )
            ufo.renderHalf = false
            ufo.renderOrder = 2
            ufo.pos.set(0,this.stage.bottom+200)
            manager.add( ufo )

            await ObjectMotionControl.moveTo(
                ufo,
                v1.set(0,this.stage.top-200),
                50
            )

            ufo.removeFromManager()
        }

        async showTitle(manager: GameObjectManager, wave: number) {
            await this.ufoFlyOver( manager )
            await super.showTitle( manager, wave )
        }

        init(scoreAndCredit: ScoreAndCredit, gameObjectManager: GameObjectManager, playerFlight: PlayerFlight): void {
            
            const waiter = new GameObject()
            gameObjectManager.add(waiter)

            const boss = new UFO( scoreAndCredit )
            boss.pos.set( 0, scoreAndCredit.stage.top-180 )
            this.enemies.push( boss )
            gameObjectManager.add( boss )

            boss.playAttackSequence().then(async ()=>{

                await waiter.wait(5)
                waiter.removeFromManager()

                this.onWaveEnd()
            })
        }
    }

}