export default class LoziUtils
{
    static getObjectByProperty(objects,prop,val)
    {
        if(objects && objects.length>0 && prop && val !== undefined)
        {
            for(var num = 0; num < objects.length; num++)
            {
                if(objects[num][prop] && objects[num][prop] == val)
                {
                    return objects[num];
                }
            }
        }
        return null;
    }

    static getObjectIndex(objects,prop,val)
    {
        if(objects && objects.length>0 && prop && val !== undefined)
        {
            for(var num = 0; num < objects.length; num++)
            {
                if(objects[num][prop] == val)
                {
                    return num;
                }
            }
        }
        return -1;
    }

    static getArrayOfObjectsByProperty(objects,prop,vals)
    {
        var arr = [];
        if(objects && objects.length>0 && vals && vals.length>0)
        {
            for(var num = 0; num < vals.length; num++)
            {
                var obj = this.getObjectByProperty(objects,prop,vals[num]);
                if(obj)
                {
                    arr.push(obj);
                }
            }
        }
        return arr;
    }
    
    static getHierarchyObjectByValue(obj,prop,val)
    {
        let arr = this.flattenHierarchy(obj,'children');

        for(let num = 0; num < arr.length; num++)
        {
            if(arr[num][prop])
            {
                if(arr[num][prop] == val)
                {
                    return arr[num];
                }
            }
        }
        return null;
    }

    static getHierarchyObjectsByProperty(obj,prop,arr)
    {
        arr = (arr) ? arr : [];

        if(obj)
        {
            if(obj[prop] && arr.indexOf(obj)<0)
            {
                arr.push(obj);
            }
            if(obj.children)
            {
                for(var num = 0; num < obj.children.length; num++)
                {
                    this.getHierarchyObjectsByProperty(obj.children[num],prop,arr);
                }
            }
        }
        return arr;
    }
    
    static flattenHierarchy(obj, childArrayProperty, arr)
    {
        if (!arr)
        {
            arr = [];
        }
        if (arr.indexOf(obj)==-1)
        {
            arr.push(obj);
        }
        if(obj[childArrayProperty])
        {
            for (var num = 0; num < obj[childArrayProperty].length; num++)
            {
                arr = this.flattenHierarchy(obj[childArrayProperty][num], childArrayProperty, arr);
            }
        }
        return arr;
    }
}