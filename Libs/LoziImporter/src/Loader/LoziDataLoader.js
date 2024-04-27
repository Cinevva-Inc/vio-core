import LoziAssetPreloader from './LoziAssetPreloader';
import Libraries         from './../Libraries/Libraries';

export default class LoziDataLoader
{
    static updateProgress(progress,onProgress,e)
    {
        if(e)
        {
            progress.assetsProgress = e;
        }
        progress.totalProgress = (progress.dataProgress/2)+(progress.assetsProgress/2);
        if(onProgress)
        {
            onProgress(progress);
        }
    }

    static onProgress(progress,e,onProgress) 
    {
        var size = 3;
        if(e.lengthComputable)
        {
            progress.dataProgress  = (e.loaded / e.total);
            this.updateProgress(progress,onProgress);
        }
        else
        {
            progress.dataProgress = e.loaded / (size * 1048576);
            progress.dataProgress = (progress.dataProgress>1) ? 1 : progress.dataProgress;
            this.updateProgress(progress,onProgress);
        }
    }

    static loadFromString(string,prefix,onComplete,onProgress,onError,generateObject,params)
	{
		return LoziAssetPreloader.preloadData(JSON.parse(string),prefix,onComplete,onProgress,onError,generateObject,params);
    }
    
    static load(url, onComplete, onProgress, onError, generateObject, params)
    {
        new Libraries.ThreeObject.FileLoader().load(url, (data) => {
            let parts = url.split('/')
            let prefix = parts.slice(0, parts.length-1).join('/') + '/'
            this.loadFromString(
                data,
                prefix,
                onComplete,
                onProgress,
                onError,
                generateObject,
                params);
        }, onProgress, onError)
        /*size = (size) ? size : 5; //average in mb
        url  = url[0] == '/' ? url = url.substring(1,url.length) : url[0] == '.' ? url.substring(2,url.length) : url;

        var prefix = "";

		if(url.split('/').length>0)
		{
			var arr = url.split('/');
			arr.splice(arr.length-1,1);
            prefix = arr.join('/');
            prefix = prefix.length>0 ? prefix+'/' : prefix;
        }
        
        var progress =
		{
			totalProgress:0,
			assetsProgress:0,
			dataProgress:0
        };
        
		var xhttp = new XMLHttpRequest();
		xhttp.onload = (e)=>
		{
			if (xhttp.readyState == 4 && xhttp.status == 200)
			{
                this.loadFromString(xhttp.responseText,prefix,complete,(e)=>{this.updateProgress(progress,onProgress,e);},error,generateObject);
			}
			else
			{
				if(error)
				{
					error(xhttp.status);
				}
			}
		}

		xhttp.onprogress = (e)=>
		{
			this.onProgress(progress,e,onProgress)
        }
        
		xhttp.open("GET",url, true);
		xhttp.send(null);
        */
    }
}