namespace zlsSpaceInvader {

    export class ColoredSprite {

        static readonly shared = new ColoredSprite()

        private cache = new WeakMap< HTMLImageElement, {[color: string]: HTMLCanvasElement}>()

        get( color: string, image: HTMLImageElement ){

            const images = this.cache.get( image ) || {}
            this.cache.set( image, {} )

            let coloredSprite = images[color]

            if( !coloredSprite ){
                coloredSprite = document.createElement("canvas")
                coloredSprite.width = image.width
                coloredSprite.height = image.height
                const ctx = coloredSprite.getContext("2d")!
                ctx.fillStyle = color
                ctx.fillRect(0,0,coloredSprite.width,coloredSprite.height)
                ctx.globalCompositeOperation ="destination-in"
                ctx.drawImage( image, 0, 0 )

                images[color] = coloredSprite
            }

            return coloredSprite
        }

    }

}