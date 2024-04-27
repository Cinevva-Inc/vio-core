import { Object3D, Vector3 } from "three";
import { VioObject } from "../../../Objects/VioObject/VioObject";
import { Cell } from "../VioPathFinding";
import { VioPathFindCell } from "./VioPathFindCell";
import { VioPathfindGridGenerator } from "./VioPathfindGridGenerator";

export class VioAStarPathfinding
{
    private _gridBuffer:VioPathFindCell[][]|null = null;

    constructor(protected grid:VioPathfindGridGenerator){}
    
    private _heuristic(position0:{x:number,y:number}, position1:{x:number,y:number})
    {
        let d1 = Math.abs(position1.x - position0.x);
        let d2 = Math.abs(position1.y - position0.y);
      
        return d1 + d2;
    }

    private _getNearest(vec:Vector3,grid:Array<Array<VioPathFindCell>>)
    {
        let current:VioPathFindCell;

        grid.forEach((row:Array<VioPathFindCell>)=>
        {
            row.forEach((cell:VioPathFindCell)=>
            {
                if(!current)
                {
                    current = cell;
                }

                if(vec.distanceTo(current.position)>vec.distanceTo(cell.position))
                {
                    current = cell;
                }
            });
        });
        //@ts-ignore
        return current;
    }

    public clearBuffer()
    {
      this._gridBuffer = null;
    }

    public calculatePath(area:Object3D, from:Vector3, to:Vector3, resolution:number = .2, extend:number = .5, depth:number = 1, direction:'top' | 'bottom' | 'front' | 'back' | 'left' | 'right' = 'top', include:Array<Object3D> = [], exclude:Array<Object3D> = []):Array<Vector3>
    {
        let grid = this._gridBuffer ? this._gridBuffer : this.grid.getGrid(area,resolution,extend,depth,direction,include,exclude);

        this._gridBuffer = grid;

        grid.forEach((row:Array<Cell>)=>
        {
            row.forEach((cell:Cell)=>
            {
              cell.startEndCost = cell.estimatedCost = cell.totalCost = 0;
              cell.parent       = null;
            });
        });

        // grid.forEach((row:Array<Cell>)=>
        // {
        //     row.forEach((cell:Cell)=>
        //     {
        //         this.grid.drawDebugSphere(cell.position,cell.canMove ? 0x00ff00 : 0xff0000);
        //     });
        // });

        let start      :VioPathFindCell        = this._getNearest(from,grid);
        let end        :VioPathFindCell        = this._getNearest(to  ,grid);
        let nearest    :VioPathFindCell|null   = null;
        let openSet    :Array<VioPathFindCell> = [start]; //array containing unevaluated grid points
        let closedSet  :Array<VioPathFindCell> = []; //array containing completely evaluated grid points
        let path       :Array<Vector3>         = [];
        let count      :number                 = 0;
        let nearestDist:number                 = Number.MAX_VALUE;

        while (openSet.length > 0) 
        {
            if(count>500)
            {
              break;
            }
            count++;

            let lowestIndex = 0;
            for (let i = 0; i < openSet.length; i++) 
            {
              if (openSet[i].totalCost < openSet[lowestIndex].totalCost)
              {
                lowestIndex = i;
              }
            }
            let current = openSet[lowestIndex];
        
            if (current === end)
            {
              let temp = current;
              path.push(temp.position);
              while (temp.parent)
              {
                path.push(temp.parent.position);
                temp = temp.parent;
              }
              return path.reverse();
            }
        
            openSet.splice(lowestIndex, 1);
            closedSet.push(current);
        
            let neighbors = current.neighbors;
        
            for (let i = 0; i < neighbors.length; i++)
            {
              let neighbor = neighbors[i];
        
              if (!closedSet.includes(neighbor)) 
              {
                let possibleG = current.startEndCost + 1;
        
                if (!openSet.includes(neighbor))
                {
                  openSet.push(neighbor);
                }
                else if (possibleG >= neighbor.startEndCost)
                {
                  continue;
                }
                neighbor.startEndCost  = possibleG;
                neighbor.estimatedCost = this._heuristic(neighbor.point, end.point);
                neighbor.totalCost     = neighbor.startEndCost + neighbor.estimatedCost;
                neighbor.parent        = current;

                if(nearest != current)
                {
                  const dist = current.position.distanceTo(end.position);

                  if(dist < nearestDist)
                  {
                    nearest     = current;
                    nearestDist = dist;
                  }
                }
              }
            }
        }
        return path.length > 0 ? path : (nearest ? this.calculatePath(area,from,nearest.position,resolution,extend,depth,direction,include,exclude) : []);
    }
}