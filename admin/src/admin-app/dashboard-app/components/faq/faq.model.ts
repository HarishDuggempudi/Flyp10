
export class FaqModel {
    constructor(){
        this.active=false;
    }
    _id:string;
    question:string;
    answer:string;
    assignedTo:string; 
    active:boolean = false;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
}

export class FaqResponse {
    dataList:FaqModel[];
    totalItems:number;
    currentPage:number;
	totaldataItem:FaqModel[];
}
