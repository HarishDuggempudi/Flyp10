
import { Component, OnInit, EventEmitter ,ViewChild, ElementRef, NgModule } from "@angular/core";
import Swal from 'sweetalert2';
import {Config} from '../../../../shared/configs/general.config';
import {RegisterUserModel} from "../../user-management/user.model";
import * as moment from 'moment';
import {ActivatedRoute, Router } from '@angular/router';
import {RoutineModel,RoutineResponse} from '../routine.model';
import {RoutineService} from "../routines.service";
import { RoutineComment } from "../routine.model";
import { ScoreCard } from "../../judges-routines/routine.model";
import { SportService } from "../../sport/sport.service";
import { USAGRoutineService } from "./usag-routine.service";
import { UserService } from "../../user-management/user.service";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { MatTableDataSource } from "@angular/material";
import * as _ from 'lodash';   

@Component({
  selector: "admin-routine-View",
  templateUrl: "./usag-routine-view.html",
  styleUrls: ['../routine-list.scss']
})
export class USAGViewComponent implements OnInit {




  @ViewChild('toJudgeVideo') toJudgeVideo:ElementRef; 
  comments:any[] = [];
  comment:string="";
  addComments:boolean = false;
  currentDuration:any;
  incompleteVideo:boolean = false;
  value:number;
  repoUrl:any;
  imageUrl:any;
  routineId:string;
  loginuserinfo:RegisterUserModel=new RegisterUserModel();
  routineObj:RoutineModel= new RoutineModel();
  commentObj:RoutineComment=new RoutineComment();
  scoreCard:ScoreCard=new ScoreCard();
  competitorname: string;
  userDetails: any;
  commentInfo:any=[];
  routine: any;
  panelcomments: any =[];
  Ranking = [];
  EventMeetLevelRanking: any =[];
  EventMeetLevelRank: any;
  EventLevelRank: void;
  resubmitform: FormGroup;
  ndForm:FormGroup;
  judges =[];
  judgeDetails =[];
  allJudges =[]
  judgesId =[];
  selectedjudgePanel: any;
  selectresubmitjudgeId: any;
  AssignedJudges =[];
  preIndex: number = 0;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];
  selectedjudgePanelId: any;
  judgeRountineComment =[];
  selectedJudge: any;
  routinemappedJudges =[]
  filterLevelRanking: any =[];
  filterRanking: any =[];
  isNDFormSubmitted: boolean = false;
  @ViewChild('resumitf') resumitf;
constructor(private userServices:UserService,private _formBuilder:FormBuilder,private _Service:USAGRoutineService,private routineservice: RoutineService,private activatedRoute: ActivatedRoute,private sportservice:SportService){
  activatedRoute.params.subscribe(param => this.routineId = param['routineId']);
  let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
  this.displayedColumns = ["SN","Panel","JudgeName","Status","Score","Actions"];
  this.loginuserinfo=userInfo;
  //console.log(this.loginuserinfo)
  this.resubmitform = this._formBuilder.group({
    "comment": ['',Validators.required],
    "judge":['',Validators.required],
    "panel":['']
    
});
this.ndForm = this._formBuilder.group({
  "nd": ['',Validators.required],
  "score":['',Validators.required],
});
  this.repoUrl = 'https://github.com/Epotignano/ng2-social-share';
   this.imageUrl = 'https://avatars2.githubusercontent.com/u/10674541?v=3&s=200';
}

closeResubmitform() {
  this.resubmitform.patchValue({           
    comment : '',
    panel : '',
    judge:''
   
})

this.resumitf.resetForm();
}
async resubmit() {

  if(this.resubmitform.valid){
    
    
    await this.updateJudgeQueue();
  
    //this.resubmitTojudge();
     this.getRoutineDetail();
     this.getRoutineAssignedJudges();
     document.getElementById('close').click()
  }
}
deleteRoutineCommentsJudge() {
  return new Promise((resolve,reject)=>{
    let data ={
      judgeId:this.selectresubmitjudgeId,
      judgePanelId :this.selectedjudgePanelId,
      routineId:this.routineId
    }
    this._Service.deleteRoutineCommentsJudge(data).subscribe((res)=>{
      console.log(res);
      resolve();
    })
  })
  
}
nd() {
  
  
      this.ndForm.patchValue({           
        score : this.routineObj.score,
        
       
    })
  
}

recalculate() {
  var data = {
    routineId : this.routineId,
    nd : this.ndForm.value.nd
  }
  this.isNDFormSubmitted = true;
  if(this.ndForm.valid){
  this._Service.updateFinalScorewithNeutralDeduction(data).subscribe((res)=>{
    if(res.success) {
     
      Swal("Success",'Final score updated successfully','success')
      this.getRoutineDetail();
    }
    document.getElementById('close1').click();
  })
}

}
applyFilterEventLevelRanking(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

  this.filterRanking.forEach((rank,index) => {
      var users = this.Ranking[index].users;
      rank.users = users.filter(user=>user.name.toLowerCase().indexOf(filterValue) > -1)
      
    
  });
}
applyFilterLevelRanking(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches

  this.filterLevelRanking = this.EventMeetLevelRanking.filter((user)=> user.name.toLowerCase().indexOf(filterValue) > -1)
      
}
viewJudgeComment(judge) {
  this.judgeRountineComment =[];
  this.selectedJudge={};
  this._Service.judgeRoutineComment(judge).subscribe((res)=>{
    this.selectedJudge = judge
    this.judgeRountineComment = res;
  })
}
updateJudgeQueue(){
  return new Promise((resolve,reject)=>{
  var resubmittojudgeId = this.resubmitform.value.judge;
  var resubmittojudgeName =''
  let resubmittojudgeInfo = this.routinemappedJudges.filter((j)=>j._id == this.resubmitform.value.judge)
  if(resubmittojudgeInfo.length > 0){
    resubmittojudgeName =resubmittojudgeInfo[0].username
  }
  if(this.selectresubmitjudgeId == resubmittojudgeId){
    let data ={
      resubmitComment : this.resubmitform.value.comment,
      resubmit: true,
      judged : false,
      judgeId:this.selectresubmitjudgeId,
      judgePanelId :this.selectedjudgePanelId,
      routineId:this.routineId
    }
  this._Service.updateJudgeQueue(data).subscribe(async(res)=>{
    console.log(res);
    await this.deleteRoutineCommentsJudge();
    await this.updateRoutineStatus();
    Swal('Success',"Resubmitted successfully","info")
    resolve()
  })
}
else {
  //for deleted the resubmit from judges queue
 
//added resumbit to judges
  let data ={
    resubmitComment : this.resubmitform.value.comment,
    judgeid : this.resubmitform.value.judge,
    judgePanel : this.selectedjudgePanel,
    judgePanelId:this.selectedjudgePanelId,
    routineId:this.routineId,
    resubmit: true,
    eventId: this.routineObj.eventMeetId
  }
  this._Service.addJudgesQueue(data).subscribe(async(res)=>{
    console.log(res);
    if(res.success){
    this.deleteJudgesfromQueue();
    await this.deleteRoutineCommentsJudge();
    await this.updateRoutineStatus();
    }
    else {
      Swal('Info',resubmittojudgeName+" was already assigned for '" +this.selectedjudgePanel+"' judge panel","info")
    }
    resolve()
  })
}
  })
}

deleteJudgesfromQueue(){
  
    let data1 ={
      judgeId:this.selectresubmitjudgeId,
      judgePanelId :this.selectedjudgePanelId,
      routineId:this.routineId
    }
  this._Service.updateJudgeQueue(data1).subscribe((res)=>{
    console.log(res)
    
  })
}
updateRoutineStatus(){
  return new Promise((resolve,reject)=>{
  this._Service.updateRoutineStatus(this.routineId).subscribe((res)=>{
    console.log(res)
    resolve()
  })
})
}
resubmitTojudge(){
  // this._Service.updateRoutineStatus(this.routineId).subscribe((res)=>{
  //   console.log(res)
  // })
}
async ngOnInit() {
  // this.toJudgeVideo.nativeElement.play();
  await this.getRoutineAssignedJudges();
  await this.getAllJudges();
  this.getRoutineDetail();
  this.getUserDetail();
 
 
}
getRoutineAssignedJudges(){
  return new Promise((resolve,reject)=>{
    this._Service.getRoutineJudges(this.routineId).subscribe((res)=>{
      this.AssignedJudges = res
      this.dataSource = new MatTableDataSource(res);
      resolve()
    })
  })
 
}
getAllJudges(){
  return new Promise((resolve,reject)=>{
  this.userServices.getUserListForSanction(1000,1,"2").subscribe(res=>{
            
    this.allJudges = res.dataList
    resolve()
  //   this.filteredJudges = this.allJudges
},err=>{
    this.errorMessage("Something Bad has happened!");
    resolve();
})
})
}
getEventMeetJudgePanel() {
  return new Promise((resolve,reject)=>{
    let data = {
      eventmeetId : this.routineObj.eventMeetId,
      sportId : this.routineObj.sid,
      eventId: this.routineObj.eid,
      levelId : this.routineObj.lid,

    }
this._Service.getEventMeetJudgePanel(data).subscribe((res)=>{
if(res.success) {
  if(res.data.length > 0){
    this.judgeDetails = res.data[0].JudgesbyPanel;
    for(var i = 0;i<this.judgeDetails.length;i++){
    
     // this.judges = this.judges.concat(this.judgeDetails[i].JudgeName);
      let judgesId = this.judgeDetails[i].Judges
     // this.judgesId = _.uniqBy(this.judgesId );
     // this.judges = _.uniqBy(this.judges,'USAGID');
      judgesId.forEach((jId)=>{
        var judge = this.allJudges.filter(judge=>judge._id == jId );
        if(judge.length >0){
          this.routinemappedJudges.push(judge[0])
        }
      })
   // this.levelName = res.data[0].levelName;
   // this.eventName = res.data[0].eventName;
   if(i == this.judgeDetails.length -1){
    this.routinemappedJudges = _.uniqBy(this.routinemappedJudges,'_id');
    console.log(this.routinemappedJudges[0])
    resolve()
   }
    }
    
  }
  else {
    resolve()
  }

}
else {
  resolve()
}
})
  })
}
resubmitjudge(res) {
  this.selectresubmitjudgeId = res.judgeId
      this.selectedjudgePanel = res.judgePanel;
      this.selectedjudgePanelId = res.judgePanelid;
}
getRankingForEventLevel() {
  return new Promise((resolve,reject)=>{
    this.routineservice.getRankingbyEventLevel(this.routineObj.lid,this.routineObj.eid,this.routineObj.eventMeetId).subscribe(
      res=>{
        this.Ranking = res;
        let EventLevel = this.Ranking[0].users.find((user)=> user.userid === this.routineObj.userid)
        this.EventLevelRank = EventLevel.rank;
        this.filterRanking =  JSON.parse(JSON.stringify(this.Ranking));
        resolve();
      })
  })
 
}
getRankingForEventMeetlevel() {
  return new Promise((resolve,reject)=>{
    this.routineservice.getRankingForEventMeetlevel(this.routineObj.lid,this.routineObj.eventMeetId).subscribe(
      res=>{
        this.EventMeetLevelRanking = res;
        this.filterLevelRanking = JSON.parse(JSON.stringify(this.EventMeetLevelRanking));
        let EventMeetLevel = this.EventMeetLevelRanking.find((user)=> user.userid === this.routineObj.userid)
        this.EventMeetLevelRank = EventMeetLevel.rank
        
        console.log(res)
        resolve();
      })
  })
}
formatdate(date){
  return moment(new Date(date)).format('L');
}

getComment(){
  this.routineservice.getRoutineCommentbyflyp10routineid(this.routineId).subscribe(
    res=>{
       this.comments=res

	   console.log("getComment",res)
    },err=>{
      this.errorMessage(err);
    }
  )
}
getEventMeetComment(){

  
    if(this.routineObj.scoretype == '1'){
    
      if(this.routineObj.SanctionRoutine) {
        this.getEventMeetOverallCommentByPanel()
      }
      else {
        this.getEventMeetOverallComment()
      }
    }
    else {
      if(this.routineObj.SanctionRoutine) {
this.getEventMeetRoutineCommentByPanel()
      }
      else {
      this.getEventMeetRoutineComment()
      }
    }
  
}
getEventMeetOverallCommentByPanel() {
this.routineservice.getEventMeetOverallCommentByPanel(this.routineId).subscribe(
    res=>{
      console.log(res) 
      
      let result=res.result?res.result:[]
      let  commentInfo=[];
      
      for(let i=0;i<result.length;i++){
        let  comments=[];
        for(let j=0;j<result[i].groupedItem.length;j++) {

          let data = {
            dod:result[i].groupedItem[j].dod,
        comments:result[i].groupedItem[j].comments,
        score:result[i].groupedItem[j].score,
          }
          comments.push(data)
        }
        let obj = {
          panel : result[i]._id.judgePanel,
          commentInfo : comments
        }
        console.log(this.panelcomments)
        this.panelcomments.push(obj)
        }
     
   
     
     
    
    })
}
getEventMeetOverallComment() {
  this.routineservice.getRoutineCommentForEventMeet(this.routineId).subscribe(
    res=>{
      let result=res.result?res.result:[]
      let  commentInfo=[]
      let  comments=[]
      for(let i=0;i<result.length;i++){
      let obj= {
        dod:result[i].dod,
        comments:result[i].comments,
        score:result[i].score,
        commentInfo:commentInfo
      }
      comments.push(obj)
      console.log(comments)
      this.comments=comments
    }
    })
    
}

getEventMeetRoutineCommentByPanel() {
  this.routineservice.getEventMeetRoutineCommentByPanel(this.routineId).subscribe(
    res=>{
      console.log(res);
      let result=res.result?res.result:[]
      for(let i=0;i<result.length;i++){
        let PanelComments = [];
        for(let j=0;j<result[i].PanelCommentsbyjudge.length;j++){

         
            PanelComments.push(result[i].PanelCommentsbyjudge[j])
           

        }
        let obj= {
          panel : result[i]._id.judgePanel,
          // judgeId :result[i]._id.
          // judge :result[i]._id.judge[0],
          // judgeroutinestatus:result[i]._id.judgeroutinestatus,
          commentInfo:PanelComments
        }
      
        console.log(this.panelcomments)
        this.panelcomments.push(obj)
      }
    })
}
getEventMeetRoutineComment() {
  this.routineservice.getRoutineCommentbyEventroutineid(this.routineId).subscribe(
    res=>{
       //this.comments=res;
        if(res.success){
         let  commentInfo=[]
         let  comments=[]
           let result=res.result?res.result:[]
          // this.comments=result
         console.log("resultsssssss1",result)
          for(let i=0;i<result.length;i++){
              // let 
              commentInfo=[]
              for(let j=0;j<result[i].commentInfo.length;j++){
                   console.log(result[i].commentInfo[j])
                   commentInfo.push(result[i].commentInfo[j].commentInfo)
                   if(j==result[i].commentInfo.length-1){
                      console.log("finalcomment",commentInfo)
                     let obj= {
                        dod:result[i].commentInfo[j].dod,
                        comments:result[i].commentInfo[j].comments,
                        score:result[i].commentInfo[j].score,
                        overallComment:result[i].commentInfo[j].commentInfo.overallComment,
                        commentInfo:commentInfo
                      }
                      comments.push(obj)
                      console.log(comments)
                      this.comments=comments
                   }
              }
                 
          }
        }
	  
    },err=>{
      this.errorMessage(err);
    }
  )
}
getScoreCardconfig(sportid){
  this.sportservice.getScoreCardConfigBySportid(sportid)
   .subscribe(res => {
 console.log("getScoreCardconfig",res)
 let temp=res;
 if(res.length>0){
    this.scoreCard=res[0];
 }else{

 }		
},
    error =>{this.errorMessage(error)});
}

getRoutineDetail(){
  this.routineservice.getRoutinebyroutinestatusid(this.routineId).subscribe(
    async(res)=>{
      this.routineObj=res;
      if(this.routineObj.SanctionRoutine) {
        this.getEventMeetJudgePanel();
      await  this.getRankingForEventLevel();
      await this.getRankingForEventMeetlevel();
      }
    
      console.log(this.routineObj)
    
      if(this.routineObj.uploadingType=='1'){
            this.getComment();
      }else{
        this.getEventMeetComment()
      }
        this.getScoreCardconfig(this.routineObj.sid)
    },
    err=>{
       console.log("err")
    }
  )
}

toggleIncompleteVideo(ev){
  this.toJudgeVideo.nativeElement.pause();
  this.comments = [];
  this.incompleteVideo = ev.checked;
}

onMetadata(e, video) {
 

  // console.log('duration: ', this.currentDuration = video.duration);
}

setCurrentTime(data) {
  this.currentDuration = data.target.currentTime;
}



errorMessage(objResponse: any) {

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

var hours = Math.floor(minutes/60)
minutes = minutes%60;
return this.pad(hours)+":"+this.pad(minutes)+":"+this.pad(secs);
}
pad(num) {
  return ("0"+num).slice(-2);
}
printPage(){
  // var divContents = document.getElementById("print-section").innerHTML; 
  //           var a = window.open('', '', 'height=650, width=650'); 
  //           a.document.write('<html>'); 
  //           a.document.write('<head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"></head>'); 
  //           a.document.write('<body>'); 
  //           a.document.write(divContents); 
  //           a.document.write('</body></html>'); 
  //           a.document.close(); 
  //           a.print(); 
  window.print();
}
   
getUserDetail() {
  this.userServices.getUserDetail(this.loginuserinfo._id)
      .subscribe(resUser => {
             this.userDetails=resUser;
             this.competitorname=this.userDetails.firstName+ " "+this.userDetails.lastName
      },
          error => this.errorMessage(error));
}


}

