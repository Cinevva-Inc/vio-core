import { BoxGeometry, Mesh, MeshBasicMaterial, MeshMatcapMaterial, Object3D, Vector3 } from 'three';
import { VioPathfindGridGenerator } from './source/VioPathfindGridGenerator';
import { VioAStarPathfinding      } from './source/VioAStarPathfinding';
import { VioPathFindingGround     } from './source/VioPathFindingGround';
import { VioRender } from '../Render/VioRender';
import { VioEditMode } from '../EditMode/VioEditMode';
import { VioResources } from '../Resources/VioResources';

export type Cell = {
  position: Vector3,
  point: {x:number,y:number},
  canMove: boolean,
  totalCost: number,
  startEndCost: number,
  estimatedCost: number,
  neighbors: Array<Cell>,
  parent: Cell|null
};

export class VioPathFinding
{
    // private static _instance:VioPathFinding;

    // private _editModeActive   : boolean = false;
    // private _grid             : VioPathfindGridGenerator;
    // private _aStar            : VioAStarPathfinding;
    // private _ground           : VioPathFindingGround|null=null;
    // private _obstacleMaterial : MeshMatcapMaterial|null=null;
    // private _obstacles        : Array<Object3D>;
    // private _activeObstacles  : Array<Object3D>;

    // private constructor()
    // {
    //   this._grid             = new VioPathfindGridGenerator();
    //   this._aStar            = new VioAStarPathfinding(this._grid);
    //   this._obstacles        = [];
    //   this._activeObstacles  = [];
    //   VioResources.getTexure('./assets/textures/matcap.jpg').then(matcap => {
    //     this._obstacleMaterial = new MeshMatcapMaterial({color: 0xff0000, transparent:true, opacity: 0.5, matcap});
    //   })
    // }

    // private _clearObstacles()
    // {
    //   this._activeObstacles.length = 0;

    //   this._obstacles.forEach(obstacle=>
    //   {
    //     obstacle.scale.set(0,0,0);  
    //   })
    // }

    // private _getObstacle()
    // {
    //     for(let num = 0; num < this._obstacles.length; num++)
    //     {
    //         if(this._obstacles[num].scale.x == 0 && this._obstacles[num].scale.y == 0)
    //         {
    //             return this._obstacles[num];
    //         } 
    //     }
        
    //     let obstacle = new Mesh( new BoxGeometry(1,1,1), this._obstacleMaterial!);
    //     (obstacle as any).type = 'movable';
    //     obstacle.scale.set(0,0,0);

    //     this._obstacles.push(obstacle);

    //     return obstacle;
    // }

    // public static setGround(position:{x:number,y:number,z:number},size:{x:number,y:number})
    // {
    //     this.ground.position.set(position.x,position.y,position.z);
    //     this.ground.scale.set(size.x,0.1,size.y);
    //     VioRender.rootScene.add(this.instance._ground!);
    //     this.ground.updateMatrixWorld(true);
    //     VioRender.rootScene.remove(this.instance._ground!);
    // }

    // public static getGround()
    // {
    //   return {position:this.ground.position,size:this.ground.scale};
    // }

    // public static setObstacles(obstacles:Array<{position:{x:number,y:number},size:{x:number,y:number} | null}>)
    // {
    //   this.instance._clearObstacles();

    //   obstacles.forEach(obstacleData=>
    //   {
    //     this.addObstacle(obstacleData,false);
    //   });
    // }

    // public static addObstacle(obstacleData:{position:{x:number,y:number},size:{x:number,y:number} | null},checkEdit:boolean = true)
    // {
    //   let obstacle = this.instance._getObstacle();
      
    //   obstacle.position.set(obstacleData.position.x,this.ground.position.y + 0.5,obstacleData.position.y);
    //   obstacle.scale.set(obstacleData.size ? obstacleData.size.x : 1,1,obstacleData.size ? obstacleData.size.y : 1);
    //   this.instance._activeObstacles.push(obstacle);

    //   if(this.editMode && checkEdit)
    //   {
    //     this.editMode = this.editMode;
    //   }
    // }

    // public static removeObstacle(obstacle:Object3D) {
    //   obstacle.scale.set(0,0,0);
    //   let i = this.instance._activeObstacles.indexOf(obstacle);
    //   if (i != -1)
    //     this.instance._activeObstacles.splice(i,1);
    // }

    // public static clear()
    // {
    //   this.instance._aStar.clearBuffer();
    //   this.setGround({x:0,y:0,z:0},{x:1,y:1})
    //   this.clearBuffer();
    // }

    // public static clearBuffer()
    // {
    //   this.instance._aStar.clearBuffer();
    // }

    // public static calculatePath(from:Vector3,to:Vector3, resolution:number = .2, extend:number = .5, depth:number = 1)
    // {
    //     const path:Array<Vector3> = this.instance._aStar.calculatePath(this.instance._ground!,from,to,resolution,extend,depth,'top',this.instance._activeObstacles,[]);

    //     // path.forEach((point:Vector3)=>
    //     // {
    //     //   this.instance._grid.drawDebugSphere(point,0x00ffff);
    //     // });

    //     return path;
    // }

    // public static set editMode(val:boolean)
    // {
    //   this.instance._editModeActive = val;

    //   this.instance._obstacles.forEach(obj=>
    //   {
    //     if(obj.parent)
    //     {
    //       obj.parent.remove(obj);
    //     }
    //   });

    //   if(val)
    //   {
    //     this.activeObstacles.forEach(obj=>
    //     {
    //       VioRender.rootScene.add(obj);
    //     });
    //     VioEditMode.setRaycastableObjects(this.activeObstacles);
    //   }
    //   this.clearBuffer();
    // }

    // public static get editMode()
    // {
    //   return this.instance._editModeActive;
    // }

    // public static get ground()
    // {
    //     if(!this.instance._ground)
    //     {
    //         this.instance._ground = new VioPathFindingGround();
    //     };
    //     return this.instance._ground;
    // }

    // public static get activeObstacles()
    // {
    //     return this.instance._activeObstacles;
    // }

    // public static get data()
    // {
    //     let obstacles:Array<any> = [];

    //     this.activeObstacles.forEach(obstacle=>
    //     {
    //       obstacles.push({position:{x:obstacle.position.x,y:obstacle.position.z},size:{x:obstacle.scale.x,y:obstacle.scale.z}});
    //     });

    //     let obj = 
    //     {
    //       obstacles:obstacles,
    //       ground   :
    //       {
    //         position:{x:this.ground.position.x,y:this.ground.position.y,z:this.ground.position.z},
    //         size    :{x:this.ground.scale.x,y:this.ground.scale.z}
    //       }
    //     }
        
    //     return obj;
    // }

    // private static get instance():VioPathFinding
    // {
    //     if(!VioPathFinding._instance)
    //     {
    //         VioPathFinding._instance = new VioPathFinding();
    //     }
    //     return VioPathFinding._instance;
    // }
}