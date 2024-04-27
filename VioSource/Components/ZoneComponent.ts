import * as THREE from "three";
import { VioRender, VioSettings, VioScene } from "../../VioCore";
import { VioObject } from "../Objects/VioObject/VioObject";
import { VioComponent } from "./Base/VioComponent";
import { Text } from '../../VioCore'

export class ZoneComponent extends VioComponent
{
    _bounds:        THREE.Box3;
    _zone:          THREE.Mesh;
    _text:          any;
    _color:         THREE.Color;
    _helper:        THREE.Object3D;

    constructor() {
        super('ZoneComponent');

        this._bounds = new THREE.Box3(
            new THREE.Vector3(-0.5,0,-0.5),
            new THREE.Vector3(0.5,0,0.5));

            this._color = new THREE.Color(0xffff00)

        let geometry = new THREE.PlaneGeometry(1, 1)
        let material = new THREE.MeshBasicMaterial({
            color: this._color,
            side: THREE.DoubleSide
        })
        material.transparent = true
        material.opacity = 0.4
        material.polygonOffset = true
        material.polygonOffsetFactor = 1
        material.polygonOffsetUnits = 0
        material.depthWrite = false
        this._zone = new THREE.Mesh(geometry, material)
        this._zone.rotateX(Math.PI/2)
        this._zone.renderOrder = 1

        this._text = new Text()
        this._text.rotateX(-Math.PI/2)
        // this._text.anchorX = 'center'
        // this._text.anchorY = 'middle'
        this._text.depthOffset = -2
        this._text.text = 'Zone'
        this._text.fontSize = 0.2
        this._text.color = 0xffffff
        this._text.sync()
        this._text.isText = true

        this._helper = new THREE.Object3D()
        let makeCorner = (rotation:number) => {
            let points = [
                new THREE.Vector3(1,0,0),
                new THREE.Vector3(0,0,0),
                new THREE.Vector3(0,0,1),
            ]
            let geometry = new THREE.BufferGeometry().setFromPoints(points)
            let material = new THREE.LineBasicMaterial({
                depthTest: false,
                depthWrite: false,
                fog: false,
                toneMapped: false,
                transparent: true,
                color: 0xff0000
            })
            let line = new THREE.Line(geometry, material)
            line.scale.set(0.1,0.1,0.1)
            line.rotateY(rotation)
            this._helper.add(line)
        }
        makeCorner(0)
        makeCorner(Math.PI)
        makeCorner(Math.PI/2)
        makeCorner(-Math.PI/2)
    }

    destroy() {
        this._zone.geometry.dispose();
        (this._zone.material as THREE.Material).dispose()
        this._text.dispose()
    }

    get scene() { return this._scene }
    set scene(scene: VioScene|null) {
        this._disableEditControls()
        super.scene = scene
        this._enableEditControls()
    }

    get editMode() { return this._editMode }
    set editMode(editMode: boolean) {
        this._disableEditControls()
        super.editMode = editMode
        this._enableEditControls()
    }

    public setData(data:any) {
        this._bounds.min.set(
            data.bounds?.min?.x ?? this._bounds.min.x,
            data.bounds?.min?.y ?? this._bounds.min.y,
            data.bounds?.min?.z ?? this._bounds.min.z)
        this._bounds.max.set(
            data.bounds?.max?.x ?? this._bounds.max.x,
            data.bounds?.max?.y ?? this._bounds.max.y,
            data.bounds?.max?.z ?? this._bounds.max.z)
        if (data.color)
            this._color.set(data.color)
        if (data.polygonOffsetFactor !== undefined)
            this.material.polygonOffsetFactor = data.polygonOffsetFactor
        if (data.polygonOffsetUnits !== undefined)
            this.material.polygonOffsetUnits = data.polygonOffsetUnits
    }

    public getData() {
        let data = super.getData()
        data.bounds = {
            min: {
                x: this._bounds.min.x,
                y: this._bounds.min.y,
                z: this._bounds.min.z,
            },
            max: {
                x: this._bounds.max.x,
                y: this._bounds.max.y,
                z: this._bounds.max.z,
            },
        }
        data.color = `#${this._color.getHexString()}`
        let material = this._zone.material as THREE.MeshBasicMaterial
        data.polygonOffsetFactor = this.material.polygonOffsetFactor
        data.polygonOffsetUnits = this.material.polygonOffsetUnits
        return data
    }

    update(delta: number): void {
        let material = this._zone.material as THREE.MeshBasicMaterial
        if (!material.color.equals(this._color)) {
            material.color.copy(this._color)
            material.needsUpdate = true
        }
        this._text.position.copy(this._bounds.min)
        this._text.position.x += 0.03
        this._zone.scale.set(
            this._bounds.max.x - this._bounds.min.x,
            this._bounds.max.z - this._bounds.min.z, 1)
        this._zone.position.set(
            (this._bounds.min.x + this._bounds.max.x)/2,
            -0.001,
            (this._bounds.min.z + this._bounds.max.z)/2)
        let name = this.object!.meta.name ?? 'Zone'
        if (this._text.text != name) {
            this._text.text = name
            this._text.sync()
        }

        this._helper.position.copy(this.object!.position)
        this._helper.rotation.copy(this.object!.rotation)
        this._helper.children[0].position.x = this._bounds.min.x - 0.02
        this._helper.children[0].position.z = this._bounds.min.z - 0.02
        this._helper.children[1].position.x = this._bounds.max.x + 0.02
        this._helper.children[1].position.z = this._bounds.max.z + 0.02
        this._helper.children[2].position.x = this._bounds.min.x - 0.02
        this._helper.children[2].position.z = this._bounds.max.z + 0.02
        this._helper.children[3].position.x = this._bounds.max.x + 0.02
        this._helper.children[3].position.z = this._bounds.min.z - 0.02
    }

    protected _enableEditControls() {
        if (this.object) {
            if (this.editMode) {
                this.object!.add(this._zone);
                this.object!.add(this._text);
            }
        }
    }

    protected _disableEditControls() {
        if (this.object) {
            if (this.editMode) {
                this.object!.remove(this._zone);
                this.object!.remove(this._text);
            }
        }
    }

    public get bounds(): THREE.Box3 { return this._bounds; }
    public get color(): THREE.Color { return this._color; }
    public set color(color: THREE.Color) { this._color.copy(color); }
    public get material(): THREE.MeshBasicMaterial { return this._zone.material as THREE.MeshBasicMaterial }
}