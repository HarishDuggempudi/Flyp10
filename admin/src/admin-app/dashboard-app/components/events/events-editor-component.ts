import Swal from 'sweetalert2';
import {Component, AfterViewInit, OnInit, Input, OnChanges, OnDestroy, Inject} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import * as moment from 'moment';
import {EventdataModel,EventListdataModel} from './events.model';
import {DashboardJudgeModel} from '../dashboard/dashboard.jude.model';
import {FormGroup, Validators, FormBuilder,} from "@angular/forms";
import {DashboardService} from '../dashboard/dashboard.service';
import {Config} from "../../../shared/configs/general.config";
import {RegisterUserModel} from "../user-management/user.model";
import {RoutineService} from '../my-routines/routines.service';
import {TeammateService} from '../teammate/teammate.service';
import {UserService} from "../user-management/user.service";
import { SportService } from '../sport/sport.service';
import {EventsService} from "./events.service";
import { UploadCSVDialog } from './upload-csv-dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
@Component({
  selector: 'event-editor',
  templateUrl: './events-editor-component.html',
  styleUrls: ['./events-editor.scss']
})

export class EventsEditorComponent implements OnInit{
  
  eventList:any=[];
  sportlist:any=[];
  AddEventForm:FormGroup;
  minDate:Date;
  AdduserEventForm:FormGroup;
  isSubmitted:boolean=false;
  userRole:string;
  showtextbox:boolean=false;
  eventid:string="";
  loginuserinfo:RegisterUserModel=new  RegisterUserModel();
  eventObj:EventdataModel=new EventdataModel();
  //eventlistObj:EventListdataModel=new EventListdataModel();
  eventlistObj:EventdataModel=new EventdataModel();
  constructor(private router: Router, private activatedRoute: ActivatedRoute,private userServices:UserService, public dialog: MatDialog,private sportServices:SportService,private _formBuilder:FormBuilder,private eventservices:EventsService) {
	activatedRoute.params.subscribe(param => this.eventid = param['eventsid']);
//	console.log('event name form route is ', this.eventid);
	let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.loginuserinfo=userInfo;
	this.minDate=new Date();
    if(userInfo.userRole){
       this.userRole=userInfo.userRole;
    }
	     this.AddEventForm = this._formBuilder.group({
                "title": ['', Validators.required],
				"sportName": ['', Validators.required],
                "start": ['', Validators.required],
                "end": ['', Validators.required],
				"address":['',Validators.required],
				"state":['',Validators.required],
				"city":['',Validators.required],
				"othertitle":[''],
				"Nod":['',Validators.required],
            }
        );
		   this.AdduserEventForm = this._formBuilder.group({
                "title": ['', Validators.required],
				"sportName": ['', Validators.required],              
            }
        );
    
  }

  ngOnInit() {
	 // this.getSportList();
	 if(this.eventid){
		 this.eventservices.getEventListByevent(this.eventid).subscribe( data => {
			// console.log('event details ', data)
			 this.eventObj = data;
			 this.bindDetail(data);
		 })
	 }
	 if(this.loginuserinfo.userRole=="1"){
		 this.getSportList();
	 }else{
		 this.getJudgesSport(this.loginuserinfo._id);
	 }     
	  this.getEventlist();
	  this.getEventMeetListById();
  }

  bindDetail(objRes:EventdataModel) {
//	console.log('bind data ', objRes);
	// let tempArr = [];
	// for (let i = 0; i < objRes[0].sportName.length; i++) {
	// 	const element = objRes[0].sportName[i];		
	// 	let tempObj = {
	// 		sportName: element
	// 	}
	// 	tempArr.push(tempObj);
	// }
    this.AddEventForm.patchValue({	  
	  title: objRes.title,
	  sportName: objRes.sportid,
      start: objRes.start,
      end: objRes.end,
	  address:objRes.address,
	  state:objRes.state,
	  city:objRes.city,
	  othertitle:objRes.othertitle,
	  Nod:objRes.Nod
	});
  }
isOthereventSelected(){
	
	let val=this.AdduserEventForm.value.title;
		this.getEventdetails(val);
	
}

getSportList(){
	    this.sportServices.getSportList(1000,1)
    .subscribe(sportres=>{
        
        this.sportlist=sportres.dataList;
       // console.log(this.sportlist);
    },err=>this.errorMessage(err));
}
getEventlist(){
	this.eventservices.getEventList().subscribe(
	  res=>{
		  this.eventList=res;
		//  console.log(this.eventList);
	  },err=>{
		  this.errorMessage(err);
	  }
	)
}
getEventdetails(event){
	//console.log(event);
	this.eventservices.getEventListByevent(event).subscribe(
	  res=>{
		 
		 // console.log(res);
		  if(res.length >0){
			   this.eventlistObj=res[0];
			 /*  this.eventObj.address=res[0].address;
			  this.eventObj.state=res[0].state;
			  this.eventObj.city=res[0].city; */
		  }
	  },err=>{
		  //this.errorMessage(err);
	  }
	)
}
uploadFromCSV(){
	let dialogRef = this.dialog.open(UploadCSVDialog, {
  width: '450px',
  data: { passphrase: ""}
	});
	dialogRef.afterClosed().subscribe(result => {
		this.router.navigate([`/events`]);	
		// if(this.loginuserinfo.userRole=="1"){
		
		// 	this.getEventlist();
		// }else{
		// 	this.getEventMeetListById();	
		// }
	})
}
formatdate(date){
   return moment(new Date(date)).format('L');
 }
saveSportsEvent(){
	if(this.AddEventForm.valid){
		if(this.eventid){
			if(this.eventObj.title=="others"){
				this.eventObj.title=this.eventObj.othertitle
			}
		//	console.log(this.eventObj)
		   this.eventObj.userid=this.loginuserinfo._id;
		//   console.log(this.eventObj.sportid)
				   this.eventservices.updateEventList(this.eventObj).subscribe(
					res=>{
				//		console.log(res);
						Swal("Success!","Event updated Successfully.","success")
						this.triggerCancelForm();
					},err=>{
						this.errorMessage(err);			
					}
				   )
		}else{
			if(this.eventObj.title=="others"){
				this.eventObj.title=this.eventObj.othertitle
			}
		//	console.log(this.eventObj)
		   this.eventObj.userid=this.loginuserinfo._id;
		 //  console.log(this.eventObj.sportid)
				   this.eventservices.saveEventMeet(this.eventObj).subscribe(
					res=>{
				//		console.log(res);
						this.triggerCancelForm();
					},err=>{
						this.errorMessage(err);			
					}
				   )
		}	
	}
	else{
		
		//console.log(this.AddEventForm);
	}
}
getEventMeetListById(){
	
	this.eventservices.getEventMeetListByuserId(this.loginuserinfo._id).subscribe(
	  res=>{
		 // console.log("rwdwewwwwwwwww",res);
		 
	  },err=>{
		  this.errorMessage(err);
		 // this.triggerCancelForm();
	  }
	)
}
saveEventList(){
	    //  console.log("rwdwewwwwwwwww",this.eventlistObj);  
        this.eventlistObj.userid=this.loginuserinfo._id;		
       //  console.log("rwdwewwwwwwwww",this.eventlistObj);	   
	this.eventservices.saveEventList(this.eventlistObj).subscribe(
		 res=>{
			// console.log(res);
			 Swal("Success!","Event added Successfully.","success")
			 this.triggerCancelForm();
		 },err=>{
			 this.errorMessage(err);
			  
		 }
		)
	
}
  getJudgesSport(resUser){
   // console.log(resUser);
    this.userServices.getJudgesSport(resUser)
    .subscribe(resSport => {
       this.sportlist=resSport;
     //  console.log("resSport",this.sportlist);      
    },
      error => this.errorMessage(error));
  }
  errorMessage(objResponse:any) {
    Swal("Alert !", objResponse, "info");
	this.triggerCancelForm();
  }
  triggerCancelForm(){
	  this.router.navigate(['/events']);
  }
}

