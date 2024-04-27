import { VioGenerator } from "../../Helpers/VioGenerator";
import { MeshComponent } from "../../Components/MeshComponent";
import { ZoneComponent } from "../../Components/ZoneComponent";
import { Object3D, Vector3, Box3 } from "three";
import { VioComponent } from "../../Components/Base/VioComponent";
import { VioScene } from "../VioScene/VioScene";
export { VioComponentRegistry } from "../../Singletons/Registry/VioComponentRegistry";

export class VioObject extends Object3D 
{
    protected _objectID: string = '';
    protected _meta: any = {};
    protected _components : Map<string, VioComponent> = new Map();
    protected _objects: Array<VioObject> = [];
    protected _scene: VioScene | null = null;
    protected _pivot: Vector3 | null = null;
    protected _editMode: boolean = false;
    protected _editModeSelected: boolean = false;
    protected _bounds: Box3 | null = null;

    constructor(objectID:string | null = null, meta:any = {}) {
        super();
        (this as any).type = 'VioObject';
        this._meta = meta
        this._objectID = objectID ?? Math.random().toString(36).substring(2)
        this._components = new Map<string, VioComponent>();
        this._objects = []
    }

    public get meta() { return this._meta }
    public get objectID() { return this._objectID }
    public get objects() { return this._objects }
    public get components() { return [...this._components.values()] }
    public get scene() { return this._scene }
    public get pivot() { return this._pivot }
    public get editMode() { return this._editMode }
    public get editModeSelected() { return this._editModeSelected }

    public set pivot(pivot: Vector3 | null) {
        this._pivot = pivot ? pivot.clone() : null
    }

    public set scene(scene: VioScene | null) {
        for (let component of this._components.values())
            component.scene = scene
        for (let object of this._objects)
            object.scene = scene
    }

    public set editMode(editMode: boolean) {
        this._editMode = editMode
        for (let component of this._components.values())
            component.editMode = editMode
        for (let object of this._objects)
            object.editMode = editMode
    }

    public set editModeSelected(editModeSelected: boolean) {
        this._editModeSelected = editModeSelected
        for (let component of this._components.values())
            component.editModeSelected = editModeSelected
        for (let object of this._objects)
            object.editModeSelected = editModeSelected
    }

    public async duplicate(): Promise<VioObject> {
        let data = this.getData()
        let object = await VioGenerator.generateObject(data);
        this.matrixWorld.decompose(
            object.position,
            object.quaternion,
            object.scale)
        await object.mesh?.isInitialized();
        return object
    }

    public fastClone(): VioObject {
        let object = new VioObject()
        object.position.copy(this.position)
        object.quaternion.copy(this.quaternion)
        object.scale.copy(this.scale)
        object.pivot = this._pivot
        Object.assign(object.meta, this.meta)
        Object.assign(object.userData, this.userData)
        for (let subObject of this.objects) {
            let clonedObject = subObject.fastClone()
            object.addObject(subObject.fastClone())
        }
        for (let component of this._components.values()) {
            let clonedComponent = VioComponent.createComponent(component.name, component.getData())
            if (clonedComponent)
                object.addComponent(clonedComponent)
        }
        return object
    }

    public dispose() {
        for (let component of this._components.values())
            component.dispose()
        for (let object of this._objects)
            object.dispose()
    }
    
    public update(delta: number) {
        for (let component of this._components.values())
            component.update(delta)
        for (let object of this._objects)
            object.update(delta)
    }

    public addComponent(component: VioComponent) {
        this.removeComponent(component.name)
        component.object = this
        component.scene = this.scene
        component.editMode = this._editMode
        component.editModeSelected = this._editModeSelected
        this._components.set(component.name, component)
        for (let otherComponent of this._components.values())
            if (otherComponent != component)
                otherComponent.onComponentAdded(component)
    }
    
    public removeComponent(name: string) {
        let component = this._components.get(name)
        if (component) {
            this._components.delete(name)
            for (let otherComponent of this._components.values())
                if (otherComponent != component)
                    otherComponent.onComponentRemoved(component)
            component.editModeSelected = false
            component.editMode = false
            component.scene = null
            component.object = null
            component.dispose()
        }
        return null
    }

    public getComponent(name: string): VioComponent|null {
        return this._components.get(name) ?? null
    }

    public getComponentByType(type:any) : VioComponent|null {
        for (let component of this._components.values())
            if (component.constructor.name == type.name)
                return component
        return null
    }

    public addObject(object: VioObject) {   
        this._objects.push(object)
        object.scene = this._scene
        object.editMode = this._editMode
        this.add(object)
        this.resetBounds()
        this.updateMatrixWorld(true)
        delete this.meta.icon
    }

    public removeObject(object: VioObject) {
        let i = this._objects.indexOf(object)
        if (i != -1) {
            object.editModeSelected = false
            object.editMode = false
            object.scene = null
            this._objects.splice(i,1)
            this.remove(object)
            this.resetBounds()
            delete this.meta.icon
        }
    }

    public get bounds(): Box3 {
        if (!this._bounds) {
            this._bounds = new Box3();
            this._bounds.setFromObject(this);
            this.updateMatrix();
            this.updateMatrixWorld(true)
            this._bounds.applyMatrix4(this.matrixWorld.clone().invert());
        }
        return this._bounds!;
    }

    public resetBounds() {
        this._bounds = null;
    }

    public getData(): any {
        return {
            components: [...this._components.values()].map(component => component.getData()),
            objects: this.objects.map(object => object.getData()),
            type: 'object',
            meta: this.meta,
            objectID: this.objectID,
            position: { x: this.position.x, y: this.position.y, z: this.position.z },
            rotation: { x: this.rotation.x, y: this.rotation.y, z: this.rotation.z, order: this.rotation.order },
            scale: { x: this.scale.x, y:this.scale.y, z:this.scale.z },
            pivot: this.pivot ? { x: this.pivot.x, y: this.pivot.y, z: this.pivot.z } : null,
        }
    }

    public get mesh(): MeshComponent | null {
        return this.getComponent('MeshComponent') as MeshComponent | null
    }

    public get zone(): ZoneComponent | null {
        return this.getComponent('ZoneComponent') as ZoneComponent | null
    }

    public static fromObject(object: Object3D): VioObject | null {
        if (object.type == 'VioObject')
            return object as VioObject
        if (object.parent)
            return VioObject.fromObject(object.parent)
        return null
    }
}