import ThreeObjectTypes from './ThreeObjectTypes';
import LoziMath         from '../../../Helpers/LoziMath';
import LoziUtils        from './../../../Helpers/LoziUtils';

import ThreeLight       from './../Lights/ThreeLight';
import ThreeMesh        from './../Mesh/ThreeMesh';
import ThreeGeometry    from './../Mesh/ThreeGeometry';
import ThreeAnimations  from '../Animations/ThreeAnimations';
import ThreeObjectCombine from './ThreeObjectCombine';
import ThreeAudio from '../Audio/ThreeAudio';
import Libraries from '../../Libraries';

export default class ThreeObject
{
    static generateObject(data,path)
    {
        var obj = this.createObject(this.getHierarchyObjectByPath(data.objects,path),data);
        this.addObjectsToBones(obj,data);
        this.postAttachProperties(obj,data);


        if(data.tempData)
        {
            if(data.tempData.audio)
            {
                obj.audioListener = data.tempData.audio.listener;
                obj.audioSources  = data.tempData.audio.objects;
            }
            delete data.tempData;
        }
        
        this.setAdditionalFunctionality(obj);

        data.skeletons = {};
        return obj;
    }

    static getHierarchyObjectByPath(obj,path)
    {
        path = path && path.length>0 ? path : "";

        if(path.length > 0)
        {
            let arr  = path.split("/");
            var temp = obj;
            
            for(var num = 0; num < arr.length; num++)
            {
                if(temp)
                {
                    temp = this.getHierarchyObjectByName(temp,arr[num]);
                }
            }
            return temp;
        }
        return obj;
    }

    static getHierarchyObjectByName(object,name)
    {
        if(object)
        {
            if(object.name == name)
            {
                return object;
            }
            
            if(object.children)
            {
                for(var num = 0; num < object.children.length; num++)
                {
                    if(object.children[num].name == name)
                    {
                        return object.children[num];
                    }
                    // var obj = this.getHierarchyObjectByName(object.children[num],name);
                    
                    // if(obj)
                    // {
                    //     return obj;
                    // }
                }
            }
        }
        return null;
    }

    static addObjectsToBones(obj,data)
    {
        var objects = LoziUtils.flattenHierarchy(obj,'children');

        for(var num1 = 0; num1 < objects.length; num1++)
        {
            if(objects[num1].parentBone != undefined)
            {
                for(var num2 = 0; num2 < objects.length; num2++)
                {
                    if(objects[num2].boneID == objects[num1].parentBone)
                    {
                        objects[num2].add(objects[num1]);
                        break;
                    }
                }
            }
        }
    }

    static createObject(obj,data,isReference)
    {
        var ClassType = this.getClassByType(obj.type);

        if(ClassType)
        {
            var created = new ClassType();
            
            if(obj.id)
            {
                created.loziID = obj.id;
            }
            if(obj.parentBoneId)
            {
                created.parentBone = obj.parentBoneId;
            }
            if(obj.name)
            {
                created.name = obj.name;
            }

            if(obj.transform && !isReference)
            {
                if(obj.transform.position)
                {
                    created.position.set(obj.transform.position[0],obj.transform.position[1],obj.transform.position[2]);
                }
                if(obj.transform.rotation)
                {
                    created.quaternion.set(obj.transform.rotation[0],obj.transform.rotation[1],obj.transform.rotation[2],obj.transform.rotation[3]);
                }
                if(obj.transform.scale)
                {
                    created.scale.set(obj.transform.scale[0],obj.transform.scale[1],obj.transform.scale[2]);
                }
            }
            
            if(!(obj.flags && obj.flags.combineMeshes == true))
            {
                this.setProperties(created,obj,data);
                if(obj.children)
                {
                    for(var num = 0; num < obj.children.length; num++)
                    {
                        var child = this.createObject(obj.children[num],data,obj.containsReference);
        
                        if(child)
                        {
                            created.add(child);
                        }
                    }
                }
            }

            return created;
        }
    }

    static setAdditionalFunctionality(obj)
    {
        obj.getObjectByPath = (path)=>
        {
            return this.getHierarchyObjectByPath(obj,path);
        };

        obj.playAudio = (name,vol)=>
        {
            vol = vol !== undefined ? vol : 1;
            
            if(obj.audioSources)
            {
                for(let num = 0; num < obj.audioSources.length; num++)
                {
                    if(obj.audioSources[num].name == name)
                    {
                        obj.audioSources[num].play();
                        obj.audioSources[num].setVolume(vol);
                    }
                }
                
            }
        }

        obj.stopAudio = (name)=>
        {
            if(obj.audioSources)
            {
                for(let num = 0; num < obj.audioSources.length; num++)
                {
                    if(obj.audioSources[num].name == name && obj.audioSources[num].source)
                    {
                        obj.audioSources[num].stop();
                    }
                }
                
            }
        }

        obj.stopAllAudios = (name)=>
        {
            if(obj.audioSources)
            {
                for(let num = 0; num < obj.audioSources.length; num++)
                {
                    if(obj.audioSources[num].source)
                    {
                        obj.audioSources[num].stop();
                    }
                }
                
            }
        }

        obj.setVolumeOnAllSources = (vol)=>
        {
            if(obj.audioSources)
            {
                for(let num = 0; num < obj.audioSources.length; num++)
                {
                    if(obj.audioSources[num].source)
                    {
                        obj.audioSources[num].setVolume(vol);
                    }
                }
                
            }
        }

        obj.pauseAudio = (name)=>
        {
            if(obj.audioSources)
            {
                for(let num = 0; num < obj.audioSources.length; num++)
                {
                    if(obj.audioSources[num].name == name)
                    {
                        obj.audioSources[num].pause();
                    }
                }
                
            }
        }
    }

    static getCombinedObjectsInfo(parent,child,obj,generated,data)
    {
        child     = child     ? child     : new Libraries.ThreeObject.Object3D();
        generated = generated ? generated : {};

        let parentMatrix = parent.matrixWorld.clone();
        if(obj.children)
        {
            for(var num = 0; num < obj.children.length; num++)
            {
                parent.position  .set(0,0,0);
                parent.quaternion.set(0,0,0,0);
                parent.scale     .set(1,1,1);
                
                parent.applyMatrix4(parentMatrix);
                parent.updateMatrixWorld(true);

                let childObj = obj.children[num];
                let gen      = null;
                let matrix   = null;
                if(child)
                {
                    parent.add(child);
                    
                    child.position  .set(0,0,0);
                    child.quaternion.set(0,0,0,0);
                    child.scale     .set(1,1,1);
                }

                if(childObj.materials && childObj.materials[0])
                {
                    let matID = childObj.materials[0];
                    if(!generated[matID])
                    {
                        let mats         = LoziUtils.getArrayOfObjectsByProperty(data.generatedAssets.materials ,"matId" ,obj.children[num].materials);
                        generated[matID] = {material:mats[0],items:[],posSize:0,normSize:0,uv1Size:0,uv2Size:0};
                    }
                    gen = generated[matID];
                }
                if(childObj.transform && !obj.containsReference)
                {
                    if(childObj.transform.position)
                    {
                        child.position.set(childObj.transform.position[0],childObj.transform.position[1],childObj.transform.position[2]);
                    }
                    if(childObj.transform.rotation)
                    {
                        child.quaternion.set(childObj.transform.rotation[0],childObj.transform.rotation[1],childObj.transform.rotation[2],childObj.transform.rotation[3]);
                    }
                    if(childObj.transform.scale)
                    {
                        child.scale.set(childObj.transform.scale[0],childObj.transform.scale[1],childObj.transform.scale[2]);
                    }
                }
                if(childObj.meshID)
                {
                    child.geometry = LoziUtils.getObjectByProperty (data.generatedAssets.geometries,"meshID",childObj.meshID);
                }
                child.updateMatrixWorld(true);

                matrix = child.matrixWorld.clone();
                if(gen && child.geometry)
                {
                    let genObj = {
                                    geometry:child.geometry,
                                    posSize :child.geometry.attributes.position.array.length,
                                    normSize:child.geometry.attributes.normal.array.length,
                                    uv1Size :child.geometry.attributes.uv.array.length,
                                    uv2Size :(child.geometry.attributes.uv2 ? child.geometry.attributes.uv2.array.length : child.geometry.attributes.uv.array.length),
                                    matrix  :matrix
                                 };

                    gen.posSize  += genObj.posSize;
                    gen.normSize += genObj.normSize;
                    gen.uv1Size  += genObj.uv1Size;
                    gen.uv2Size  += genObj.uv2Size;

                    gen.items.push(genObj);

                }

                parent.position  .set(0,0,0);
                parent.quaternion.set(0,0,0,0);
                parent.scale     .set(1,1,1);
                parent.applyMatrix4(matrix);
                parent.updateMatrixWorld(true);
                
                // this.getCombinedObjectsInfo(child,null,childObj,generated,data);
                this.getCombinedObjectsInfo(parent,child,childObj,generated,data);
            }
        }
        if(child.parent)
        {
            child.parent.remove(child);
        }
        return generated;
    }

    static setProperties(created,obj,data)
    {
        /*
        if(obj.flags && obj.flags.combineMeshes)
        {
            let generated = this.getCombinedObjectsInfo(created,null,obj,null,data);
            
            created.position  .set(0,0,0);
            created.quaternion.set(0,0,0,0);
            created.scale     .set(1,1,1);

            for(let key in generated)
            {
                generated[key].id = obj.id;
                let geometry = ThreeGeometry.combineGeometry(generated[key]);
                let child    = new Libraries.ThreeObject.Mesh(geometry,generated[key].material);
                created.add(child);
            }
        }
        */
        if(obj.meshID)
        {
            created.meshGeometryID = obj.meshID;
            created.geometry       = LoziUtils.getObjectByProperty        (data.generatedAssets.geometries,"meshID",obj.meshID);
            created.material       = LoziUtils.getArrayOfObjectsByProperty(data.generatedAssets.materials ,"matId" ,obj.materials);

            if(created.geometry.bones)
            {
                created.add (created.geometry.bones.root);
                created.bind(created.geometry.bones);
                
                for(var num = 0; num < created.material.length; num++)
                {
                    created.material[num].skinning = true;
                }
            }
            // if(Object.values(created.geometry.)>0)
            {
                for(var num = 0; num < created.material.length; num++)
                {
                    created.material[num].morphTargets = true;
                }

                if(created.updateMorphTargets)
                {
                    created.updateMorphTargets();
                }
            }
        }
        if(obj.animationID)
        {
            created.animationID = obj.animationID;
        }
        if(obj.lightData)
        {
            ThreeLight.setLightData(created,obj.lightData);
        }
        // if(obj.cameraData)
        // {
        //     Lozi.Static.Camera.setCameraData(created,obj.cameraData);
        // }

        // if(obj.scriptProperties)
        // {
        //     created.properties = obj.scriptProperties;
        //     properties.push(created);
        // }

        // if(obj.collider)
        // {
        //     created.collider = obj.collider;
        //     colliders.push(created.collider);
        // }

        if(obj.sound)
        {
            if(!data.tempData)
            {
                data.tempData = {};
            }
            if(!data.tempData.audio)
            {
                data.tempData.audio = {};
                data.tempData.audio.listener = ThreeAudio.createListener();
                data.tempData.audio.objects  = [];
            }

            created.sound      = obj.sound;
            created.sound.clip = LoziUtils.getObjectByProperty(data.generatedAssets.sounds,"id",created.sound.clip);

            if(created.sound && created.sound.clip)
            {
                created.sound      = ThreeAudio.createSource(data.tempData.audio.listener,created.sound,created);
                data.tempData.audio.objects.push(created.sound);
            }
        }

        if(created.geometry)
        {
            created.castShadow    = (created.geometry.castShadow    == false ? false : true);
            created.receiveShadow = (created.geometry.receiveShadow == false ? false : true);
        }

        // if(obj.children && obj.children.length>0)
        // {
        //     for(var num = 0; num < obj.children.length; num++)
        //     {
        //         createObject(obj.children[num],created);
        //     }
        // }

        // objects.push(created);

        // if(obj.type == Lozi.Static.Object.types.SpotLight 		  ||
        //    obj.type == Lozi.Static.Object.types.DirectionalLight ||
        //    obj.type == Lozi.Static.Object.types.PointLight 	  ||
        //     obj.type == Lozi.Static.Object.types.AreaLight)
        //     {
        //         lights.push(created);
        //     }
        // if(obj.type == Lozi.Static.Object.types.OrthographicCamera ||
        //     obj.type == Lozi.Static.Object.types.PerspectiveCamera)
        //     {
        //         cameras.push(createds);
        //     }
    }

    static postAttachProperties(obj,data)
    {
        if(obj)
        {
            // if(obj.geometry.bones)
            {
                // obj.objects = this.flattenHierarchy(obj);
            }
            if(obj.animationID)
            {
                // obj.objects = this.flattenHierarchy(obj);
                let animData  = ThreeAnimations.setAnimationData(obj,data);
                obj.animation = animData.mixer;
                obj.clips     = animData.clips;
                // window.mix    = obj.animation;
                // window.targ   = obj;
            }
            for(var num = 0; num < obj.children.length; num++)
            {
                this.postAttachProperties(obj.children[num],data);
            }
        }
    }

    static applyFlagsToObjects(obj,data)
    {
        this.applyObjectReferences(obj,obj,data);
        this.combineObjectGeometries(obj,data);
    }

    static applyObjectReferences(obj,root,data,refsBuffer)
    {
        refsBuffer = refsBuffer ? refsBuffer : this.flattenHierarchy(root);

        if(obj.children && !(obj.flags && obj.flags.reference))
        {
            for(var num = 0; num < obj.children.length; num++)
            {
                this.applyObjectReferences(obj.children[num],root,data,refsBuffer);
            }
        }

        if(obj.flags && obj.flags.reference)
        {
            let reference = refsBuffer[obj.flags.reference];

            if(reference)
            {
                if(!obj.children)
                {
                    obj.children = [];
                }
                obj.children.push(reference);
                obj.containsReference = true;
            }
            obj.flags.reference     = null;
            obj.flags.combineMeshes = false;
        }
    }

    static flattenHierarchy(hier,obj)
    {
        obj = obj ? obj : {};

        if(hier.id)
        {
            if(!obj[hier.id])
            {
                obj[hier.id] = hier;
            }
        }
        if(hier.children)
        {
            for(let num = 0; num < hier.children.length; num++)
            {
                this.flattenHierarchy(hier.children[num],obj);
            }
        }
        return obj;
    }

    static combineGeometries(arr,obj,material)
    {
        return ThreeObjectCombine.combineGeometries(arr,obj,material);
    }

    static combineObjectsAsOne(arr,obj,material)
    {
        return ThreeObjectCombine.combineObjectsAsOne(arr,obj,material);
    }

    static combineObjectGeometries(obj,data)
    {
        if(obj.children && !(obj.flags && obj.flags.combineMeshes == true))
        {
            for(var num = 0; num < obj.children.length; num++)
            {
                this.combineObjectGeometries(obj.children[num],data);
            }
        }
        if(obj.flags && obj.flags.combineMeshes == true)
        {
            let temp      = this.createObject(obj,data);
            let generated = this.getCombinedObjectsInfo(temp,null,obj,null,data);

            obj.flags.combineMeshes = false;
            obj.children  = [];

            for(let key in generated)
            {
                generated[key].id = obj.id;

                let geometry = ThreeGeometry.combineGeometry(generated[key]);
                let newObj   = 
                {
                    name     :generated[key].material.name,
                    type     :ThreeObjectTypes.Mesh,
                    materials:[generated[key].material.matId],
                    // meshID   :data.generatedAssets.geometries[2].meshID
                    meshID   :geometry.meshID
                };
                data.generatedAssets.geometries.push(geometry);
                obj.children.push(newObj);
            }
        }
    }

    static getClassByType(type)
    {
        switch(type)
        {
            case ThreeObjectTypes.Object            :
            case ThreeObjectTypes.Object3D          :
            case ThreeObjectTypes.AnimationObject   :{return Libraries.ThreeObject.Object3D;          }
            case ThreeObjectTypes.Scene             :{return Libraries.ThreeObject.Scene;             }
            case ThreeObjectTypes.SpotLight         :{return Libraries.ThreeObject.SpotLight;         }
            case ThreeObjectTypes.DirectionalLight  :{return Libraries.ThreeObject.DirectionalLight;  }
            case ThreeObjectTypes.PointLight        :{return Libraries.ThreeObject.PointLight;        }
            case ThreeObjectTypes.AreaLight         :{return Libraries.ThreeObject.AmbientLight;      }
            case ThreeObjectTypes.PerspectiveCamera :{return Libraries.ThreeObject.PerspectiveCamera; }
            case ThreeObjectTypes.OrthographicCamera:{return Libraries.ThreeObject.OrthographicCamera;}
            case ThreeObjectTypes.SkinnedMesh       :{return Libraries.ThreeObject.SkinnedMesh;       }
            // case ThreeObjectTypes.SkinnedMesh       :{return Libraries.ThreeObject.Mesh;       } 
            // case ThreeObjectTypes.Mesh              :{return Libraries.ThreeObject.InstancedMesh;              }
            case ThreeObjectTypes.Mesh              :{return Libraries.ThreeObject.Mesh;              }
        }
        return undefined;
    }
}