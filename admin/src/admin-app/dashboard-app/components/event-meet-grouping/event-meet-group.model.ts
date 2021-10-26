export class EventMeetGroupModel{
    constructor(){
        this.active=true;
		
    }
    //_id:string;
    eventId:string;
    competitors;
    active:boolean = true;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    groupName:string;
}

