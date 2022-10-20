namespace zlsSpaceInvader {

    export class Zombie1 extends Kidnapper {

        constructor(
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight)=>void
        ){
            super(
                Sprites.shared.images["zombie1"],
                scorer,
                100,
                onHitPlayer
            )
        }

    }

    export class Zombie2 extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight)=>void
        ){
            super(
                Sprites.shared.images["zombie2"],
                scorer,
                100,
                onHitPlayer
            )
        }

    }

    export class Hand extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight)=>void
        ){
            super(
                Sprites.shared.images["hand"],
                scorer,
                100,
                onHitPlayer
            )
        }

    }

    export class Dog extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight)=>void
        ){
            super(
                Sprites.shared.images["dog"],
                scorer,
                100,
                onHitPlayer
            )
        }

    }

    export class Producer extends EnemyFlight {

        constructor(
            scorer: ScoreAndCredit,
            onHitPlayer: (e:EnemyFlight, p:PlayerFlight)=>void
        ){
            super(
                Sprites.shared.images["p"],
                scorer,
                1000,
                onHitPlayer
            )
        }

    }

}