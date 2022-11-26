namespace zlsSpaceInvader {
    const v1 = new Vector2
    const v2 = new Vector2
    const v3 = new Vector2
    const v4 = new Vector2
    const v5 = new Vector2
    const v6 = new Vector2
    const v7 = new Vector2
    const v8 = new Vector2
    const v9 = new Vector2

    const epsilon = 0.01

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

    export class ColliderLineSegment extends ColliderShape {
        readonly isColliderLineSegment = true
        from = new Vector2
        to = new Vector2
    }

    export class ColliderCompoundShape extends ColliderShape {
        readonly isCompoundShape = true

        readonly shapes: {
            shape: ColliderShape
            pos: Vector2
        }[] = []
    }

    function isPointInsideBox(
        point: Vector2,
        box: ColliderBox,
        boxPos: Vector2
    ){
        v8.sub( point, boxPos ).abs()
        return v8.x<=box.size.x+epsilon && v8.y<=box.size.y+epsilon
    }

    function isPointOnLineInsideSegment(
        line: ColliderLineSegment,
        linePos: Vector2,
        point: Vector2
    ){
        v8.sub(point, linePos).sub(line.from)
        v9.sub(line.to, line.from).normalize()

        const d = v8.dot(v9)

        return d>=0 && d<=line.to.distance(line.from)
    }

    function isIntersectLineSegmentBox(
        line: ColliderLineSegment,
        linePos: Vector2,
        box: ColliderBox,
        boxPos: Vector2
    ){
        if(
            isPointInsideBox( v1.add(line.to, linePos), box, boxPos ) ||
            isPointInsideBox( v1.add(line.from, linePos), box, boxPos )
        ){
            return true
        }

        const lineDir = v1.sub( line.to, line.from ).normalize()
        const boxMax = v2.sub(boxPos, linePos).sub(line.from).addScaled(box.size,0.5)
        const boxMin = v3.sub(boxPos, linePos).sub(line.from).addScaled(box.size,-0.5)


        
        const intersectAxisPoints = [
            v4.copy(lineDir).multiply(
                boxMin.x/lineDir.x
            ).add(linePos).add(line.from),
            v5.copy(lineDir).multiply(
                boxMax.x/lineDir.x
            ).add(linePos).add(line.from),
            v6.copy(lineDir).multiply(
                boxMin.y/lineDir.y
            ).add(linePos).add(line.from),
            v7.copy(lineDir).multiply(
                boxMax.y/lineDir.y
            ).add(linePos).add(line.from)
        ]

        for( let pt of intersectAxisPoints ){
            if( 
                isPointInsideBox( pt, box, boxPos ) &&
                isPointOnLineInsideSegment( line, linePos, pt )
            ){
                return true
            }
        }

        return false
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

            // linesegment to box
            const lineB = shapeB as ColliderLineSegment
            if( boxA.isColliderBox && lineB.isColliderLineSegment ){
                return isIntersectLineSegmentBox(lineB, posB, boxA, posA)
            }

            const lineA = shapeA as ColliderLineSegment
            if( lineA.isColliderLineSegment && boxB.isColliderBox ){
                return isIntersectLineSegmentBox(lineA, posA, boxB, posB)
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