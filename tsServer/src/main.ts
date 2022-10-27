const fs = require('fs')
const http = require('http')
const mime = require('mime-types')

const rootDirectory = "../../html/"
const portNumber = 3333
const appRootPath = "/zlsspaceinvader"

http.createServer(function (request: any, response: any) {
    let url: string = request.url
    if( url.startsWith(appRootPath)){
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
        // case "/api/asset/list":
        //     AssetManager.shared.list().then( json=>{
        //         response.end(JSON.stringify(json))
        //     })
        //     break
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
}).listen(portNumber)   