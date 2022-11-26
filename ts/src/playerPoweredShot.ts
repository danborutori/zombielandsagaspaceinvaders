namespace zlsSpaceInvader {

    export class PlayerPoweredShot{

        private bulletCooldown = 0

        update( deltaTime: number, player: PlayerFlight ){
            this.bulletCooldown -= deltaTime

            if( Input.shared.fire &&
                this.bulletCooldown<=0 &&
                player.manager &&
                player.canShoot
            ){
                for( let u of player.flightUnits ){
                    const b = new PlayerBullet(player.stage, u.bulletColor)
                    b.pos.copy(player.pos)
                    b.pos.x += u.pos.x
                    b.pos.y -= 6
                    player.manager.add(b)
                }
                this.bulletCooldown = Constant.playerFireInterval
                Audio.play( Audio.sounds.shoot )
            }
        }

    }

}