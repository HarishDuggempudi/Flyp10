import {ImageProperties} from "../../../shared/models/image.model";
export class SportModel {
    constructor(){
        this.active=false;
    }
    _id:string;
    sportName:string;
    selectLevel:any;
    // sportAddedDate:string;
    imageName:string;
    imageProperties:ImageProperties;
    fieldsConfig:any;
    baseMapping:boolean = false;
    categoryMapping:boolean = false;
    elementGroupMapping:boolean = false;
    elementMapping:boolean = false;
    eventMapping:boolean = false;
    levelMapping:boolean = false;
    active:boolean = false;
    addnotes:boolean=false;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}

export class SportResponse {
    dataList:SportModel[];
    totalItems:number;
    currentPage:number;
	totaldataItem:SportModel[];
}

export class CategoryModel {
    constructor(){
        this.active=false;
    }
    _id:string;
    categoryName:string;
    active:boolean = false;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}

export class CategoryResponse {
    dataList:CategoryModel[];
    totalItems:number;
    currentPage:number;
	totaldataItem:CategoryModel[];
}

export class MappingModel {
    _id: string;
    sport: string;
    level: string[]=[];
    // mappingFieldsVal: Array<{'level': string, 'event': string, 'category': string, 'element': string, 'elementGroup': string, 'base': string}>;
    mappingFieldsVal: any[];

}

export class MappingResponse {
    dataList:MappingModel[];
    totalItems:number;
    currentPage:number;
	totaldataItem:CategoryModel[];
}

export class LevelModel {
    constructor(){
        this.active=false;
    }
    _id:string;
    level:string;
    maxscore:string;
    active:boolean = false;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}

export class LevelResponse {
    dataList:LevelModel[];
    totalItems:number;
    currentPage:number;
	totaldataItem:LevelModel[];
    
}

export class EventModel {
    constructor() {
        this.active = false;
    }
    _id:string;
    Event:string;
    eventFullname:string;
    difficultyFactor:string;
    active:boolean;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}
export class SportsEventResponse {
    dataList:EventModel[];
    totalItems:number;
    currentPage:number;
	totaldataItem:EventModel[];
}
export class ElementGroupModel {
    constructor() {
        this.active = false;
    }
    _id:string;
    elementGroup:string;
    active:boolean;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}
export class ElementModel {
    constructor() {
        this.active = true;
		this.skillValue=0;
		this.factor=0;
    }
    _id:string;
    elementName:string;
	skillValue:number;
	factor:number;
	event:string
    active:boolean;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}
export class SportsElementResponse {
    dataList:EventModel[];
    totalItems:number;
    currentPage:number;
	totaldataItem:EventModel[];
}
export class SportsElementgroupResponse {
    dataList:ElementGroupModel[];
    totalItems:number;
    currentPage:number;
	totaldataItem:ElementGroupModel[];
}
export class PricingModel {
    constructor() {
        this.active = true;
    }
    _id:string;
    sport:string;
	sportid:string;
    scoretype:string;
    competitor:string;
    judge:string;
    technician:string;
    active:boolean;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}
export class SportsPricingResponse {
    dataList:EventModel[];
    totalItems:number;
    currentPage:number;
	totaldataItem:EventModel[];
}
