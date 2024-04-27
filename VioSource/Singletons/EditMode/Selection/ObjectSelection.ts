import { Object3D, Vector3, Box3, Matrix4, Mesh } from "three";
import { VioHelpers } from "../../../Helpers/VioHelpers";
import { VioInput } from "../../../Singletons/Input/VioInput";
import { VioObject } from '../../../Objects/VioObject/VioObject';
import { VioRender } from "../../Render/VioRender";
import { VioScene } from "../../../Objects/VioScene/VioScene";
import { VioEvents } from "../../../Singletons/Events/VioEvents";
import { VioEditMode } from "../../../Singletons/EditMode/VioEditMode";
// import { Hud } from "./Hud";
import { TransformControls, TransformControlsGizmo } from "../../../../Libs/controls/TransformControls";
 
export class ObjectSelection extends Object3D
{
    protected _axisX       :Vector3 = new Vector3(1,0,0);
    protected _axisY       :Vector3 = new Vector3(0,1,0);
    protected _parent      :VioObject|null=null;
    protected _object      :VioObject|null=null;
    protected _objRef      :Object3D;
    protected _buffer      :Vector3 = new Vector3();
    protected _controls    :TransformControls;

    constructor()
    {
        super();

        // this._hud            = new Hud();
        this._objRef         = new Object3D();
        (this._objRef as any).type    = 'SelectionHandler';
        (this as any).type            = 'ObjectSelection';
        this._controls = new TransformControls(VioRender.camera.selectedCamera,VioRender.canvasElement);
        this._controls.setSize(0.5);
        this._controls.setSpace('local');
        this._controls.traverse((obj:any) => obj.isTransformControls = true);
        this._controls.addEventListener('change', (e) => {
            // console.log('change', e)
        })
        this._controls.addEventListener('objectChange', (e) => {
            // console.log('objectChange', e)
            this.update()
        })
        this.add(this._objRef);
        // this.add(this._hud);
        this.attach(this._controls);
    }
    
    private _onMeshUpdated = ()=>
    {
        this.sync()
    }

    //@ts-ignore
    public setObject(object:VioObject|null)
    {
        if(this._object)
        {
            this._object.removeEventListener('MeshUpdated', this._onMeshUpdated);
            this._object.editModeSelected = false;
        }
        
        this._object = object;
        if(this._object)
        {
            this.visible = true;

            let center = new Vector3();
            if (this._object.pivot)
                center.copy(this._object.pivot)
            else
                this._object.bounds.getCenter(center);

            let matrix = new Matrix4();
            matrix.makeTranslation(center);
            this.object!.updateMatrixWorld();
            matrix.premultiply(this.object!.matrixWorld);
            matrix.decompose(
                this._objRef.position,
                this._objRef.quaternion,
                this._objRef.scale)
            
            if((this._controls as any).enabled)
            {
                this._controls.attach(this._objRef);
            }

            this.updateHandlers();
            
            if(this._object.type == 'VioObject')
            {
                this._object.editModeSelected = true;
                this._object.addEventListener('MeshUpdated',this._onMeshUpdated);
            }
        }
        else
        {
            this.visible = false;
            this._controls.detach();
        }
        // this.updateHud(true);
    }

    public sync() {
        this.setObject(this._object);
    }

    public update(silent:boolean=false)
    {
        if (this._object) {
            let position = this._object.position.clone()
            let rotation = this._object.rotation.clone()
            let scale = this._object.scale.clone()

            let center = new Vector3();
            if (this._object.pivot)
                center.copy(this._object.pivot)
            else
                this._object.bounds.getCenter(center);
            let matrix = new Matrix4();
            matrix.makeTranslation(center);
            matrix.invert();
            this._objRef.updateMatrixWorld(true);
            matrix.premultiply(this._objRef.matrixWorld);
            if (this._object.parent)
                matrix.premultiply(this._object.parent!.matrixWorld.clone().invert());
            matrix.decompose(
                this._object.position,
                this._object.quaternion,
                this._object.scale);
            if (this._object.parent &&
                this._object.parent!.type == 'VioObject') 
            {
                (this._object.parent! as VioObject).resetBounds();
            }

            if (
                !VioInput.pressedKeys.includes('SHIFTLEFT') &&
                !VioInput.pressedKeys.includes('SHIFTRIGHT'))
            {
                let scene = this._object.parent
                while (scene && scene.type != 'Scene')
                    scene = scene.parent

                if (scene)
                    ObjectSelection.snapObject(this._object, (scene as VioScene).objects)
            }

            if (VioInput.pressedKeys.includes('CONTROLLEFT') ||
                VioInput.pressedKeys.includes('CONTROLRIGHT'))
            {
                let moveSteps = 5
                this._object.position.x = Math.round(this._object.position.x*moveSteps)/moveSteps
                this._object.position.y = Math.round(this._object.position.y*moveSteps)/moveSteps
                this._object.position.z = Math.round(this._object.position.z*moveSteps)/moveSteps

                let rotateSteps = 8/Math.PI
                this._object.rotation.x = Math.round(this._object.rotation.x*rotateSteps)/rotateSteps
                this._object.rotation.y = Math.round(this._object.rotation.y*rotateSteps)/rotateSteps
                this._object.rotation.z = Math.round(this._object.rotation.z*rotateSteps)/rotateSteps
            }

            this._object.scale.x = Math.max(0.001, this._object.scale.x)
            this._object.scale.y = Math.max(0.001, this._object.scale.y)
            this._object.scale.z = Math.max(0.001, this._object.scale.z)

            if (!silent) {
                let changes = {} as any
                if (!this._object.position.equals(position))
                    changes.position = {old: position, new: this._object.position.clone()}

                if (!this._object.rotation.equals(rotation))
                    changes.rotation = {old: rotation, new: this._object.rotation.clone()}

                if (!this._object.scale.equals(scale))
                    changes.scale = {old: scale, new: this._object.scale.clone()}

                // if (Object.keys(changes).length > 0)
                VioEvents.broadcastEvent("objectChanged", changes, this._object)
            }
        }
    }

    public updateHandlers()
    {
        // let type = this.handlerType();
        // this._hud.updateHandlers((this._controls as any).enabled ? 'none' : type);

        // if((this._controls as any).enabled)
        // {
        //     if((this._controls.mode == 'scale') && type == 'Dirlight')
        //     {
        //         this._controls.mode = "translate";
        //     }
        //     if((this._controls.mode == 'rotate' || this._controls.mode == 'scale') && type == 'light')
        //     {
        //         this._controls.mode = "translate";
        //     }
        // }
    }

    public updateControlType(type:'translate' | 'rotate' | 'scale' | 'brush' | 'move' | 'none')
    {
        // this._hud.handlersCont.visible = type == 'none';
        (this._controls as any).enabled = type != 'none';
        this._controls.visible          = type != 'none';

        if(type != 'none')
        {
            this._controls.mode = type;
        }
        this.updateHandlers();
    }

    // private handlerType(obj:Object3D|null=null)
    // {
    //     obj = obj ? obj : this._object;

    //     if(obj && obj.type == 'VioObject')
    //     {
    //         return (obj as VioObject).handlerType;
    //     }
    //     return '';
    // }

    public get object()
    {
        return this._object;
    }

    public get handlers()
    {
        return []
        // if(this._object)
        // {
        //     return [...[this._object],...this._hud.handlers];
        // }
        // return this._hud.handlers;
    }
    
    public get controls()
    {
        return this._controls;
    }

    static sampleObject(object:Object3D, matrix:Matrix4, steps:number=10, samples:Record<string, Array<Vector3>> = {}) {
        let mesh = object as Mesh
        if (mesh.isMesh) {
            let points = mesh.geometry.getAttribute('position').array
            for (let i=0; i<points.length; i+=3) {
                let point = new Vector3()
                point.set(points[i], points[i+1], points[i+2])
                point.applyMatrix4(mesh.matrixWorld)
                point.applyMatrix4(matrix)
                let x = Math.round(point.x * steps)
                let y = Math.round(point.y * steps)
                let z = Math.round(point.z * steps)
                let k = `${x}|${y}|${z}`
                let hits = samples[k]
                if (hits === undefined)
                    samples[k] = [point]
                else
                    samples[k].push(point)
            }
        }
        else {
            for (let childObject of object.children)
                ObjectSelection.sampleObject(childObject, matrix, steps, samples)
        }
        return samples
    }

    public static snapObject(targetObject:VioObject, sceneObjects:Array<VioObject>) {
        if (VioEditMode.selection.snapToGrid) {
            targetObject.position.x = Math.round(targetObject.position.x)
            targetObject.position.y = Math.round(targetObject.position.y)
            targetObject.position.z = Math.round(targetObject.position.z)
        }
        /*return
        targetObject.updateMatrixWorld(true)
        let bounds = targetObject.bounds.clone().applyMatrix4(targetObject.matrixWorld);
        let center = new Vector3()
        let steps = 1
        let matrix = targetObject.matrixWorld.clone().invert().multiply(targetObject.matrix)
        let samples = ObjectSelection.sampleObject(targetObject, matrix, steps)
        let adjustments = new Map<string, {offset:Vector3, score:number, bonus:number, distance:number}>()
        let loop = (object:Object3D) => {
            if (object === targetObject) {
                // console.log('skip self')
                return
            }
            if ((object as any).isTransformControls)
                return
            let mesh = object as Mesh
            if (mesh.isMesh) {
                let boundingSphere = mesh.geometry.boundingSphere
                if (boundingSphere) {
                    center.copy(boundingSphere.center).applyMatrix4(mesh.matrixWorld)
                    let radius = boundingSphere.radius
                    let space
                    let distance = bounds.distanceToPoint(center)
                    if (distance < radius) {
                        // console.log('nearby', mesh.name, distance, radius)
                        let points = mesh.geometry.getAttribute('position').array
                        for (let i=0; i<points.length; i+=3) {
                            let point = new Vector3()
                            point.set(points[i], points[i+1], points[i+2])
                            point.applyMatrix4(mesh.matrixWorld)
                            point.applyMatrix4(matrix)
                            for (let x of [Math.floor(point.x * steps), Math.ceil(point.x * steps)])
                            for (let y of [Math.floor(point.y * steps), Math.ceil(point.y * steps)])
                            for (let z of [Math.floor(point.z * steps), Math.ceil(point.z * steps)])
                            {
                                let k = `${x}|${y}|${z}`
                                let hits = samples[k]
                                if (hits) {
                                    // console.log({hits})
                                    for (let hit of hits) {
                                        let distance = hit.manhattanDistanceTo(point)
                                        let offset = point.clone().sub(hit)
                                        // if (targetObject.position.y == 0 && offset.y != 0)
                                            // continue
                                        let key = [
                                            Math.round(offset.x * 1000),
                                            Math.round(offset.y * 1000),
                                            Math.round(offset.z * 1000)].join('|')
                                        let adjustment = adjustments.get(key)
                                        if (adjustment)
                                            adjustment.score += 1
                                        else {
                                            let score: number = 1
                                            let sourceObject: Object3D|null = mesh
                                            let rounded = false
                                            while (sourceObject && sourceObject.type != 'VioObject')
                                                sourceObject = sourceObject.parent
                                            // console.log({sourceObject})
                                            let bonus = 1
                                            if (sourceObject) {
                                                let sourcePosition = sourceObject.getWorldPosition(new Vector3())
                                                let targetPosition = targetObject.getWorldPosition(new Vector3())
                                                targetPosition.add(offset)
                                                let dx = Math.abs(sourcePosition.x - targetPosition.x)
                                                let dy = Math.abs(sourcePosition.y - targetPosition.y)
                                                let dz = Math.abs(sourcePosition.z - targetPosition.z)
                                                if (Math.abs(Math.round(dx) - dx) < 0.0001) bonus += 1
                                                if (Math.abs(Math.round(dy) - dz) < 0.0001) bonus += 1
                                                if (Math.abs(Math.round(dy) - dz) < 0.0001) bonus += 1
                                                // console.log({sourcePosition, targetPosition})
                                            }
                                            adjustments.set(key, {offset, score, bonus, distance})
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            else {
                for (let childObject of object.children)
                    loop(childObject)
            }
        }
        sceneObjects.forEach(sceneObject => loop(sceneObject))
        let getBestAdjustment = (distance:number) => {
            let bestAdjustment = null
            for (let adjustment of adjustments.values()) {
                if (adjustment.distance < distance)
                    if (!bestAdjustment || bestAdjustment.score * bestAdjustment.bonus < adjustment.score * adjustment.bonus)
                        bestAdjustment = adjustment
            }
            return bestAdjustment
        }
        let bestAdjustment1 = getBestAdjustment(0.2)
        let bestAdjustment2 = getBestAdjustment(0.5)
        if (bestAdjustment1) {
            if (bestAdjustment1 === bestAdjustment2) {
                console.log('best adjustement', bestAdjustment1?.score, bestAdjustment1?.bonus, bestAdjustment1?.distance)
                targetObject.position.add(bestAdjustment1.offset)
            }
            else {
                console.log('conflicting adjustements')
            }
        }
        else if (Math.abs(targetObject.position.y) < 0.2) {
            targetObject.position.y = 0
        }*/
    }
}