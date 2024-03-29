const fs = require('fs')
const https = require('https')
const mime = require('mime-types')
const LocalStorage = require("node-localstorage").LocalStorage
const _localStorage: Storage = new LocalStorage('./scratch')

const rootDirectory = "./html/"
const portNumber = 86
const appRootPath = "/zlsspaceinvader"

function readJSON( request: any ){
    return new Promise( (resolve, reject)=>{
        let data = ""
        request.on( "data", (chunk: any)=>{
            data += chunk.toString()
        })
        request.on("end",()=>{
            resolve( JSON.parse(data))
        })
        request.on("error",(e: Error)=>{
            reject(e)
        })
    })
}

https.createServer(
    {
        key: fs.readFileSync("key.pem"),
        cert: fs.readFileSync("cert.crt")
    },
    function (request: any, response: any) {
        let url: string = request.url
        if( url.startsWith(appRootPath) || 
            url == "/favicon.ico"
        ){
            if( url.startsWith(appRootPath) )
                url = url.substring(appRootPath.length)

            switch(url){
            case "":
            case "/":
                response.end(`
                <head>
                    <meta http-equiv="Refresh" content="0; URL=${appRootPath}/index.html">
                </head>
                `)
                break
            case "/leaderboard":
                Leaderboard.shared.handle( request, response )
                break
            default:
                // The filename is simple the local directory and tacks on the requested url
                const filename = rootDirectory+decodeURI(url)

                // This line opens the file as a readable stream
                const readStream = fs.createReadStream(filename)

                // This will wait until we know the readable stream is actually valid before piping
                readStream.on('open', function () {
                    response.setHeader("Content-Type", mime.lookup(url))
                    // This just pipes the read stream to the response object (which goes to the client)
                    readStream.pipe(response)
                })

                // This catches any errors that happen while creating the readable stream (usually invalid names)
                readStream.on('error', function(err: Error) {
                    response.end( err.stack )
                })
                break
            }
        }else{
            response.end("Unknown app.")
        }
    }
).listen(portNumber)   

interface LeaderboardRecord {
    name: string
    score: number
    wave: number
    uuid: string
    time: number
}

class Leaderboard{
    static readonly maxRecord = 500
    static recordsKey = {
        easy: "Leaderboard.records.easy",
        normal: "Leaderboard.records"
    }

    static shared = new Leaderboard()

    private records:{
        normal: LeaderboardRecord[]
        easy: LeaderboardRecord[]
     } = {
        easy: JSON.parse( _localStorage.getItem(Leaderboard.recordsKey.easy) || "[]" ),
        normal: JSON.parse( _localStorage.getItem(Leaderboard.recordsKey.normal) || "[]" )
     }

    handle( request: any, response: any ){
        switch(request.method.toUpperCase()){
        case "GET":
            response.writeHead(200)
            response.end(JSON.stringify(this.records))
            break
        case "POST":
            this.handlePostRecord(request,response)
            break
        }
    }

    private handlePostRecord( request: any, response: any ){
        readJSON(request).then(async (json: any)=>{

            const body = await API.getBody(json)

            const difficulty = body.difficulty || "normal"
            const name = body.name
            const score = body.score
            const wave = body.wave
            const uuid = body.uuid
            if( (difficulty=="easy" || difficulty=="normal") &&
                typeof(name) == "string" &&
                typeof(score) == "number" &&
                typeof(uuid) == "string" &&
                name.match(/[A-Z]{3}/i) &&
                name.length==3
            ){
                this.postRecord({
                    name: name,
                    score: score,
                    wave: wave,
                    uuid: uuid,
                    time: Date.now()
                }, difficulty)
                response.writeHead(200)
                response.end(JSON.stringify({state:"OK"}))
            }else{
                response.writeHead(400)
                response.end(JSON.stringify({state:"FAIL"}))
            }
        })
    }

    private postRecord( record: LeaderboardRecord, difficulty: "easy" | "normal" ){
        const records = this.records[difficulty]
        if( records.findIndex( r=>r.uuid==record.uuid )<0 ){ // resubmission check

            records.push( record )
            records.sort((a,b)=>b.score-a.score)
            if( records.length>Leaderboard.maxRecord )
                records.length = Leaderboard.maxRecord

            _localStorage.setItem(Leaderboard.recordsKey[difficulty], JSON.stringify(this.records[difficulty]))
        }
    }
}