namespace zlsSpaceInvader {

    interface LeaderboardRecord {
        name: string
        score: number
        time: number
    }

    export class Leaderboard {
        static shared = new Leaderboard()

        async getRecords(): Promise<LeaderboardRecord[]> {
            const request = await fetch("leaderboard")
            return request.json()
        }

        async post( name: string, score: number ){
            const request = await fetch("leaderboard", {
                method: "POST",
                body: JSON.stringify({
                    name: name,
                    score: score
                })
            })
            const json = await request.json()
            if( json.state!="OK"){
                throw new Error( json )
            }
        }
    }
}