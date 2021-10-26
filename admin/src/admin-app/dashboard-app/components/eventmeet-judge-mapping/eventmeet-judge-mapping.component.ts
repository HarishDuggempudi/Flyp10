import Swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { takeUntil } from "rxjs/operators";

import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";

import { RegisterUserModel } from "../user-management/user.model";
import { Config } from "../../../shared/configs/general.config";

import { Subject } from "rxjs";
import { EventMeetJudgeMappingService } from "./eventmeet-judge.service";
import { SportService } from "../sport/sport.service";
import { UserService } from "../user-management/user.service";
@Component({
  selector: "event-meet-judge-mapping",
  templateUrl: "./event-meet-judge-mapping-component.html",
  styleUrls: ['./eventmeet-judge-map.scss']

})

export class EventMeetJudgeMapping implements OnInit {

  AddEventMeetForm: FormGroup;
  AddJudgesForm:FormGroup;
  allCompetitors: any;
  filteredCompetitors: any =[];
  allEvents: any =[];
  private _onDestroy = new Subject<void>();
  loginuserinfo: RegisterUserModel;
  @ViewChild('form') myForm;
  @ViewChild('f') myNgForm;
  @ViewChild('swapform') swapform;
  isSubmitted = false;
  allSports =[]
  filteredSports
  allLevels = []
  allEventMeets =[]
  filteredEvents: any[];
  filteredLevels: any[];
  sportName: any;
  informationToEdit: any;
  eventmeetid: any;
  filteredEventMeetLevels: any =[];
  filteredEventMeetsEvents =[];
  sanctionJudges: any=[];
  allJudges: any =[];
  matchedJudges: any;
  filteredJudges: any =[];
  JudgesToShow: any =[];
  showJudges = false;
  isSubmittedJudgeForm = false;
  judgepanels =[]
  judgeDetails: any =[];
  ScoreCalculation: any ;
  levelName: any ='';
  eventName: any ='';
  calculationNone: boolean = false;
  MemberID: any;
  judgeChangeFrom: any;
  swappingJudgesToShow: any;
  swapJudgeForm: FormGroup;
  isSwapJudgeFormSubmitted: boolean = false;
  swapJudgePanelIndex: any;
  swapJudgeIndex: any;

  constructor(private userService:UserService,private activatedRoute:ActivatedRoute,private _formBuilder: FormBuilder, private sportService: SportService, private eventjudgemap: EventMeetJudgeMappingService) {
    this.AddEventMeetForm = this._formBuilder.group({
      "EventMeet": ['', Validators.required],
      "Sports": ['', Validators.required],
      'Levels': ['', Validators.required],
      'Events': ['', Validators.required],
      "inputCompetitors":['']
    });
    this.swapJudgeForm = this._formBuilder.group({
      "reason": ['',Validators.required],
      "panel":['',Validators.required],
      "JudgeChangeFrom":['',Validators.required],
      "JudgeChangeTo":['',Validators.required]
  });
    this.AddJudgesForm = this._formBuilder.group({
      "Panel": ['', Validators.required],
      "Judges": ['', Validators.required],
      
    });
    this.activatedRoute.queryParams.subscribe(param=>{
      this.AddEventMeetForm.controls.EventMeet.setValue(param['eventmeetId']);
      this.getEventDetail()
      this.OnEventMeetChange();
    })
    //  this.AddEventMeetForm.controls.inputCompetitors.valueChanges
    //       .pipe(takeUntil(this._onDestroy))
    //        .subscribe(() => {
    //         // this.filterCompetitors()
    //    });
  }
  
  
  addjudges(){
    if(this.calculationNone){
      this.showJudges = false
    }
    else {
    this.showJudges = true
    }
  }
  async ngOnInit() {
    let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.loginuserinfo = userInfo;
    
     this.getSportsDetails();
    // this.getEventMeetListByuserid();
     this.getSanctionEventMeet()
  //  await this.getAllJudges();
    

  }
  getSportsDetails() {
    return new Promise(async (resolve,reject)=>{
      await this.getSports();
      await this.getLevels();
      await this.getEvents();
   

    

    
      resolve();
  
    })

    



  }
  getSports() {
    return new Promise(async (resolve,reject)=>{
    this.sportService.getSportList(1000, 1)
    .subscribe(sportres => {
      //console.log('sports',sportres);
      this.allSports = sportres.dataList;
      this.filteredSports = this.allSports
      resolve();

    }, err => {this.errorMessage(err);
      resolve();
    });
  })
  }
  getLevels(){
    return new Promise(async (resolve,reject)=>{
    this.sportService.getLevelList(10000, 1)
    .subscribe(levelres => {
      //console.log('levelres',levelres)
      this.allLevels = levelres.dataList;
      resolve();
      //this.filteredLevels = this.allLevels

    }, err => {
      this.errorMessage(err);
      resolve();
    });
  })
  }
  getEvents(){
    return new Promise(async (resolve,reject)=>{
    this.sportService.getSportsEvent(10000, 1)
    .subscribe(eventRes => {
      //console.log('eventRes',eventRes)

      this.allEvents = eventRes.dataList;
      resolve();
      // this.filteredEvents = this.allEvents

    }, err => {
      this.errorMessage(err);
      resolve();
    })
  })
  }
  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }

  getEventMeetListByuserid() {
    return new Promise((resolve,reject)=>{
    this.eventjudgemap.getEventMeetByuserid(this.loginuserinfo._id).subscribe((res) => {
      console.log(res);

      this.allEventMeets = res
resolve();
    },err=>{
      this.errorMessage("Something Bad has happened!");
      resolve();
  })
  })
  }
  getUSAGMember() {
    return new Promise((resolve,reject)=>{
        this.eventjudgemap.getUSAGMember(this.loginuserinfo._id).subscribe((res)=>{
            if(res.success){
              
                  this.MemberID = res.data['MemberID']
                    resolve()
                
                
              
            }
            else {
              resolve()
            }
           
        })
    })
  
  }
  async getSanctionEventMeet(){
    await this.getUSAGMember()
    this.eventjudgemap.getSanctionEventMeet(this.MemberID).subscribe((res)=>{
      console.log(res);
    if(res && res.success){
      this.allEventMeets = res.result
    }
    })
  }
  getEventDetail() {
    return new Promise((resolve,reject)=>{
      let eventId = this.AddEventMeetForm.value.EventMeet;
      this.eventjudgemap.getEventMeet(eventId).subscribe(async (res)=>{
        this.allEventMeets.push(res.result)
          resolve()
          
      })
    })
    
   
  }
  getAllJudges(){
    return new Promise((resolve,reject)=>{
    this.userService.getUserListForSanction(1000,1,"2").subscribe(res=>{
              
      this.allJudges = res.dataList
      resolve()
    //   this.filteredJudges = this.allJudges
  },err=>{
      this.errorMessage("Something Bad has happened!");
      resolve();
  })
})
  }
 
  OnEventMeetChange() {
    this.filteredEventMeetLevels =[];
  this.filteredEventMeetsEvents =[];
  this.filteredJudges =[];
  this.judgeDetails=[];
  this.JudgesToShow =[];
  this.judgepanels =[];
  this.ScoreCalculation ='';
  this.levelName = '';
  this.eventName =''

    this.eventmeetid = this.AddEventMeetForm.value.EventMeet
    this.eventjudgemap.getEventMeet(this.eventmeetid).subscribe(async (res) => {

      let response = res.result
     
      
      //this.AddEventMeetForm.get('Sports').disable();
if(response.SanctionMeet){
  this.informationToEdit = response
  this.OnSportChange()
  let SanctionID = response.SanctionID
  await this.getSanctionJudges(SanctionID)

      //console.log('response',response)


        


    }
  })
  }
  OnLevelChange() {
    this.AddEventMeetForm.get('Events').setValue('');
    let level = this.filteredEventMeetLevels.filter(level=> level._id == this.AddEventMeetForm.value.Levels)
  this.levelName = level[0].level;

   
  }
  saveJudgeByPanel() {
    this.isSubmittedJudgeForm = true
    if (this.AddJudgesForm.valid) {
        
        let JudgeName = [];
        let JudgeMemberID =[];
       
            let panel = this.judgepanels.filter(event=>{
                return event._id == this.AddJudgesForm.value.Panel
            })
      
        for(let i=0;i<this.AddJudgesForm.value.Judges.length;i++){
            
            let name = this.allJudges.filter(event=>{
                return event._id == this.AddJudgesForm.value.Judges[i]
            })
           ;
            let MemberID = this.JudgesToShow.filter(event=>{
              return event._id == this.AddJudgesForm.value.Judges[i]
          })
        //  JudgeMemberID.push(MemberID[0].MemeberID);
        JudgeName.push({name:name[0].username,firstName:name[0].firstName,lastName:name[0].lastName,USAGID:MemberID[0].MemberID})
        }

        let detailsToAdd = {          
            Panel :this.AddJudgesForm.value.Panel,
            Judges :this.AddJudgesForm.value.Judges,
            JudgeName:JudgeName,
            PanelName:panel[0].judgePanel,
           // JudgeMemberID:JudgeMemberID
        }

       
        // this.AddSportForm.get("Sports").disable()
        if(this.judgeDetails.length>0){
            for(let e=0;e<this.judgeDetails.length;e++){
                let temp=this.judgeDetails[e]
                if(temp.Panel==this.AddJudgesForm.value.Panel){
                    this.judgeDetails[e]=detailsToAdd
                    e=this.judgeDetails.length;
                }
                if(e==this.judgeDetails.length-1){
                    this.judgeDetails.push(detailsToAdd)
                }
    
            }
        }else{
            this.judgeDetails.push(detailsToAdd)
        }
    
        this.AddJudgesForm.patchValue({           
            Panel : '',
            Judges : '',
           
        })
        this.isSubmittedJudgeForm = false
        this.myNgForm.resetForm();
        this.showJudges=false
        window.scroll(0,0)
        
      }
  }
 
  resetJudgesForm(){
    this.AddJudgesForm.reset()
}
delete(i){
    this.judgeDetails.splice(i,1)
}
  saveEventMeetJudgeMap(val) {
    let data = {
      eventmeetId : this.AddEventMeetForm.value.EventMeet,
      sportId : this.AddEventMeetForm.value.Sports,
      eventId: this.AddEventMeetForm.value.Events,
      levelId : this.AddEventMeetForm.value.Levels,
      JudgesbyPanel : this.judgeDetails,
      levelName : this.levelName,
      eventName:this.eventName

    }
    if(this.judgeDetails.length > 0){
    this.eventjudgemap.saveEventmeetJudgesBypanel(data).subscribe((res)=>{
      if(res.success){
        if(val == '1'){
        Swal("Success !", res.message, "success");
        this.judgeDetails =[];
        this.JudgesToShow =[];
        this.judgepanels =[];
        this.ScoreCalculation ='';
        this.levelName ='';
        this.eventName =''
        this.isSubmitted = false;
        this.myForm.resetForm();
        this.showJudges=false
        }
      }
    })
  }else {
    Swal("Alert","Please add judges for panel.","info")
  }
  
  }
  async onEventChange(){
    let sportid = this.AddEventMeetForm.value.Sports;
    this.judgeDetails = [];
    let event =  this.filteredEventMeetsEvents.filter(event=>{
      return event._id == this.AddEventMeetForm.value.Events
  })
  this.eventName = event[0].Event
    this.getJudgesPanelForSports(sportid);
    await this.getEventMeetJudgePanel()
    await this.getScoreCalculationbySportLevelEvent()
  }
  getScoreCalculationbySportLevelEvent() {
    return new Promise((resolve,reject)=>{
      let data = {
       
        sportId : this.AddEventMeetForm.value.Sports,
        eventId: this.AddEventMeetForm.value.Events,
        levelId : this.AddEventMeetForm.value.Levels,
  
      }
this.eventjudgemap.getScoreCalculationbySportLevelEvent(data).subscribe((res)=>{
  if(res.success) {
    if(res.data.length > 0){
      this.ScoreCalculation = res.data[0].calculation;
      this.calculationNone = false
      resolve()
    }
    else {
      this.calculationNone = true
      this.ScoreCalculation =''
      resolve()
    }
  
  }
  else {
    resolve()
  }
 
})
    })
  }
  getEventMeetJudgePanel() {
    return new Promise((resolve,reject)=>{
      let data = {
        eventmeetId : this.AddEventMeetForm.value.EventMeet,
        sportId : this.AddEventMeetForm.value.Sports,
        eventId: this.AddEventMeetForm.value.Events,
        levelId : this.AddEventMeetForm.value.Levels,
  
      }
this.eventjudgemap.getEventMeetJudgePanel(data).subscribe((res)=>{
  if(res.success) {
    if(res.data.length > 0){
      this.judgeDetails = res.data[0].JudgesbyPanel;
     // this.levelName = res.data[0].levelName;
     // this.eventName = res.data[0].eventName;
      resolve()
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
  getJudgesPanelForSports(sportid) {
    this.eventjudgemap.getJudgesPanelForSports(sportid).subscribe((res)=>{
if(res.success) {
  this.judgepanels = res.data;
}
    })
  }
  deletejudge(i,j){
    this.judgeDetails[i].Judges.splice(j,1)
    this.judgeDetails[i].JudgeName.splice(j,1)
  }
  swapjudge(i,j) {
    this.isSwapJudgeFormSubmitted = false;
    this.swapform.resetForm()
    this.swapJudgeForm.patchValue({           
      reason : '',
      JudgeChangeTo : '',
     
  })
    this.swapJudgePanelIndex = i
    this.swapJudgeIndex = j
    this.judgeChangeFrom = this.judgeDetails[i].Judges[j];
    let judgeName =this.judgeDetails[i].JudgeName[j].firstName+' '+this.judgeDetails[i].JudgeName[j].lastName+'-'+this.judgeDetails[i].JudgeName[j].USAGID
    this.swapJudgeForm.patchValue({           
      JudgeChangeFrom : judgeName,
      panel : this.judgeDetails[i].PanelName,
     
  })
    this.swappingJudgesToShow = JSON.parse(JSON.stringify(this.JudgesToShow));
    let removeswapfromjudgeIndex = this.swappingJudgesToShow.findIndex((judge)=>judge._id == this.judgeChangeFrom)
    this.swappingJudgesToShow.splice(removeswapfromjudgeIndex,1)


  }
  swap() {
    this.isSwapJudgeFormSubmitted = true;

    if(this.swapJudgeForm.valid) {
      let data = {
        eventmeetId : this.AddEventMeetForm.value.EventMeet,
        sportId : this.AddEventMeetForm.value.Sports,
        eventId: this.AddEventMeetForm.value.Events,
        levelId : this.AddEventMeetForm.value.Levels,
        panel:this.swapJudgeForm.value.panel,
        judgeIdChangeFrom:this.judgeChangeFrom,
        judgeIdChangeTo:this.swapJudgeForm.value.JudgeChangeTo,
        reason:this.swapJudgeForm.value.reason
        
      }
      console.log(data)
      let MemberID = this.JudgesToShow.filter(event=>{
        return event._id == this.swapJudgeForm.value.JudgeChangeTo
    })
      let name = this.allJudges.filter(event=>{
        return event._id == this.swapJudgeForm.value.JudgeChangeTo
    })
    let IsalreadyJudgeForthisPanel = this.judgeDetails[this.swapJudgePanelIndex].Judges.filter(judge => judge == data.judgeIdChangeTo)
    if(IsalreadyJudgeForthisPanel.length == 0){
    this.judgeDetails[this.swapJudgePanelIndex].Judges[this.swapJudgeIndex] = data.judgeIdChangeTo;
    this.judgeDetails[this.swapJudgePanelIndex].JudgeName[this.swapJudgeIndex] = {name:name[0].username,firstName:name[0].firstName,lastName:name[0].lastName,USAGID:MemberID[0].MemberID}
    this.saveEventMeetJudgeMap('2');
    this.eventjudgemap.swapJudgesForEventmeetByEventLevel(data).subscribe((res)=>{
      if(res.success) {
        Swal("Success !", res.message, "success");
      }


    })
  
    
  }
  else {
    Swal('Info',name[0].username+" was already assigned for '" +this.swapJudgeForm.value.panel+"' judge panel","info")
  }
  document.getElementById('close').click();
    this.isSwapJudgeFormSubmitted = false
    this.swapform.resetForm()
    this.swapJudgeForm.patchValue({           
      reason : '',
      JudgeChangeTo : '',
     
  })
  }

    
    
  }
  onJudgePanelChange(){
    let panel=this.AddJudgesForm.value.Panel
    let judge=this.judgeDetails.filter(item=>item.Panel==panel)
    judge=judge[0]?judge:[]
    if(judge.length>0){
        this.AddJudgesForm.patchValue({
            Judges:judge[0].Judges
        })
    }else{
       this.AddJudgesForm.patchValue({
           Judges:''
       })  
    }
  }
  getSanctionJudges(SanctionID) {
    return new Promise(async (resolve,reject)=>{
      await this.getAllJudges();
      this.eventjudgemap.getSanctionJudges(SanctionID).subscribe((res)=>{
        if(res && res.success){
        this.sanctionJudges = res.data
        for (var i =0;i<this.sanctionJudges.length;i++){
          let judge =this.allJudges.filter(event => event._id == this.sanctionJudges[i].Flyp10UserID)
          if(judge.length > 0){
          judge[0]['MemberID'] = this.sanctionJudges[i].MemeberID;
          this.filteredJudges.push(judge[0])
          this.JudgesToShow.push(judge[0]);
          }
        

         }
      
        let judgestoShow =  this.JudgesToShow.filter((obj, pos, arr) => {
         return arr.map(mapObj => mapObj['_id']).indexOf(obj['_id']) === pos;
      
        })
        this.JudgesToShow = judgestoShow
        resolve()
        }
        else {
          resolve()
        }
        
      })
    })
    
  }
  async OnSportChange() {
    if(this.allEvents.length == 0 || this.allLevels.length == 0){
    await this.getSportsDetails();
    }
    this.filteredEvents = []
    this.filteredLevels = [];
    let name = this.allSports.filter(event => {
      return event._id == this.informationToEdit.Sport
    })

    this.sportName = name[0].sportName
    // this.sportService.getSportDetailsbyMapping(this.AddEventMeetForm.value.Sports).subscribe(
    //   res => {
    //     if (res.length > 0) {
    //       let temp = res[0];
    //       let level = [];
    //       this.AddEventMeetForm.controls["Events"].setValue("");
    //       level = temp.level;
    //       for (let j = 0; j < level.length; j++) {
    //         let templevelid = level[j];
    //         //console.log(templevelid)
    //         let temp = this.allLevels.filter(item => item._id == templevelid)
    //         //console.log(temp);
    //         if (temp[0]) {
    //           this.filteredLevels.push(temp[0]);
    //         }

    //       }


    //       let eventarray = temp.mappingFieldsVal;
    //       for (let e = 0; e < eventarray.length; e++) {
    //         let eventObj = eventarray[e];
    //         for (let f = 0; f < this.allEvents.length; f++) {
    //           if (eventObj.event == this.allEvents[f]._id) {

    //             this.filteredEvents.push(this.allEvents[f]);
    //           }
    //         }
    //       }

          if (this.eventmeetid) {


            // this.AddEventMeetForm.patchValue({

            //   "Sports": this.informationToEdit.Sport,
            //   Events: this.informationToEdit.Events,
            //   Levels: this.informationToEdit.Levels,


            // });

            let eventmeetlevel = this.informationToEdit.Levels;
            for (let j = 0; j < eventmeetlevel.length; j++) {
              let templevelid = eventmeetlevel[j];
              let temp = this.allLevels.filter(item => item._id == templevelid)

              if (temp[0]) {
                this.filteredEventMeetLevels.push(temp[0]);
              }
            }
            let EventMeeteventarray = this.informationToEdit.Events;
            for (let e = 0; e < EventMeeteventarray.length; e++) {
              let eventObj = EventMeeteventarray[e];
              for (let f = 0; f < this.allEvents.length; f++) {
                if (eventObj== this.allEvents[f]._id) {
  
                  this.filteredEventMeetsEvents.push(this.allEvents[f]);
                }
              }
            }
            this.AddEventMeetForm.get('Sports').setValue(this.informationToEdit.Sport);
            this.AddEventMeetForm.get('Events').setValue('');
            this.AddEventMeetForm.get('Levels').setValue('');
            
            //   this.onEventChange();

          }





        
      // }, err => {
      //   this.errorMessage(err)
      // })
    //alert(this.sportid);




  }



}




