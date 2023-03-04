namespace zlsSpaceInvader {

    export interface LeaderboardRecord {
        name: string
        score: number
        wave: number
    }

    export class Leaderboard {
        static shared = new Leaderboard()

        async getRecords(): Promise<{
            easy: LeaderboardRecord[]
            normal: LeaderboardRecord[]
        }> {
            return new APIRequest("leaderboard").get()
        }

        async post( name: string, score: number, wave: number, uuid: string, difficulty: Difficulty ){
            await new APIRequest("leaderboard").post({
                difficulty: difficulty,
                name: name,
                score: score,
                wave: wave,
                uuid: uuid
            })
        }
    }
}