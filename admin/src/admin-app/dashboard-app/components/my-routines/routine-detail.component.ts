import { Component, OnInit, EventEmitter ,ViewChild, ElementRef, NgModule } from "@angular/core";
import Swal from 'sweetalert2';
import {Config} from '../../../shared/configs/general.config';
import {RegisterUserModel} from "../user-management/user.model";
import * as moment from 'moment';
import {ActivatedRoute, Router } from '@angular/router';
import {RoutineModel,RoutineResponse} from '../my-routines/routine.model';
import {RoutineService} from "./routines.service";
import { RoutineComment } from "./routine.model";
import { ScoreCard } from "../judges-routines/routine.model";
import { SportService } from "../sport/sport.service";
import { UserService } from "../user-management/user.service";
import * as xlsx from 'xlsx'

@Component({
  selector: 'routine-detail',
  templateUrl: './routine-details.html',
  styleUrls: ['./routine-list.scss']
})
export class RoutineDetailComponent implements OnInit {




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
  Eventmeetroutinedata: any;
  routineJudgesScoreByPanel: any;
constructor(private userServices:UserService,private routineservice: RoutineService,private activatedRoute: ActivatedRoute,private sportservice:SportService){
  activatedRoute.params.subscribe(param => this.routineId = param['routineId']);
  let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
  this.loginuserinfo=userInfo;
  //console.log(this.loginuserinfo)
  this.repoUrl = 'https://github.com/Epotignano/ng2-social-share';
   this.imageUrl = 'https://avatars2.githubusercontent.com/u/10674541?v=3&s=200';
}

ngOnInit() {
  // this.toJudgeVideo.nativeElement.play();
  this.getRoutineDetail();
 
  this.getUserDetail();
 
 
}
getRankingForEventLevel() {
  return new Promise((resolve,reject)=>{
    this.routineservice.getRankingbyEventLevel(this.routineObj.lid,this.routineObj.eid,this.routineObj.eventMeetId).subscribe(
      res=>{
        this.Ranking = res;
        let EventLevel = this.Ranking[0].users.find((user)=> user.userid === this.routineObj.userid)
        this.EventLevelRank = EventLevel.rank
        resolve();
      })
  })
}
downloadscore() {
  let data = {
    lid : this.routineObj.lid,
    eid : this.routineObj.eid,
    eventMeetId:this.routineObj.eventMeetId
  }
  this.routineservice.getEventlevelRoutines(data).subscribe((res)=>{
    console.log(res)
    this.Eventmeetroutinedata = res.data;
    if(this.Eventmeetroutinedata.length >0){
    let newArray:any[]=[];
    this.Eventmeetroutinedata.forEach(async (data, index)=>{
        await this.getEventMeetRoutineJudgesScore(data._id)
let Obj ={}
Obj['USAGID'] = data.MemberInfo.MemberID?data.MemberInfo.MemberID:'';
Obj['ClubName'] = data.USAGclubInfo.clubInfo?data.USAGclubInfo.clubInfo.ClubName:''
Obj['ClubUSAGID'] = data.USAGclubInfo.clubInfo?data.USAGclubInfo.clubInfo.ClubUSAGID:''
Obj['RoutineId'] = data._id;
Obj['EventName'] = this.routineObj.EventName;
Obj['Title'] = data.title;
Obj['Event'] = data.event;
Obj['Level'] = data.level;
Obj['FirstName'] = data.USAGclubInfo.firstName;
Obj['LastName'] = data.USAGclubInfo.lastName;
Obj['dob'] = data.USAGclubInfo?data.USAGclubInfo.DOB:'';
Obj['SubmittedBy'] = data.submittedBy;
Obj['Score'] =data.score;
//Judges score by panel
for(var i =0;i<this.routineJudgesScoreByPanel.length;i++){
  for(var j=0;j<this.routineJudgesScoreByPanel[i].PanelJudges.length;j++){
  let judegePanel = this.routineJudgesScoreByPanel[i]._id.judgePanel;
  let judge = this.routineJudgesScoreByPanel[i].PanelJudges[j]
      Obj[judegePanel+'#'+(j+1)] = judge.score;
  }
  if(i === this.routineJudgesScoreByPanel.length -1){
      newArray.push(Obj)
  }
}

    if(index == this.Eventmeetroutinedata.length -1)      {
      const ws: xlsx.WorkSheet=xlsx.utils.json_to_sheet(newArray);
      const wb: xlsx.WorkBook = xlsx.utils.book_new();
      let sheetname = this.routineObj.EventMeetName ? this.routineObj.EventMeetName:'Eventlevel';
      xlsx.utils.book_append_sheet(wb, ws, sheetname+'-score');
  
      /* save to file */
      xlsx.writeFile(wb,sheetname+'-score.xlsx');
    }
      
        
      })


   
  }
  else {
      Swal('Info!',"No routines found",'info')
  }
})
}
getEventMeetRoutineJudgesScore(routineId){
  return new Promise((resolve,reject)=>{
      this.routineservice.getEventMeetRoutineJudgesScore(routineId).subscribe((res)=>{
          if(res.success){

            this.routineJudgesScoreByPanel = res.data
            resolve()
          }
          else {
              resolve()
          }
      })
  })
}
getRankingForEventMeetlevel() {
  return new Promise((resolve,reject)=>{
    this.routineservice.getRankingForEventMeetlevel(this.routineObj.lid,this.routineObj.eventMeetId).subscribe(
      res=>{
        this.EventMeetLevelRanking = res;
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
      // if(this.routineObj.SanctionRoutine) {
      
      // }
    
      console.log(this.routineObj)
    
      if(this.routineObj.uploadingType=='1'){
            this.getComment();
      }else{
        this.getEventMeetComment();
        await  this.getRankingForEventLevel();
      await this.getRankingForEventMeetlevel();
      
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

