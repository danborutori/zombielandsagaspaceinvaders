namespace zlsSpaceInvader {

    export interface DifficultyProfile{
        extraFlyOffRate: number
        bulletCount: number
        bulletInterval: number
        hp: number
    }

    export class DifficultyManager {

        static readonly shared = new DifficultyManager()

        getProfile( wave: number ): DifficultyProfile {
            return {
                extraFlyOffRate: Math.floor(wave/10)*0.01,
                bulletCount: Math.floor((wave+4)/5),
                bulletInterval: 1/Math.floor((wave+5)/6),
                hp: 3+Math.floor(wave/10)
            }
        }

    }

}