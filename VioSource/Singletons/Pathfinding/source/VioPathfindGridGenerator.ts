import { Box3, BoxGeometry, Mesh, MeshBasicMaterial, Object3D, Raycaster, SphereGeometry, Vector3 } from "three";
import { VioHelpers } from "../../../Helpers/VioHelpers";
import { VioObject       } from "../../../Objects/VioObject/VioObject";
import { VioRender       } from "../../Render/VioRender";
import { VioPathFindCell } from "./VioPathFindCell";

export class VioPathfindGridGenerator
{
    private _raycast  : Raycaster;
    private _boundBox : Mesh;

    constructor()
    {
        this._raycast  = new Raycaster();
        this._boundBox = new Mesh( new BoxGeometry( 1, 1, 1 ), new MeshBasicMaterial( {color: 0x00ff00, transparent:true,opacity:0.3} ));
        // VioRender.scene.add(this._boundBox);
    }
    
    public getGrid(obj:Object3D, resolution:number = .2, extend:number = .5, depth:number = 1, direction:string, include:Array<Object3D>, exclude:Array<Object3D>)
    {
        console.log("GENERATING");
        let cells :Array<Array<VioPathFindCell>>;
        let dir   :Vector3 = new Vector3();
        let buffer:Vector3 = new Vector3();
        let axis  :string  = '';
        
        switch(direction)
        {
            case 'top'   :{ axis = 'y'; dir.set(0, 1,0); cells = this._getGridCells(obj,resolution, new Vector3(0,-1,0), ['x','z'], axis,  100); break;}
            case 'bottom':{ axis = 'y'; dir.set(0,-1,0); cells = this._getGridCells(obj,resolution, new Vector3(0, 1,0), ['x','z'], axis, -100); break;}
        }
        
        const objects = include;

        objects.forEach((sceneObj:Object3D)=>
        {
            if(this._boundBox != sceneObj && obj != sceneObj && !exclude.includes(sceneObj))
            {
                this._updateBounds(sceneObj,extend);

                const defaultPos      = (this._boundBox.position as any)[axis];
                const boundSize       = ((this._boundBox.scale as any)[axis] / 2);
                const currentBoundPos = defaultPos - boundSize;

                cells!.forEach((row:Array<VioPathFindCell>)=>
                {
                    row.forEach((cell:VioPathFindCell)=>
                    {
                        let cellPos = (cell.position as any)[axis];

                        (this._boundBox.position as any)[axis] = (currentBoundPos<cellPos) ? (cellPos + boundSize) + 0.1 : defaultPos;

                        buffer.set(cell.position.x,cell.position.y,cell.position.z);

                        this._boundBox.updateMatrixWorld(true);
            
                        this._raycast.set(buffer,dir);
                        const intersects = this._raycast.intersectObject(this._boundBox);
                        
                        if(intersects.length>0 && intersects[0].distance < depth)
                        { 
                            cell.canMove = false;
                        }
                    });
                });
            }
        });

        cells!.forEach((row:Array<VioPathFindCell>)=>
        {
            row.forEach((cell:VioPathFindCell)=>
            {
                cell.updateNeighbors(cells);
            });
        });

        return cells!;
    }

    protected _updateBounds(obj:Object3D,extend:number)
    {
        let bounds = new Box3().setFromObject(obj);
        const xSize = (bounds.max.x - bounds.min.x) + extend;
        const ySize = (bounds.max.y - bounds.min.y) + extend;
        const zSize = (bounds.max.z - bounds.min.z) + extend;

        this._boundBox.scale.set(xSize, ySize, zSize);
        this._boundBox.position.set(obj.position.x,obj.position.y,obj.position.z);
        this._boundBox.updateMatrixWorld(true);
    }

    protected _getGridCells(obj:Object3D, resolution:number, direction:Vector3, axis:Array<string>, opAxis:string, offset:number)
    {
        const size  :any                           = VioHelpers.Mesh.getSizeAndPosition(obj).size;
        const cells :Array<Array<VioPathFindCell>> = [];
        const buffer:any                           = new Vector3();
        let   countX:number                        = 0;
        let   countY:number                        = 0;

        for(let numX = 0; numX < size[axis[0]]; numX+=resolution)
        {
            let rows:Array<VioPathFindCell> = [];

            countY = 0;
            for(let numY = 0; numY < size[axis[1]]; numY+=resolution)
            {
                buffer[axis[0]] = (obj.position as any)[axis[0]] + ( numX - (size[axis[0]]/2) + (resolution / 2));
                buffer[axis[1]] = (obj.position as any)[axis[1]] + ( numY - (size[axis[1]]/2) + (resolution / 2));
                buffer[opAxis ] = (obj.position as any)[opAxis ] + (size[opAxis]/2) + offset,

                this._raycast.set(buffer,direction);

                const intersects = this._raycast.intersectObject(obj);

                if(intersects.length>0)
                {
                    rows.push(new VioPathFindCell(intersects[0].point,{x:countX,y:countY}));
                }
                countY++;
            }
            if(rows.length>0)
            {
                cells.push(rows);
            }
            countX++;
        }
        return cells;
    }

    
    public drawDebugSphere(pos:Vector3,color:any)
    {
        const sphere = new Mesh( new SphereGeometry(.01, 32, 16), new MeshBasicMaterial({color: color, depthWrite:false }));
              sphere.position.x = pos.x;
              sphere.position.y = pos.y;
              sphere.position.z = pos.z;
              VioRender.scene.add(sphere);
    }
}