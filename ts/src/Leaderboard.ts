namespace zlsSpaceInvader {

    export interface LeaderboardRecord {
        name: string
        score: number
        wave: number
    }

    export class Leaderboard {
        static shared = new Leaderboard()

        async getRecords(): Promise<LeaderboardRecord[]> {
            return new APIRequest("leaderboard").get()
        }

        async post( name: string, score: number, wave: number ){
            await new APIRequest("leaderboard").post({
                name: name,
                score: score,
                wave: wave
            })
        }
    }
}