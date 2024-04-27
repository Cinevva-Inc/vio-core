import Libraries from "../../Libraries";

export default class ThreeGeometry
{
    static generateMeshGeometry(objInfo)
    {
        var geometry;
        if(objInfo.geometry)
        {
            var geometryData = this.generateGeometry(objInfo.name,
                                                     objInfo.geometry.vertices,
                                                     objInfo.geometry.normals,
                                                     objInfo.geometry.uv,
                                                     objInfo.geometry.faces);

            geometry = new Libraries.ThreeObject.BufferGeometry();
            geometry.setAttribute('position',new Libraries.ThreeObject.BufferAttribute(new Float32Array(geometryData.vertices),3));

            if(geometryData.normals.length>0){geometry.setAttribute('normal',new Libraries.ThreeObject.BufferAttribute(new Float32Array(geometryData.normals),3));}

            if(geometryData.uvs.length>0)
            {
                for(var num = 0; num < geometryData.uvs.length; num++)
                {
                    var numbr = (num>0) ? num+1 : "";
                    geometry.setAttribute('uv'+numbr,new Libraries.ThreeObject.BufferAttribute(new Float32Array(geometryData.uvs[num]),2));
                }
            }

            var count = 0;
            for(var num = 0; num < objInfo.geometry.faces.length; num++ )
            {
                geometry.addGroup(count,objInfo.geometry.faces[num].length,num);
                count += objInfo.geometry.faces[num].length;
            }
        }

        // geometry.hasSkin  = false;
        // geometry.hasMorph = false;
        // if(objInfo.skin || objInfo.morph)
        // {
        //     if(objInfo.skin)
        //     {
        //         geometry.hasSkin = true;
        //     }
        //     if(objInfo.morph)
        //     {
        //         geometry.hasMorph = true;
        //     }
        // }
        if(objInfo.id)
        {
            geometry.meshID = objInfo.id;
        }
        if(objInfo.name)
        {
            geometry.name = objInfo.name;
        }
        if(objInfo.geometry.castShadows)
        {
            geometry.castShadow = objInfo.geometry.castShadows;
        }
        if(objInfo.geometry.recieveShadows)
        {
            geometry.receiveShadow = objInfo.geometry.recieveShadows;
        }
        return geometry;
    }
            
    static generateGeometry(nameData,vertices,normals,uvs,faces)
    {
        var geometry =
        {
            name	: "",
            vertices: [],
            normals : [],
            uvs     : []
        };

        for(var num1 = 0; num1 < faces.length; num1++ ) 
        {
            for(var num2 = 0; num2 < faces[num1].length; num2++ )
            {
                var index  = parseInt(faces[num1][num2]);
                var vertex = ((index>=0)?index:index+vertices.length/3)*3;
                var normal = ((index>=0)?index:index+normals.length/3)*3;

                geometry.vertices.push(vertices[vertex],vertices[vertex+1],vertices[vertex+2]);
                geometry.normals .push(normals [normal],normals [normal+1],normals [normal+2]);
            }
        }

        if(uvs.length==1)
        {
            uvs.push(uvs[0]);
        }
        if(uvs.length>1)
        {
            if(uvs[0].length != uvs[1].length)
            {
                uvs[1] = uvs[0];
            }
        }
        for(var num1 = 0; num1 < uvs.length; num1++ )
        {
            geometry.uvs.push([]);
            for(var num2 = 0; num2 < faces.length; num2++ )
            {
                for(var num3 = 0; num3 < faces[num2].length; num3++ )
                {
                    var index  = parseInt(faces[num2][num3]);
                    var uv     = ((index>=0)?index:index+uvs[num1].length/2)*2;
                    geometry.uvs[num1].push(uvs[num1][uv],uvs[num1][uv+1]);
                }
            }
        }
        geometry.name = nameData;

        return geometry;
    }

    static flipGeometryArray(arr)
    {
        const temp = [0, 0, 0];
        for (let i = 0; i < arr.length / 9; i++)
        {
            temp[0] = arr[i * 9];
            temp[1] = arr[i * 9 + 1];
            temp[2] = arr[i * 9 + 2];
        
            arr[i * 9    ] = arr[i * 9 + 6];
            arr[i * 9 + 1] = arr[i * 9 + 7];
            arr[i * 9 + 2] = arr[i * 9 + 8];
        
            arr[i * 9 + 6] = temp[0];
            arr[i * 9 + 7] = temp[1];
            arr[i * 9 + 8] = temp[2];
        }
        return arr;
    }

    static flipUV(arr)
    {
        const temp = [0, 0];
        for (let i = 0; i < arr.length / 6; i++)
        {
            temp[0] = arr[i * 6];
            temp[1] = arr[i * 6 + 1];
        
            arr[i * 6    ] = arr[i * 6 + 4];
            arr[i * 6 + 1] = arr[i * 6 + 5];
        
            arr[i * 6 + 4] = temp[0];
            arr[i * 6 + 5] = temp[1];
          }
          return arr;
    }

    static combineGeometry(data)
    {
        let items      = data.items;
        let geometry   = new Libraries.ThreeObject.BufferGeometry();
        let sumPosArr  = new Float32Array(data.posSize );
        let sumNormArr = new Float32Array(data.normSize);
        let sumUvArr   = new Float32Array(data.uv1Size );
        let sumUv2Arr  = new Float32Array(data.uv2Size );

        let sumPosCursor  = 0;
        let sumNormCursor = 0;
        let sumUvCursor   = 0;
        let sumUv2Cursor  = 0;

        for (let a = 0; a < items.length; a++ )
        {
            let old    = items[a].geometry.getAttribute('position').array.slice();
            let oldN   = items[a].geometry.getAttribute('normal'  ).array.slice();
            let oldUv1 = items[a].geometry.getAttribute('uv'      ).array.slice();
            let oldUv2 = items[a].geometry.getAttribute('uv2') ? items[a].geometry.getAttribute('uv2').array.slice() : oldUv1;

            items[a].geometry.applyMatrix4( items[a].matrix );
            items[a].geometry.verticesNeedUpdate = true;

            var posAttArr = items[a].geometry.getAttribute('position').array;
            posAttArr = (items[a].flipped) ? this.flipGeometryArray(posAttArr) : posAttArr;

            for (let b = 0; b < posAttArr.length; b++)
            {
                sumPosArr[b + sumPosCursor] = posAttArr[b];
                posAttArr[b  ] = old[b];
            }
            sumPosCursor += posAttArr.length;

            var numAttArr = items[a].geometry.getAttribute('normal').array;
            numAttArr = (items[a].flipped) ? this.flipGeometryArray(numAttArr) : numAttArr;

            for (let b = 0; b < numAttArr.length; b++)
            {
                sumNormArr[b + sumNormCursor] = numAttArr[b];
                numAttArr [b] = oldN[b];
            }
            sumNormCursor += numAttArr.length;


            var uvAttArr = items[a].geometry.getAttribute('uv').array;
            
            uvAttArr = (items[a].flipped) ? this.flipUV(uvAttArr) : uvAttArr;

            for (let b = 0; b < uvAttArr.length; b++)
            {
                sumUvArr[b + sumUvCursor] = uvAttArr[b];
                uvAttArr[b] = oldUv1[b];
            }
            sumUvCursor += uvAttArr.length;

            
            var uv2AttArr= items[a].geometry.getAttribute('uv2') ? items[a].geometry.getAttribute('uv2').array
                                                                 : items[a].geometry.getAttribute('uv' ).array;

            
            uv2AttArr = (items[a].flipped) ? this.flipUV(uv2AttArr) : uv2AttArr;
            for (let b = 0; b < uv2AttArr.length; b++)
            {
                sumUv2Arr[b + sumUv2Cursor] = uv2AttArr[b];
                uv2AttArr[b] = oldUv2[b];
            }
            sumUv2Cursor += uv2AttArr.length;

            items[a].geometry.verticesNeedUpdate = true;
        }

        geometry.setAttribute('position', new Libraries.ThreeObject.BufferAttribute(sumPosArr , 3 ));
        geometry.setAttribute('normal'  , new Libraries.ThreeObject.BufferAttribute(sumNormArr, 3 ));
        geometry.setAttribute('uv'      , new Libraries.ThreeObject.BufferAttribute(sumUvArr  , 2 ));
        geometry.setAttribute('uv2'     , new Libraries.ThreeObject.BufferAttribute(sumUv2Arr , 2 ));

        geometry.meshID = data.id + '-' +  data.material.matId;

        geometry.addGroup(0,sumPosArr.length,0);

        return geometry;
    }
}