namespace zlsSpaceInvader {
    const v1 = new Vector2
    const v2 = new Vector2

    export abstract class ColliderShape {
    }

    export class ColliderBox extends ColliderShape {
        readonly isColliderBox = true
        readonly size = new Vector2

        constructor(
            size: Vector2
        ){
            super()
            this.size.copy(size)
        }
    }

    export class ColliderCompoundShape extends ColliderShape {
        readonly isCompoundShape = true

        readonly shapes: {
            shape: ColliderShape
            pos: Vector2
        }[] = []
    }

    export class CollisionChecker {
        
        static intersect(
            shapeA: ColliderShape,
            posA: Vector2,
            shapeB: ColliderShape,
            posB: Vector2
        ){
            // box to box
            const boxA = shapeA as ColliderBox
            const boxB = shapeB as ColliderBox
            if( boxA.isColliderBox && boxB.isColliderBox ){
                v1.sub( posA, posB ).abs()
                v2.add(boxA.size, boxB.size)
                return v1.x<v2.x/2 && v1.y<v2.y/2
            }

            // compound
            const compoundA = shapeA as ColliderCompoundShape
            if( compoundA.isCompoundShape ){
                const v = new Vector2
                for( let s of compoundA.shapes ){
                    if( CollisionChecker.intersect(
                            s.shape,
                            v.add(posA, s.pos), 
                            shapeB,
                            posB
                        )
                    )
                        return true
                }
                return false
            }
            const compoundB = shapeB as ColliderCompoundShape
            if( compoundB.isCompoundShape ){
                const v = new Vector2
                for( let s of compoundB.shapes ){
                    if( CollisionChecker.intersect(
                            shapeA,
                            posA,
                            s.shape,
                            v.add(posB, s.pos)
                        )
                    )
                        return true
                }
                return false
            }
            return false
        }
    }

}