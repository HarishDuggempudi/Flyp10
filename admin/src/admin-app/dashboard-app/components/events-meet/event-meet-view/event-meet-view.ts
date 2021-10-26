import Swal from "sweetalert2";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { EventMeetService } from "../event-meet-service";
import { MeetResponse,MeetModel, CSVObjModel } from "../event-meet-model";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { SportService } from "../../sport/sport.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
//import * as jsPDF from 'jspdf';
import * as xlsx from 'xlsx'
//import  html2canvas from 'html2canvas';

import { UserSecurityModel, UserModel } from "../../user-management/user.model";
import { UserService } from "../../user-management/user.service";
import { Config } from "../../../../shared/configs/general.config";

@Component({
  selector: "event-meet-view",
  templateUrl: "./event-meet-view.html",
  styleUrls:['event-meet-view.scss']
})

export class EventMeetView implements OnInit {

    // @ViewChild('rankingtable') content:ElementRef;
    // @ViewChild('contentToConvert') content1:ElementRef;
    disable:any  = true
    eventMeetObj:MeetModel = new MeetModel();
    AddEventMeetForm:FormGroup;
    isSubmitted:boolean = false;
    isstartcodeSubmitted:boolean = false;
    eventid:string;
    allSports:any = []
    allLevels:any = []
    allEvents:any = []
    private _onDestroy = new Subject<void>();
    filteredEvents: any = [];
    filteredSports: any = [];
    filteredLevels: any = [];
    filteredJudges:any = []
    sportid: any;
    showLevelEvent: boolean = true;
    countrylist: any = [];
    statelist: any;
    allJudges: any = []
    startDate: Date;
    minDate: Date;
    informationToEdit: any;
    userRole: string;
    userId: string;
    enrolled: boolean=true;
    SanctionMeet = false
    sportDetails:any = []
    Competitors: any =[];
    isUSAGMeetDirector: boolean;
    startCodeForm: FormGroup;
    startcode;
    isSanctionEventMeet = false
    IsOnGoingEventMeet = false;
    EventMeetJudgespanelBylevelevent: any =[];
    Ranking: any =[];
    LevelRanking: any =[];
    pdfResponse: any;
    pdfFileName: any;
    file: Blob;
    fileURL: string;
    Eventmeetroutinedata:any[] =[];
    routineJudgesScoreByPanel =[];
    MemberID: any;
    filterRanking: any =[];
    filterLevelRanking: any =[];
    SportEvent =[];
    Headers = [];
    AthlteInfo =[];
    filterAthleteInfo =[];
    levelRequestRoutine: any;


    constructor(public eventService:EventMeetService,private userService:UserService,private sportService:SportService,private router: Router, private activatedRoute: ActivatedRoute, private _objService:EventMeetService, private _formBuilder:FormBuilder) {


        // this.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        this.minDate = new Date();

        this.startCodeForm = this._formBuilder.group({
            "startcode": ['',Validators.required]

        });

        this.AddEventMeetForm = this._formBuilder.group({
        "EventName": ['', Validators.required],
        "StartDate": ['', Validators.required],
        "EndDate": ['', Validators.required],
        "Sports": ['',Validators.required],
        Events : ['',Validators.required],
        Levels : ['',Validators.required],
            // Judges : ['',Validators.required],
            State : ['',Validators.required],
            Country : ['',Validators.required],
        "active": [false],
        "inputLevel":[''],
        "inputEvent":[''],
        "inputSport":[''],
        "inputJudges":[''],
        NjudgePrice:['',Validators.required] ,
        NcompetitorPrice:['',Validators.required],
        SjudgePrice:['',Validators.required] ,
        ScompetitorPrice:['',Validators.required]   ,
        NtechnicianPrice:['0',Validators.required],
        StechnicianPrice:['0',Validators.required]

            }
        );

        this.AddEventMeetForm.controls['EventName'].disable()
        this.AddEventMeetForm.controls['StartDate'].disable()
        this.AddEventMeetForm.controls['EndDate'].disable()
        this.AddEventMeetForm.controls['Sports'].disable()
        this.AddEventMeetForm.controls['NjudgePrice'].disable()
        this.AddEventMeetForm.controls['NcompetitorPrice'].disable()
        this.AddEventMeetForm.controls['SjudgePrice'].disable()
        this.AddEventMeetForm.controls['ScompetitorPrice'].disable()
        this.AddEventMeetForm.controls['NtechnicianPrice'].disable()
        this.AddEventMeetForm.controls['StechnicianPrice'].disable()

        // this.AddEventMeetForm.controls['Judges'].disable()
        this.AddEventMeetForm.controls['State'].disable()
        this.AddEventMeetForm.controls['Country'].disable()
        this.AddEventMeetForm.controls['active'].disable()

    }
    getAthleteCoachRoutinesByEvent() {
        this.eventService.getAthleteCoachRoutinesByEvent(this.informationToEdit._id,this.informationToEdit.SanctionID).subscribe((res)=>{
            this.AthlteInfo = res.result;
            
            this.filterAthleteInfo = JSON.parse(JSON.stringify(this.AthlteInfo));
        })
    }
    getEventmeetSportEvent() {
        this.eventService.getEventMeetSportEventInfobyId(this.informationToEdit._id).subscribe((res)=>{
            this.SportEvent = res.result;
            this.Headers =['Athlete' ,'Club','Level']
            for(var i =0;i<this.SportEvent.length;i++) {
               this.Headers.push(this.SportEvent[i].Event) 

            }
            
        }) 
    }
  downloadscore1(){
      //console.log(this.eventid,"eventid")
      this.eventService.downloadEventmeetScore(this.eventid).subscribe((res)=>{
          console.log(res)
          var routineindex =0
          this.Eventmeetroutinedata = res.data;
          if(this.Eventmeetroutinedata.length >0){
          let newArray:any[]=[];
          for(var index =0;index <this.Eventmeetroutinedata.length;index ++){
            var data = this.Eventmeetroutinedata[index];
            var routine = this.Eventmeetroutinedata[index].Routines;
            var routineJudgesScoreByPanel = this.Eventmeetroutinedata[index].Judges?this.Eventmeetroutinedata[index].Judges:[];
            let Obj:CSVObjModel =new CSVObjModel();
            if(data.Routine_coachInfo.length > 0 ){
            Obj.USAGID = data.Routine_MemberInfo.MemberID?data.Routine_MemberInfo.MemberID:'';
            Obj.ClubName = data.Routine_coachclubInfo ?data.Routine_coachclubInfo[0].ClubName:'';
            Obj.ClubUSAGID = data.Routine_coachclubInfo ?data.Routine_coachclubInfo[0].ClubUSAGID:''
            Obj.FirstName = data.Routine_coachInfo[0].FirstName;
            Obj.LastName = data.Routine_coachInfo[0].LastName;
            Obj.DOB = '';
          }
          else if(data.Routine_athleteInfo.length > 0){
            Obj.USAGID = data.Routine_MemberInfo.MemberID?data.Routine_MemberInfo.MemberID:'';
            Obj.ClubName = data.Routine_athleteclubInfo?data.Routine_athleteclubInfo[0].ClubName:'';
            Obj.ClubUSAGID = data.Routine_athleteclubInfo ?data.Routine_athleteclubInfo[0].ClubUSAGID:''
            Obj.FirstName = data.Routine_athleteInfo[0].FirstName;
            Obj.LastName = data.Routine_athleteInfo[0].LastName;
            Obj.DOB = data.Routine_athleteInfo[0].DOB;
          }
          if(!routine && data.ownRoutines.length == 0){
             if(data.Mapped_MemberInfo) {
            
            if(data.Mapped_coachInfo.length > 0 ){
                Obj.USAGID = data.Mapped_MemberInfo.MemberID?data.Mapped_MemberInfo.MemberID:'';
            Obj.ClubName = data.Mapped_coachclubInfo ?data.Mapped_coachclubInfo[0].ClubName:'';
            Obj.ClubUSAGID = data.Mapped_coachclubInfo ?data.Mapped_coachclubInfo[0].ClubUSAGID:''
            Obj.FirstName = data.Mapped_coachInfo[0].FirstName;
            Obj.LastName = data.Mapped_coachInfo[0].LastName;
            Obj.DOB = '';
            newArray.push(Obj)
          }
          else if(data.Mapped_athleteInfo.length > 0){
            Obj.USAGID = data.Mapped_MemberInfo.MemberID?data.Mapped_MemberInfo.MemberID:'';
            Obj.ClubName = data.Mapped_athleteclubInfo?data.Mapped_athleteclubInfo[0].ClubName:'';
            Obj.ClubUSAGID = data.Mapped_athleteclubInfo ?data.Mapped_athleteclubInfo[0].ClubUSAGID:''
            Obj.FirstName = data.Mapped_athleteInfo[0].FirstName;
            Obj.LastName = data.Mapped_athleteInfo[0].LastName;
            Obj.DOB = data.Mapped_athleteInfo[0].DOB;
            newArray.push(Obj)
          }
        
         // Obj['index'] = index
         
        }
          }
          if(routine){
            Obj.RoutineId = routine._id;
            Obj.EventName = routine.EventMeetName;
            Obj.Title = routine.title;
            Obj.Event = routine.event;
            Obj.Level = routine.level;
            Obj.Athlete = routine.athlete;
            Obj.SubmittedBy = routine.submittedBy;
            Obj.Score =routine.score;

            //Judges score by panel
            if(routineJudgesScoreByPanel.length >0){
            for(var i =0;i<routineJudgesScoreByPanel.length;i++){
              for(var j=0;j<routineJudgesScoreByPanel[i].PanelJudges.length;j++){
              let judegePanel = routineJudgesScoreByPanel[i]._id.judgePanel;
              let judge = routineJudgesScoreByPanel[i].PanelJudges[j]
                  Obj[judegePanel+'#'+(j+1)] = judge.score;
              }
              if(i === routineJudgesScoreByPanel.length -1){
                 // Obj['routineindex'] = routineindex++;
                 // Obj['index'] = index
                  newArray.push(Obj)
              }
            }
        }
        else {
            newArray.push(Obj)
        }
    }

                if(index == this.Eventmeetroutinedata.length -1)      {

                  const ws: xlsx.WorkSheet=xlsx.utils.json_to_sheet(newArray);
                  const wb: xlsx.WorkBook = xlsx.utils.book_new();
                    xlsx.utils.book_append_sheet(wb, ws, 'EventMeet-score');
                  /* save to file */
                  xlsx.writeFile(wb, this.eventMeetObj.EventName+'.xlsx');
                }



          }




        }
        else {
            Swal('Info!',"No routines found",'info')
        }
      })
  }

async downloadscore()  {
   
   this.eventService.eventMeetId = this.eventid     
        await this.getEventMeetRoutineByLevel();
        let coach = await this.getMappedEventMeetCoach();
        let newArray:any[]=[];
        if(this.Eventmeetroutinedata.length >0){
             for(var index =0;index <this.Eventmeetroutinedata.length;index ++){
                var routine = this.Eventmeetroutinedata[index];
                var routineJudgesScoreByPanel = this.Eventmeetroutinedata[index].Judges?this.Eventmeetroutinedata[index].Judges:[];
                let Obj:CSVObjModel =new CSVObjModel();
                if(routine.coachInfo){
                Obj.USAGID = routine.MemberInfo.MemberID?routine.MemberInfo.MemberID:'';
                Obj.ClubName = routine.coachclubInfo ?routine.coachclubInfo[0].ClubName:'';
                Obj.ClubUSAGID = routine.coachclubInfo ?routine.coachclubInfo[0].ClubUSAGID:''
                Obj.FirstName = routine.coachInfo.FirstName;
                Obj.LastName = routine.coachInfo.LastName;
                Obj.DOB = '';
              }
              else if(routine.athleteInfo){
                Obj.USAGID = routine.MemberInfo.MemberID?routine.MemberInfo.MemberID:'';
                Obj.ClubName = routine.athleteclubInfo?routine.athleteclubInfo[0].ClubName:'';
                Obj.ClubUSAGID = routine.athleteclubInfo ?routine.athleteclubInfo[0].ClubUSAGID:''
                Obj.FirstName = routine.athleteInfo.FirstName;
                Obj.LastName = routine.athleteInfo.LastName;
                Obj.DOB = routine.athleteInfo.DOB;
              }
              
              if(routine){
                Obj.RoutineId = routine._id;
                Obj.EventName = routine.EventMeetName;
                Obj.Title = routine.title;
                Obj.Event = routine.event;
                Obj.Level = routine.level;
                Obj.Athlete = routine.athlete;
                Obj.SubmittedBy = routine.submittedBy;
                Obj.Score =routine.score;
    
                //Judges score by panel
                if(routineJudgesScoreByPanel.length >0){
                for(var i =0;i<routineJudgesScoreByPanel.length;i++){
                  for(var j=0;j<routineJudgesScoreByPanel[i].PanelJudges.length;j++){
                  let judegePanel = routineJudgesScoreByPanel[i]._id.judgePanel;
                  let judge = routineJudgesScoreByPanel[i].PanelJudges[j]
                      Obj[judegePanel+'#'+(j+1)] = judge.score;
                  }
                  if(i === routineJudgesScoreByPanel.length -1){
                     // Obj['routineindex'] = routineindex++;
                     // Obj['index'] = index
                      newArray.push(Obj)
                  }
                }
            }
            else {
                newArray.push(Obj)
            }
        }
    
                    if(index == this.Eventmeetroutinedata.length -1)      {
            this.eventService.progress = this.eventService.progress+10;
               
            this.eventService.progressSource.next(this.eventService.progress);
                      newArray = newArray.concat(coach)
                      const ws: xlsx.WorkSheet=xlsx.utils.json_to_sheet(newArray);
                      const wb: xlsx.WorkBook = xlsx.utils.book_new();
                        xlsx.utils.book_append_sheet(wb, ws, 'EventMeet-score');
                      /* save to file */
                      xlsx.writeFile(wb, this.eventMeetObj.EventName+'.xlsx');
                    }
    
    
    
              }
            }
    
        
            else {
                this.eventService.progress = 100;
                this.eventService.progressSource.next(this.eventService.progress);
                Swal('Info!',"No routines found",'info')
            }
    



}
getMappedEventMeetCoach() {
    return new Promise((resolve,reject)=>{
        this.eventService.mappedEventMeetCoachInfo(this.eventid,this.informationToEdit.SanctionID).subscribe(async(res)=>{
            var newArray =[];
            var EventMeetcoach = res.data;
            for(var c =0;c< EventMeetcoach.length ;c++) {
                let coach = EventMeetcoach[c]
                let Obj:CSVObjModel =new CSVObjModel();
                var coachsubmittedroutine = this.Eventmeetroutinedata.filter((routine)=> routine.submittedByID == coach.userId) ;
                var coachownroutine = this.Eventmeetroutinedata.filter((routine)=> routine.uid == coach.userId) ;
                if(coachsubmittedroutine.length == 0 && coachownroutine.length == 0) {
                        if(coach.Mapped_MemberInfo) {
                       
                       if(coach.Mapped_coachInfo.length > 0 ){
                       Obj.USAGID = coach.Mapped_MemberInfo.MemberID?coach.Mapped_MemberInfo.MemberID:'';
                       Obj.ClubName = coach.Mapped_coachclubInfo ?coach.Mapped_coachclubInfo[0].ClubName:'';
                       Obj.ClubUSAGID = coach.Mapped_coachclubInfo ?coach.Mapped_coachclubInfo[0].ClubUSAGID:''
                       Obj.FirstName = coach.Mapped_coachInfo[0].FirstName;
                       Obj.LastName = coach.Mapped_coachInfo[0].LastName;
                       Obj.DOB = '';
                       newArray.push(Obj)
                     }
                     else if(coach.Mapped_athleteInfo.length > 0){
                       Obj.USAGID = coach.Mapped_MemberInfo.MemberID?coach.Mapped_MemberInfo.MemberID:'';
                       Obj.ClubName = coach.Mapped_athleteclubInfo?coach.Mapped_athleteclubInfo[0].ClubName:'';
                       Obj.ClubUSAGID = coach.Mapped_athleteclubInfo ?coach.Mapped_athleteclubInfo[0].ClubUSAGID:''
                       Obj.FirstName = coach.Mapped_athleteInfo[0].FirstName;
                       Obj.LastName = coach.Mapped_athleteInfo[0].LastName;
                       Obj.DOB = coach.Mapped_athleteInfo[0].DOB;
                       newArray.push(Obj)
                     }
                   
                    // Obj['index'] = index
                    
                   }
                     
                }

                if(c == EventMeetcoach.length - 1) {
                    this.eventService.progress = this.eventService.progress+10;
               
            this.eventService.progressSource.next(this.eventService.progress);
                    resolve(newArray);
                }
             }
        }, error =>this.errorMessage(error))
    })
}
getEventMeetRoutineByLevel() {
    return new Promise(async (resolve,reject)=>{
        var levels = this.informationToEdit.Levels;
        var events = this.informationToEdit.Events;
        this.Eventmeetroutinedata = []
        this.levelRequestRoutine = 0;
        for (var i = 0; i < levels.length; i++) {
           // for (var j = 0; j < events.length; j++) {
               let data = {
                   eventmeetId :this.eventid,
                   levelId:levels[i],
                 //  eventId:events[j]
               }
              // this.eventService.progress = 1;
               
            //   this.eventService.progressSource.next(this.eventService.progress);
            this.eventService.progress = Math.round(1 / levels.length * 80);
            this.eventService.progressSource.next(this.eventService.progress);
            this.eventService.downloadEventmeetScoreByLevel(data).subscribe((res)=>{
                if(res.success) {
                    this.levelRequestRoutine++;
                    this.eventService.progress = Math.round(this.levelRequestRoutine / levels.length * 80);
                    this.eventService.progressSource.next(this.eventService.progress);
                    this.Eventmeetroutinedata = this.Eventmeetroutinedata.concat(res.response);
                    if(this.levelRequestRoutine == levels.length){
                        resolve(this.Eventmeetroutinedata)
                    }
                }
               
            } , error =>this.errorMessage(error))
          
       //}
        // if(i == levels.length -1) {
        //     resolve(this.Eventmeetroutinedata)
        // }
    
}

})
    
}

downloadEventmeetScoreByLevel(data) {
    return new Promise(async (resolve,reject)=>{
    this.eventService.downloadEventmeetScoreByLevel(data).subscribe((res)=>{
        if(res.success) {
            this.Eventmeetroutinedata = this.Eventmeetroutinedata.concat(res.response);
        }
        resolve();
    } , error =>this.errorMessage(error))
    })
}
  getEventMeetRoutineJudgesScore(routineId){
      return new Promise((resolve,reject)=>{
          this.eventService.getEventMeetRoutineJudgesScore(routineId).subscribe((res)=>{
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


    sendstartcode() {
        let data = {
            eventmeetId : this.eventid,
            startcode:this.startcode

        }
this.eventService.SendStartCodeForUSAGMappedCoaches(data).subscribe((res)=>{
    if(res && res.success){
        document.getElementById('close').click();
        Swal('Success!',"Start code sent to the mapped competitors",'success')

    }
})

    }
    Reset() {

    }
    ngOnInit() {

        let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());
        console.log('userinfo',userInfo)
        this.userRole = userInfo.userRole
        this.userId = userInfo._id
     //this.getUSAGVerificationMemberIDByFlyp10UserID(this.userId)
        this.activatedRoute.params.subscribe(param => {
            //  console.log("sdsds",param['id'])
              this.eventid = param['eventId']
              if(this.eventid != this.eventService.eventMeetId) {
                   this.eventService.progress = 0;
        this.eventService.progressSource.next(this.eventService.progress);
              }
              if(this.eventid){

                this.getEventDetail();
                this.getJudgesPanelByeventmeetId();
                this.getMappedCompetitorsForeventmeet();
                




              }

            })


    }
    async getEventLevelRanking() {

        let levels = this.informationToEdit.Levels;
        let events = this.informationToEdit.Events;
        for(var i=0;i<levels.length;i++){
            for(var j =0;j<events.length;j++){
                let users =[]
                var routinelist:any =[]
                routinelist = await this.getRoutineByEventLevel(levels[i],events[j]);
               if(routinelist['length']) {
                   for(var k = 0;k<routinelist['length'];k++){
                       let user = {
                        athlete : routinelist[k].athlete,
                        score :routinelist[k].score,
                        eventlevelRank :routinelist[k].eventlevelRank
                       }
                       users.push(user);
                       if(k == routinelist['length'] -1){
                        users.sort((a, b) => {
                            return b.score - a.score;
                        });
                           let rank = {
                               eventName : routinelist[0].event,
                               levelName : routinelist[0].level,
                               users: users
                           }
                           this.Ranking.push(rank);
                       }
                   }
               }

            }
        }

    }
    getRoutineByEventLevel(lid,eid) {
        return new Promise((resolve,reject)=>{
            this.eventService.getRoutineByEventLevel(lid,eid,this.eventid).subscribe((res)=>{
            resolve(res)

            })
        })

    }
    getJudgesPanelByeventmeetId() {
        this.eventService.getJudgespanelByeventmeetId(this.eventid).subscribe((res)=>{
            if(res && res.success) {
            this.EventMeetJudgespanelBylevelevent = res.data;
            }
        })
    }
    getUSAGMember() {
        return new Promise((resolve,reject)=>{
            this.userService.getUSAGMember(this.userId).subscribe((res)=>{
                if(res.success){

                      let memberid = res.data['MemberID']
                      if(memberid){
                      this.MemberID =memberid;
                      }
                        resolve()



                }
                else {
                  resolve()
                }

            })
        })

      }
    getUSAGVerificationMemberIDByFlyp10UserID() {
        return new Promise(async (resolve,reject)=>{
          await this.getUSAGMember();
          this._objService.checkMeetDirectorOrAdmin(this.MemberID,this.informationToEdit.SanctionID).subscribe((res)=>{
            console.log(res)
            if(res && res.data.length > 0){
              this.isUSAGMeetDirector = true;
              resolve();
            }
            else {
              this.isUSAGMeetDirector = false;
              resolve()
            }

          })
        })
    }
    getEventDetail() {

        this.eventService.getEventMeet(this.eventid).subscribe(async(res)=>{
            this.showLevelEvent = false



            let response = res.result
            this.informationToEdit = response;
            if(response.SanctionMeet) {
            this.getUSAGVerificationMemberIDByFlyp10UserID()
            }
            this.AddEventMeetForm.get('Sports').setValue(response.Sport)

            this._objService.checkisEnrolledEvent(this.eventid,this.userId).subscribe(responseForEnrol=>{
               console.log('enrolled',responseForEnrol)
                if(responseForEnrol.success){
                   if(responseForEnrol.result.length>0){
                       this.enrolled=true
                   }else{
                       this.enrolled=false
                   }
                }
                if(response.SanctionMeet) {
                    this.SanctionMeet = true
                }
                else {
                    this.SanctionMeet = false
                }
            })

            console.log('response',response)

            this.informationToEdit = response;
            var usaTime = new Date().toLocaleString("en-US", {timeZone: "America/Chicago"});
            var date1 = new Date(usaTime);
            console.log(date1);
            var formatDate1 = date1.getFullYear()+'-'+this.addZ(date1.getMonth()+1)+'-'+this.addZ(date1.getDate())+'T00:00:00'
            console.log(new Date(formatDate1),new Date(this.informationToEdit.EndDate),new Date(this.informationToEdit.StartDate))

            if(new Date(this.informationToEdit.StartDate) <= new Date(formatDate1) && new Date(formatDate1) <= new Date(this.informationToEdit.EndDate)){
this.IsOnGoingEventMeet = true;
            }

            this.sportDetails = this.informationToEdit.Judges;
            if(this.informationToEdit.Createdby == this.userId) {
                this.isUSAGMeetDirector = true;
            }

            this.AddEventMeetForm.patchValue({
                "EventName": this.informationToEdit.EventName,
                "StartDate":this.informationToEdit.StartDate,
                "EndDate":this.informationToEdit.EndDate,
                "Sports":this.informationToEdit.SportName,
                 Events :this.informationToEdit.Events,
                 Levels :this.informationToEdit.Levels,
                // Judges :this.informationToEdit.Judges,
                NjudgePrice:this.informationToEdit.NjudgePrice,
                NcompetitorPrice:this.informationToEdit.NcompetitorPrice,
                SjudgePrice:this.informationToEdit.SjudgePrice,
                ScompetitorPrice:this.informationToEdit.ScompetitorPrice,
                StechnicianPrice : this.informationToEdit.StechnicianPrice?this.informationToEdit.StechnicianPrice:"0",
                NtechnicianPrice : this.informationToEdit.NtechnicianPrice?this.informationToEdit.NtechnicianPrice:"0",
                State :this.informationToEdit.State,
                Country :this.informationToEdit.Country,
                "active":this.informationToEdit.active

            })
            this.isSanctionEventMeet  = this.informationToEdit.SanctionMeet?true:false;
if(this.isSanctionEventMeet){
    this.getEventmeetSportEvent()
     this.getAthleteCoachRoutinesByEvent()
     this.getRankingForEventMeet();
     this.getRankingForEventMeetAlllevel();
    
}
            this.minDate = this.informationToEdit.StartDate
         //   this.getEventLevelRanking();



        })

    }
    applyFilterRanking(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      
        this.filterRanking.forEach((rank,index) => {
            var users = this.Ranking[index].users;
            rank.users = users.filter(user=>user.name.toLowerCase().indexOf(filterValue) > -1)
            
            if(index == this.filterRanking.length -1){
                console.log(this.Ranking)
            }
        });
      }
      applyFilterAthleteInfo(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
        this.filterAthleteInfo = this.AthlteInfo.filter(user=>user.Name.toLowerCase().indexOf(filterValue) > -1)
        
      }
      applyFilterLevelRanking(filterValue: string) {
        filterValue = filterValue.trim(); // Remove whitespace
        filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
      
        this.filterLevelRanking.forEach((rank,index) => {
            var users = this.LevelRanking[index].users;
            rank.users = users.filter(user=>user.name.toLowerCase().indexOf(filterValue) > -1)
        });
      }
     addZ(n) { return n < 10 ? '0' + n : '' + n; }
    getRankingForEventMeet() {
        return new Promise((resolve,reject)=>{
            this.eventService.getRankingForEventMeet(this.eventid).subscribe((res)=>{

                this.Ranking = res;
                this.filterRanking = JSON.parse(JSON.stringify(this.Ranking));
                resolve()
            })
        })

    }
    getRankingForEventMeetAlllevel() {
        return new Promise((resolve,reject)=>{
            this.eventService.getRankingForEventMeetAlllevel(this.eventid).subscribe((res)=>{

                this.LevelRanking = res;
                this.filterLevelRanking = JSON.parse(JSON.stringify(this.LevelRanking));
                resolve()
            })
        })

    }
    getMappedCompetitorsForeventmeet() {
        this.eventService.getMappedCompetitorsForeventmeet(this.eventid).subscribe((res)=>{
            console.log(res)
            this.Competitors = res.result;
            console.log(this.Competitors)

        })
    }


    saveEventMeet() {

        console.log('form',this.AddEventMeetForm,this.AddEventMeetForm.valid)
        this.isSubmitted = true;
        if (this.AddEventMeetForm.valid) {
            let eventName = []
            let levelName = []
            let JudgeName = []
            for(let i=0;i<this.AddEventMeetForm.value.Events.length;i++){

                let name = this.allEvents.filter(event=>{
                    return event._id == this.AddEventMeetForm.value.Events[i]
                })
                eventName.push(name[0].Event)
            }
            for(let i=0;i<this.AddEventMeetForm.value.Levels.length;i++){

                let name = this.allLevels.filter(event=>{
                    return event._id == this.AddEventMeetForm.value.Levels[i]
                })
                levelName.push(name[0].level)
            }
            for(let i=0;i<this.AddEventMeetForm.value.Judges.length;i++){

                let name = this.allJudges.filter(event=>{
                    return event._id == this.AddEventMeetForm.value.Judges[i]
                })
                JudgeName.push(name[0].username)
            }

            let name = this.allSports.filter(event=>{
                return event._id == this.AddEventMeetForm.value.Sports
            })

            let sportName = name[0].sportName

            let bodytomerge={
                SportName:sportName,
                EventName:eventName,
                LevelName:levelName,
                JudgeName:JudgeName
            }
            this.AddEventMeetForm.value.SportName = sportName
            this.AddEventMeetForm.value.EventNames = eventName
            this.AddEventMeetForm.value.LevelName = levelName
            this.AddEventMeetForm.value.JudgeName = JudgeName

            if (!this.eventid) {

                this.eventService.saveEventMeet(this.AddEventMeetForm.value)
                    .subscribe(res => this.resStatusMessage(res),
                        error =>this.errorMessage(error));
            }
            else {

                this.eventService.update(this.AddEventMeetForm.value,this.eventid)
                    .subscribe(res => this.resStatusMessage(res),
                        error =>this.errorMessage(error));
            }
        }
    }

    resStatusMessage(res:any) {
      console.log('res',res)
        if(res.success){
            this.triggerCancelForm();
            Swal("Success !", res.message, "success");
        }else{
            Swal("Alert !", res.message, "info");
        }

    }

    errorMessage(objResponse:any) {
        Swal("Alert !", objResponse, "info");
        this.eventService.progress = 0;
        this.eventService.progressSource.next(this.eventService.progress);
    }

    triggerCancelForm() {
        this.router.navigate(['/event-meets']);
    }




  returnMinDate(){

    if(this.AddEventMeetForm.value.StartDate){

        return new Date(this.AddEventMeetForm.value.StartDate)
    }else{
        return new Date()
    }

  }
  enroll(){
      this.informationToEdit.userId = this.userId
      this._objService.enrollEventMeet(this.informationToEdit).subscribe(res=>{
          console.log('res',res)
          this.resStatusMessage(res)
     },err=>{
         this.errorMessage(err)
     })
  }






}
