import { VioComponentRegistry } from "../Singletons/Registry/VioComponentRegistry";
// import { VioInventoryItemsRegistry } from "../Singletons/Registry/VioInventoryItemsRegistry";
import { VioObject } from "../Objects/VioObject/VioObject";
import { VioScene } from "../Objects/VioScene/VioScene";
import { VioPathFinding } from "../Singletons/Pathfinding/VioPathFinding";
import { VioPostProcessing } from "../Singletons/PostProcessing/VioPostProcessing";
import { VioRender } from "../Singletons/Render/VioRender";
import { VioScenarios } from "../Singletons/Scenarios/VioScenarios";
import { VioHud } from "../Singletons/Hud/VioHud";
import { VioHelpers } from "./VioHelpers";
import { Box3, Vector3 } from "three";

export class VioGenerator
{
    public static async generateAsset(data:any,onProgress?:(progress:number,status:string,canRender:boolean)=>void)
    {
        let generated:any = null;

        switch(data.type)
        {
            case 'scene':
            {
                generated = await VioGenerator.generateScene(data,onProgress);
                break;
            }
            case 'object':
            {
                generated = await VioGenerator.generateObject(data,(total:number,count:number,status)=>
                {
                    if(onProgress)
                    {
                        onProgress(count/total,status,false);
                    }
                });
                break;
            }
        }
        return generated;
    }

    public static setGlobalData(data:any)
    {
        if(data.input)
        {

        }
        // if(data.inventoryItemsRegistry)
        // {
        //     VioInventoryItemsRegistry.setItemsByData(data.inventoryItemsRegistry);
        // }
    }

    public static setSceneData(data:any)
    {
        // console.log("SCENE DATA",data);
        if(data.color)
        {
            VioRender.clearColor = data.color;
        }
        // if(data.pathfinding)
        // {
        //     VioPathFinding.setGround(data.pathfinding.ground.position,data.pathfinding.ground.size);
        //     VioPathFinding.setObstacles(data.pathfinding.obstacles);
        // }
        // if(data.postProcessing)
        // {
        //     // VioPostProcessing.activateEffects(data.postProcessing);
        // }
        if(data.scenarios)
        {
            VioScenarios.setScenariosByData(data.scenarios);
        }
        if(data.hud)
        {
            VioHud.instance.data = data.hud;
        }
        if(data.camera)
        {
            VioRender.camera.setCameraBaseData(data.camera);
        }
    }

    public static setSceneProps(data:any)
    {
    }

    public static async loadProject(url:any,onProgress?:(progress:number,status:string,canRender:boolean)=>void,onComplete?:()=>void)
    {
        if(onProgress)
        {
            onProgress(0,'Fetching Project data',false);
        }
        const resp = await VioHelpers.Ajax.getDataAsync(url,'GET');

        if(resp.data && resp.data.type == 'project')
        {
            let data = resp.data;

            if(onProgress)
            {
                onProgress(0,'Setting Project data',false);
            }

            this.setGlobalData(data);
            
            let sceneData = data.scenes[data.selectedScene];

            switch(sceneData.type)
            {
                case 'inline':
                {
                    VioRender.scene = await this.generateScene(sceneData.object,onProgress,onComplete);
                    break;   
                }
                case 'url':
                {
                    await this.loadScene(sceneData.object, onProgress,onComplete);
                    break;
                }
            }
        }
    }

    public static async loadScene(
        url:string,
        onProgress?:(progress:number,status:string,canRender:boolean)=>void,
        onComplete?:()=>void,
        onScene?:(scene:VioScene)=>void)
    {
        const resp  = await VioHelpers.Ajax.getDataAsync(url,'GET');
        let   scene: VioScene|null = null;
        if(resp.data && resp.data.type == 'scene')
        { 
            scene = await this.generateScene(resp.data,onProgress,onComplete,onScene);
        }
        else
        {
            throw new Error("Loaded data is not scene type!");
        }

        VioRender.scene = scene!;

        return scene;
    }

    public static async loadObject(url:string,onProgress?:(total: number, progress: number, status: string)=>void | null)
    {
        const resp   = await VioHelpers.Ajax.getDataAsync(url,'GET');
        let   object: VioObject|null = null;
        if(resp.data && resp.data.type == 'object')
        { 
            object = await this.generateObject(resp.data,onProgress);
        }
        else
        {
            throw new Error("Loaded data is not object type!");
        }
        return object;
    }

    private static getFrustumDividedObjects(data:any)
    {
        let obj:any = {count:0};
        obj.frustum = [];
        obj.objects = [];

        let box:Box3    = new Box3();
        let min:Vector3 = new Vector3();
        let max:Vector3 = new Vector3();
        
        if(data.objects)
        {
            obj.count = data.objects.length;

            for(let num = 0; num < data.objects.length; num++)
            {
                if(data.objects[num].bounds)
                {
                    min.set(data.objects[num].bounds.min.x,data.objects[num].bounds.min.y,data.objects[num].bounds.min.z);
                    max.set(data.objects[num].bounds.max.x,data.objects[num].bounds.max.y,data.objects[num].bounds.max.z);
                    box.set(min,max);
                    
                    if(VioRender.camera.frustum.intersectsBox(box))
                    {
                        obj.frustum.push(data.objects[num]);
                    }
                    else
                    {
                        obj.objects.push(data.objects[num]);
                    }
                }
                else
                {
                    if(VioRender.camera.frustum.containsPoint(data.objects[num].position))
                    {
                        obj.frustum.push(data.objects[num]);
                    }
                    else
                    {
                        obj.objects.push(data.objects[num]);
                    }
                }
            }
        }
        // console.log("OBJJJ",obj);
        return obj;
    }

    private static getOverallObjects(data:any)
    {
        let count = 0;
        if(data.objects)
        {
            for(let num = 0; num < data.objects.length; num++)
            {
                count++;
                
                if(data.objects[num].components)
                {
                    count+=data.objects[num].components.length;
                }
            }
        }
        return count;
    }

    private static async loadObjects(progressIndex:number,objects:Array<any>,parent:VioScene,onProgress:(progressIndex:number,index:number,progress:number,total:number)=>void)
    {
        await Promise.all(objects.map(async (object:any, num:number) => {
            let instance = await VioGenerator.generateObject(objects[num],(objectTotal:number,progress:number,status:string)=>
            {
                if(onProgress)
                {
                    onProgress(progressIndex,num,progress/objectTotal,objects.length);
                }
            });
            parent.addObject(instance);
            if(onProgress)
            {
                onProgress(progressIndex,num,1,objects.length);
            }
        }))
    }
    
    public static async generateScene(
        data:any,
        onProgress?:(progress:number,status:string,canRender:boolean)=>void,
        onComplete?:()=>void,
        onScene?:(scene:VioScene)=>void)
    {
        if(onProgress)
        {
            onProgress(0,'Setting Scene data',false);
        }
        VioGenerator.setGlobalData(data);
        VioGenerator.setSceneData(data);

        const obj = new VioScene();
        if (onScene)
            onScene(obj);

        if(data.skybox)
        {
            await obj.setSkybox(data.skybox);
        }

        if(data.skyboxRotation)
        {
            obj.skyboxRotation.set(
                data.skyboxRotation.x,
                data.skyboxRotation.y,
                data.skyboxRotation.z,
                data.skyboxRotation.order)
        }

        if(data.objects)
        {
            let objects = this.getFrustumDividedObjects(data);
            
            let overallProgress = 0;
            let prog:Array<Array<number>> = [[],[]];

            let onProgressCB = (progressIndex:number,index:number, progress:number,total:number)=>
            {
                prog[progressIndex][index]  = progress/total;

                overallProgress = 0;
                for(let num = 0; num < prog.length; num++)
                {
                    overallProgress += ((prog[num].reduce((a, b) => a + b,0)) / prog.length);
                }

                let canRender:boolean = Math.round((prog[0].reduce((a, b) => a + b,0))) == 1;
                
                if(onProgress)
                {
                    onProgress(overallProgress,'Creating Object',canRender);
                }
            }

            await this.loadObjects(0,objects.frustum,obj,onProgressCB);
            
            await this.loadObjects(1,objects.objects,obj,onProgressCB).then(() => {
                if (onComplete)
                    onComplete()
            })
        }
        VioGenerator.setSceneProps(data);

        return obj;
    }
    
    public static async generateScene4(data:any,onProgress?:(progress:number,status:string)=>void | null)
    {
        if(onProgress)
        {
            onProgress(0,'Setting Scene data');
        }
        VioGenerator.setGlobalData(data);
        VioGenerator.setSceneData(data);

        const obj = new VioScene();

        if(data.skybox)
        {
            obj.skybox = data.skybox;
        }

        if(data.objects)
        {
            let objects = this.getFrustumDividedObjects(data);
            
            let overallProgress = 0;
            let prog:Array<Array<number>> = [[],[]];

            // await this.loadFrustumCulledObjects(objects.frustum,obj,prog);
            for(let num = 0; num < objects.frustum.length; num++)
            {
                prog[0][num] = 0;
                let instance = await VioGenerator.generateObject(objects.frustum[num],(objectTotal:number,progress:number,status:string)=>
                {
                    prog[0][num]    = progress/objectTotal;
                    overallProgress = (prog[0].reduce((a, b) => a + b,0) + prog[1].reduce((a, b) => a + b,0))/objects.count;
                    if(onProgress)
                    {
                        onProgress(overallProgress,status);
                    }
                });
                obj.addObject(instance);
                
                if(onProgress)
                {
                    onProgress(overallProgress,'Creating Object');
                }
            }

            for(let num = 0; num < objects.objects.length; num++)
            {
                setTimeout(async ()=>
                {
                    prog[1][num]    = 0;
                    let instance = await VioGenerator.generateObject(objects.objects[num],(objectTotal:number,progress:number,status:string)=>
                    {
                        prog[1][num]    = progress/objectTotal;
                        overallProgress = (prog[0].reduce((a, b) => a + b,0) + prog[1].reduce((a, b) => a + b,0))/objects.count;
                        if(onProgress)
                        {
                            onProgress(overallProgress,status);
                        }
                    });
                    obj.addObject(instance);
                    
                    if(onProgress)
                    {
                        onProgress(overallProgress,'Creating Object');
                    }
                },0);
            }
        }
        VioGenerator.setSceneProps(data);

        return obj;
    }
    
    public static async generateScene3(data:any,onProgress?:(progress:number,status:string)=>void | null)
    {
        let total = this.getOverallObjects(data);
        let count = 0;

        if(onProgress)
        {
            onProgress(0,'Setting Scene data');
        }
        VioGenerator.setGlobalData(data);
        VioGenerator.setSceneData(data);

        const obj = new VioScene();

        if(data.skybox)
        {
            obj.skybox = data.skybox;
        }

        if(data.objects)
        {
            let overallProgress = 0;
            let prog:Array<number> = [];
            let arr:Array<VioObject>  = [];
            for(let num = 0; num < data.objects.length; num++)
            {
                setTimeout(async ()=>
                {
                    prog[num] = 0;
                    if(VioRender.camera.frustum.containsPoint(data.objects[num].position))
                    {
                        console.log("AA",num,VioRender.camera.position,data.objects[num].position);
                    }
                    let instance = await VioGenerator.generateObject(data.objects[num],(objectTotal:number,progress:number,status:string)=>
                    {
                        prog[num] = progress/objectTotal;
                        overallProgress = prog.reduce((a, b) => a + b)/data.objects.length;
                        if(onProgress)
                        {
                            onProgress(overallProgress,status);
                        }
                    });
                    obj.addObject(instance);
                    arr.push(instance);
                    
                    if(onProgress)
                    {
                        onProgress(overallProgress,'Creating Object');
                    }
                },0);
            }
        }
        VioGenerator.setSceneProps(data);

        return obj;
    }

    public static async generateScene2(data:any,onProgress?:(progress:number,status:string)=>void | null)
    {
        let total = this.getOverallObjects(data);
        let count = 0;

        if(onProgress)
        {
            onProgress(0,'Setting Scene data');
        }
        VioGenerator.setGlobalData(data);
        VioGenerator.setSceneData(data);

        const obj = new VioScene();

        if(data.skybox)
        {
            obj.skybox = data.skybox;
        }

        if(data.objects)
        {
            let arr:Array<VioObject> = [];
            for(let num = 0; num < data.objects.length; num++)
            {
                let current  = count;
                let instance = await VioGenerator.generateObject(data.objects[num],(objectTotal:number,progress:number,status:string)=>
                {
                    count = current + progress;
                    if(onProgress)
                    {
                        onProgress(count/total,status);
                    }
                });
                obj.addObject(instance);
                arr.push(instance);
                count++;
                if(onProgress)
                {
                    onProgress(count/total,'Creating Object');
                }
            }
        }
        VioGenerator.setSceneProps(data);

        return obj;
    }

    public static async generateObject(data:any,onProgress?:(total:number,progress:number,status:string)=>void | null)
    {
        // console.log('generateObject', data);

        let meta = data.meta ?? {}
        if (meta.icon?.startsWith('blob:'))
            delete meta.icon

        const obj = new VioObject(data.objectID ? data.objectID : null, meta);

        if (data.objects)
        {
            (await Promise.all(data.objects.map((nestedData:any) => VioGenerator.generateObject(nestedData)))).forEach((nestedObject:VioObject) => obj.addObject(nestedObject))
        }

        if (data.pivot)
        {
            obj.pivot = new Vector3(data.pivot.x, data.pivot.y, data.pivot.z);
        }

        if (data.components)
        {
            let total = data.components.length;
            let count = 0;
            let text  = '';
            for(let num = 0; num < data.components.length; num++)
            {
                let comp = VioGenerator.createComponent(data.components[num]);
                if (comp)
                    obj.addComponent(comp);
            }

            for(let num = 0; num < obj.components.length; num++)
            {
                // console.log('initialized', obj.components[num], obj.components[num].initialized);
                await obj.components[num].isInitialized((status:string)=>
                {
                    text = status;
                    if(onProgress)
                    {
                        onProgress(total,count,text);
                    }
                });

                if(count < total)
                {
                    count++;
                }
                if(onProgress)
                {
                    onProgress(total,count,text);
                }
            }
        }
        obj.position.set(data.position.x,data.position.y,data.position.z);
        obj.rotation.set(data.rotation.x,data.rotation.y,data.rotation.z);
        obj.scale   .set(data.scale   .x,data.scale   .y,data.scale   .z);

        return obj;
    }

    public static createComponent(data:any)
    {
        // console.log('createComponent', data)
        return VioComponentRegistry.createComponent(data.name,data);
    }
}