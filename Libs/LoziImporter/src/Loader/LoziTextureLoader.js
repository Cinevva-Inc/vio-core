import Libraries from '../Libraries/Libraries';

export default class LoziTextureLoader
{ 
    static loadImage(imgData,prefix,complete,progress,error)
    {
        var img       = {data:null,loaded:false,loadProgress:0,isFromByteArray:(!self.Image)};
        let isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;

        if(img)
        {
            if(imgData.indexOf("data:image/png;base64,")>-1)
            {
                if(img.isFromByteArray == true)
                {
                    let byteCharacters = self.atob(imgData.split(',')[1]);
                    let byteNumbers    = new Array(byteCharacters.length);

                    for (let num = 0; num < byteCharacters.length; num++)
                    {
                        byteNumbers[num] = byteCharacters.charCodeAt(num);
                    }
                    let byteArray = new Uint8Array(byteNumbers);
                    
                    let imgBimap = isFirefox ? self.createImageBitmap( new Blob([byteArray], {type: "image/png"})) : self.createImageBitmap( new Blob([byteArray], {type: "image/png"}),{imageOrientation:'flipY'});
                    
                    imgBimap.then(function(imageBitmap)
                    {
                        img.data   = imageBitmap;
                        img.loaded = true;
                        if(complete)
                        {
                            complete();
                        }
                    });
                }
                else
                {
                    img.src 		 = imgData;
                    img.loadProgress = 1;

                    setTimeout(()=>
                    {
                        img.loaded = true;
                        if(complete)
                        {
                            complete();
                        }
                    },0);
                }
            } 
            else
            {
                var request = new XMLHttpRequest();
                request.onreadystatechange = ()=>
                {
                    if (request.readyState == 4 && request.status == 200)
                    {
                        img.loadProgress = 1;
                        if(img.isFromByteArray == true)
                        {
                            let imgBimap = isFirefox ? self.createImageBitmap(new Blob([request.response], {type: "image/png"})) : self.createImageBitmap(new Blob([request.response], {type: "image/png"}),{imageOrientation:'flipY'});
                            
                            imgBimap.then(function(imageBitmap)
                            {
                                img.data   = imageBitmap;
                                img.loaded = true;
                                if(complete)
                                {
                                    complete();
                                }
                            });
                        }
                        else
                        {
                            img.data     = new Image();
                            var blob     = new Blob( [ request.response ]);
                            img.data.src = self.URL.createObjectURL( blob );

                            setTimeout(()=>
                            {
                                img.loaded = true;
                                if(complete)
                                {
                                    complete();
                                }
                            },0);
                        }
                    }
                }
                request.onprogress = function(e)
                {
                    if(e.lengthComputable)
                    {
                        img.loadProgress = (e.loaded / e.total);
                        if(progress)
                        {
                            progress(img.loadProgress);
                        }
                    }
                };
                request.onerror = error;
                
                let url = imgData.startsWith('http') ? imgData : prefix+imgData;
                request.open('GET', url , true );
                request.responseType = 'arraybuffer';
                request.send();
            }
        }
        return img;
    }

    static loadImages(imagesData,prefix,complete,progress,error)
    {
        var images = [];

        if(imagesData.length>0)
        {
            for(var num1 = 0; num1 < imagesData.length; num1++)
            {
                for(var num2 = 0; num2 < imagesData[num1].textureData.length; num2++)
                {
                    var image = this.loadImage(imagesData[num1].textureData[num2],prefix,complete,progress,error);
                    if(image)
                    {
                        imagesData[num1].textureData[num2] = image; 
                        images.push(image);
                    }
                }
            }
        }
        else
        {
            setTimeout(()=>
            {
                if(complete)
                {
                    complete();
                }
            },0);
        }
        return images;
    }

    static loadTexture(prefix, texData)
    {
        if(texData && texData.textureData && texData.textureData.length>0)
        {
            var texture;
            switch(texData.textureData.length)
            {
                case 1:{texture = Libraries.object.Texture.generateTexture	  (prefix, texData); break;}
                case 6:{texture = Libraries.object.Texture.generateCubeTexture(prefix, texData); break;}
            }
            return texture;
        }
    }

    static loadTextures(prefix, texturesData)
    {
        var textures = [];
        for(var num = 0; num < texturesData.length; num++)
        {
            
            var texture = this.loadTexture(prefix, texturesData[num]);
            if(texture)
            {
                textures.push(texture);
            }
        }
        return textures;
    }
}