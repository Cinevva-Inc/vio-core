import { Vector3 } from "three";

export class VioPathFindCell
{
    public canMove:boolean = true;
    public totalCost:number = 0;
    public startEndCost:number = 0;
    public estimatedCost:number = 0;
    public distanceToTarget:number = -1;
    public neighbors:Array<VioPathFindCell>;
    public parent:VioPathFindCell|null=null;

    constructor(readonly position:Vector3, readonly point:{x:number,y:number})
    {
        this.neighbors = [];
        this.parent    = null;
    }

    private _addCell(cell:VioPathFindCell)
    {
        if(cell.canMove)
        {
            this.neighbors.push(cell);
        }
    }

    updateNeighbors(grid:Array<Array<VioPathFindCell>>)
    {
        let x = this.point.x;
        let y = this.point.y;

        if (x < grid.length - 1) 
        {
          this._addCell(grid[x + 1][y]);
        }
        if (x > 0)
        {
          this._addCell(grid[x - 1][y]);
        }
        if (y < grid[x].length - 1)
        {
          this._addCell(grid[x][y + 1]);
        }
        if (y > 0)
        {
          this._addCell(grid[x][y - 1]);
        }

        if (x > 0 && y < grid[x].length - 1)
        {
          this._addCell(grid[x - 1][y + 1]);
        }
        if (x > 0 && y > 0)
        {
          this._addCell(grid[x - 1][y - 1]);
        }
        if (x < grid.length - 1 && y < grid[x].length - 1) 
        {
          this._addCell(grid[x + 1][y + 1]);
        }
        if (x < grid.length - 1 && y > 0) 
        {
          this._addCell(grid[x + 1][y - 1]);
        }
    };
}