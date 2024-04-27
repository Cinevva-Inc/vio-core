import { AmbientLight, DirectionalLight, Euler, Object3D, Box3, Matrix4, PerspectiveCamera, Scene, Vector3, WebGLRenderer } from 'three';
import { GLTFLoaderX } from "../../Singletons/Resources/GLTFLoaderX";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { VioHelpers } from '../../Helpers/VioHelpers';
import { VioRender } from '../../Singletons/Render/VioRender';
//@ts-ignore
// import { lozi             } from './../../../Libs/lozi';
import * as lozi from './../../../Libs/LoziImporter/src/index';
import { IvioModel } from '../../Interfaces/IvioModel';


export class VioIconGenerator
{
    private static _instance:VioIconGenerator;

    protected _renderer       :WebGLRenderer;
    protected _camera         :PerspectiveCamera;
    protected _scene          :Scene;
    protected _cont           :Object3D;
    protected _screenSize     :{width:number, height:number, dpi:number};
    protected _cameraTransform:{position:Vector3, rotation:Euler};
    protected _ambientLight   :AmbientLight;
    protected _dirLight       :DirectionalLight;

    private constructor()
    {
        this._camera          = new PerspectiveCamera();
        this._scene           = new Scene();
        this._cont            = new Object3D();
        this._renderer        = new WebGLRenderer({antialias:true, alpha:true});
        this._screenSize      = { width:256, height:256, dpi:1 };
        this._cameraTransform = { position: new Vector3(0,0,1.35), rotation: new Euler(0,0,0)};
        this._ambientLight    = new AmbientLight(0xffffff, 1);
        this._dirLight        = new DirectionalLight(0xffffff, 4);
        this._dirLight.position.set(0,1,1)
        // this._cameraTransform = { position:new Vector3(-0.65,0,1.2), rotation: new Euler(0,-30,0)};

        this._camera.layers.enableAll();

        this._scene.add(this._cont);
        // this._scene.add(this._ambientLight);
        this._scene.add(this._dirLight);
    }

    private _setObjectPosition(obj:Object3D, rotation:number=0)
    {
        // VioHelpers.Mesh.attachBakedGeometry(obj);
        
        this._cont.position.set(0,0,0);
        this._cont.rotation.set(0,0,0);
        this._cont.scale.set(1,1,1);
        this._cont.updateMatrix();
        this._cont.updateMatrixWorld(true);

        this._cont.add(obj);

        obj.position.set(0,0,0);
        obj.rotation.set(0,0,0);
        obj.scale.set(1,1,1);
        obj.updateMatrix();
        obj.updateMatrixWorld(true);

        let bounds = new Box3();
        bounds.setFromObject(this._cont);
        let size = bounds.getSize(new Vector3());
        let center = bounds.getCenter(new Vector3());

        let maxSize = Math.max(size.x, size.y, size.z);
        let scale = 1 / maxSize;

        this._cont.applyMatrix4(new Matrix4().makeTranslation(center.negate()))
        this._cont.applyMatrix4(new Matrix4().makeScale(scale, scale, scale))

        console.log({size})


        if (size.y < Math.max(size.x, size.z) / 4) {
            this._camera.position.y = 0.5;
            this._camera.position.z = 1;
            this._camera.rotation.x = -Math.PI/6;
            if (size.x > size.z)
                this._cont.applyMatrix4(new Matrix4().makeRotationY(-Math.PI/2))
            this._cont.applyMatrix4(new Matrix4().makeRotationY(-Math.PI/4))
        }
        else {
            // if (size.x < size.z)
                // this._cont.applyMatrix4(new Matrix4().makeRotationY(-Math.PI/2))
            // this._cont.applyMatrix4(new Matrix4().makeRotationY(-Math.PI/4))
        }

        console.log({rotation})

        if (rotation)
            this._cont.applyMatrix4(new Matrix4().makeRotationY(rotation))

        this._cont.updateMatrix();
        this._cont.updateMatrixWorld(true);
    }

    private _takeScreenshot(): string
    {
        this._renderer.render( this._scene, this._camera );
        return this._renderer.domElement.toDataURL('image/png');
    }

    public static createIcon(obj:Object3D, rotation:number=0): string
    {
        VioIconGenerator.setSize(
            this.instance._screenSize.width,
            this.instance._screenSize.height,
            this.instance._screenSize.dpi);

        VioIconGenerator.setCameraTransform(
            this.instance._cameraTransform.position,
            this.instance._cameraTransform.rotation);

        obj.updateMatrixWorld(true);

        let matrix = obj.matrixWorld.clone();
        let parent = obj.parent;

        this.instance._setObjectPosition(obj, rotation);

        let image = this.instance._takeScreenshot()

        this.instance._cont.remove(obj);
        matrix.decompose(obj.position,obj.quaternion,obj.scale);

        if(parent)
        {
            parent.attach(obj);
        }
        return image
    }

    public static setCameraTransform(position:Vector3, rotation:Euler)
    {
        this.instance._cameraTransform.position.copy(position);
        this.instance._cameraTransform.rotation.copy(rotation);

        this.instance._camera.position.copy(this.instance._cameraTransform.position);
        this.instance._camera.rotation.set (VioHelpers.Math.degToRad(this.instance._cameraTransform.rotation.x),
                                            VioHelpers.Math.degToRad(this.instance._cameraTransform.rotation.y),
                                            VioHelpers.Math.degToRad(this.instance._cameraTransform.rotation.z));

        this.instance._camera.updateMatrixWorld(true);
    }

    public static setSize(width:number, height:number, dpi:number = 1)
    {
        let inst = this.instance;

        inst._screenSize.width  = width;
        inst._screenSize.height = height;
        inst._screenSize.dpi    = dpi;

        if(inst._renderer)
        {
            inst._renderer.setPixelRatio( dpi );
            inst._renderer.setSize( width, height);
        }

        if(inst._camera)
        { 
            inst._camera.aspect = width / height;
		    inst._camera.updateProjectionMatrix();
        }
    }

    private static get instance():VioIconGenerator
    {
        if(!VioIconGenerator._instance)
        {
            VioIconGenerator._instance = new VioIconGenerator();
        }
        return VioIconGenerator._instance;
    }
}