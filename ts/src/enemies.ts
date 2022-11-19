namespace zlsSpaceInvader {

    export class Zombie1 extends Kidnapper {

        constructor(
            hp: number,
            scorer: ScoreAndCredit
        ){
            super(
                Sprites.shared.images["zombie1"],
                scorer,
                50,
                hp
            )
        }

    }

    export class Zombie2 extends EnemyFlight {

        constructor(
            hp: number,
            scorer: ScoreAndCredit
        ){
            super(
                Sprites.shared.images["zombie2"],
                scorer,
                50,
                hp
            )
            this.bulletIntervalScale = 0.5
            this.bulletShootAngle = 15*Math.PI/180
        }

    }

    export class Hand extends EnemyFlight {

        constructor(
            hp: number,
            scorer: ScoreAndCredit
        ){
            super(
                Sprites.shared.images["hand"],
                scorer,
                50,
                hp
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
            scorer: ScoreAndCredit
        ){
            super(
                Sprites.shared.images["dog"],
                scorer,
                50,
                hp
            )
            this.homingTime = 2.5
        }

    }

}