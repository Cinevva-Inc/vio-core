import Libraries from '../../Libraries';
import LoziUtils     from './../../../Helpers/LoziUtils';
import ThreeGeometry from './ThreeGeometry';
import ThreeMeshSkin from './ThreeMeshSkin';

export default class ThreeMesh
{
    static parseGeometries(meshes,data)
    {
        var geometries = [];
        if(meshes)
        {
            for(var num = 0; num < meshes.length; num++)
            {
                if(meshes[num])
                {
                    var geom  = ThreeGeometry.generateMeshGeometry(meshes[num]);
                    var bones = ThreeMeshSkin.generateSkeletonByID(meshes[num],data);
                    if(meshes[num].skin)
                    {
                        ThreeMeshSkin.generateSkin(geom,meshes[num]);
                    }
                    if(meshes[num].morph)
                    {
                        // ThreeMeshSkin.generateBlendShapeData(geom,meshes[num]);
                    }
                    if(bones)
                    {
                        geom.bones = bones;
                    }
                    
                    geometries.push(geom);
                }
            }
        }
        return geometries;
    }

    // static generateBlendShapeData(geometry,geomzData)
    // {
    //     var morphData = geomzData.morph.blendShapes;

    //     for (var num1 = 0; num1 < morphData.length; num1++)
    //     {
    //         geometry.morphTargets[num1]			 = {};
    //         geometry.morphTargets[num1].name     = morphData[num1].name;
    //         geometry.morphTargets[num1].vertices = [];

    //         var blendShape   = morphData[num1];
    //         var geometryData = this.generateGeometry(blendShape.name,blendShape.vertices,geomzData.geometry.normals,geomzData.geometry.uv,geomzData.geometry.faces);

    //         for(var num2 = 0; num2 < geometryData.vertices.length; num2 += 3 )
    //         {
    //             var vertex = new Libraries.ThreeObject.Vector3(geometryData.vertices[num2],geometryData.vertices[num2+1],geometryData.vertices[num2+2]);

    //             geometry.morphTargets[num1].vertices.push(vertex);
    //         }
    //     }
    //     return geometry;
    // }

    
    static createMeshByGeometryID(id,materialIDs,data)
    {
        var mesh;
        var material;
        var materials = [];
        var geometry = LoziUtils.getObjectByProperty(data.geometries,"meshID",id);

        if(materialIDs)
        {
            for(var num = 0; num < materialIDs.length; num++)
            {
                var mat = LoziUtils.getObjectByProperty(data.materials,"matId",materialIDs[num]);
                if(mat)
                {
                    materials.push(mat);
                }
            }
            // material = (materials.length>1) ? new Libraries.ThreeObject.MultiMaterial(materials) : materials[0];
            material = (materials.length>1) ? materials : materials[0];
        }


        if(geometry)
        {
            if(geometry.hasMorph==false && geometry.hasSkin==false)
            {
                mesh = new Libraries.ThreeObject.Mesh(geometry,material);
            }
            else
            {
            	mesh = new Libraries.ThreeObject.SkinnedMesh(geometry,material);
                
            	// var skeleton = new Libraries.ThreeObject.Skeleton( geometry.bones );
            	// var rootBone = skeleton.bones[ 0 ];
            	// mesh.add( rootBone );
            	// mesh.bind( skeleton );
                
            	// for(var num = 0; num < materials.length; num++)
            	// {
            	// 	materials[num].skinning 	= geometry.hasSkin;
            	// 	materials[num].morphTargets = geometry.hasMorph;
            	// }

            }
            if(geometry.receiveShadow)
            {
                mesh.receiveShadow = geometry.receiveShadow;
            }
            if(geometry.castShadow)
            {
                mesh.castShadow    = geometry.castShadow;
            }
        }
        return mesh;
    }

    static createMeshByGeometryID2(id,materialIDs,data)
    {
        var mesh;
        var material;
        var materials = [];
        var geometry = LoziUtils.getObjectByProperty(data.geometries,"meshID",id);

        if(materialIDs)
        {
            for(var num = 0; num < materialIDs.length; num++)
            {
                var mat = LoziUtils.getObjectByProperty(data.materials,"matId",materialIDs[num]);
                if(mat)
                {
                    materials.push(mat);
                }
            }
            // material = (materials.length>1) ? new Libraries.ThreeObject.MultiMaterial(materials) : materials[0];
            material = (materials.length>1) ? materials : materials[0];
        }


        if(geometry)
        {
            if(geometry.hasMorph==false && geometry.hasSkin==false)
            {
                mesh = new Libraries.ThreeObject.Mesh(geometry,material);
            }
            else
            {
            	mesh = new Libraries.ThreeObject.SkinnedMesh(geometry,material);
                
            	// var skeleton = new Libraries.ThreeObject.Skeleton( geometry.bones );
            	// var rootBone = skeleton.bones[ 0 ];
            	// mesh.add( rootBone );
            	// mesh.bind( skeleton );
                
            	// for(var num = 0; num < materials.length; num++)
            	// {
            	// 	materials[num].skinning 	= geometry.hasSkin;
            	// 	materials[num].morphTargets = geometry.hasMorph;
            	// }

            }
            if(geometry.receiveShadow)
            {
                mesh.receiveShadow = geometry.receiveShadow;
            }
            if(geometry.castShadow)
            {
                mesh.castShadow    = geometry.castShadow;
            }
        }
        return mesh;
    }

    // static combineMeshes(obj)
    // {
    //     var merged   = [];
    //     var buffered = [];
    //     var meshCont = new Libraries.ThreeObject.Object3D();
    //     for(var num = 0; num < obj.objects().length; num++)
    //     {
    //         obj.objects()[num].updateMatrixWorld(true);
    //     }

    //     for(var num1 = 0; num1 < obj.materials().length; num1++)
    //     {
    //         var meshFaceMaterial = new Libraries.ThreeObject.MeshFaceMaterial([obj.materials()[num1]]);

    //         var mergeGeometry = new Libraries.ThreeObject.Geometry();

    //         for(var num2 = 0; num2 < obj.meshes().length; num2++)
    //         {
    //             if(obj.meshes()[num2].material == obj.materials()[num1])
    //             {
    //                 var matrix = obj.meshes()[num2].matrixWorld;
    //                 var geom   = obj.meshes()[num2].geometry;

    //                 if(geom.attributes)
    //                 {
    //                     geom = new Libraries.ThreeObject.Geometry().fromBufferGeometry(geom);
    //                     buffered.push(geom);
    //                 }
    //                 mergeGeometry.merge(geom,matrix);
    //             }
    //             }
    //             var mergedMesh  = new Libraries.ThreeObject.Mesh(mergeGeometry, meshFaceMaterial);
    //             mergedMesh.name = "Combined-"+obj.materials()[num1].name;
    //             merged.push(mergedMesh);
    //             meshCont.add( mergedMesh );
    //     }
    //     Lozi.Utils.clearArray(buffered,Lozi.Static.Geometry.disposeGeometry,1);
    //     Lozi.Utils.clearArray(obj.meshes(),Lozi.Static.Geometry.disposeMesh,1,['remove','children']);

    //     meshCont.name = "Combined-Meshes";
    //     obj.add(meshCont);

    //     return merged;
    // }

    // static disposeMesh(obj)
    // {
    //     if(obj.parent)
    //     {
    //         obj.parent.remove(obj);
    //     }
    // }

    // static disposeGeometry(obj)
    // {
    //     Lozi.Libraries.object().Geometry.disposeGeometry(obj);
    // }
}