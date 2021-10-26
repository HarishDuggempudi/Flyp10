import { Component, OnInit, EventEmitter ,ViewChild,HostListener,OnDestroy } from "@angular/core";
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { SportService } from '../sport/sport.service';
import Swal from 'sweetalert2';
import {Config} from '../../../shared/configs/general.config';
import {RegisterUserModel} from "../user-management/user.model";
import {Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {Router} from '@angular/router'
import {RoutineModel} from "./routine.model";
import {RoutineService} from "./routines.service";
import {UserService} from "../user-management/user.service";
import * as moment from 'moment';
import {EventsService} from "../events/events.service"
import { ComponentCanDeactivate } from './pending-changes.guard';
import { Observable } from 'rxjs/Observable';
import * as _ from 'lodash';   
@Component({
  selector: "judge-routine",
  templateUrl: "./judge-routine.html",
  styleUrls: ['./judge-routine.scss']
})
export class JudgeRoutineComponent implements OnInit,ComponentCanDeactivate,OnDestroy    {
	
 
  suggestedRoutine:any=[];
  judgedRoutine:any=[];
  ownsportObj:any=[];
  routineList:any=[];
  judgeEvent:any=[];
  routineObj:RoutineModel =new RoutineModel();
  setsession:boolean=true;
  isvalidclick:boolean=false;
  showRequest:boolean=true;
  timoutcall:any;
	 timerInterval:any;
	 inComplete:any=[]
	 inApp:any=[]
	 scored:any=[]
eventMeetRountine:any=[];
  loginuserinfo:RegisterUserModel=new RegisterUserModel();
	SportObj: any;
	eventMeetGroupRoutine: any = [];
	GroupeduserRoutine: any = [];
	LowerEventEventmeetGroup: any = [];
	GroupedRoutines: any;
	eventroutineJudgeObj:any;
	userInfo: any;
	
  constructor(private eventService:EventsService,private userServices: UserService,private route:Router, private _formBuilder: FormBuilder,private routineservice: RoutineService) {
    let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.loginuserinfo=userInfo;
  }
@HostListener('window:beforeunload', ['$event'])
public doSomething($event) {
  //  //console.log("do I see this?") // <---- this logs to the console.
    if(this.suggestedRoutine.length>0){
		 //alert("clear Session")
		 return false
	 }else{
		 return true
	 }
}

 canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
//	//console.log("this.isvalidclick",this.isvalidclick)
	if(this.isvalidclick){
		return true
	}else if(!this.isvalidclick && this.suggestedRoutine.length==0){
		return true
	}else{
		return false
	} 
	 
  } 
  async ngOnInit() {
    // this.getAllRoutine();
	 this.getuserEvent(this.loginuserinfo._id);
	 await this.getUserByUserID(this.loginuserinfo._id);
	 this.getAssignedroutine(this.loginuserinfo._id);
	 this.getAssignedEventMeetForJudges(this.loginuserinfo._id)
	 this.getEventMeetRoutine(this.loginuserinfo._id)
	 this.getJudgedRoutine();
	 this.getJudgedEventMeetRoutine()
	
  }
  getUserByUserID(userId){
	return new Promise<void>((resolve, reject) => {
	
	this.routineservice.getUserByUserID(userId).subscribe(data => {
		this.userInfo = data;
		resolve()
	  })
	})
  }
  ngOnDestroy() { 
     clearTimeout(this.timoutcall);
	 clearInterval(this.timerInterval);
	 //this.isvalidclick=false
	 if(this.routineObj.technician_status=='1' && !this.isvalidclick){
		this.clearAssignedRoutine(this.routineObj._id)
	}
	 if(this.routineObj.routinestatus=='2' && !this.isvalidclick){
		 this.clearAssignedRoutine(this.routineObj._id)
	 }
  } 
    clearAssignedRoutine(id){	 
		  let objTemp: RoutineModel = new RoutineModel();
								objTemp._id = id;
								objTemp.routinestatus = '0';
								objTemp.judgedBy=" ";
								objTemp.judgedOn=new Date().toString();
								objTemp.assignedTo=" ";
								if(this.routineObj['uploadingfor'] && (this.routineObj['uploadingfor'] == '1' || this.routineObj['uploadingfor'] == '3')&& this.routineObj.technician_status && this.routineObj.technician_status != '2'){
									objTemp.technician_status = '0'
								}
								if(this.routineObj['judgeInfo'] && this.routineObj['judgeInfo'].hasOwnProperty('isTechnician') && this.routineObj['judgeInfo'].isTechnician == '1'){
									objTemp.technician_status = '0'
								}

				this.routineservice.updateAssignedRoutine(objTemp).subscribe(
				   res=>{
					      // Swal("Info","Routine session expired.", "info");	
                            //this.location.back();	
                          this.suggestedRoutine=[];		
                          this.routineList=[];						  
					 },err=>{
						  this.errorMessage(err)
								 // Swal("Alert!", "Something bad happened; please try again later.", "info");
		         })
 }
  formatdate(date){
   return moment(new Date(date)).format('L');
 }
 clearSession(title,id){	 
		  let objTemp: RoutineModel = new RoutineModel();
								objTemp._id = id;
								objTemp.routinestatus = '0';
								objTemp.judgedBy=" ";
								objTemp.judgedOn=new Date().toString();
								objTemp.assignedTo=" "
								//for flyp10routine
								if(this.routineObj['uploadingfor'] && (this.routineObj['uploadingfor'] == '1' || this.routineObj['uploadingfor'] == '3')&& this.routineObj.technician_status && this.routineObj.technician_status != '2'){
									objTemp.technician_status = '0'
								}
								//for eventmeet routine
								if(this.routineObj['judgeInfo'] && this.routineObj['judgeInfo'].hasOwnProperty('isTechnician') && this.routineObj['judgeInfo'].isTechnician == '1'){
									objTemp.technician_status = '0'
								}
								
				this.routineservice.updateRoutine(objTemp).subscribe(
				   res=>{
					        Swal("Info","Routine session expired.", "info");	
						         this.suggestedRoutine=[];
							    this.routineList=[];
                           		this.getAssignedroutine(this.loginuserinfo._id);			   
					 },err=>{
						  this.errorMessage(err)
								 // Swal("Alert!", "Something bad happened; please try again later.", "info");
				 })
				 
 }   
 
  sessionMaintain(){
    
		let timeOut=(14*60000)
		////console.log(this.routineObj)

	  let seconds=60;
	  
	 this.timoutcall=setTimeout(()=>{ 
	   this.closefullscreen();
       Swal({
        title: "Routine Session Expiring!",
        html: "Your routine session will expire in <span id='sec' style='font-weight:bold;'>"+seconds+"</span> seconds.<br>Do you want to reset?",
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
		allowOutsideClick:false,
	   onBeforeOpen: () => {
       this.timerInterval = setInterval(() => {
              seconds--;
			  if(this.setsession){
				  document.getElementById("sec").innerHTML=seconds.toString()
			  }
			  
			  if(seconds==0){
				  
				  clearInterval(this.timerInterval)
				  this.clearSession(this.routineObj.title,this.routineObj._id);
			  }
            }, 1000)
       },
        confirmButtonText: "Yes, Reset!"
      }).then(result => {
         if (result.value) {
			 clearInterval(this.timerInterval);
             this.sessionMaintain();
			
	 		 
         }else{
			this.setsession=false;
		 } 
      });
	 }, timeOut); 
  }

closefullscreen(){
		try{
					 const docWithBrowsersExitFunctions = document as Document & {
						 mozCancelFullScreen(): Promise<void>;
						 webkitExitFullscreen(): Promise<void>;
						 msExitFullscreen(): Promise<void>;
						 mozFullScreenElement:any;
						 webkitFullscreenElement:any;
						 msFullscreenElement:any;
					 };
				 
						 if (docWithBrowsersExitFunctions.exitFullscreen) {
						 docWithBrowsersExitFunctions.exitFullscreen();
					 } else if (docWithBrowsersExitFunctions.mozCancelFullScreen) { /* Firefox */
						 docWithBrowsersExitFunctions.mozCancelFullScreen();
					 } else if (docWithBrowsersExitFunctions.webkitExitFullscreen) { /* Chrome, Safari and Opera */
						 docWithBrowsersExitFunctions.webkitExitFullscreen();
					 } else if (docWithBrowsersExitFunctions.msExitFullscreen) { /* IE/Edge */
						 docWithBrowsersExitFunctions.msExitFullscreen();
					 }
		}catch(e){
			//console.log(e)
		}
	 
	// this.isfullscreen = false;
 }
  getAssignedroutine(userid){
	 // this.getVerifiedJudgeSportsByjudgeId(this.loginuserinfo._id);
    this.routineservice.getAssignedroutine(userid).subscribe(
        res=>{
				if(res.length>0){
					res.forEach((routine) => {
						if(routine.groupId){
							this.suggestedRoutine.push(routine)
						}
						else {
							this.clearAssignedRoutine(res[0]._id)
							if(this.userInfo && this.userInfo.EligibleJudgeForMyFlyp10Routine){
								this.getVerifiedJudgeSportsByjudgeId(this.loginuserinfo._id)
							   }
						}
					});

									 
				}else{
					if(this.userInfo && this.userInfo.EligibleJudgeForMyFlyp10Routine){
					 this.getVerifiedJudgeSportsByjudgeId(this.loginuserinfo._id)
					}
				}
                   
           // //console.log("resssssssssss",this.suggestedRoutine)
      },err=>{
         this.errorMessage(err)
      }
    ) 
  }
  getAssignedEventMeetForJudges(userid){
	  this.routineservice.getAssignedEventMeetForJudges(userid).subscribe((res)=>{
		  console.log(res);
		  res.forEach((r)=>{
           this.routineservice.getSingleRoutine(r.routineId).subscribe((routine)=>{
			   this.suggestedRoutine.push(routine)
		   })
		  })

	  })
  }
  getAllRoutine(){
    this.routineservice.getAllRotinebyStatus().subscribe(
      res=>{
        this.routineList=res;
       // //console.log("resssssssssss",res)
      },err=>{
         this.errorMessage(err)
      }
    )
  } 
  getuserEvent(userid){
	  this.eventService.getfutureevntbyuserid(userid).subscribe(
	    res=>{
			////console.log("userEvent",userid,res)
			this.judgeEvent=res;
		},err=>{
			this.errorMessage(err);
		})
  }
  getEventMeetRoutine(userid){
	  this.routineservice.getEventForJudges(userid).subscribe(res=>{
		   //console.log("evnet Meet Rountine ",userid,res)
		   if(res.success){
			   let eventmeetRoutine = res.result;
			   this.eventMeetRountine = [];
			   let temp;
			   for(var i= 0;i<eventmeetRoutine.length;i++){
				   temp = eventmeetRoutine[i];
				   let eventMeetInfo;
				   if(eventmeetRoutine[i].sportid == Config.WFigureSkating || eventmeetRoutine[i].sportid == Config.MFigureSkating){
					  
						eventMeetInfo = eventmeetRoutine[i].eventmeetInfo;
					   
					   let eventmeetJudge = eventmeetRoutine[i].judgeInfo;
					   //Figureskating technician for higher;
					   if(eventmeetJudge.hasOwnProperty('isTechnician') && eventmeetJudge.isTechnician == '1'&& eventMeetInfo.EventLevel == '1' && eventmeetRoutine[i].technician_status == '0'){
							this.eventMeetRountine.push(temp);
							if(i == eventmeetRoutine.length-1){
								if(this.LowerEventEventmeetGroup.length >0)
								 this.getEventMeetGroupRoutine();
								}
					   }
					   //Figureskating judge for higher;
					   else if(eventmeetJudge.hasOwnProperty('isTechnician') && eventmeetJudge.isTechnician == '0'&& eventMeetInfo.EventLevel == '1' && eventmeetRoutine[i].technician_status == '2'){
						this.eventMeetRountine.push(temp);
						if(i == eventmeetRoutine.length-1){
							if(this.LowerEventEventmeetGroup.length >0)
							 this.getEventMeetGroupRoutine();
							}
					   }
					   //Figureskating judge for lower;
					  else if(eventmeetJudge.hasOwnProperty('isTechnician') && eventmeetJudge.isTechnician == '0'&& eventMeetInfo.EventLevel == '0'){
						this.LowerEventEventmeetGroup.push(temp);
						if(i == eventmeetRoutine.length-1){
							if(this.LowerEventEventmeetGroup.length >0)
							 this.getEventMeetGroupRoutine();
							}
						//this.eventMeetRountine.push(temp);
					  }
					
					 
				   }
				   else {
					this.eventMeetRountine.push(temp);
					if(i == eventmeetRoutine.length-1){
						if(this.LowerEventEventmeetGroup.length >0)
						 this.getEventMeetGroupRoutine();
						}
				   }
				   
				  
			   }

			//   this.eventMeetRountine=res.result
			   //console.log(this.eventMeetRountine,this.eventMeetRountine.length)
		   }
		   else{
			this.eventMeetRountine=[] 
			Swal("Alert","Unable to get event meet routine.","info")
		   }
	  },err=>{
		//  //console.log("error")
		  this.eventMeetRountine=[]
		  Swal("Alert","Unable to get event meet routine.","info")
	  })
  }
  getEventMeetGroupRoutine() {
	  var eventmeetgroups = [];
	  var eventMeetGroupRoutine = [];
	  this.eventMeetGroupRoutine =[];
	  console.log(this.LowerEventEventmeetGroup,"LowerEventEventmeetGroup")
	this.LowerEventEventmeetGroup.forEach((routine,i) => {
		this.routineservice.getEventmeetGroupByeventId(routine.eventMeetId).subscribe((res) => {
			if (res.success) {
			  eventmeetgroups = res.result;
			  if (eventmeetgroups.length > 0) {
				 
				eventmeetgroups.forEach((comp, j) => {
					let  competitorsRoutine = [];
				  comp.competitors.forEach((c,k) => {
					let croutine = this.LowerEventEventmeetGroup.filter((routine1)=>routine1.userid == c._id && routine1.eventMeetId == comp.eventId)
					if(croutine.length > 0){
						competitorsRoutine.push(croutine[0]);
						competitorsRoutine = _.uniqBy(competitorsRoutine,'userid' );
					}
					if(k == comp.competitors.length-1 && comp.competitors.length == competitorsRoutine.length){
					
						let data = {
							groupId :comp._id,
							GroupName : comp.groupName,
							CompetitorRoutines : competitorsRoutine,
						}
						eventMeetGroupRoutine.push(data);
				
					}
					if(i == this.LowerEventEventmeetGroup.length -1){
						this.eventMeetGroupRoutine = _.uniqBy(eventMeetGroupRoutine,'groupId' );
						console.log(this.eventMeetGroupRoutine);
					}

				  })
				})
			}
		}
			})
			
	});
	
  }
   getVerifiedJudgeSportsByjudgeId(username){
	  this.routineservice.getVerifiedJudgeByjudgeId(username).subscribe(
     async(res)=>{
         this.ownsportObj=res;
	     if(this.ownsportObj.length>0){
			  for(let i=0;i<this.ownsportObj.length;i++){
				   let temp1=this.ownsportObj[i];
							 await this.getRoutineListData(temp1);
			  }
		 }else{ 
			 
		 }
         ////console.log("resssssssssss",res)
      },err=>{
         this.errorMessage(err)
      }
     )
   }
   getRoutineListData(tempObject) {
	return new Promise<void>((resolve, reject) => {
		this.routineservice.getroutinebysportsandlevel(tempObject.sportid,tempObject.levelid).subscribe(
		  res=>{
	if(res.length>0){
		let temp=[];
		////console.log(res)
	  for(let j=0;j<res.length;j++){
		   let tempObj=res[j];
	   //	//console.log(tempObj)
		   let sourceinfo=tempObj.sourceinfo ? tempObj.sourceinfo:[]
		   let array=sourceinfo.filter(item=>item.judgeid==this.loginuserinfo._id);
		   ////console.log(array,'array')
		   if(array.length >0){
			   if(j==res.length-1){
					   this.routineList = this.routineList.concat(temp);
						  this.routineList=this.routineList.sort(function(a, b){return Number(b.userinfo.subtype) - Number(a.userinfo.subtype)});
						  resolve();
			   }
		   }else{
		
			if(tempObject.uploadingfor == '1' && tempObj.technician_status && tempObj.technician_status == '0') {
				temp.push(tempObj);
			 }
			 else if(tempObject.uploadingfor == '2' && tempObj.technician_status && tempObj.technician_status == '2'){
				temp.push(tempObj);
			 }
			 else if(tempObject.uploadingfor == '3'&& tempObj.technician_status){
				temp.push(tempObj);
			 }
			 else if(tempObject.uploadingfor == '0'){
				temp.push(tempObj);
			 }
			if(j==res.length-1){
			   //	//console.log('etemplse',temp)
				   this.routineList = this.routineList.concat(temp);
					  this.routineList=this.routineList.sort(function(a, b){return Number(b.userinfo.subtype) - Number(a.userinfo.subtype)});
					  resolve();
			   }
		   }
	  }
  }
  else{
	  resolve();
  }
},err=>{
    this.errorMessage(err)
 })
	})
   }
   Requestroutinebyjudge(){
       this.assignRoutine(0);
	    this.showRequest=true;
	   
	}
   RequestForroutine(){
       //this.assignRoutine(0);
	     this.showRequest=false
	     this.routineList=[];
	     this.routineservice.getVerifiedJudgeByjudgeId(this.loginuserinfo._id).subscribe(
      async (res)=>{
         this.ownsportObj=res;
	     if(this.ownsportObj.length>0){
			this.ownsportObj.forEach(async(ele,i) => {
				   let temp1=this.ownsportObj[i];
				   this.SportObj = this.ownsportObj[i];
				  await this.getRoutineBySportandLevel(temp1,i);
				
			  }
			)
		 }else{ 
			 
		 }
         ////console.log("resssssssssss",res)
      },err=>{
         this.errorMessage(err)
      }
     )
   }

   getRoutineBySportandLevel(temp1,i){
	   return new Promise<void>((resolve,reject)=>{
		this.routineservice.getroutinebysportsandlevel(temp1.sportid,temp1.levelid).subscribe((res)=>{
			if(res.length>0){
				 let temp=[];
			   for(let j=0;j<res.length;j++){
					let tempObj=res[j];
			  
					 let sourceinfo=tempObj.sourceinfo ? tempObj.sourceinfo:[]
					 let array=sourceinfo.filter(item=>item.judgeid==this.loginuserinfo._id);
					 if(array.length >0){
						 if(j==res.length-1){
								 this.routineList = this.routineList.concat(temp);
								 this.routineList=this.routineList.sort(function(a, b){return Number(b.userinfo.subtype) - Number(a.userinfo.subtype)});
								 if(i==this.ownsportObj.length-1){

								   this.assignRoutine(0);
								   resolve();								  
								}
								else {
									resolve()
								}
							}
					 }else{
						 //Figure skating technician
						 if((temp1.uploadingfor == '1' || temp1.uploadingfor == '3')&& tempObj.technician_status && tempObj.technician_status == '0') {
							 tempObj.uploadingfor = temp1.uploadingfor;
							 temp.push(tempObj);
						  }
						  //for Figure skating judges;
						  else if((temp1.uploadingfor == '2'|| temp1.uploadingfor == '3') && tempObj.technician_status && tempObj.technician_status == '2'){
							 tempObj.uploadingfor = temp1.uploadingfor;
							 temp.push(tempObj);
						  }
						  else if(temp1.uploadingfor == '0'){
							 tempObj.uploadingfor = temp1.uploadingfor;
							 temp.push(tempObj);
						  }
					 
					 if(j==res.length-1){
						 this.routineList = this.routineList.concat(temp);
						 this.routineList=this.routineList.sort(function(a, b){return Number(b.userinfo.subtype) - Number(a.userinfo.subtype)});
						 if(i==this.ownsportObj.length-1){
						   this.assignRoutine(0);	
						   resolve()							  
						}
						else {
							resolve()
						}
						}
					}
				 
			   }
		   }else{
				if(i==this.ownsportObj.length-1){
				   this.assignRoutine(0);
				   resolve()
				}
				else {
					resolve()
				}
		   }						   
		 // //console.log("getroutinebysportsandlevel",this.routineList)
	   
	 },err=>{
		 this.errorMessage(err);
		  if(i==this.ownsportObj.length-1){
					this.assignRoutine(0);
				resolve()   
		   }
		   else {
			   resolve()
		   }
	 })
	   })
   }
   RequestForEventMeetGroupRoutine() {

	this.GroupedRoutines = this.eventMeetGroupRoutine[0].CompetitorRoutines;
	this.GroupedRoutines.forEach((routine,i)=>{
		this.assignRoutineForEventMeetGroup(routine)
	})
   }
 assignRoutineForEventMeetGroup(routine) {
	let objTemp: RoutineModel = new RoutineModel();
	objTemp._id = routine._id;
	objTemp.routinestatus = '2';
	objTemp.judgedBy=this.loginuserinfo.username;
	objTemp.judgedOn=new Date().toString();
	objTemp.assignedTo=this.loginuserinfo._id;
 this.routineservice.updateRoutine(objTemp).subscribe(
   res=>{
	this.routineservice.updateAssignedStatusInEventMeetForJudges(this.loginuserinfo._id,routine._id).subscribe((res)=>{
            console.log(res);
	})
	  this.suggestedRoutine.push(routine);
								  
   },err=>{
	  this.errorMessage(err)
	  Swal("Alert!", "Something bad happened; please try again later.", "info");
   }
 )
 }
 getEventJudgesDetails() {
	this.routineservice.getEventJudgeDetails(this.routineObj._id,this.loginuserinfo._id).subscribe((res)=>{
		console.log(res);
		
		  this.eventroutineJudgeObj = res[0];
	})
		  
 }
   RequestForEventMeetroutine(){
//	this.suggestedRoutine.push(this.eventMeetRountine[0]);
	this.routineObj=this.eventMeetRountine[0];
	let objTemp: RoutineModel = new RoutineModel();
	objTemp._id = this.eventMeetRountine[0]._id;
	objTemp.routinestatus = '5';
	objTemp.judgedBy=this.loginuserinfo.username;
	objTemp.judgedOn=new Date().toString();
	objTemp.assignedTo=this.loginuserinfo._id;
	let judgeInfo = this.eventMeetRountine[0].judgeInfo;
	console.log(judgeInfo.hasOwnProperty('isTechnician'))
  if(judgeInfo.hasOwnProperty('isTechnician') && judgeInfo.isTechnician == '1'){
	objTemp.technician_status = '1';
   }
  this.routineservice.updateRoutine(objTemp).subscribe(
   res=>{
	//  //console.log("resssssssssssss",res);
	if(judgeInfo.hasOwnProperty('isTechnician') && judgeInfo.isTechnician == '1'){
		this.routineObj.technician_status = '1';
	   }
	  this.suggestedRoutine.push(this.eventMeetRountine[0]);
	  this.getEventJudgesDetails()
	  
	//this.sessionMaintain();
   })

}

   assignRoutine(i){
	  // //console.log("assignRoutine",i);
	   let eventarray=[]
	  if(i<this.routineList.length){
		  let tempObj=this.routineList[i];
		 //  //console.log("tempObj",i);
		  if(this.judgeEvent.length >0) {
			  
			     for(let j=0;j<this.judgeEvent.length;j++){			  
			    let tempJudgeevent=this.judgeEvent[j];
				//	//console.log("tempJudgeevent",j,tempJudgeevent);
					this.eventService.getevntbyuseridandeventid(tempObj.userid,tempJudgeevent.eventid).subscribe(
					res=>{
					//	//console.log("user",res); 
						 if(res.length>0){
							 eventarray.push(res[0]);
						 }
						if(j==this.judgeEvent.length-1){
							
						   this.pushtoScoring(i,eventarray);
						}	
					},err=>{
						this.errorMessage(err);
					})	
              		
		     }
		  }else{
			  this.pushtoScoring(i,eventarray);
		  }
		
	   }else{
		   this.showRequest=true;
		   Swal("Alert!","Currently you are not allowed to access a routine","info")
	   }
   }
  pushtoScoring(i,eventarray){
	 // //console.log("pushtoScoring",i,eventarray);
	  if(eventarray.length>0){
		  for(let j=0;j<eventarray.length;j++){
			  let tempevent=eventarray[j];
			  ////console.log("Nod",tempevent.Nod)
			    var a = moment(tempevent.start);
			   	var b = moment();
				  var c=a.diff(b, 'days');
				// //console.log("Nod",c);
				if(parseInt(tempevent.Nod)<c){
					if(j==eventarray.length-1){
							  let objTemp: RoutineModel = new RoutineModel();
								objTemp._id = this.routineList[i]._id;
								objTemp.routinestatus = '2';
								objTemp.judgedBy=this.loginuserinfo.username;
								objTemp.judgedOn=new Date().toString();
								objTemp.assignedTo=this.loginuserinfo._id;
								if((this.routineList[i].uploadingfor == '1' || this.routineList[i].uploadingfor == '3')&& this.routineList[i].technician_status && this.routineList[i].technician_status == '0') {
									objTemp.technician_status = '1';
								 }
								
							 this.routineservice.updateRoutine(objTemp).subscribe(
							   res=>{
								//  //console.log("resssssssssssss",res);
								  this.suggestedRoutine.push(this.routineList[i]);
								  this.routineObj=this.routineList[i];
								  if((this.routineList[i].uploadingfor == '1' || this.routineList[i].uploadingfor == '3')&& this.routineList[i].technician_status && this.routineList[i].technician_status == '0') {
								  this.routineObj.technician_status = '1';
								  }
								  this.sessionMaintain();
								 //Swal("Success!","Routine marked as inappropriate.", "success");							  
							   },err=>{
								  this.errorMessage(err)
								  Swal("Alert!", "Something bad happened; please try again later.", "info");
							   }
                             )
					}				 
				}
				else{
					  
					    j=eventarray.length;
						this.assignRoutine(i+1);
                         
				}
		  }
	  }
	  else{
		   let objTemp: RoutineModel = new RoutineModel();
								objTemp._id = this.routineList[i]._id;
								objTemp.routinestatus = '2';
								objTemp.judgedBy=this.loginuserinfo.username;
								objTemp.judgedOn=new Date().toString();
								objTemp.assignedTo=this.loginuserinfo._id;
								if((this.routineList[i].uploadingfor == '1' || this.routineList[i].uploadingfor == '3')&& this.routineList[i].technician_status && this.routineList[i].technician_status == '0') {
									objTemp.technician_status = '1';
								 }
							 this.routineservice.updateRoutine(objTemp).subscribe(
							   res=>{
								// //console.log("resssssssssssss",this.routineList[i]);
								  this.suggestedRoutine.push(this.routineList[i]);
								  this.routineObj=this.routineList[i];
								  if((this.routineList[i].uploadingfor == '1' || this.routineList[i].uploadingfor == '3')&& this.routineList[i].technician_status && this.routineList[i].technician_status == '0') {
									this.routineObj.technician_status = '1';
								 }
								  this.sessionMaintain();
								 //Swal("Success!","Routine marked as inappropriate.", "success");							  
							   },err=>{
								  this.errorMessage(err)
								  Swal("Alert!", "Something bad happened; please try again later.", "info");
							   }
                             )
	  }
  }
  getJudgedRoutine(){
    this.routineservice.getJudgedRotineByuser(this.loginuserinfo._id).subscribe(
      res=>{
			
				this.judgedRoutine=res;
				
				for(let i=0;i<this.judgedRoutine.length;i++){
					if(this.judgedRoutine[i].routinestatus=='3'){
						this.inComplete.push(this.judgedRoutine[i])
					}else if(this.judgedRoutine[i].routinestatus=='4'){
						this.inApp.push(this.judgedRoutine[i])
					}else if(this.judgedRoutine[i].routinestatus=='1'){
						this.scored.push(this.judgedRoutine[i])
					}
				
				}
				////console.log('judged routines',this.scored[0],this.inApp,this.inComplete)
      },err=>{
          this.errorMessage(err);
      }
    )
  }
  
  judgedeventMeetRoutine:any=[]
  inCompleteE:any=[]
  inAppE:any=[]
  scoredE:any=[]

  getJudgedEventMeetRoutine(){

    this.routineservice.getJudgedEventMeetRoutine(this.loginuserinfo._id).subscribe(
      res=>{
		   console.log(res)
			 if(res.success){
				this.judgedeventMeetRoutine=res.result?res.result:[];
				
				for(let i=0;i<this.judgedeventMeetRoutine.length;i++){
					if(this.judgedeventMeetRoutine[i].routinestatus=='3'){
						this.inCompleteE.push(this.judgedeventMeetRoutine[i])
					}else if(this.judgedeventMeetRoutine[i].routinestatus=='4'){
						this.inAppE.push(this.judgedeventMeetRoutine[i])
					}else if(this.judgedeventMeetRoutine[i].routinestatus=='1'){
						this.scoredE.push(this.judgedeventMeetRoutine[i])
					}
				
				}
			 }else{

			 }
				
				////console.log('judged routines',this.scored[0],this.inApp,this.inComplete)
      },err=>{
          this.errorMessage(err);
      }
    )
  }
errorMessage(objResponse: any) {
 // //console.log(objResponse)
  if(objResponse.message){
    Swal("Alert !", objResponse.message, "info");
  }
  else{
    Swal("Alert !", objResponse, "info");
  }
 
}
onClick(){
 
  
    }
    openPage(i){
      this.route.navigate(['routines/to-judge',i])

    }
 
}
