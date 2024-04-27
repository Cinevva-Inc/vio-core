export type ExposedProperty = 
{
	type 	   :'label' | 'editableLabel' | 'text' | 'editableText' | 'number' | 'slider' | 'color' | 'droppable'  | 'droppableSmall' | 'droppableObject' | 'droppableValue' | 'droppableIcon'  | 'droppableIconsArray' | 'checkbox' | 'array' | 'propetiesCont' | 'function',
	label	   :string,
	property   :string,
	min?       :number,
	max?       :number,
	value	   :string | number | boolean | Array<ExposedProperty> | object | null,
	options?   :string | number | boolean | Array<string | number | boolean> | {min:number,max:number},
	visible?   :{property:string,value:string | number | boolean},
	logicValue?:string | number | boolean,
	itemLogic? :any
}

export type ExposedPropertiesObject = 
{
	name	  :string,
	class?    :string,
	type?     :string,
	controller:{logic:any,data:any} | null,
	properties:Array<ExposedProperty>
};
