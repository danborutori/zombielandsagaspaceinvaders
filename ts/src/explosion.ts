namespace zlsSpaceInvader {

    export class Explosion extends SpriteObject {

        private lifeTime = 0

        constructor(){
            super( Sprites.shared.images["explod"])

            Audio.dom.src = "./sound/invaderkilled.wav"
        }

        update(deltaTime: number): void {
            super.update( deltaTime )

            this.lifeTime += deltaTime

            if( this.lifeTime>0.1 && this.manager ){
                this.removeFromManager()
            }
        }

    }
}