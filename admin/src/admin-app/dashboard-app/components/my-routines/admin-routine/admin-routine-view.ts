
import { Component, OnInit, EventEmitter ,ViewChild, ElementRef, NgModule } from "@angular/core";
import Swal from 'sweetalert2';
import {Config} from '../../../../shared/configs/general.config';
import {RegisterUserModel} from "../../user-management/user.model";
import * as moment from 'moment';
import {ActivatedRoute, Router } from '@angular/router';
import {RoutineModel,RoutineResponse} from '../../my-routines/routine.model';
import {RoutineService} from "../routines.service";
import { RoutineComment } from "../routine.model";
import { ScoreCard } from "../../judges-routines/routine.model";
import { SportService } from "../../sport/sport.service";
import { AdminRoutineService } from "./Admin-routines.service";
import { MatTableDataSource } from "@angular/material";

@Component({
  selector: "admin-routine-View",
  templateUrl: "./admin-routine-view.html",
  styleUrls: ['../routine-list.scss']
})
export class AdminViewComponent implements OnInit {




  @ViewChild('toJudgeVideo') toJudgeVideo:ElementRef; 
  comments:any[] = [];
  comment:string="";
  addComments:boolean = false;
  currentDuration:any;
  incompleteVideo:boolean = false;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[];
  value:number;
  repoUrl:any;
  imageUrl:any;
  routineId:string;
  preIndex: number = 0;
  loginuserinfo:RegisterUserModel=new RegisterUserModel();
  routineObj:RoutineModel= new RoutineModel();
  commentObj:RoutineComment=new RoutineComment();
  scoreCard:ScoreCard=new ScoreCard();
  AssignedJudges: any =[];
constructor(private routineservice: RoutineService,private _Service:AdminRoutineService,private activatedRoute: ActivatedRoute,private sportservice:SportService){
  activatedRoute.params.subscribe(param => this.routineId = param['routineId']);
  let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
  this.displayedColumns = ["SN","Panel","JudgeName","Status","Score","Overall Comment"];
  this.loginuserinfo=userInfo;
  this.repoUrl = 'https://github.com/Epotignano/ng2-social-share';
   this.imageUrl = 'https://avatars2.githubusercontent.com/u/10674541?v=3&s=200';
}

ngOnInit() {
  // this.toJudgeVideo.nativeElement.play();
  this.getRoutineDetail();
  this.getComment();
  this.getRoutineAssignedJudges()
}
formatdate(date){
  return moment(new Date(date)).format('L');
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

getComment(){
  this.routineservice.getRoutineCommentbyflyp10routineid(this.routineId).subscribe(
    res=>{
       this.comments=res;
	   //console.log(this.comments)
    },err=>{
      this.errorMessage(err);
    }
  )
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
getEventMeetRoutineComment(){
  
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
getRoutineDetail(){
  this.routineservice.getRoutinebyroutinestatusid(this.routineId).subscribe(
    res=>{
      this.routineObj=res;
      if(this.routineObj.uploadingType=='1'){
        this.getComment();
  }else{
    this.getEventMeetRoutineComment()
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


}

