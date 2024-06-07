import * as THREE from "three";
import { VioRender, VioSettings, VioScene } from "../../VioCore";
import { VioObject          } from "../Objects/VioObject/VioObject";
import { VioComponent } from "./Base/VioComponent";

export type LightType = 'DirectionalLight' | 'HemisphereLight' | 'PointLight' | 'SpotLight';

export class LightComponent extends VioComponent
{
    _light:         THREE.PointLight | THREE.SpotLight | THREE.DirectionalLight | THREE.HemisphereLight | null = null;
    _type:          LightType = 'PointLight';
    _color:         THREE.Color;
    _groundColor:   THREE.Color;
    _intensity:     number = 4;
    _distance:      number = 10;
    _angle:         number = Math.PI/8;
    _penumbra:      number = 4;
    _decay:         number = 2;
    _castShadow:    boolean = false;
    _enabled:       boolean = true;
    _icon:          THREE.Sprite;
    _source:        THREE.Object3D;
    _helper:        THREE.Object3D|null = null;
    _handler:       THREE.Mesh;
    _shadowRadius:  number = 2;
    _shadowSize:    number = 40;
    _shadowNear:    number = 0.5;
    _shadowFar:     number = 100;
    _shadowRes:     number = 512;
    _shadowBias:    number = -0.001;
    _shadowBlurSamples: number = 25;
    _disableShadowsOnMobile: boolean = false;

    constructor() {
        super('LightComponent');
        this._color = new THREE.Color(1,1,1);
        this._groundColor = new THREE.Color(0.5,0.5,0.5);
        this._createLight();
        let material = new THREE.SpriteMaterial({
            depthTest: false,
            depthWrite: false,
            sizeAttenuation: true,
            transparent: true,
            map: new THREE.TextureLoader().load('./light.png')
        })
        material.color = this._color;

        let scale = 0.5;

        this._source = new THREE.Object3D();

        this._icon = new THREE.Sprite(material);
        // this._icon.center.x = 0.5;
        // this._icon.center.y = 0.5;
        // this._icon.renderOrder = 98;
        this._icon.scale.set(scale, scale, scale);

        this._handler = new THREE.Mesh(
            new THREE.SphereGeometry(.2, 10, 10),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.01
            }));

        (this._handler as any).type = 'Handler';

        this._handler.add(this._icon);
        this._source.add(this._light!);
    }

    get object() { return super.object }
    set object(object: VioObject|null) {
        if (this.object)
            this.object.remove(this._source);
        this._disableEditControls()
        super.object = object
        this._enableEditControls()
        if (this.object) {
            this.object.add(this._source)
            this.object.updateMatrixWorld(true);
        }
    }

    public setData(data:any)
    {
        this._intensity         = data.intensity         ?? this._intensity;
        this._distance          = data.distance          ?? this._distance;
        this._angle             = data.angle             ?? this._angle;
        this._penumbra          = data.penumbra          ?? this._penumbra;
        this._decay             = data.decay             ?? this._decay;
        this._castShadow        = data.castShadow        ?? this._castShadow;
        this._shadowRadius      = data.shadowRadius      ?? this._shadowRadius;
        this._shadowSize        = data.shadowSize        ?? this._shadowSize;
        this._shadowNear        = data.shadowNear        ?? this._shadowNear;
        this._shadowBias        = data.shadowBias        ?? this._shadowBias;
        this._shadowBlurSamples = data.shadowBlurSamples ?? this._shadowBlurSamples;
        this._shadowFar         = data.shadowFar         ?? this._shadowFar;
        this._shadowRes         = data.shadowRes         ?? this._shadowRes;
        this._disableShadowsOnMobile = data.disableShadowsOnMobile ?? this._disableShadowsOnMobile;

        if (data.color) {
            if (data.color.startsWith('#'))
                this._color.set(data.color);
            else
                this._color.set('#'+data.color);
        }

        if (data.groundColor) {
            if (data.groundColor.startsWith('#'))
                this._groundColor.set(data.groundColor);
            else
                this._groundColor.set('#'+data.groundColor);
        }

        if (data.type && this.type != data.type)
            this.type = data.type as LightType;
        else
            this.updateLight()
    }

    public getData()
    {
        let data = super.getData()

        data.type               = this._type;
        data.color              = '#' + this._color.getHexString();
        data.groundColor        = '#' + this._groundColor.getHexString();
        data.intensity          = this._intensity;
        data.distance           = this._distance;
        data.angle              = this._angle;
        data.penumbra           = this._penumbra;
        data.decay              = this._decay;
        data.castShadow         = this._castShadow;
        data.shadowRadius       = this._shadowRadius;
        data.shadowSize         = this._shadowSize;
        data.shadowNear         = this._shadowNear;
        data.shadowFar          = this._shadowFar;
        data.shadowRes          = this._shadowRes;
        data.shadowBias         = this._shadowBias;
        data.shadowBlurSamples  = this._shadowBlurSamples;
        data.disableShadowsOnMobile = this._disableShadowsOnMobile;

        return data
    }

    get editMode() { return this._editMode }
    set editMode(editMode: boolean) {
        this._disableEditControls();
        super.editMode = editMode
        this._enableEditControls();
    }

    get editModeSelected() { return this._editModeSelected }
    set editModeSelected(editModeSelected: boolean) {
        this._disableEditControls();
        super.editModeSelected = editModeSelected
        this._enableEditControls();
    }

    update(delta: number): void  {
        if(this._helper)
            (this._helper as any).update();
    }

    protected _enableEditControls() {
        if (this.object) {
            if (this.editMode) {
                this._source.add(this._handler);
                this._handler.updateMatrixWorld(true);
            }
            if (this.editMode && this.editModeSelected) {
                VioRender.rootScene.add(this._helper!);
                this._helper!.updateMatrixWorld(true);
            }
        }
    }

    protected _disableEditControls() {
        if (this.object) {
            if (this.editMode)
                this._source.remove(this._handler);
            if (this.editMode && this.editModeSelected)
                VioRender.rootScene.remove(this._helper!);
        }
    }

    protected _createLight() {
        switch (this._type) {
        case 'DirectionalLight':
            this._light = new THREE.DirectionalLight(
                this._color,
                this._intensity);
            this._light.target.position.z = -1;
            this._light.position.set(0, 0, 0);
            this._light.add(this._light.target);
            this._helper = new THREE.DirectionalLightHelper(this._light, 0.2);
            break;

        case 'HemisphereLight':
            this._light = new THREE.HemisphereLight(
                this._color,
                this._groundColor,
                this._intensity);
            this._helper = new THREE.HemisphereLightHelper(this._light, 0.2);
            break;

        case 'PointLight':
            this._light = new THREE.PointLight(
                this._color,
                this._intensity,
                this._distance,
                this._decay);
            this._light.position.set(0, 0, 0);
            this._helper = new THREE.PointLightHelper(this._light, 0.2);
            break;

        case 'SpotLight':
            this._light = new THREE.SpotLight(
                this._color,
                this._intensity,
                this._distance,
                this._angle,
                this._penumbra,
                this._decay);
            this._light.target.position.z = -1;
            this._light.position.set(0, 0, 0);
            this._light.add(this._light.target);
            this._helper = new THREE.SpotLightHelper(this._light);
            break;
        }
        if (this._light.castShadow !== undefined) {
            this._light.castShadow = this.shallCastShadow;
            if (this._light.castShadow)
                this._updateLightShadow();
        }
        this._light.updateMatrixWorld(true);
    }

    protected _updateLightShadow() {
        let shadow = this._light!.shadow;
        if (shadow) {
            shadow.radius           = this._shadowRadius;
            shadow.bias             = this._shadowBias;
            shadow.blurSamples      = this._shadowBlurSamples;
            shadow.mapSize.width    = this._shadowRes;
            shadow.mapSize.height   = this._shadowRes;
            shadow.camera.near      = this._shadowNear;
            shadow.camera.far       = this._shadowFar;
            if (shadow.map) {
                shadow.map.width  = this._shadowRes;
                shadow.map.height = this._shadowRes;
            }
            if (shadow.camera.type == 'OrthographicCamera') {
                let camera = shadow.camera as THREE.OrthographicCamera;
                camera.top       = this._shadowSize/2;
                camera.left      = -this._shadowSize/2;
                camera.right     = this._shadowSize/2;
                camera.bottom    = -this._shadowSize/2;
            }
            shadow.camera.updateProjectionMatrix();
            shadow.needsUpdate = true;
        }
    }

    public recreateLight() {
        this._source.remove(this._light!);
        this._disableEditControls();

        this._createLight();

        this._enableEditControls();
        this._source.add(this._light!);
        this._light!.updateMatrixWorld();
    }

    public set type(type: LightType) {
        if (this._type != type) {

            this._source.remove(this._light!);
            this._disableEditControls();

            this._type = type;
            this._createLight();

            this._enableEditControls();
            this._source.add(this._light!);
            this._light!.updateMatrixWorld(true);
        }
    }

    public set enabled(enabled: boolean) {
        if (this._enabled != enabled) {
            if (this.object) {
                this._source.remove(this._light!);
                this._enabled = enabled;
                this._source.add(this._light!);
                this._light!.updateMatrixWorld(true);
            }
        }
    }

    public get type():          LightType   { return this._type; }
    public get color():         THREE.Color { return this._color; }
    public get groundColor():   THREE.Color { return this._groundColor; }
    public get intensity():     number      { return this._intensity; }
    public get distance():      number      { return this._distance; }
    public get angle():         number      { return this._angle; }
    public get penumbra():      number      { return this._penumbra; }
    public get decay():         number      { return this._decay; }
    public get enabled():       boolean     { return this._enabled; }
    public get castShadow():    boolean     { return this._castShadow; }
    public get shadowRadius():  number      { return this._shadowRadius; }
    public get shadowSize():    number      { return this._shadowSize; }
    public get shadowNear():    number      { return this._shadowNear; }
    public get shadowFar():     number      { return this._shadowFar; }
    public get shadowRes():     number      { return this._shadowRes; }
    public get shadowBias():    number      { return this._shadowBias; }
    public get shadowBlurSamples(): number  { return this._shadowBlurSamples; }
    public get disableShadowsOnMobile(): boolean { return this._disableShadowsOnMobile; }

    public set color(color: THREE.Color)            { this._color.copy(color);              this.updateLight(); }
    public set groundColor(groundColor: THREE.Color){ this._groundColor.copy(groundColor);  this.updateLight(); }
    public set intensity(intensity: number)         { this._intensity = intensity;          this.updateLight(); }
    public set distance(distance: number)           { this._distance = distance;            this.updateLight(); }
    public set angle(angle: number)                 { this._angle = angle;                  this.updateLight(); }
    public set penumbra(penumbra: number)           { this._penumbra = penumbra;            this.updateLight(); }
    public set decay(decay: number)                 { this._decay = decay;                  this.updateLight(); }
    public set castShadow(castShadow: boolean)      { this._castShadow = castShadow;        this.updateLight(); }
    public set shadowRadius(shadowRadius: number)   { this._shadowRadius = shadowRadius;    this.recreateLight(); }
    public set shadowSize(shadowSize: number)       { this._shadowSize = shadowSize;        this.updateLight(); }
    public set shadowNear(shadowNear: number)       { this._shadowNear = shadowNear;        this.updateLight(); }
    public set shadowFar(shadowFar: number)         { this._shadowFar = shadowFar;          this.updateLight(); }
    public set shadowRes(shadowRes: number)         { this._shadowRes = shadowRes;          this.recreateLight(); }
    public set shadowBias(shadowBias: number)       { this._shadowBias = shadowBias;        this.updateLight(); }
    public set shadowBlurSamples(shadowBlurSamples: number) { this._shadowBlurSamples = shadowBlurSamples; this.recreateLight(); }
    public set disableShadowsOnMobile(disableShadowsOnMobile: boolean) { this._disableShadowsOnMobile = disableShadowsOnMobile; this.updateLight(); }

    public get light(): THREE.PointLight | THREE.SpotLight | THREE.DirectionalLight | THREE.HemisphereLight { return this._light!; }

    public get shallCastShadow() {
        return this._castShadow && (!this._disableShadowsOnMobile || !VioRender.mobileCheck)
    }

    public updateLight() {
        switch (this._type) {
            case 'DirectionalLight': {
                let light = this._light as THREE.DirectionalLight;

                light.intensity = this._intensity;
                light.color.copy(this._color);

                break;
            }

            case 'HemisphereLight': {
                let light = this._light as THREE.HemisphereLight;

                light.intensity = this._intensity;
                light.color.copy(this._color);
                light.groundColor.copy(this._groundColor);

                break;
            }

            case 'PointLight': {
                let light = this._light as THREE.PointLight;

                light.intensity = this._intensity;
                light.color.copy(this._color);
                light.distance  = this._distance;
                light.decay     = this._decay;

                break;
            }

            case 'SpotLight': {
                let light = this._light as THREE.SpotLight;

                light.intensity = this._intensity;
                light.color.copy(this._color);
                light.distance  = this._distance;
                light.angle     = this._angle;
                light.penumbra  = this._penumbra;
                light.decay     = this._decay;

                break;
            }
        }

        if (this._light!.castShadow !== undefined) {
            this._light!.castShadow = this.shallCastShadow;
            if (this._light!.castShadow)
                this._updateLightShadow();
        }
    }
}