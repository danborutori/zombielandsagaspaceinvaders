namespace zlsSpaceInvader {

    export class Zombie1 extends Kidnapper {

        constructor(
            hp: number,
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight, i: number)=>void
        ){
            super(
                Sprites.shared.images["zombie1"],
                scorer,
                100,
                hp,
                onHitPlayer
            )
        }

    }

    export class Zombie2 extends EnemyFlight {

        constructor(
            hp: number,
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight, i: number)=>void
        ){
            super(
                Sprites.shared.images["zombie2"],
                scorer,
                100,
                hp,
                onHitPlayer
            )
        }

    }

    export class Hand extends EnemyFlight {

        constructor(
            hp: number,
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight, i: number)=>void
        ){
            super(
                Sprites.shared.images["hand"],
                scorer,
                100,
                hp,
                onHitPlayer
            )
            this.bulletCountDelta = -1
        }

        protected bulletFactoty(direction: Vector2): EnemyBullet {
            return new Grenade( this.scorer.stage, direction, this )
        }
    }

    export class Dog extends EnemyFlight {

        constructor(
            hp: number,
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight, i: number)=>void
        ){
            super(
                Sprites.shared.images["dog"],
                scorer,
                100,
                hp,
                onHitPlayer
            )
        }

    }

}