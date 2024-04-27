import LoziEnums from "./LoziEnums"

export default class LoziEnumsTranslator
{
    static get enumDictionary()
    {
        let obj = {};

        obj[LoziEnums.Type            ] = 'type';
        obj[LoziEnums.Transform       ] = 'transform';
        obj[LoziEnums.Children        ] = 'children';
        obj[LoziEnums.Position        ] = 'position';
        obj[LoziEnums.Rotation        ] = 'rotation';
        obj[LoziEnums.Scale           ] = 'scale';
        obj[LoziEnums.Id              ] = 'id'; //parentBoneId
        obj[LoziEnums.Name            ] = 'name';
        obj[LoziEnums.Tag             ] = 'tag';
        obj[LoziEnums.Materials       ] = 'materials';
        obj[LoziEnums.MeshID          ] = 'meshID';
        obj[LoziEnums.AnimationID     ] = 'animationID';
        obj[LoziEnums.LightData       ] = 'lightData';
        obj[LoziEnums.CameraData      ] = 'cameraData';
        obj[LoziEnums.Collider        ] = 'collider';
        obj[LoziEnums.ParentBoneId    ] = 'parentBoneId';
        obj[LoziEnums.ScriptProperties] = 'scriptProperties';
        obj[LoziEnums.Sound           ] = 'sound';
        obj[LoziEnums.Flags           ] = 'flags';
        obj[LoziEnums.CombineMeshes   ] = 'combineMeshes';
        obj[LoziEnums.Reference       ] = 'reference';
        
        return obj;
    }

    static HierarchyEnumsToHumanReadable(obj,enumDict)
    {
        if(!obj)
        {
            return;
        }

        enumDict = enumDict ? enumDict : this.enumDictionary;

        for(let key in obj)
        {
            if(enumDict[key])
            {
                let temp = obj[key];
                delete obj[key];

                obj[enumDict[key]] = temp;
            }
        }

        this.HierarchyEnumsToHumanReadable(obj[enumDict[LoziEnums.Transform]],enumDict);
        this.HierarchyEnumsToHumanReadable(obj[enumDict[LoziEnums.Flags    ]],enumDict);

        if(obj[enumDict[LoziEnums.Children]])
        {
            for(let num = 0; num < obj[enumDict[LoziEnums.Children]].length; num++)
            {
                this.HierarchyEnumsToHumanReadable(obj[enumDict[LoziEnums.Children]][num],enumDict);
            }
        }
    }
} 