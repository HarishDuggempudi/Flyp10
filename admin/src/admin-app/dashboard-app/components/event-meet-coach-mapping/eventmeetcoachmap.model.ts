export class EventMeetCoachMappingModel{
    constructor(){
        this.active=true;
		
    }
    //_id:string;
    eventId:string;
    userId:string;
    active:boolean = true;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
}

