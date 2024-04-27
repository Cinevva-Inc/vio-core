import { VioHelpers } from '../../Helpers/VioHelpers';
import { VioGenerator } from '../../Helpers/VioGenerator';
import { VioRender } from '../../Singletons/Render/VioRender';
import { VioResources } from '../../Singletons/Resources/VioResources';
import { VioObject } from "../VioObject/VioObject";
import { VioHud } from '../../Singletons/Hud/VioHud';
import { VioScenarios } from '../../Singletons/Scenarios/VioScenarios';
import { THREE, VioEditMode } from '../../../VioCore';
import { Scene } from 'three';

export class VioScene extends Scene
{
    public objects  : Array<VioObject> = [];
    public skybox   :{path:string,object:THREE.Mesh|null};
    public skyboxRotation: THREE.Euler;
    public meta     : any;
    public ambientLight : THREE.AmbientLight;
    public hemisphereLight: THREE.HemisphereLight;
    public directionalLight: THREE.DirectionalLight;

    constructor()
    {
        super();
        this.meta = {};
        this.skybox = { path:'', object:null };
        this.skyboxRotation = new THREE.Euler();
        this.ambientLight  = new THREE.AmbientLight(0xffffff, 0);
        this.hemisphereLight = new THREE.HemisphereLight(0xffffff, 0xbbbbbb, 0);
        this.directionalLight = new THREE.DirectionalLight(0xffffff, 0);
        this.add(this.ambientLight)
        this.add(this.hemisphereLight)
        this.add(this.directionalLight)
    }

    public static async load(url:string, onProgress:(progress:number,status:string,canRender?:boolean)=>void | null, onComplete:()=>void|null, onScene:(scene:VioScene)=>void|null)
    {
        url = await VioResources.getUrl(url)
        let {data} = await VioHelpers.Ajax.getDataAsync(url, 'GET');
        let scene = new VioScene()
        if (onScene)
            onScene(scene)
        await scene.setData(data)
        if (onComplete)
            onComplete()
        return scene
    }

    public getObjectByObjectID(objectID:string): VioObject|null {
        let foundObject: VioObject|null = null;
        this.traverse((object:any) => {
            if (object.objectID == objectID)
                foundObject = object as VioObject
        })
        return foundObject;
    }

    public update(delta: number): void 
    {
        if(this.skybox.object)
        {
            let scale = VioRender.camera.cameraFrustumDistance * 0.8;
            this.skybox.object.scale.set(scale,scale,scale);
            this.skybox.object.position.copy(VioRender.camera.position);
            this.skybox.object.rotation.copy(this.skyboxRotation);
            this.skybox.object.updateMatrixWorld(true);
        }

        for (let object of this.objects) {
            if (object.visible)
                object.update(delta);
        }
    }

    public addObject(object:VioObject)
    {
        const i = this.objects.indexOf(object);
        if (i == -1) {
            this.objects.push(object);
            this.add(object);
            object.scene = this;
            object.editMode = VioEditMode.enabled;
        }
    }

    public traverseObjects(callback: (object:VioObject) => void) {
        let loop = (object:VioObject) => {
            callback(object)
            object.objects.forEach(object => callback(object as VioObject))
        }
        this.objects.forEach(object => loop(object))
    }

    public removeObject(object:VioObject)
    {
        const i = this.objects.indexOf(object);

        if(i != -1)
        {
            this.objects.splice(i,1);
            this.remove(object);
            object.scene = null;
        }
    }
    
    public async setSkybox(url: string) {
        if (this.skybox.object) {
            this.remove(this.skybox.object)
            this.skybox.object = null;
        }

        if (url?.startsWith('https://blockade-platform-production')) {
            let hash = new Uint8Array(await crypto.subtle.digest('SHA-1', new TextEncoder().encode(url)))
                .reduce((output, elem) => (output + ('0' + elem.toString(16)).slice(-2)), '')
            url = `https://app.cinevva.com/uploads/${hash}.png`
        }

        this.skybox.path = url;

        if (this.skybox.path) {
            let skybox = await VioResources.getSkybox(this.skybox.path);
            this.skybox.object = skybox.object;
            this.skybox.object.renderOrder = -1;
            this.add(this.skybox.object)
        }
    }

    public async setData(data: any)
    {
        console.log('scene.setData', data)
        this.meta = data.meta ?? {};

        if (data.skybox)
        {
            this.setSkybox(data.skybox.path ?? data.skybox);
        }

        if (data.skyboxRotation) {
            this.skyboxRotation.set(
                data.skyboxRotation.x,
                data.skyboxRotation.y,
                data.skyboxRotation.z,
                data.skyboxRotation.order)
        }

        if (data.color) {
            VioRender.clearColor = data.color;
        }

        if (data.camera) {
            VioRender.camera.setData(data.camera);
        }

        if (data.hud) {
            VioHud.instance.data = data.hud;
        }

        if (data.scenarios) {
            VioScenarios.setScenariosByData(data.scenarios);
        }

        if (data.objects) {
            await Promise.all(data.objects.map(async (data:any) => {
                try {
                    let object = await VioGenerator.generateObject(data)
                    this.addObject(object)
                }
                catch (ex) {
                    console.error('cannot generate object', ex, {data})
                }
            }))
        }

        if (data.lights) {
            let loader = new THREE.ObjectLoader()
            this.ambientLight.copy(loader.parse(data.lights.ambient) as THREE.AmbientLight)
            this.hemisphereLight.copy(loader.parse(data.lights.hemisphere) as THREE.HemisphereLight)
            this.directionalLight.copy(loader.parse(data.lights.directional) as THREE.DirectionalLight)
        }
        else {
            if (data.ambient) {
                this.ambientLight.color.set(data.ambient.color)
                this.ambientLight.intensity = data.ambient.intensity
            }
            else {
                this.ambientLight.intensity = 0
            }
            if (data.hemisphere) {
                this.hemisphereLight.color.set(data.hemisphere.color)
                this.hemisphereLight.groundColor.set(data.hemisphere.groundColor)
                this.hemisphereLight.intensity = data.hemisphere.intensity
                this.hemisphereLight.position.copy(data.hemisphere.position)
            }
            else {
                this.hemisphereLight.intensity = 0
            }
            if (data.directional) {
                console.log('directional', data.directional)
                this.directionalLight.visible = true
                this.directionalLight.color.set(data.directional.color)
                this.directionalLight.intensity = data.directional.intensity
                this.directionalLight.position.copy(data.directional.position)
                if (data.directional.castShadow) {
                    this.directionalLight.castShadow = true
                    let shadow = this.directionalLight.shadow
                    let shadowRes = data.directional.shadowRes ?? 512
                    shadow.mapSize.width  = data.directional.shadowRes
                    shadow.mapSize.height = data.directional.shadowRes
                    shadow.bias = data.directional.shadowBias ?? 0
                    let camera = shadow.camera as THREE.OrthographicCamera;
                    let shadowSize = data.directional.shadowSize ?? 100
                    camera.top     = shadowSize/2
                    camera.left    = -shadowSize/2
                    camera.right   = shadowSize/2
                    camera.bottom  = -shadowSize/2
                    camera.updateProjectionMatrix();
                    shadow.needsUpdate = true;
                }
            }
            else {
                this.directionalLight.intensity = 0
            }
        }
    }

    public getData() {
        let data: any = {}

        data.type = 'scene';
        data.meta = this.meta;
        data.skybox = this.skybox.path;
        data.skyboxRotation = {
            x: this.skyboxRotation.x,
            y: this.skyboxRotation.y,
            z: this.skyboxRotation.z,
            order: this.skyboxRotation.order,
        };
        data.color = VioRender.clearColor;
        data.camera = VioRender.camera.getData();
        data.hud = VioHud.instance.data;
        data.scenarios = VioScenarios.data;
        data.objects =
            this.objects
                .filter(object => !object.userData.transient)
                .map(object => object.getData())
        data.lights = {
            ambient: this.ambientLight.toJSON(),
            hemisphere: this.hemisphereLight.toJSON(),
            directional: this.directionalLight.toJSON(),
        }
        return data;
    }
}