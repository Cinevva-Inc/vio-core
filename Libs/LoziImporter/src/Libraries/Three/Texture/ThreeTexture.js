import Libraries from "../../Libraries";

export default class ThreeTexture
{
    static generateTexture(prefix, dataObj)
    {
        if(dataObj && dataObj.textureData && dataObj.textureData.length>0)
        {
            if(dataObj.textureData[0])
            {
                let url = dataObj.textureData[0];
                if (
                    !url.startsWith('http:') &&
                    !url.startsWith('https:') &&
                    !url.startsWith('blob:') &&
                    !url.startsWith('data:'))
                    url = prefix + url;

                let loader           = new Libraries.ThreeObject.TextureLoader();
                let texture          = loader.load(prefix + dataObj.textureData[0]);
                texture.texID	     = dataObj.id;
                texture.name  	     = dataObj.name;
                // texture.image 	     = image;
                texture.wrapS        = Libraries.ThreeObject.RepeatWrapping;
                texture.wrapT        = Libraries.ThreeObject.RepeatWrapping;
                // texture.repeat.set( 1, image.src ? 1 : -1);
                texture.repeat.set(1, 1);
                // texture.usedImages   = [texture.image];
                // texture.colorSpace = 'srgb';
                // texture.needsUpdate  = true;
                return texture;
            }
        }
    }

    static generateCubeTexture(prefix, dataObj)
    {
        if(dataObj && dataObj.textureData && dataObj.textureData.length>0)
        {
            var texture    	    = new Libraries.ThreeObject.CubeTexture();
            texture.texID  	    = dataObj.id;
            texture.name   	    = dataObj.name;
            texture.images 	    = [];
            texture.usedImages  = texture.images;
            texture.needsUpdate = true;

            for(var num = 0; num < dataObj.textureData.length; num++)
            {
                texture.images.push(dataObj.textureData[num].data);
            }
            return texture;
        }
    }

    static disposeTexture(obj)
    {
        if(obj.dispose && obj.constructor === Function)
        {
            obj.dispose();
        }
    }

    static disposeImage(obj)
    {
        if(obj.src)
        {
            obj.src = "";
        }
    }
}