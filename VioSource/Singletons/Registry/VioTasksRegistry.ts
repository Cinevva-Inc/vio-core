export class VioTasksRegistry
{
    private static _instance:VioTasksRegistry;
    
    private constructor()
    {
    }
    
    public static get data()
    {
        const obj:Array<any> = [];

        return obj;
    }

    private static get instance():VioTasksRegistry
    {
        if(!VioTasksRegistry._instance)
        {
            VioTasksRegistry._instance = new VioTasksRegistry();
        }
        return VioTasksRegistry._instance;
    }
}