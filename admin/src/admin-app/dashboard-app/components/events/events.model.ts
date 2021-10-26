export class EventdataModel{
    constructor(){
        this.active=true;
		this.status=true;
    }
    _id:string;
    userid:string;
    title:string;
	othertitle:string;
    start:string;
    end:string;
	sportName:string;
	sportid:string;	
    status:boolean;
	address:string;
	state:string;
	city:string;
	Nod:string;
    active:boolean = true;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;

}

export class EventListdataModel{
    constructor(){
        this.active=true;
		this.status=true;
    }
      _id:string;
    userid:string;
    title:string;
	othertitle:string;
    start:string;
    end:string;
	sportName:string
    status:boolean;
	address:string;
	state:string;
	city:string;
	Nod:string;
	eventid:string;
    active:boolean = true;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;

}
