namespace zlsSpaceInvader {

    export interface LeaderboardRecord {
        name: string
        score: number
        wave: number
    }

    export class Leaderboard {
        static shared = new Leaderboard()

        async getRecords(): Promise<LeaderboardRecord[]> {
            const request = await fetch("leaderboard")
            return request.json()
        }

        async post( name: string, score: number, wave: number ){
            const request = await fetch("leaderboard", {
                method: "POST",
                body: JSON.stringify({
                    name: name,
                    score: score,
                    wave: wave
                })
            })
            const json = await request.json()
            if( json.state!="OK"){
                throw new Error( json )
            }
        }
    }
}