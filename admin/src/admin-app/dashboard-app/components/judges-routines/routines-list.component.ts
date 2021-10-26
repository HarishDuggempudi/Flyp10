import { Component, OnInit, EventEmitter ,ViewChild, ElementRef, NgModule ,HostListener,OnDestroy} from "@angular/core";
import {Location} from "@angular/common";
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { SportService } from '../sport/sport.service';
import Swal from 'sweetalert2';
import {Config} from '../../../shared/configs/general.config';
import {RegisterUserModel} from "../user-management/user.model";
import {Validators, FormBuilder, FormGroup, FormControl,FormArray} from "@angular/forms";
// import {RoutineModel} from "./routine.model";
// import {RoutineService} from "./routines.service";
import * as moment from 'moment';
import {ScoreComponent} from './score.component'
import {MDCSlider} from '@material/slider';
import { CeiboShare } from 'ng2-social-share';
import { ShareButtons } from '@ngx-share/core';
import {ActivatedRoute, Router } from '@angular/router';
import {MatSliderModule} from '@angular/material/slider';
import {RoutineModel,RoutineResponse} from '../my-routines/routine.model';
import {RoutineService} from "./routines.service";
import { RoutineComment,ScoreCard} from "./routine.model";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TeammateService } from '../teammate/teammate.service';
import {UserService} from "../user-management/user.service";
import {WalletService} from "../wallet/wallet.service";
import {WalletModel} from "../wallet/wallet.model";
import { ComponentCanDeactivate } from './pending-changes.guard';
import { Observable } from 'rxjs/Observable';
import {ElementModel} from "../sport/sport.model";
import {map, startWith} from 'rxjs/operators';
import { EventMeetService } from "../events-meet/event-meet-service";
import { forEach } from "@angular/router/src/utils/collection";
import { Ng2DeviceService } from 'ng2-device-detector';

@Component({
  selector: "routine-list",
  templateUrl: "./routines-list.html",
  styleUrls: ['./routines.scss'],
})



export class RoutineListComponent implements OnInit,OnDestroy,ComponentCanDeactivate {
    @ViewChild('toJudgeVideo') toJudgeVideo:ElementRef; 
    comments:any[] = [];
    comment:string="";
    addComments:boolean = false;
    currentDuration:any="00.00";
    incompleteVideo:boolean = false;
    value:number;
    repoUrl:any;
    imageUrl:any;
    score:FormGroup;
	startValueForm:FormGroup;
	addCommentForm:FormGroup;
	reportForm:FormGroup;
	elementval:any=[];
    dismiss:any;
    firstscore:any;
	pricinginfo:any
    secondscore:any;
    routineId:string;
	degreeofDifficult:any=1;
    loginuserinfo:RegisterUserModel=new RegisterUserModel();
    userinfo:RegisterUserModel=new RegisterUserModel();
    routineObj:RoutineModel= new RoutineModel();
    commentObj:RoutineComment=new RoutineComment();
	startValue:boolean=false;
	isScoreMatch:boolean=true;
	finalscore:any=0;
	setsession:boolean=true;
	isExpired:boolean=false;
	 timoutcall:any;
	 scoreCard:ScoreCard=new ScoreCard();
   timerInterval:any;
   filteredOptions:any=[];
   judgeCount:any=1;
	commentlist:any=[{"value":"0","label":"Start Value"},{"value":"1","label":"(-)Deduction"},{"value":"2","label":"(+)Awarded"}];
	routineJudgeObj: any;
	IsVisibleIncompleteInappropriate: boolean = true;
	eventroutineJudgeObj: any;
	Judges: any;
	secureroutineid;
	isReportSubmitted = false;
	deviceInfo: any;
	@ViewChild('form') form;
	JudgeInfo: any;
	MaxScore: number;
	isMorethanMaxScore: boolean = false;
  constructor(private deviceService: Ng2DeviceService,private _objUserService:UserService,private location :Location,private route:Router,private walletservice:WalletService,private sportservice:SportService,private _service: TeammateService,private _fb: FormBuilder,private routineservice: RoutineService,private activatedRoute: ActivatedRoute,private share:ShareButtons,private _formBuilder: FormBuilder,private slider:MatSliderModule,private eventService:EventMeetService ) {
	activatedRoute.params.subscribe(param => this.routineId = param['routineId']);
	
    let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.loginuserinfo=userInfo;
    this.repoUrl = 'https://github.com/Epotignano/ng2-social-share';
     this.imageUrl = 'https://avatars2.githubusercontent.com/u/10674541?v=3&s=200';

     this.score = this._fb.group({
      scores: ['', Validators.required],
      retype: ['', Validators.required],
  });
  
   this.startValueForm=this._fb.group({
      comment: ['', Validators.required],
      dod: ['1', Validators.required],
	  score: ['',Validators.required],
	  rescore: ['',Validators.required],
	  ND:['']
   });
   this.reportForm=this._fb.group({
	message: ['',Validators.required],
	
 });
  this.addCommentForm=this._fb.group({
	    commentformList: this._fb.array([
              this.intialComment(),
        ])
  });
  
}
sendtheReport() {
	var device;
	var deviceInfo;
	this.deviceInfo = this.deviceService.getDeviceInfo();
	const isMobile = this.deviceService.isMobile();
	const isTablet = this.deviceService.isTablet();
	const isDesktopDevice = this.deviceService.isDesktop();
	console.log(this.deviceInfo);
	if(isMobile){
		device = "Mobile"
	}
	else if(isTablet){
		device = "Tablet"
	}
	else if(isDesktopDevice){
		device = "Desktop"
	}
	deviceInfo= this.deviceInfo.device;
	this.isReportSubmitted = true;
	if(this.reportForm.valid){
		let data = {
			messagebody :`<div class=\"container\"><p><b>Device:</b>`+device+`<br><b>RoutineId :</b>`+this.routineId+`<br><b>JudgeId:</b>`+this.loginuserinfo._id+`<br>`+this.reportForm.value.message+`</p></div>`,
			from:this.reportForm.value.from,
			subject:"Bug Report From Judge"
		}
		this.routineservice.sendReportMail(data).subscribe((res)=>{
			console.log(res);
			this.isReportSubmitted = false;
		    this.reportForm.reset();
			document.getElementById('close').click();
			
			Swal("Success !", "Report sent successfully!", "success");
		})
	}
}

    secondsToMinutes(val) {
     // console.log('value ', val);
	  let value=parseInt(val);
      const minutes: number = Math.floor(value / 60);
      var seconds = Math.floor(value % 60);
      var hours = minutes/60
      if(hours >=1 ) {
        return this.pad(Math.round(hours)) + ':' + this.pad(Math.round(minutes)) + ':' + this.pad(Math.round(seconds));
      }else if(minutes>=1){
		 // console.log('value Time', seconds, Math.round(seconds));
		 
		  return this.pad(Math.round(minutes)) + ':' +this.pad(Math.round(seconds)) ;
	  } else{
		  return ':' +this.pad(Math.round(seconds)) ;
	  }         
   }
   
@HostListener('window:beforeunload', ['$event'])
public doSomething($event) {
    //console.log("do I see this?") // <---- this logs to the console.
if(this.routineObj.routinestatus=='2' && !this.isExpired){
		return false
	}else{
		return true
	}
}

 canDeactivate(): Observable<boolean> | boolean {
    // insert logic to check if there are pending changes here;
    // returning true will navigate without confirmation
    // returning false will show a confirm dialog before navigating away
	if(this.routineObj.routinestatus=='2' && !this.isExpired){
		return false
	}else{
		return true
	}
	
  } 
  ngOnInit() {
	// this.toJudgeVideo.nativeElement.play();
	this.secureroutineid = this.routineId .replace(/.(?=.{4})/g, '.');
    this.getRoutineDetail();
    
	
	
	
  } 

  copyToClipbaord(val: string){
	let selBox = document.createElement('textarea');
	  selBox.style.position = 'fixed';
	  selBox.style.left = '0';
	  selBox.style.top = '0';
	  selBox.style.opacity = '0';
	  selBox.value = val;
	  document.body.appendChild(selBox);
	  selBox.focus();
	  selBox.select();
	  document.execCommand('copy');
	  document.body.removeChild(selBox);
	  Swal("Success !", "Copied to clipboard!", "success");
	  //Swal.close();
	}
  
  

  ngOnDestroy() { 
    
	if(this.routineObj.routinestatus=='2'){		
		clearTimeout(this.timoutcall);
	    clearInterval(this.timerInterval);
		this.clearAssignedRoutine(this.routineObj._id)
	}
	if(this.routineObj.technician_status!='2'){		
		clearTimeout(this.timoutcall);
	    clearInterval(this.timerInterval);
		this.clearAssignedRoutine(this.routineObj._id)
	}
  }
  getElement(id){
	  this.sportservice.getElementByevent(id).subscribe(res=>{
		  // console.log(res)
		  this.elementval=res;
	  },err=>{
		  console.log(err)
	  })
  }
onElementChange(element,com,i){
    // console.log(element)
	 let tempVal=[];
	 tempVal=this.elementval.filter(item=>item.elementName==element);
	 //console.log(tempVal)
	 if(tempVal.length>0){
	   (<FormArray>this.addCommentForm.controls['commentformList']).controls[i]['controls']["skillValue"].setValue(tempVal[0].skillValue);
	   (<FormArray>this.addCommentForm.controls['commentformList']).controls[i]['controls']["factor"].setValue(tempVal[0].factor);
	 }	 
	 //console.log(control.)
}
  
  doFilter(event){
	
	this.filteredOptions=this.elementval.filter(element=>element.elementName.toLowerCase().includes(event.toLowerCase()))
  }
  clearAssignedRoutine(id){	 
		  let objTemp: RoutineModel = new RoutineModel();
								objTemp._id = id;
								objTemp.routinestatus = '0';
								objTemp.judgedBy=" ";
								objTemp.judgedOn=new Date().toString();
								objTemp.assignedTo=" "
								if(this.routineJudgeObj && (this.routineJudgeObj.uploadingfor == '1' || ( this.routineJudgeObj.uploadingfor == '3' && this.routineObj.technician_status != '2'))) {
									objTemp.technician_status = '0'
								}
								else if(this.routineJudgeObj && (this.routineJudgeObj.uploadingfor == '2' || ( this.routineJudgeObj.uploadingfor == '3' && this.routineObj.technician_status == '2'))) {
									objTemp.technician_status = '2'
								}
								else if(this.eventroutineJudgeObj && this.eventroutineJudgeObj.isTechnician == '0'){
									objTemp.technician_status = '2'
								}
								else if(this.eventroutineJudgeObj && this.eventroutineJudgeObj.isTechnician == '1'){
									objTemp.technician_status = '0'
								}			
				this.routineservice.updateAssignedRoutine(objTemp).subscribe(
				   res=>{
					      // Swal("Info","Routine session expired.", "info");	
                            //this.location.back();						   
					 },err=>{
						  this.errorMessage(err)
								 // Swal("Alert!", "Something bad happened; please try again later.", "info");
		         })
 } 
 clearSession(title,id){	 
		  let objTemp: RoutineModel = new RoutineModel();
								objTemp._id = id;
								objTemp.routinestatus = '0';
								objTemp.judgedBy=" ";
								objTemp.judgedOn=new Date().toString();
								objTemp.assignedTo=" "
								if(this.routineJudgeObj && (this.routineJudgeObj.uploadingfor == '1' || ( this.routineJudgeObj.uploadingfor == '3' && this.routineObj.technician_status != '2'))) {
									objTemp.technician_status = '0'
								}
								else if(this.routineJudgeObj && (this.routineJudgeObj.uploadingfor == '2' || ( this.routineJudgeObj.uploadingfor == '3' && this.routineObj.technician_status == '2'))) {
									objTemp.technician_status = '2'
								}
								else if(this.eventroutineJudgeObj && this.eventroutineJudgeObj.isTechnician == '0'){
									objTemp.technician_status = '2'
								}
								else if(this.eventroutineJudgeObj && this.eventroutineJudgeObj.isTechnician == '1'){
									objTemp.technician_status = '0'
								}
				this.routineservice.updateRoutine(objTemp).subscribe(
				   res=>{
					       Swal("Info","Routine session expired.", "info");	
						    this.isExpired=true;
                            this.location.back();						   
					 },err=>{
						  this.errorMessage(err)
								 // Swal("Alert!", "Something bad happened; please try again later.", "info");
		         })
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
		 console.log(e)
	 }
  
 // this.isfullscreen = false;
}
  sessionMaintain(){
	  let timeOut=(14*60000)
	  let seconds=60;

	  //alert(timeOut)
	 this.timoutcall=setTimeout(()=>{ 
	   if(this.routineObj.routinestatus=='2'){
		
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
	   }

	 }, timeOut); 
  }
   getSportPricing(sportid,type){
	 
	 this.sportservice.getSportPricingDetailbysportID(sportid,type)
	 .subscribe(res=>{
		// console.log("pricing",res);
		 if(res){
			 this.pricinginfo=res[0];
			
		 }
          		 
	 },err=>{
		// console.log(err);
	 })
 }
  getUserDetail(uid) {
    this._objUserService.getUserDetail(uid)
      .subscribe(resUser => {
        // console.log(resUser)
		 this.userinfo=resUser;
      },
        error => this.errorMessage(error));
  }
  intialComment(){
	 // console.log("intial comment")
   return  this._fb.group({		  
			  time: [this.secondsToMinutes(this.currentDuration), Validators.required],
			  element: ['',Validators.required],
			  comment: [''],
			  skillValue: [0, Validators.required],
			  execution: [0,''],
			  bonus: [0,''],
			  factor: [1,Validators.required],
			  total:[''],
			  submitted:[0]
		  });
  }
  formatdate(date){
    return moment(new Date(date)).format('L');
  }
  showaddCommentsBar(){
    this.addComments = true;
    this.toJudgeVideo.nativeElement.pause();
  }
  
  showaddCommentform(){
	   //console.log("Add NEw comment Form")

	   this.toJudgeVideo.nativeElement.pause();
	   const control = <FormArray>this.addCommentForm.controls['commentformList'];
	  // console.log(control.value)
	   let controlvalue=[];
	    controlvalue=control.value;
	   if(this.comments.length == controlvalue.length){
		   control.insert(0,this.intialComment());
	   }else{
		   // console.log(control.valid);
		   if(controlvalue.length==1){
			   (<FormArray>this.addCommentForm.controls['commentformList']).controls[0]['controls']["time"].setValue(this.secondsToMinutes(this.currentDuration));
		   }else{
			 Swal("Alert !","Please complete your previous comment", "info")  
		   }
	   }
       
	
	  
  }
  getComment(){
    this.routineservice.getRoutineCommentbyroutineid(this.routineId,this.loginuserinfo._id).subscribe(
      res=>{
         this.comments=res;
      },err=>{
        this.errorMessage(err);
      }
    )
  }
  showCommentsBar(){
    this.toJudgeVideo.nativeElement.pause();
    Swal({
      title: "Are you sure want to mark this routine as inappropriate?",
      text: "You will not be able to edit this after submit!.",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes"
    }).then(result => {
      if (result.value) {
		if(this.routineObj.sportid == Config.MFigureSkating || this.routineObj.sportid == Config.WFigureSkating){
		  if(this.routineJudgeObj && (this.routineJudgeObj.uploadingfor == '1' || ( this.routineJudgeObj.uploadingfor == '3' && this.routineObj.technician_status != '2'))) {
              this.showCommentsBarAsTechnician()
		  }
		  else if(this.eventroutineJudgeObj &&(this.eventroutineJudgeObj.isTechnician == '1')&& this.eventroutineJudgeObj.eventmeetInfo.EventLevel == '1'){
			this.showCommentsBarAsTechnician()
		  }
		  else {
			  this.showCommentsBarAsJudges()
		  }
		}
		else {
			this.showCommentsBarAsJudges()
		}
      
        
      }
    });
  }
  showCommentsBarAsTechnician() {
	let objTemp: RoutineModel = new RoutineModel();
	objTemp._id = this.routineObj._id;
	objTemp.routinestatus = '4';
	objTemp.judgedBy=this.loginuserinfo.username;
	objTemp.judgedOn=new Date().toString();
	objTemp.jid=this.loginuserinfo._id;
	objTemp.technician_status = '2';
   if(this.routineObj.uploadingType=='1'){
	this.updateTechnicianRoutine('4');
	this.routineservice.updateRoutine(objTemp).subscribe(
		res=>{
		 // console.log("resssssssssssss",res);
		  Swal("Success!","Routine marked as inappropriate.", "success");
		//  this.getRoutineDetail();
			  let msg='Your routine "'+this.routineObj.title+'" marked as inappropriate.'
					  this.pushNotification(msg,'4');
					  this.RefundWallet('1')
					  this.routineObj.technician_status=objTemp.technician_status
					  this.route.navigate(["/routines"]);
		},err=>{
		   this.errorMessage(err)
		   Swal("Alert!", err, "info");
		}
	  )

   }else{

	this.updateTechnicianRoutine('4');
	this.routineservice.updateRoutine(objTemp).subscribe(
		res=>{
	this.routineservice.updateEventMeetRoutineID(objTemp._id,objTemp).subscribe(
		res=>{
		 // console.log("resssssssssssss",res);
		  Swal("Success!","Routine marked as inappropriate.", "success");
			  this.routineObj.technician_status=objTemp.technician_status;
			  this.route.navigate(['routines'])
			  //let msg='Your routine "'+this.routineObj.title+'" marked as inappropriate.'
			  //this.pushNotification(msg,'4');
			  this.RefundWallet('2')
		},err=>{
		   this.errorMessage(err)
		   Swal("Alert!", err, "info");
		}
	  )
	})
   }
  }
  updateTechnicianRoutine(status){
	let objTemp ={
		_id : this.routineObj._id,
		status : status,
		judgedBy:this.loginuserinfo.username,
		judgedOn:new Date().toString(),
		judgeid:this.loginuserinfo._id,
		score:this.startValueForm.value.score?this.startValueForm.value.score:'0',
		comment:this.startValueForm.value.comment?this.startValueForm.value.comment:'',
		dod:this.startValueForm.value.dod?this.startValueForm.value.dod:'0'
	}
	
	this.routineservice.updateTechnicianRoutine(objTemp).subscribe((res)=>{
		console.log(res)
	})
  }
  showCommentsBarAsJudges() {
	let objTemp: RoutineModel = new RoutineModel();
	objTemp._id = this.routineObj._id;
	objTemp.routinestatus = '4';
	objTemp.judgedBy=this.loginuserinfo.username;
	objTemp.judgedOn=new Date().toString();
	objTemp.jid=this.loginuserinfo._id;
	if(this.routineObj.SanctionRoutine){
		objTemp.judgePanelid = this.eventroutineJudgeObj.judgePanelid;
		objTemp.judgePanel = this.eventroutineJudgeObj.judgePanel
	}
   if(this.routineObj.uploadingType=='1'){
	this.routineservice.updateRoutine(objTemp).subscribe(
		res=>{
		 // console.log("resssssssssssss",res);
		  Swal("Success!","Routine marked as inappropriate.", "success");
		//  this.getRoutineDetail();
			  let msg='Your routine "'+this.routineObj.title+'" marked as inappropriate.'
					  this.pushNotification(msg,'4');
					  this.RefundWallet('1')
					  this.routineObj.routinestatus=objTemp.routinestatus
					  this.route.navigate(["/routines"]);
		},err=>{
		   this.errorMessage(err)
		   Swal("Alert!", err, "info");
		}
	  )

   }else{


	this.routineservice.updateEventMeetRoutineID(objTemp._id,objTemp).subscribe(
		res=>{
		 // console.log("resssssssssssss",res);
		  Swal("Success!","Routine marked as inappropriate.", "success");
			  this.routineObj.routinestatus=objTemp.routinestatus;
			  this.route.navigate(['routines'])
			  //let msg='Your routine "'+this.routineObj.title+'" marked as inappropriate.'
			  //this.pushNotification(msg,'4');
			  this.RefundWallet('2')
		},err=>{
		   this.errorMessage(err)
		   Swal("Alert!", err, "info");
		}
	  )
   }
  }
  addComment(){
    //console.log('video duration change ====> ', this.currentDuration)
    let comment = {
        comment: this.comment,
        time: this.currentDuration,
        addedBy: 'JudgeName',
    }
   // this.postComment(this.comment,this.currentDuration);
    this.comments.push(comment);
    this.addComments = false;
    this.comment = "";
    this.toJudgeVideo.nativeElement.play();
}
getJudgeCount(){
	this.routineservice.getEventJudgesCount(this.routineObj._id).subscribe(res=>{
		 console.log('getEventJudgesCount',res)
		 if(res.success){
			let response= res.result?res.result:[]
			this.judgeCount=response.length?response.length:1
		 }
	})
}
 getSportEventDetailByEvent(event){
	 this.sportservice.getSporteventDetailbyEvent(event).subscribe(
	 res=>{
		// console.log("Event tttttttttttttttttttttt",res);
		 if(res.length>0){
			 let temp=res[0];
			 this.startValueForm.controls['dod'].setValue(temp.difficultyFactor);
		 }
	 },err=>{
		 this.errorMessage(err)
	 }) 
 }
  postComment(controls){
	  //console.log("ssssssssssssssssssss",controls)
       let commentObj:RoutineComment=new RoutineComment();
        commentObj.judgeid=this.loginuserinfo._id;
		commentObj.routineid=this.routineId;
		commentObj.routinetitle=this.routineObj.title;
		commentObj.userid=this.routineObj.userid;
		commentObj.judgename=this.loginuserinfo.username;
		commentObj.comment=controls.value.comment;
		commentObj.time=controls.value.time;
		commentObj.bonus=controls.value.bonus;
		commentObj.element=controls.value.element;
		commentObj.skillvalue=controls.value.skillValue;
		commentObj.factor=controls.value.factor;
		commentObj.execution=controls.value.execution;
		commentObj.state=this.userinfo.address;
		let tot=((controls.value.skillValue+controls.value.execution)*(controls.value.factor))+(controls.value.bonus && controls.value.bonus!=null && controls.value.bonus!=undefined ?controls.value.bonus:0);
		console.log(tot,this.finalscore)          
		tot=Math.round(tot * 100 ) / 100
		//console.log(tot)
	     commentObj.total=tot
		this.comments.push(commentObj);
		this.calculateFinalScore(commentObj)
		this.filteredOptions=this.elementval 
		//this.toJudgeVideo.nativeElement.play();
    
  }
  
  calculateFinalScore(Obj){
	  //console.log("finalScore",this.finalscore,Obj.total)
	    this.finalscore=this.finalscore+Obj.total;
		let score=this.startValueForm.value.dod*this.finalscore;
		if (!isNaN(score)) {
			 score=Number(score.toFixed(3));
			  this.startValueForm.controls['score'].setValue(score);
			  //this.startValueForm.controls['score'].updateValueAndValidity();
		    }

  }
  resetFinalScore(Obj){
	  this.recalculate();

  }
  onchangeDOD(){
	   let score=this.startValueForm.value.dod*this.finalscore;
		    //console.log("Score+",score)
			if (!isNaN(score)) {
				score=Number(score.toFixed(3));
			  this.startValueForm.controls['score'].setValue(score)
		     }
  }
  pushTechnicianCommentToServer(comment){
	comment.sport = this.routineObj.sport;
	comment.level = this.routineObj.level;
	comment.event = this.routineObj.event;
   this.routineservice.postTechnicianComment(comment).subscribe(
  res=>{
	console.log(res);
	/* this.startValue=true;
	this.comments.push(this.commentObj); */
  },err=>{
	this.errorMessage(err)
  }
)
}
  pushCommentToServer(comment){
		comment.sport = this.routineObj.sport;
		comment.level = this.routineObj.level;
		comment.event = this.routineObj.event;
		if(this.routineObj.SanctionRoutine) {
			comment.judgePanelid = this.eventroutineJudgeObj.judgePanelid;
			comment.judgePanel = this.eventroutineJudgeObj.judgePanel
		}
		comment.overallcomment = this.startValueForm.value.comment?this.startValueForm.value.comment:""
	   this.routineservice.postComment(comment).subscribe(
      res=>{
        console.log(res);
		/* this.startValue=true;
		this.comments.push(this.commentObj); */
      },err=>{
        this.errorMessage(err)
      }
    )
  }
  removeComment(i,control){
	  if(control.value.type!="0"){	
		Swal({
			title: "Are you sure want to delete this comment?",
			text: "",
			type: "warning",
			showCancelButton: true,
			confirmButtonColor: "#DD6B55",
			confirmButtonText: "Yes"
		  }).then(result => {
			if (result.value) {	   
		   const controls = <FormArray>this.addCommentForm.controls['commentformList'];
           controls.removeAt(i);
		   this.comments.pop();
		   this.resetFinalScore(control.value);
			}
		})
		  // console.log("this.comments",this.comments)
	  }else{
		  Swal("Alert !","Start value cannot be deleted.", "info");
	  }
	   
  }
  postJudgesNodes(controls,i){
	 // console.log(controls);
	  if(controls.valid){
		  //controls['submitted'].setValue(1)
		  const controls1 = <FormArray>this.addCommentForm.controls['commentformList'];
		  const group = <FormGroup>controls1.controls[i];
		  group.controls['submitted'].setValue(1);
		  //group.controls['submitted'].updateValueAndValidity();
		   //console.log(controls.controls[i]);
		  this.postComment(controls);		
	  }
	
      
  }
  getRoutineDetail(){
    this.routineservice.getRoutinebyroutinestatusid(this.routineId).subscribe(
      res=>{
		this.routineObj=res;
		
		//console.log("xcxcx",res,this.loginuserinfo._id)
		if(this.routineObj.uploadingType=='1'){
			if(this.loginuserinfo._id==this.routineObj.assignedTo){		
				if(this.routineObj.routinestatus=='2'){
				   this.sessionMaintain();
				}
			   this.getScoreCardconfig(this.routineObj.sportid);
			   this.getSportPricing(this.routineObj.sportid,this.routineObj.scoretype);
			   this.getSportEventDetailByEvent(this.routineObj.event);
			   this.getUserDetail(this.routineObj.userid);
			   this.getElement(this.routineObj.eid);
			   this.getMaxScoreForLevel(this.routineObj.lid);
			   this.getJudgesSportDetails();
			   
		   }else{
			   Swal("Alert !","Unauthorized Access", "info");
			   this.route.navigate(["/routines"]);
		   }
		}else{
			// if(this.routineObj.routinestatus=='2'){
			// 	this.sessionMaintain();
			//  }
			this.getScoreCardconfig(this.routineObj.sid);
			this.getEventMeetDetailsByID()
			//this.getSportPricing(this.routineObj.sportid,this.routineObj.scoretype);
			this.getJudgeCount()
			this.getSportEventDetailByEvent(this.routineObj.event);
			this.getUserDetail(this.routineObj.userid);
			this.getElement(this.routineObj.eid);
			this.getMaxScoreForLevel(this.routineObj.lid);
			this.getEventJudgesDetails();
			//this.getJudgesSportDetails();
			
		}
		
      //  console.log("response Routine",res)
		
      },
      err=>{
         //console.log("err")
      }
    )
  }
  getMaxScoreForLevel(lid){
	this.routineservice.getMaxScoreForLevel(lid).subscribe((res)=>{
		console.log(res);
		this.MaxScore = res.maxscore?Number(res.maxscore):0
	})
  }

  getEventJudgesDetails() {
	  this.routineservice.getEventJudgeDetails(this.routineObj._id,this.loginuserinfo._id).subscribe((res)=>{
		  console.log(res);
		  if(res[0].hasOwnProperty('isTechnician')){
			this.eventroutineJudgeObj = res[0];
			if(this.eventroutineJudgeObj &&(this.eventroutineJudgeObj.isTechnician == '0')&& this.eventroutineJudgeObj.eventmeetInfo.EventLevel == '1'){
				//populate the technician routine  status comment;
				this.showIncompleteInappropriate();
				this.loadTechnicianRoutineStatusData();
				this.loadTechnicianRoutineComment();
			}
			
		  }
		 
	  })
  }
  
  getJudgesSportDetails() {
	this.routineservice.getJudgesSportDetails(this.routineObj.sportid,this.routineObj.lid,this.routineObj.assignedTo).subscribe((res)=>{
		this.routineJudgeObj = res.result[0];
		this.showIncompleteInappropriate();
		if(this.routineJudgeObj &&(this.routineJudgeObj.uploadingfor == '2' || (this.routineJudgeObj.uploadingfor == '3' && this.routineObj.technician_status == '2'))){
			//populate the technician routine  status comment;
			this.loadTechnicianRoutineStatusData()
		    this.loadTechnicianRoutineComment();
		}
		
	}) 

  }
  showIncompleteInappropriate() {
	if(this.routineObj.sportid == Config.MFigureSkating || this.routineObj.sportid == Config.WFigureSkating){	  
	if(this.routineJudgeObj && (this.routineJudgeObj.uploadingfor =='2' || ( this.routineJudgeObj.uploadingfor == '3' && this.routineObj.technician_status == '2'))){
		this.IsVisibleIncompleteInappropriate = false;
	}
else if(this.eventroutineJudgeObj &&(this.eventroutineJudgeObj.isTechnician == '0')&& this.eventroutineJudgeObj.eventmeetInfo.EventLevel == '1'){
	this.IsVisibleIncompleteInappropriate = false;
}
	else {
		this.IsVisibleIncompleteInappropriate = true;
	}
}

  }
  loadTechnicianRoutineStatusData() {
	  this.routineservice.getTechnicianRoutineStatusData(this.routineObj._id).subscribe((res)=>{
		  console.log(res);
		  if(res.length > 0){
			this.startValueForm.controls['dod'].setValue(res[0].dod);
			this.startValueForm.controls['comment'].setValue(res[0].comment);
			this.startValueForm.controls['score'].setValue(res[0].score);
		  }
		 
	  })
  }
  loadTechnicianRoutineComment(){
	  this.routineservice.getTechnicianRoutineComment(this.routineObj._id).subscribe((res)=>{
		// let data = res[0].reverse;
		res = res.reverse();
		if(res.length > 0)
		{
			
			this.insertaddCommentForm(res.length-1)
			for(var i =0;i< res.length ;i++){
				
			(<FormArray>this.addCommentForm.controls['commentformList']).controls[i]['controls']["comment"].setValue(res[i].comment);
			(<FormArray>this.addCommentForm.controls['commentformList']).controls[i]['controls']["element"].setValue(res[i].element);
			 (<FormArray>this.addCommentForm.controls['commentformList']).controls[i]['controls']["skillValue"].setValue(res[i].skillvalue);
			 (<FormArray>this.addCommentForm.controls['commentformList']).controls[i]['controls']["execution"].setValue(res[i].execution);
			 (<FormArray>this.addCommentForm.controls['commentformList']).controls[i]['controls']["bonus"].setValue(res[i].bonus);
			 (<FormArray>this.addCommentForm.controls['commentformList']).controls[i]['controls']["factor"].setValue(res[i].factor);
			 (<FormArray>this.addCommentForm.controls['commentformList']).controls[i]['controls']["total"].setValue(res[i].total);
			 var control = (<FormArray>this.addCommentForm.controls['commentformList']).controls[i]
			 this.postJudgesNodes(control,i);
			}
		}
		 
	  })
  }
  insertaddCommentForm(count) {
	  for(var i=0;i<count;i++)
	  {
		const control = <FormArray>this.addCommentForm.controls['commentformList'];
		control.insert(0,this.intialComment());
	  }
  }
  getEventMeetDetailsByID(){
	  console.log(this.routineObj)
	this.eventService.getEventMeet(this.routineObj.eventMeetId).subscribe(res=>{
		console.log('getEventMeet',res)
        if(res.success){
            let result=res.result
			let judgeprice=0
			let competitorprice=0
			let technicianprice = 0
			console.log(result)
            if(this.routineObj.scoretype=='1'){
				judgeprice=result.SjudgePrice
				competitorprice=result.ScompetitorPrice
				technicianprice = result.StechnicianPrice?result.StechnicianPrice:"0"
            }else{
				judgeprice=result.NjudgePrice
				competitorprice=result.NcompetitorPrice
				technicianprice = result.NtechnicianPrice?result.NtechnicianPrice:"0"
			}
			this.pricinginfo={
				judge:judgeprice,
				competitor:competitorprice,
				technician:technicianprice
			}
            //let findjudges=result.Judges
            // for(let i=0;i<findjudges.length;i++){
            //    let temp=findjudges[i]
            //   //console.log(temp)
            //    if(temp.Event==routine.eid){
            //      let Judges=temp.Judges
            //      let judgesCount=Judges.length
            //      let Amt=(Number(price)*Number(judgesCount))
            //      let response={
            //       competitor:Amt,
            //       judge:Amt
            //      }
            //      this.RefundWallet(response,routine)
            //    }
            // }
         } 
      })
  }
  getEventRoutineDetails(){
	   this.routineservice.getEventRoutineDetails(this.loginuserinfo._id,this.routineObj._id).subscribe(res=>{

		   console.log(res);
		   if(res.success){
			   this.routineObj=res[0]?res[0]:{}
			   this.routineObj.routinestatus=this.routineObj.judgeinfo.routinestatus;
		   }
	   })
  }
  getScoreCardconfig(sportid){
	  	 this.sportservice.getScoreCardConfigBySportid(sportid)
        .subscribe(res => {
			//console.log("getScoreCardconfig",res)
			let temp=res;
			if(res.length>0){
				 this.scoreCard=res[0];
			}else{

			}		
		},
         error =>{this.errorMessage(error)});
  }
  deleteComment(comment){
    this.comments.splice(this.comments.indexOf(comment),1);

  }
  ontypeChange(event){
	  //console.log(event.value)
	  if(event.value=='0' && this.startValue){
		   Swal("Info!","Start value already exists.", "info");
	  }
  }
  submitstatus(status,score){
	if(this.routineObj.sportid == Config.MFigureSkating || this.routineObj.sportid == Config.WFigureSkating){
   if(this.routineJudgeObj && (this.routineJudgeObj.uploadingfor =='1' || ( this.routineJudgeObj.uploadingfor == '3' && this.routineObj.technician_status != '2'))){
	this.submitstatusAsTechnician(status,score)
   }
   else if (this.eventroutineJudgeObj && this.eventroutineJudgeObj.isTechnician == '1'){
	this.submitstatusAsTechnician(status,score)
   }
   else {
	this.submitstatusAsJudge(status,score)
   }
}
else {
	this.submitstatusAsJudge(status,score);
}
    
  }
  submitstatusAsTechnician(status,score) {
	let objTemp: RoutineModel = new RoutineModel();
	objTemp._id = this.routineObj._id;
	objTemp.routinestatus = status;
    objTemp.judgedBy=this.loginuserinfo.username;
    objTemp.jid=this.loginuserinfo._id;
	objTemp.judgedOn=new Date().toString();
	objTemp.technician_status = '2';
    if(score){
      objTemp.score=score
	}
	if(this.routineObj.uploadingType=='1'){
		 this.updateTechnicianRoutine(status);
		 this.routineservice.updateRoutine(objTemp).subscribe(
			res=>{
			 // console.log("resssssssssssss",res);
			  Swal("Success!","Routine status updated successfully.", "success");
			//  this.getRoutineDetail();
			   let msg='Your routine "'+this.routineObj.title+'" marked as poor video quality.'
			   this.pushNotification(msg,'3');
			   this.RefundWalletForTechnician('1');
			   this.routineObj.routinestatus=objTemp.routinestatus
			   this.routineObj.technician_status=objTemp.technician_status;
			   this.route.navigate(["/routines"]);
			},err=>{
			   this.errorMessage(err)
			}
		  )
	}else{
		this.updateTechnicianRoutine(status);
		this.routineservice.updateRoutine(objTemp).subscribe((res)=>{
		
		this.routineservice.updateEventMeetRoutineID(objTemp._id,objTemp).subscribe(
			res=>{
			 // console.log("resssssssssssss",res);
			  Swal("Success!","Routine status updated successfully.", "success");
			  this.routineObj.technician_status=objTemp.technician_status;
				  this.route.navigate(['routines'])
			   //let msg='Your routine "'+this.routineObj.title+'" marked as incomplete.'
			   //this.pushNotification(msg,'3');
			   this.RefundWalletForTechnician('2');
			},err=>{
			   this.errorMessage(err)
			}
		  )
		})
	}

  }
  submitstatusAsJudge(status,score){
	let objTemp: RoutineModel = new RoutineModel();
    objTemp._id = this.routineObj._id;
    objTemp.routinestatus = status;
    objTemp.judgedBy=this.loginuserinfo.username;
    objTemp.jid=this.loginuserinfo._id;
	objTemp.judgedOn=new Date().toString();
	if(this.routineObj.SanctionRoutine){
		objTemp.judgePanelid = this.eventroutineJudgeObj.judgePanelid;
		objTemp.judgePanel = this.eventroutineJudgeObj.judgePanel
	}
	
    if(score){
      objTemp.score=score
	}
	if(this.routineObj.uploadingType=='1'){
		this.routineservice.updateRoutine(objTemp).subscribe(
			res=>{
			 // console.log("resssssssssssss",res);
			  Swal("Success!","Routine status updated successfully.", "success");
			//  this.getRoutineDetail();
			   let msg='Your routine "'+this.routineObj.title+'" marked as poor video quality.'
			   this.pushNotification(msg,'3');
			   this.RefundWallet('1');
			   this.routineObj.routinestatus=objTemp.routinestatus
			   this.route.navigate(["/routines"]);
			},err=>{
			   this.errorMessage(err)
			}
		  )
	}else{

		this.routineservice.updateEventMeetRoutineID(objTemp._id,objTemp).subscribe(
			res=>{
			 // console.log("resssssssssssss",res);
			  Swal("Success!","Routine status updated successfully.", "success");
			  this.routineObj.routinestatus=objTemp.routinestatus;
				  this.route.navigate(['routines'])
			   //let msg='Your routine "'+this.routineObj.title+'" marked as incomplete.'
			   //this.pushNotification(msg,'3');
			   this.RefundWallet('2');
			},err=>{
			   this.errorMessage(err)
			}
		  )
	}

  }
   CheckScore(){
			if(this.startValueForm.value.score==this.startValueForm.value.rescore){
				this.isScoreMatch=true;
			}
			else{
				this.isScoreMatch=false;
			}
			if(Number(this.startValueForm.value.rescore) > this.MaxScore){
				this.isMorethanMaxScore=true;

			}
			else {
				this.isMorethanMaxScore=false;
			}
	}
	whyThis(){
		Swal("","Sports without a Degree of Difficulty to leave this at “1”.");
	}
  validatejudgeNotes(){
	  if(this.routineObj.sportid == Config.MFigureSkating || this.routineObj.sportid == Config.WFigureSkating){
		  //flyp10routine
		if(this.routineJudgeObj && (this.routineJudgeObj.uploadingfor == '1' || ( this.routineJudgeObj.uploadingfor == '3' && this.routineObj.technician_status != '2'))){
		 this.validateJudgesNotesAsTechnician() 
		}
		//eventmeetroutine
		else if (this.eventroutineJudgeObj && this.eventroutineJudgeObj.isTechnician == '1'){
			this.validateJudgesNotesAsTechnician() 
		}
		else {
			this.validatejudgeNotesAsJudge();
		}
	  }
	  else{
		  this.validatejudgeNotesAsJudge()
	  }
	  //if(this.routineObj.scoretype!="2"){
	
  }
  validateJudgesNotesAsTechnician() {
	if(this.routineObj.scoretype=="1"){
		this.submitScoreByTechnician();
	}else{
		 const control = <FormArray>this.addCommentForm.controls['commentformList'];
		  let controlvalue=[];
		  controlvalue=control.value;
		  this.CheckScore();
		  console.log(controlvalue.length,this.comments.length)
		  if(controlvalue.length==this.comments.length){
			  this.submitScoreByTechnician();
		  }else{
			 Swal("Alert !","Please complete your previous comment", "info");
			 
		   }
 }
  }
  submitScoreByTechnician(){
	this.recalculate();
	this.CheckScore()
    if(!this.isMorethanMaxScore && this.startValueForm.value.score==this.startValueForm.value.rescore && this.startValueForm.valid){
    //  this.dismiss="modal";
      Swal({
        title: "Are you sure want to submit this routine score?",
        text: "You will not be able to edit this score after submit!.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes"
      }).then(result => {
        if (result.value) {
          let objTemp: RoutineModel = new RoutineModel();
          objTemp._id = this.routineObj._id;
          objTemp.technician_status = '2';
		  objTemp.judgedOn=new Date().toString();
		
		 
		if(this.routineObj.scoretype =="1"){
		
		 if(this.routineObj.uploadingType=='1'){
			 this.updateTechnicianRoutine('1')
			this.routineservice.updateRoutineTechnicianStatus(objTemp).subscribe(
				res=>{
				  Swal("Success!","Routine Score Submitted Successfully.", "success");
				  this.creditWalletForTechnician('1');
				  let msg='Your routine "'+this.routineObj.title+'" performance was judged.'
				  this.pushNotification(msg,'5');
				  this.routineObj.routinestatus=objTemp.routinestatus;
				  this.routineObj.technician_status=objTemp.technician_status;
				  this.route.navigate(["/routines"]);
				},err=>{
				   this.errorMessage(err)
				   Swal("Alert!", err, "info");
				}
			  ) 

		 }else{
			objTemp.jid=this.loginuserinfo._id;   
			this.updateTechnicianRoutine('1')
			this.routineservice.updateRoutineTechnicianStatus(objTemp).subscribe((res)=>{
			
			
			this.routineservice.updateEventMeetRoutineID(objTemp._id,objTemp).subscribe(
				res=>{
				  console.log("resssssssssssss",res);
				  Swal("Success!","Routine Score Submitted Successfully.", "success");
				  this.routineObj.routinestatus=objTemp.routinestatus;
				  this.routineObj.technician_status=objTemp.technician_status;
				  this.route.navigate(['routines'])
				  this.creditWalletForTechnician('2');
				  this.routineObj.routinestatus='1'
				
				  //this.routineservice.
				 // let msg='Your routine "'+this.routineObj.title+'" performance was judged.'
				  //this.pushNotification(msg,'5');
				},err=>{
				   this.errorMessage(err)
				   Swal("Alert!", err, "info");
				}
			  ) 
			  });
		 }
	      
	    }
		else{
		//	 console.log("notes")			
			if(this.comments.length>0){
			//	console.log("notes list")
			       for(let i=0;i<this.comments.length;i++){
					let temp=this.comments[i];
					this.pushTechnicianCommentToServer(temp);
                    if(i==this.comments.length-1){

						if(this.routineObj.uploadingType=='1'){
							this.updateTechnicianRoutine('1')
							this.routineservice.updateRoutineTechnicianStatus(objTemp).subscribe(
								res=>{
								 // console.log("resssssssssssss",res);
								  Swal("Success!","Routine Score Submitted Successfully.", "success");
								 // this.getRoutineDetail();
								  this.creditWalletForTechnician('1');
								  let msg='Your routine "'+this.routineObj.title+'" performance was judged.'
								  this.pushNotification(msg,'5');
								  this.routineObj.routinestatus=objTemp.routinestatus
								  this.routineObj.technician_status=objTemp.technician_status;
								  this.route.navigate(["/routines"]);
								},err=>{
								   this.errorMessage(err)
								   Swal("Alert!", err, "info");
								}
							  )

						}else{
							objTemp.jid=this.loginuserinfo._id;   
							this.updateTechnicianRoutine('1');
							
							this.routineservice.updateRoutineTechnicianStatus(objTemp).subscribe((res)=>{
								
							this.routineservice.updateEventMeetRoutineID(objTemp._id,objTemp).subscribe(
								res=>{
								 // console.log("resssssssssssss",res);
								  Swal("Success!","Routine Score Submitted Successfully.", "success");
								  this.routineObj.routinestatus=objTemp.routinestatus;
								  this.routineObj.technician_status=objTemp.technician_status;
								  this.route.navigate(['routines'])
								  this.creditWalletForTechnician('2');
								 // let msg='Your routine "'+this.routineObj.title+'" performance was judged.'
								  //this.pushNotification(msg,'5');
								},err=>{
								   this.errorMessage(err)
								   Swal("Alert!", err, "info");
								}
							  )
							 
							});

						}
						    
					 }				
				}
			   			 
			}
			else{
			//	 console.log("no notes list")
				Swal("Alert!", "Please add judge notes before submitting score","info");
			}
		}
         
        }
      });
    }else{
     // Swal("Alert!", "Your Score Mismatch");
	   //console.log(this.startValueForm)
    }

    
  }
  validatejudgeNotesAsJudge() {
	if(this.routineObj.scoretype=="1"){
		this.submitScore();
	}else{
		 const control = <FormArray>this.addCommentForm.controls['commentformList'];
		  let controlvalue=[];
		  controlvalue=control.value;
		  this.CheckScore();
		  console.log(controlvalue.length,this.comments.length)
		  if(controlvalue.length==this.comments.length){
			  this.submitScore();
		  }else{
			 Swal("Alert !","Please complete your previous comment", "info");
			 
		   }
 }
  }
  submitScore(){
	this.recalculate();
	this.CheckScore()
    if(!this.isMorethanMaxScore && this.startValueForm.value.score==this.startValueForm.value.rescore && this.startValueForm.valid){
    //  this.dismiss="modal";
      Swal({
        title: "Are you sure want to submit this routine score?",
        text: "You will not be able to edit this score after submit!.",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes"
      }).then(result => {
        if (result.value) {
          let objTemp: RoutineModel = new RoutineModel();
          objTemp._id = this.routineObj._id;
          objTemp.routinestatus = '1';
		  objTemp.score=this.startValueForm.value.score;
		  objTemp.nd = this.startValueForm.value.ND?this.startValueForm.value.ND:0;
		  objTemp.comment=this.startValueForm.value.comment;
		  objTemp.dod=this.startValueForm.value.dod;
          objTemp.judgedBy=this.loginuserinfo.username;
          objTemp.jid=this.loginuserinfo._id;
          objTemp.judgedOn=new Date().toString();
		  if(this.routineObj.SanctionRoutine){
			objTemp.judgePanelid = this.eventroutineJudgeObj.judgePanelid;
			objTemp.judgePanel = this.eventroutineJudgeObj.judgePanel
		}
		  //console.log(this.comments);
    //   if(this.routineObj.scoretype!="2"){
		if(this.routineObj.scoretype =="1"){
		 //  console.log("score",this.routineObj.scoretype,this.routineObj);
		 if(this.routineObj.uploadingType=='1'){
			this.routineservice.updateRoutine(objTemp).subscribe(
				res=>{
				  console.log("resssssssssssss",res);
				  Swal("Success!","Routine Score Submitted Successfully.", "success");
				 // this.getRoutineDetail();
				  this.creditWallet('1');
				  let msg='Your routine "'+this.routineObj.title+'" performance was judged.'
				  this.pushNotification(msg,'5');
				  this.routineObj.routinestatus=objTemp.routinestatus
				  this.route.navigate(["/routines"]);
				},err=>{
				   this.errorMessage(err)
				   Swal("Alert!", err, "info");
				}
			  ) 

		 }else{
			   
			
			this.routineservice.updateEventMeetRoutineID(objTemp._id,objTemp).subscribe(
				res=>{
				  console.log("resssssssssssss",res);
				  Swal("Success!","Routine Score Submitted Successfully.", "success");
				  this.routineObj.routinestatus=objTemp.routinestatus;
				  this.route.navigate(['routines'])
				  this.creditWallet('2');
				  this.routineObj.routinestatus='1'
				  //this.routineservice.
				 // let msg='Your routine "'+this.routineObj.title+'" performance was judged.'
				  //this.pushNotification(msg,'5');
				},err=>{
				   this.errorMessage(err)
				   Swal("Alert!", err, "info");
				}
			  ) 
		 }
	      
	    }
		else{
		//	 console.log("notes")			
			if(this.comments.length>0){
			//	console.log("notes list")
			       for(let i=0;i<this.comments.length;i++){
					let temp=this.comments[i];
					this.pushCommentToServer(temp);
                    if(i==this.comments.length-1){

						if(this.routineObj.uploadingType=='1'){

							this.routineservice.updateRoutine(objTemp).subscribe(
								res=>{
								 // console.log("resssssssssssss",res);
								  Swal("Success!","Routine Score Submitted Successfully.", "success");
								 // this.getRoutineDetail();
								  this.creditWallet('1');
								  let msg='Your routine "'+this.routineObj.title+'" performance was judged.'
								  this.pushNotification(msg,'5');
								  this.routineObj.routinestatus=objTemp.routinestatus
								  this.route.navigate(["/routines"]);
								},err=>{
								   this.errorMessage(err)
								   Swal("Alert!", err, "info");
								}
							  )

						}else{

							this.routineservice.updateEventMeetRoutineID(objTemp._id,objTemp).subscribe(
								res=>{
								 // console.log("resssssssssssss",res);
								  Swal("Success!","Routine Score Submitted Successfully.", "success");
								  this.routineObj.routinestatus=objTemp.routinestatus;
								  this.route.navigate(['routines'])
								  this.creditWallet('2');
								 // let msg='Your routine "'+this.routineObj.title+'" performance was judged.'
								  //this.pushNotification(msg,'5');
								},err=>{
								   this.errorMessage(err)
								   Swal("Alert!", err, "info");
								}
							  )


						}
						    
					 }				
				}
			   			 
			}
			else{
			//	 console.log("no notes list")
				Swal("Alert!", "Please add judge notes before submitting score","info");
			}
		}
         
        }
      });
    }else{
     // Swal("Alert!", "Your Score Mismatch");
	   //console.log(this.startValueForm)
    }

    
  }
  creditWallet(uploadingType){

	if(Number(this.pricinginfo.judge) > 0.01 ){
	  	 
			
			//console.log(this.pricinginfo.judge,this.judgeCount,uploadingType) 			  
			 let walletObj={
			  "type" :'c',
			  "userid":this.loginuserinfo._id,
			  "balance":this.pricinginfo.judge
		   }
		 this.walletservice.creditUserWallet(walletObj).subscribe(res=>{
				//  console.log(res);	
                 this.saveTransaction(this.pricinginfo.judge);	
                   Swal("Success!","$"+this.formatDollar(this.pricinginfo.judge)+" has been credited to your wallet.", "success");				 
			  },err=>{
				  //console.log(err);
		  })
		
	}
  }
  creditWalletForTechnician(uploadingType){

	if(Number(this.pricinginfo.technician) > 0.01){
	  let walletObj={
	   "type" :'c',
	   "userid":this.loginuserinfo._id,
	   "balance":this.pricinginfo.technician
	}
  this.walletservice.creditUserWallet(walletObj).subscribe(res=>{
		 //  console.log(res);	
		  this.saveTransaction(this.pricinginfo.technician);	
			Swal("Success!","$"+this.formatDollar(this.pricinginfo.technician)+" has been credited to your wallet.", "success");				 
	   },err=>{
		   //console.log(err);
   })
 }
}
    formatDollar(val){
	  if(val){
		  var amt=val.toString();
		  if(amt.indexOf('.')!=-1){
			return amt
		  }else{
			 return amt+'.00'
		  }
	  }
	  else{
		   return '0.00'
	  }
	  
  }
  RefundWallet(type){

	 if(type='1'){

		if(Number(this.pricinginfo.judge) > 0.01){
            // console.log(this.routineObj)
			 let walletObj={
				 
			 }
       		if(this.routineObj.submittedByID){
			   walletObj={
				  "type" :'c',
				  "userid":this.routineObj.submittedByID,
				  "balance":this.pricinginfo.competitor
			   }
			}else{
				 walletObj={
				  "type" :'c',
				  "userid":this.routineObj.userid,
				  "balance":this.pricinginfo.competitor
			   }
			}
			//console.log(walletObj)
		 this.walletservice.creditUserWallet(walletObj).subscribe(res=>{
				//  console.log(res);	
                 this.saveRefundTransaction(this.pricinginfo.competitor,walletObj);	                 				 
			  },err=>{
				 // console.log(err);
		  })
		}
	 }
	  	 
  }
  RefundWalletForTechnician(type){

	if(type='1'){

	   if(Number(this.pricinginfo.technician) > 0.01){
		   // console.log(this.routineObj)
			let walletObj={
				
			}
			  if(this.routineObj.submittedByID){
			  walletObj={
				 "type" :'c',
				 "userid":this.routineObj.submittedByID,
				 "balance":this.pricinginfo.competitor
			  }
		   }else{
				walletObj={
				 "type" :'c',
				 "userid":this.routineObj.userid,
				 "balance":this.pricinginfo.competitor
			  }
		   }
		   //console.log(walletObj)
		this.walletservice.creditUserWallet(walletObj).subscribe(res=>{
			   //  console.log(res);	
				this.saveRefundTransaction(this.pricinginfo.competitor,walletObj);	                 				 
			 },err=>{
				// console.log(err);
		 })
	   }
	}
		  
 }
   saveTransaction(Amount){
		  var desc='Routine scoring -'+this.routineObj.title;
		  var time= moment(new Date()).format("MM/DD/YYYY HH:mm:ss A").toString();
		  var transactionObj={
								  userid:this.loginuserinfo._id,
								  txn_amount:Amount,
								  txn_type:'c',
								  txn_id:Math.random().toString(36).substr(2, 9),
								  txn_token:'',
								  txn_desc:desc,
								  txn_date:	time	  
		                    }
						
			this.walletservice.saveTransaction(transactionObj).subscribe(res=>{
				 // console.log(res);			  
			  },err=>{
				//  console.log(err);
		     })			  
	  } 
	   saveRefundTransaction(Amount,walletObj){
		  var desc='Refund -'+this.routineObj.title;
		  if(this.routineObj.teammate){
			  desc='Refund -'+this.routineObj.title+" "+this.routineObj.teammate
		  }
		  var time= moment(new Date()).format("MM/DD/YYYY HH:mm:ss A").toString();
		 // console.log(walletObj)
		  var transactionObj={
								  userid:walletObj.userid,
								  txn_amount:Amount,
								  txn_type:'c',
								  txn_id:Math.random().toString(36).substr(2, 9),
								  txn_token:'',
								  txn_desc:desc,
								  txn_date:	time	  
		                    }
							
							
			this.walletservice.saveTransaction(transactionObj).subscribe(res=>{
				 // console.log(res);			  
			  },err=>{
				  //console.log(err);
		     })			  
	  }  
  toggleIncompleteVideo(ev){
    this.toJudgeVideo.nativeElement.pause();
    this.comments = [];
    this.incompleteVideo = ev.checked;
  }

  onMetadata(e, video) {
   // console.log('metadata: ', e);
   // console.log('video : ', video);

    // console.log('duration: ', this.currentDuration = video.duration);
  }

  setCurrentTime(data) {
    this.currentDuration = data.target.currentTime;
 }
 returnTotalValue(com){
		 let tot=((com.value.skillValue+com.value.execution)*com.value.factor)+(com.value.bonus && com.value.bonus!=null && com.value.bonus!=undefined ?com.value.bonus:0);
		 tot=Math.round(tot * 100 ) / 100
		 return tot
	 
	 
 }
 onFactorValueChange(){
	this.finalscore=0;
	 let commentArray=<FormArray>this.addCommentForm.controls['commentformList'].value;
	   //console.log(commentArray);
	 for(let i=0;i<commentArray.length;i++){
		// console.log(commentArray[i]);
		 let temp=commentArray[i]
		  //console.log(temp);
		 if(i<this.comments.length){
			 if(temp.type=="0"){
				  this.finalscore=(Number(temp.value)+Number(temp.bonus))*temp.factor	 			    
			  if (!isNaN(this.finalscore)) {
				this.finalscore=Number(this.finalscore.toFixed(3));
			  this.startValueForm.controls['score'].setValue(this.finalscore)
		     }
		 }else if(temp.type=="1"){
			  this.finalscore=Number(this.finalscore)+(Number(-temp.value)+Number(temp.bonus))*temp.factor
			  if (!isNaN(this.finalscore)) {
				 this.finalscore=Number(this.finalscore.toFixed(3));
			  this.startValueForm.controls['score'].setValue(this.finalscore)
		     }
		 }
		 else if(temp.type=="2"){
			  this.finalscore=Number(this.finalscore)+(Number(temp.value)+Number(temp.bonus))*temp.factor
			  if (!isNaN(this.finalscore)) {
				  this.finalscore=Number(this.finalscore.toFixed(3));
			  this.startValueForm.controls['score'].setValue(this.finalscore)
		     }
		 }
			 
		 }else{
			 //console.log("not submitted")
		 }
	
	 }
 }
 recalculate(){
	 this.finalscore=0;
//	console.log(this.addCommentForm.value,this.comments);
	let commentArray=<FormArray>this.addCommentForm.controls['commentformList'].value;
//	console.log(commentArray,this.comments)
	//console.log(this.finalscore)
	let tempComments=[];
	if(commentArray.length>0){
		for(let i=0;i<commentArray.length;i++){
			let temp=commentArray[i];	
			//console.log(temp);	
			if(temp.submitted==1)	{
				let commentObj:RoutineComment=new RoutineComment();
				commentObj.judgeid=this.loginuserinfo._id;
				commentObj.routineid=this.routineId;
				commentObj.routinetitle=this.routineObj.title;
				commentObj.userid=this.routineObj.userid;
				commentObj.judgename=this.loginuserinfo.username;
				commentObj.comment=temp.comment;
				commentObj.time=temp.time;
				commentObj.element=temp.element;
				commentObj.skillvalue=temp.skillValue;
				commentObj.factor=temp.factor;
				commentObj.bonus=temp.bonus;
				commentObj.execution=temp.execution;
				commentObj.state=this.userinfo.address;
				let tot=((temp.skillValue+temp.execution)*(temp.factor))+(temp.bonus && temp.bonus!=null && temp.bonus!=undefined ?temp.bonus:0);
					tot=Math.round(tot * 100 ) / 100
					commentObj.total=tot			
				tempComments.push(commentObj);
				this.calculateFinalScore(commentObj)
				if(i==this.comments.length-1){
					this.comments=tempComments;
					console.log(this.comments,this.finalscore)
				}
			}else{
				console.log(temp)
			}


		}   
		
	}
 }


pushNotification(msg,type){

   const notificationitem = {
          UID: this.routineObj.userid,
          type: type,
          read: false,
          message: msg,
          notificationProperties: {
            FID: '',
            RID: ''
            }
        }
	  this._service.saveNotification(notificationitem).subscribe( response => {
                // console.log('Notification saved')
    }, err => {
     // console.log('err ', err);
    })	  
}



errorMessage(objResponse: any) {
  console.log(objResponse)
  if(objResponse.message){
    Swal("Alert !", objResponse.message, "info");
  }
  else{
    Swal("Alert !", objResponse, "info");
  }
 
}
formatduration(secs) {
  var minutes = Math.floor(secs / 60);
  secs =Math.floor(secs%60)
  //console.log("wsedwwew",secs%60,secs, );
  var hours = Math.floor(minutes/60)
  minutes = minutes%60;
 // console.log("Time",this.pad(hours)+":"+this.pad(minutes)+":"+this.pad(secs));
  return this.pad(hours)+":"+this.pad(minutes)+":"+this.pad(secs);
  }
  pad(num) {
    return ("0"+num).slice(-2);
  }
 
}
