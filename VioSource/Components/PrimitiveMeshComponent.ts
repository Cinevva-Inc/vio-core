import { Box3,  BufferGeometry, BoxGeometry, Material, Mesh, MeshStandardMaterial, MeshMatcapMaterial, PlaneGeometry, SphereGeometry, Vector3 } from "three";
import { VioObject          } from "../Objects/VioObject/VioObject";
import { VioResources } from "../Singletons/Resources/VioResources";
import { VioComponent } from "./Base/VioComponent";

export type PrimitiveMeshComponentArgs = {type: 'Box' | 'Plane' | 'Sphere', modelSize:number,opacity:number};

export class PrimitiveMeshComponent extends VioComponent
{
    protected mesh  :Mesh|null     = null;
    protected mat   :Material|null = null;
    protected params:PrimitiveMeshComponentArgs|null=null;

    constructor()
    {
        super('PrimitiveMeshComponent');
    }

    async _createGeometry()
    {
        let geometry:BufferGeometry|null = null;
        let modelSize:number = this.params!.modelSize !== undefined ? this.params!.modelSize : 1;

        switch(this.params!.type)
        {
            case 'Box'   :{ geometry = new BoxGeometry   ( modelSize, modelSize, modelSize ); break; }
            case 'Plane' :{ geometry = new PlaneGeometry ( modelSize, modelSize );            break; }
            case 'Sphere':{ geometry = new SphereGeometry( modelSize);                        break; }
        }

        if(geometry)
        {
            this.mat  = new MeshStandardMaterial( {color: 0xffffff,transparent:true, opacity:this.params!.opacity});
            this.mesh = new Mesh( geometry, this.mat );

            if(this.object)
            {
                this.object.add(this.mesh);
            }
        }
    }

    get object() { return super.object }
    public set object(object: VioObject|null) {
        if (this.object && this.mesh)
            this.object.remove(this.mesh);
        super.object = object
        if (this.object && this.mesh)
            this.object.add(this.mesh);
    }

    public setData(data:any)
    {
        this.params = data;
        this._createGeometry();
    }

    public getData():any
    {
        let obj  = super.getData() as any;

        obj.type = this.params!.type;
        obj.size = this.params!.modelSize !== undefined ? this.params!.modelSize : 1;

        return obj;
    }

    public get meshObject()
    {
        return this.mesh;
    }
}