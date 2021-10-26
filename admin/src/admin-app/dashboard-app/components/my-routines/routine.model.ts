import {ImageProperties} from "../../../shared/models/image.model";
import * as moment from 'moment';
export class RoutineModel {
	judgeinfo: any;
    constructor(){
        this.active=true;
        this.submissionfor='1';
        this.scoretype='2';
        this.judgedBy=" ";
        this.score=" ";
        this.routineType='1';
        this.uploadingType='1';
        this.technician_status;
        this.SanctionRoutine = false;
        this.EventMeetName =''
        
    }
    _id:string;
    title:string;
    sport:string;
    level:string;
    event:string;
    duration:string;
    submissionfor:string;
    scoretype:string;
    originalfilename:string;
    videofilename:string;
    submittedBy:string;
    submittedOn:string;
    routinestatus:string;
    description:string;
    score:string;
    EventMeetName:string;
	dod:string;
	comment:string;
    userid:string;
    judgedBy:string;
    teammate:string;
    judgedOn:string;
    routineProperty:ImageProperties;
    filetype:string;
    filesize:string;
    active:boolean = true;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    routinePropertystring1:string;
    routinePropertystring2:string;
    deleted:boolean;
    deletedBy:string;
    deletedOn:string;
    htmlfile:string;
    terms:string;
	assignedTo:string;
	athlete:string;
    sportid:string;
    sid:string;
    lid:string;
    eid:string;
    uid:string;
    jid:string;
    EventName:string;
	awards:string;
	submittedByID;
    state:string;
    routineType:string;
    RoutineID:string;
    isResubmitted:string;
    sourceID:string;
    isConverted:string;
    convertedfileName:string;
    thumbnailPath:string;
    uploadingType:string;
    eventMeetId:string;
    judges:any;
    technician:any;
    eventlevel:any;
    technician_status:string;
    groupId:string;
    SanctionRoutine:boolean;
    judgePanel:string;
    judgePanelid:string;
    nd:any;
    
}
export class RoutineComment{
    constructor(){
        this.active=true;
    }
    _id:string;
    userid:string;
    routineid:string;
    judgeid:string;
    judgename:string;
    routinetitle:string;
    comment:string;
    time:string;
    read:string;
    sport:string;
    event:string;
    level:string;
    active:boolean = true;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;

}
export class RoutineResponse {
    dataList:RoutineModel[];
    totalItems:number;
    currentPage:number;
}
