
export class LibraryModel {
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
    judgedOn:string;
}

export class LibraryResponse {
    dataList:LibraryModel[];
    totalItems:number;
    currentPage:number;
}
