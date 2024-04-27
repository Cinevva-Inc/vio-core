import Libraries from "../../Libraries";
import LoziUtils from "./../../../Helpers/LoziUtils";

export default class ThreeMeshSkin
{
    static generateSkeletonByID(objInfo,data)
    {
        if(objInfo.skin)
        {
            if(objInfo.skin.bones)
            {
                if(!data.skeletons)
                {
                    data.skeletons = {};
                }
                // if(data.skeletons[objInfo.skin.bones])
                {
                    // return data.skeletons[objInfo.skin.bones];
                }
                var bonesData = LoziUtils.getObjectByProperty(data.assets.bones ,"id",objInfo.skin.bones);
                
                if(!data.skeletons[objInfo.skin.bones])
                {
                    data.skeletons[objInfo.skin.bones] = this.generateSkeleton(bonesData);
                }
                return data.skeletons[objInfo.skin.bones];


                /////// test ^^^^^^
                if(bonesData)
                {
                    return this.generateSkeleton(bonesData);
                }
            }
        }
        return undefined;
    }

    static generateSkinData(geomData)
    {
        var influencesPerVertex = 4;
        var weights = [];
        var indices = [];
        
        var geomWeights = [];
        var geomIndices = [];

        for(var num1 = 0; num1 < geomData.geometry.faces.length; num1++ )
        {
            for(var num2 = 0; num2 < geomData.geometry.faces[num1].length; num2++ )
            {
                var index  = parseInt(geomData.geometry.faces[num1][num2]);
                var weight = ((index>=0)?index:index+geomData.skin.skinWeights.length/4)*4;
                var indice = ((index>=0)?index:index+indices.length/4)*4;

                weights.push(geomData.skin.skinWeights[weight],geomData.skin.skinWeights[weight+1],geomData.skin.skinWeights[weight+2],geomData.skin.skinWeights[weight+3]);
                indices.push(geomData.skin.skinIndices[indice],geomData.skin.skinIndices[indice+1],geomData.skin.skinIndices[indice+2],geomData.skin.skinIndices[indice+3]);
            }
        }

        if (weights && weights.length>0)
        {
            for ( var i = 0, l = weights.length; i < l; i += influencesPerVertex )
            {
                var x =                               	 weights[ i ];
                var y = (weights[ i + 1 ]!==undefined) ? weights[ i + 1 ] : 0;
                var z = (weights[ i + 2 ]!==undefined) ? weights[ i + 2 ] : 0;
                var w = (weights[ i + 3 ]!==undefined) ? weights[ i + 3 ] : 0;

                geomWeights.push(x, y, z, w);
            }
        }

        if (indices && indices.length>0)
        {
            for ( var i = 0, l = indices.length; i < l; i += influencesPerVertex )
            {
                var a =                               indices[ i ];
                var b = ( influencesPerVertex > 1 ) ? indices[ i + 1 ] : 0;
                var c = ( influencesPerVertex > 2 ) ? indices[ i + 2 ] : 0;
                var d = ( influencesPerVertex > 3 ) ? indices[ i + 3 ] : 0;

                geomIndices.push(a, b, c, d);
            }
        }

        return {weights:new Libraries.ThreeObject.Float32BufferAttribute(geomWeights,4),indices:new Libraries.ThreeObject.Uint16BufferAttribute(geomIndices,4)};
    }
    
    static generateSkeleton(bonesData)
    {
        var bones    = [];
        var root     = null;
        var bonesArr = bonesData.bones;
        for(var num = 0; num < bonesArr.length; num++)
        {
            var bone = new Libraries.ThreeObject.Bone();
            bone.boneID      = bonesArr[num].id;
            bone.name        = bonesArr[num].name;
            bone.parentIndex = bonesArr[num].parent; 
            
            bone.position  .set(bonesArr[num].pos [0],bonesArr[num].pos [1],bonesArr[num].pos [2]);
            bone.scale     .set(bonesArr[num].scl [0],bonesArr[num].scl [1],bonesArr[num].scl [2]);
            bone.quaternion.set(bonesArr[num].rotq[0],bonesArr[num].rotq[1],bonesArr[num].rotq[2],bonesArr[num].rotq[3]);
            
            bones.push(bone);
        }

        for(var num = 0; num < bones.length; num++)
        {
            if(bones[num].parentIndex>=0)
            {
                bones[bones[num].parentIndex].add(bones[num]);
            }
            else
            {
                root = bones[num];
            }
        }
        var skeleton  = new Libraries.ThreeObject.Skeleton(bones);
        skeleton.skeletonID = bonesData.id;
        skeleton.root = root;

        return skeleton;
    }

    static generateSkin(geometry,geomData)
    {
        var skinData = this.generateSkinData(geomData);
        
        geometry.setAttribute( 'skinIndex' , skinData.indices);
        geometry.setAttribute( 'skinWeight', skinData.weights);
    }

    static generateBlendShapeData(geometry,geomData)
    {
        var morphData = geomData.morph.blendShapes;

        geometry.morphAttributes.position = [];

        for (var num1 = 0; num1 < morphData.length; num1++)
        {
            var geometryData = Geometry.generateGeometry(morphData[num1].name,morphData[num1].vertices,geomData.geometry.normals,geomData.geometry.uv,geomData.geometry.faces);

            var attr  = new Libraries.ThreeObject.Float32BufferAttribute(geometryData.vertices, 3 );
            attr.name = morphData[num1].name;
            geometry.morphAttributes.position[num1] = attr;
        }
        return geometry;
    }
}