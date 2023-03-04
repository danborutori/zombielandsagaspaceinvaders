namespace zlsSpaceInvader {

    export type Difficulty = "normal" | "easy"

    export interface DifficultyProfile{
        extraFlyOffRate: number
        bulletCount: number
        bulletInterval: number
        hp: number
    }

    export class DifficultyManager {

        static readonly shared = new DifficultyManager()

        difficulty: Difficulty = "normal"

        getProfile( wave: number ): DifficultyProfile {
            const _this = this
            return {
                get extraFlyOffRate(){
                    switch(_this.difficulty){
                    case "normal":
                        return Math.floor(wave/10)*0.01
                    case "easy":
                        return Math.floor(wave/10)*0.0025
                    }
                },
                get bulletCount(){
                    switch(_this.difficulty){
                    case "normal":
                        return Math.floor((wave+4)/5)
                    case "easy":
                        return Math.floor((wave+4)/10)
                    }
                },
                get bulletInterval(){
                    switch(_this.difficulty){
                    case "normal":
                        return 1/Math.floor((wave+5)/6)
                    case "easy":
                        return 1/Math.floor((wave+5)/12)
                    }
                },
                hp: this.difficulty=="normal"?
                    1+Math.floor(Math.min(30,wave)/6):
                    1+Math.floor(Math.min(30,wave)/12)
            }
        }

    }

}