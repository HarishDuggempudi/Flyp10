import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';

import {Config} from "../../../shared/configs/general.config";
import {UserModel} from "../user-management/user.model";
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { TeammateRoutineService } from "./teammate-routine.service";

@Component({
  selector: "team-routine-detail",
  templateUrl: "./teammate-routine-detail.html",
})
export class TeamMateRoutineDetailComponent implements OnInit {
  routineId: any;
    routineObj: any;
  Ranking =[];
  EventLevelRank: any;
  EventMeetLevelRanking =[]
  EventMeetLevelRank: any;

   /* Pagination */
   
  constructor(private router: Router,private activatedRoute: ActivatedRoute, private _service: TeammateRoutineService){
    activatedRoute.params.subscribe(param => this.routineId = param['routineId']);
  }
  
  ngOnInit() {
    
        // this.toJudgeVideo.nativeElement.play();
        this.getRoutineDetail();
  }
  formatdate(date){
    return moment(new Date(date)).format('L');
  }
  
  getRoutineDetail(){
    this._service.getRoutinebyroutinestatusid(this.routineId).subscribe(
      async(res)=>{
        this.routineObj=res;
        if(this.routineObj.uploadingType=='2'){
    
      await  this.getRankingForEventLevel();
    await this.getRankingForEventMeetlevel();
    
    }
      },
      err=>{
         console.log("err")
      }
    )
  }
  getRankingForEventLevel() {
    return new Promise((resolve,reject)=>{
      this._service.getRankingbyEventLevel(this.routineObj.lid,this.routineObj.eid,this.routineObj.eventMeetId).subscribe(
        res=>{
          this.Ranking = res;
          let EventLevel = this.Ranking[0].users.find((user)=> user.userid === this.routineObj.userid)
          this.EventLevelRank = EventLevel.rank
          resolve();
        })
    })
  }
  getRankingForEventMeetlevel() {
    return new Promise((resolve,reject)=>{
      this._service.getRankingForEventMeetlevel(this.routineObj.lid,this.routineObj.eventMeetId).subscribe(
        res=>{
          this.EventMeetLevelRanking = res;
          let EventMeetLevel = this.EventMeetLevelRanking.find((user)=> user.userid === this.routineObj.userid)
          this.EventMeetLevelRank = EventMeetLevel.rank
          
          console.log(res)
          resolve();
        })
    })
  }

}
