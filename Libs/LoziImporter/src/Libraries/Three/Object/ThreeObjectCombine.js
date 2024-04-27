import ThreeObjectTypes from './ThreeObjectTypes';
import LoziMath         from '../../../Helpers/LoziMath';
import LoziUtils        from '../../../Helpers/LoziUtils';

import ThreeLight       from '../Lights/ThreeLight';
import ThreeMesh        from '../Mesh/ThreeMesh';
import ThreeGeometry    from '../Mesh/ThreeGeometry';
import ThreeAnimations  from '../Animations/ThreeAnimations';
import Libraries from '../../Libraries';

export default class ThreeObjectCombine
{
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
                
                this.getCombinedObjectsInfo(parent,child,childObj,generated,data);
            }
        }
        if(child.parent)
        {
            child.parent.remove(child);
        }
        return generated;
    }
    
    static getObjectsInfo2(parent,child,obj,generated,data)
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
                        child.position.set(childObj.transform.position.x,childObj.transform.position.y,childObj.transform.position.z);
                    }
                    if(childObj.transform.rotation)
                    {
                        child.quaternion.set(childObj.transform.rotation.x,childObj.transform.rotation.y,childObj.transform.rotation.z,childObj.transform.rotation.w);
                    }
                    if(childObj.transform.scale)
                    {
                        child.scale.set(childObj.transform.scale.x,childObj.transform.scale.y,childObj.transform.scale.z);
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
            }
        }
        if(child.parent)
        {
            child.parent.remove(child);
        }
        return generated;
    }

    static getObjectsInfo2(parent,arr,overrideMaterial)
    {
        let buffer       = new Libraries.ThreeObject.Vector3();
        let generated    = {};
        let parentPar    = parent.parent;

        parent.updateMatrixWorld(true);
        let parentMatrix = parent.matrixWorld.clone();
        
        if(parentPar)
        {
            parentPar.remove(parent);
        }
        parent.matrixWorld.identity();
        parent.updateMatrixWorld(true);

        for(var num = 0; num < arr.length; num++)
        {
            let gen       = null;
            let matrix    = null;
            let obj       = arr[num];
            let objParent = obj.parent;
            let material  = overrideMaterial != undefined && overrideMaterial !=null ? overrideMaterial : obj.material[0];
            obj.getWorldScale(buffer);
            let flippedX  = buffer.x<0;
            let flippedY  = buffer.y<0;
            let flippedZ  = buffer.z<0;
            let flipped   = buffer.x<0 || buffer.y<0 || buffer.z<0;

            obj.updateMatrixWorld(true);
            matrix = obj.matrixWorld.clone();
            parent.add(obj);
            obj.matrixWorld.copy(matrix);
            obj.updateMatrixWorld(true);

            if(!generated[material.uuid])
            {
                generated[material.uuid] = {material:material,items:[],posSize:0,normSize:0,uv1Size:0,uv2Size:0};
            }
            gen = generated[material.uuid];

            if(gen && obj.geometry)
            {
                let genObj = {
                                geometry:obj.geometry,
                                posSize :obj.geometry.attributes.position.array.length,
                                normSize:obj.geometry.attributes.normal.array.length,
                                uv1Size :obj.geometry.attributes.uv.array.length,
                                uv2Size :(obj.geometry.attributes.uv2 ? obj.geometry.attributes.uv2.array.length : obj.geometry.attributes.uv.array.length),
                                matrix  :matrix,
                                flippedX:flippedX,
                                flippedY:flippedY,
                                flippedZ:flippedZ,
                                flipped:flipped
                             };

                gen.posSize  += genObj.posSize;
                gen.normSize += genObj.normSize;
                gen.uv1Size  += genObj.uv1Size;
                gen.uv2Size  += genObj.uv2Size;

                gen.items.push(genObj);
            }
            objParent.add(obj);
            obj.matrixWorld.copy(matrix);
            obj.updateMatrixWorld(true);
        }
        if(parentPar)
        {
            parentPar.add(parent);
        }
        parent.matrixWorld.copy(parentMatrix);
        parent.updateMatrixWorld(true);
        return generated;
    }

    static getObjectsInfo3(parent,arr,overrideMaterial)
    {
        let buffer       = new Libraries.ThreeObject.Vector3();
        let generated    = {};
        let parentPar    = parent.parent;

        parent.updateMatrixWorld(true);
        let parentMatrix = parent.matrixWorld.clone();
        
        if(parentPar)
        {
            parentPar.remove(parent);
        }
        parent.matrixWorld.identity();
        parent.updateMatrixWorld(true);

        for(var num = 0; num < arr.length; num++)
        {
            let gen       = null;
            let matrix    = null;
            let obj       = arr[num];
            let objParent = obj.parent;
            let material  = overrideMaterial != undefined && overrideMaterial !=null ? overrideMaterial : obj.material[0];
            obj.getWorldScale(buffer);
            let flippedX  = buffer.x<0;
            let flippedY  = buffer.y<0;
            let flippedZ  = buffer.z<0;
            let flipped   = buffer.x<0 || buffer.y<0 || buffer.z<0;

            obj.updateMatrixWorld(true);
            matrix = obj.matrixWorld.clone();
            parent.add(obj);
            obj.matrixWorld.copy(matrix);
            obj.updateMatrixWorld(true);

            if(!generated[material.uuid])
            {
                generated[material.uuid] = {material:material,items:[],posSize:0,normSize:0,uv1Size:0,uv2Size:0};
            }
            gen = generated[material.uuid];

            if(gen && obj.geometry)
            {
                let genObj = {
                                geometry:obj.geometry,
                                posSize :obj.geometry.attributes.position.array.length,
                                normSize:obj.geometry.attributes.normal.array.length,
                                uv1Size :obj.geometry.attributes.uv.array.length,
                                uv2Size :(obj.geometry.attributes.uv2 ? obj.geometry.attributes.uv2.array.length : obj.geometry.attributes.uv.array.length),
                                matrix  :matrix,
                                flippedX:flippedX,
                                flippedY:flippedY,
                                flippedZ:flippedZ,
                                flipped:flipped
                             };

                gen.posSize  += genObj.posSize;
                gen.normSize += genObj.normSize;
                gen.uv1Size  += genObj.uv1Size;
                gen.uv2Size  += genObj.uv2Size;

                gen.items.push(genObj);
            }
            objParent.add(obj);
            obj.matrixWorld.copy(matrix);
            obj.updateMatrixWorld(true);
        }
        if(parentPar)
        {
            parentPar.add(parent);
        }
        parent.matrixWorld.copy(parentMatrix);
        parent.updateMatrixWorld(true);
        return generated;
    }

    static getObjectsInfo(arr,overrideMaterial)
    {
        let buffer       = new Libraries.ThreeObject.Vector3();
        let generated    = {};
        
        for(var num = 0; num < arr.length; num++)
        {
            arr[num].getWorldScale(buffer);

            let gen       = null;
            let obj       = arr[num];
            let material  = overrideMaterial != undefined && overrideMaterial !=null ? overrideMaterial : obj.material[0];
            let flipped   = buffer.x<0 || buffer.y<0 || buffer.z<0;
            
            obj.updateMatrix ();
            obj.updateMatrixWorld(true);

            if(!generated[material.uuid])
            {
                generated[material.uuid] = {material:material,items:[],posSize:0,normSize:0,uv1Size:0,uv2Size:0};
            }
            gen = generated[material.uuid];

            if(gen && obj.geometry)
            {
                let genObj = {
                                geometry:obj.geometry,
                                posSize :obj.geometry.attributes.position.array.length,
                                normSize:obj.geometry.attributes.normal.array.length,
                                uv1Size :obj.geometry.attributes.uv.array.length,
                                uv2Size :(obj.geometry.attributes.uv2 ? obj.geometry.attributes.uv2.array.length : obj.geometry.attributes.uv.array.length),
                                matrix  :obj.matrixWorld,
                                flipped :flipped
                             };
                gen.posSize  += genObj.posSize;
                gen.normSize += genObj.normSize;
                gen.uv1Size  += genObj.uv1Size;
                gen.uv2Size  += genObj.uv2Size;

                gen.items.push(genObj);
            }
        }
        return generated;
    }
    
    static getAllMeshes(arr,meshes)
    {
        meshes = meshes ? meshes : [];
        if(arr)
        {
            for(let num = 0; num < arr.length; num++)
            {
                if(arr[num])
                {
                    if(arr[num].geometry)
                    {
                        meshes.push(arr[num]);
                    }
                    this.getAllMeshes(arr[num].children,meshes);
                }
            }
        }
        return meshes;
    }

    static combineGeometries(arr,obj,material)
    {
        obj           = obj ? obj : new Libraries.ThreeObject.Object3D();
        let meshes    = this.getAllMeshes(arr);

        let generated = this.getObjectsInfo(meshes,material);

        for(let key in generated)
        {
            let geometry = ThreeGeometry.combineGeometry(generated[key]);
            let newObj   = new Libraries.ThreeObject.Mesh(geometry,generated[key].material);
            newObj.isCombinedMesh = true;
            obj.add(newObj);
        }
        return obj;
    }

    static combineObjectsAsOne(arr,material)
    {
        if(material)
        {
            let meshes    = this.getAllMeshes(arr);
    
            let generated = this.getObjectsInfo(meshes,material);
    
            for(let key in generated)
            {
                let geometry = ThreeGeometry.combineGeometry(generated[key]);
                let newObj   = new Libraries.ThreeObject.Mesh(geometry,generated[key].material);
                
                return newObj;
            }
        }
        return null;
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
                    meshID   :geometry.meshID
                };
                data.generatedAssets.geometries.push(geometry);
                obj.children.push(newObj);
            }
        }
    }
}