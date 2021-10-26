import {ImageProperties} from "../../../shared/models/image.model";
import * as moment from 'moment';
export class RoutineModel {
    constructor(){
        this.active=true;
        this.submissionfor='1';
        this.scoretype='1';
        this.judgedBy=" ";
        this.score=" ";
        this.sport=" ";
        this.event=" ";
        this.technician_status;
        
        
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
    awards:string;
    state:string;
    submittedByID;
    RoutineID:string;
    isResubmitted:string;
    sourceID:string;
    isConverted:string;
    convertedfileName:string;
    thumbnailPath:string;
    technician_status:string;
   
}
export class RoutineComment{
    constructor(){
        this.active=true;
        this.bonus=0;
    }
    _id:string;
    userid:string;
    routineid:string;
    judgeid:string;
    judgename:string;
    routinetitle:string;
    comment:string;
	skillvalue:number;
	execution:number
	element:string;
	factor:string;
	total:number;
    time:string;
    read:string;
	state:string
    active:boolean = true;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
    bonus:number;
    judgePanel :string;
    judgePanelid:string;

}
export class RoutineResponse {
    dataList:RoutineModel[];
    totalItems:number;
    currentPage:number;
}
export class ScoreCard {
	constructor(){
		this.skillvalue=true;
		this.factor=true;
		this.execution=true;
	}
	skillvalue:boolean=true;
	factor:boolean=true;
	execution:boolean=true;
    addedBy:string;
    addedOn:string;
    updatedBy:string;
    updatedOn:string;
    deleted:boolean;
    deletedBy:string;
}
