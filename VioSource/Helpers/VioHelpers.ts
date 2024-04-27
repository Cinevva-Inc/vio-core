import { Box3, BufferAttribute, BufferGeometry, Euler, Matrix3, Matrix4, Mesh, MeshBasicMaterial, Object3D, Quaternion, Scene, SkinnedMesh, Vector3, Vector4 } from "three";
// import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast, StaticGeometryGenerator } from 'three-mesh-bvh';

export class VioHelpers
{
    public static Bounds = 
    {
    }

    public static Math =
    {
        degToRad:(degrees:number)=>
        {
            return degrees * (Math.PI/180);
        },
        
        radToDeg:(radians:number)=>
        {
            return radians * (180/Math.PI);
        },

        calcAngle(x1:number, y1:number, x2:number, y2:number)
        { 
            let deltaX = x1-x2; 
            let deltaY = y1-y2; // reverse
            let radians = Math.atan2(deltaY, deltaX)
            let degrees = (radians * 180) / Math.PI - 90; // rotate
            // if (force360) {
            // while (degrees >= 360) degrees -= 360;
            // while (degrees < 0) degrees += 360;
            // }
            // console.log('angle to degree:',{deltaX,deltaY,radians,degrees})
            return degrees;
        },
        
        increment(start:number,end:number,amount:number)
        {
            if(start != end)
            {
                let less = start < end;
                start += (start < end ? amount : -amount);
                start  = (start > end &&  less ? end : start);
                start  = (start < end && !less ? end : start);
            }
            
            return start;
        },
        
        lerp(start:number, end:number, amount:number)
        {
            return (1-amount) * start + amount * end;
        }
    }

    public static Ajax =
    {
        getData(url:string,type:'GET' | 'POST',onComplete:(data:any,error:string | null)=>void,params:any)
        {
            fetch(url, {
                method: type,
                headers: type == 'POST' ? {'Content-Type': 'application/json'} : undefined,
                body: type == 'POST' ? JSON.stringify(params ?? {}) : undefined
            })
                .then(res => res.json())
                .then(data => onComplete(data, null))
                .catch(ex => onComplete(null, ex.message))
        },
        
        getDataPromise(url:string,type:'GET' | 'POST',params:any = null):Promise<{data:any,error:string | null}>
        {
            return new Promise(resolve=>
            {
                this.getData(url,type,(obj,error)=>
                {
                    resolve({data:obj,error:error});
                },params);
            });
        },
        
        async getDataAsync(url:string,type:'GET' | 'POST' = 'GET',params:any = null):Promise<{data:any,error:string | null}>
        {
            return await this.getDataPromise(url,type,params);
        }
    }

    public static Mesh =
    {
        getSizeAndPosition(obj:Object3D, buffer:Vector3|null = null, bakeSkinnedMesh:boolean = true, countRotation:boolean = true)
        {
            obj.updateMatrixWorld(true);

            let bounds = new Box3();

            obj.traverse(child=>
            {
                child.updateMatrixWorld(true);
                if(child.type == 'Mesh')
                {
                    let box  = new Box3();
                    let geom = (child as any).geometry as BufferGeometry;

                    if(geom)
                    {
                        geom.computeBoundingBox();
                        box.copy(geom.boundingBox!);

                        if(!countRotation)
                        {
                            let matrix = new Matrix4();
                            let pos    = buffer ? buffer : new Vector3();
                            let quat   = new Quaternion();
                            let scl    = new Vector3();
    
                            child.matrixWorld.decompose(pos,quat,scl);
                            quat.set(0,0,0,1);
                            matrix.compose(pos,quat,scl);
                            box.applyMatrix4(matrix );
                        }
                        else
                        {
                            box.applyMatrix4( child.matrixWorld );
                        }

                        bounds.union(box);
                    }
                }
                if(child.type == 'Handler')
                {
                    let box  = new Box3();
                    let geom = (child as any).geometry as BufferGeometry;

                    if(geom.boundingBox === null)
                    {
                        geom.computeBoundingBox();
                    }
                    box.copy(geom.boundingBox!);
                    
                    let matrix:Matrix4 = new Matrix4();
                    matrix.setPosition(child.getWorldPosition(new Vector3));
                    box.applyMatrix4( matrix);

                    bounds.union(box);
                }
                if(child.type == 'Sprite')
                {
                    let box  = new Box3();
                    box.applyMatrix4(obj.matrixWorld);
                }
            });
            
            const xSize = bounds.max.x - bounds.min.x;
            const ySize = bounds.max.y - bounds.min.y;
            const zSize = bounds.max.z - bounds.min.z;

            let worldPos = obj.getWorldPosition(buffer ? buffer : new Vector3());
            let center   = bounds.getCenter(new Vector3()).sub(worldPos);

            return {position:center, size:new Vector3(xSize, ySize, zSize), bounds:bounds};
        },
        
        updatePivot(object:Object3D,pivot:Vector3, position:Vector3|null = null, quaternion:Quaternion|null = null, scale:Vector3|null = null)
        {
            object.matrix.compose( position ? position : object.position, quaternion ? quaternion : object.quaternion, scale ? scale :object.scale );
        
            if ( pivot != null )
            {
              var px = pivot.x, py = pivot.y,  pz = pivot.z;
              var te = object.matrix.elements;
        
              te[ 12 ] += px - te[ 0 ] * px - te[ 4 ] * py - te[ 8  ] * pz;
              te[ 13 ] += py - te[ 1 ] * px - te[ 5 ] * py - te[ 9  ] * pz;
              te[ 14 ] += pz - te[ 2 ] * px - te[ 6 ] * py - te[ 10 ] * pz;

              object.matrix.elements = te;
            }
            // object.matrixWorldNeedsUpdate = true;
            object.updateMatrixWorld(true);
        },

        rotateAroundPoint(targetObject:Object3D, point:Vector3, rot:number)//rotation:Euler)
        {
            point.x = 4.5;
            point.y = 0;
            point.z = 2;

            targetObject.matrixAutoUpdate = false;
            targetObject.rotation.y += rot;
            this.updatePivot(targetObject,point);
            targetObject.matrixAutoUpdate = true;
        }
    }

    public static object =
    {
        bubbleToType(obj:Object3D,type:string,firstByType:boolean = false, lastType:Object3D|null = null):any
        {
            if(obj.type == type)
            {
                lastType = obj;
            }
            if(firstByType && lastType)
            {
                return lastType;
            }
            return (obj.parent) ? this.bubbleToType(obj.parent,type,firstByType,lastType) : lastType;
        },
        equals(a:any,b:any)
        {
            if(a == b)
            {
                return true;
            }

            if(((a == null || a == undefined) && (b != null || b != undefined)) || (b == null || b == undefined) && (a != null || a != undefined))
            {
                return false;
            }

            let aKeys = Object.keys(a);
            let bKeys = Object.keys(b);

            if(aKeys.length == bKeys.length)
            {
                for(let num = 0; num < aKeys.length; num++)
                {
                    if(!bKeys.includes(aKeys[num]) || a[aKeys[num]] != b[aKeys[num]])
                    {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
    }

    public static yield =
    {
        async waitForSeconds(seconds:number)
        {
            return new Promise(resolve=>
            {
                setTimeout(resolve,seconds * 1000);
            });
        },

        async skipFrame()
        {
            return new Promise(resolve=>
            {
                setTimeout(resolve,0);
            });
        },

        
    }
}