import LoziDataLoader 	  from './Loader/LoziDataLoader';
import Libraries		  from './Libraries/Libraries';
import LoziTextureLoader  from './Loader/LoziTextureLoader';
import LoziUtils		  from "./Helpers/LoziUtils";

const loadAsync = async (url,progress,error,generateObject)=>
{
	return await new Promise(resolve=>
	{
		LoziDataLoader.load(url,(data)=>
		{
			resolve(data);
		},progress,error,generateObject);
	});
};

const load = (url,complete,progress,error,generateObject)=>
{
	LoziDataLoader.load(url,complete,progress,error,generateObject);
};

const loadFromString = (url,prefix,complete,progress,error,generateObject)=>
{
	LoziDataLoader.loadFromString(url,prefix,complete,progress,error,generateObject);
};

const loadTexture = (url,complete,progress,error)=>
{
	let loader = new Libraries.ThreeObject.TextureLoader();
	loader.load(url, complete, progress, error)
};

const generateObject = (data,path)=>
{
	return Libraries.object.Object.generateObject(data,path);
};

const getHierarchyObjectByPath = (data,path)=>
{
	return Libraries.object.Object.getHierarchyObjectByPath(data,path);
};

const getGeometryByPath = (data,path)=>
{
	let obj = Libraries.object.Object.getHierarchyObjectByPath(data.objects,path);

	if(obj)
	{
		if(obj.meshID)
		{
			for(let num = 0; num < data.generatedAssets.geometries.length; num++)
			{
				if(data.generatedAssets.geometries[num].meshID == obj.meshID)
				{
					return data.generatedAssets.geometries[num];
				}
			}
		}
		return null;
	}
};

const setThreejsObject = (obj)=>
{
	Libraries.setThreeJsObject(obj);
}

const combineObjects = (arr,obj,material)=>
{
	return Libraries.object.Object.combineGeometries(arr,obj,material);
};

const combineObjectsAsOne = (arr,material)=>
{
	return Libraries.object.Object.combineObjectsAsOne(arr,material);
};

export
{ 
	setThreejsObject,
	load,
	loadAsync,
	loadFromString,
	loadTexture,
	generateObject,
	getHierarchyObjectByPath,
	getGeometryByPath,
	combineObjects,
	combineObjectsAsOne,
	LoziUtils
};