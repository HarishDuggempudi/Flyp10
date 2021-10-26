import Swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource, throwMatDialogContentAlreadyAttachedError } from "@angular/material";
import { EventMeetService } from "../event-meet-service";
import { MeetResponse,MeetModel } from "../event-meet-model";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { SportService } from "../../sport/sport.service";
import { takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { CountryService } from "../../countryConfig/country.service";
import { UserModel, UserSecurityModel } from "../../user-management/user.model";
import { UserService } from "../../user-management/user.service";
import { Config } from "../../../../shared/configs/general.config";
import * as moment from 'moment';
import { Location } from "@angular/common";
import * as _ from 'lodash';   

@Component({
  selector: "event-meet-list",
  templateUrl: "./event-meet-editor.html",
  styleUrls:['./event-meet.scss']
})

export class EventMeetEditorComponent implements OnInit {


    
    eventMeetObj:MeetModel = new MeetModel();
    AddEventMeetForm:FormGroup;
    isSubmitted:boolean = false;
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
    matchedJudges: any = [];
    JudgesToShow: any = [];
    TechnicianToShow :any = []
    AddSportForm:FormGroup
    sportDetails:any = []
    Competitors:any = []
    isSubmittedSportForm:boolean = false
    sportName: any;
    showJudges:boolean=false;
    @ViewChild('f') myNgForm;
    showTechnician: boolean = false;
    MFigureSkating = Config.MFigureSkating;
    WFigureDkating = Config.WFigureSkating;
    addTechnician: boolean = false;
    judgesInfo: any = [];
    addEventLevel: boolean;
    sanctionEventMeet: any;
    filteredOptions: any;
    userRole: any;
    userInfo: any;
    isUSAGMember: boolean = false;
    sanctionid: any;
    SanctionInfo: any;
    isOpenSanction = false
    isSanctionEventMeet: boolean = false;
    sportjudgepanel: any =[];
    SanctionMeet = false;
  USAGSports = Config.USAGSportsInFlyp10;
    EventMeetJudgespanelBylevelevent: any =[];
    sanctionlevels: any =[];
    allsanctionlevel: any =[];
    notinsertSanctionlevels: any =[];
    MemberID: any;
    constructor(private eventService:EventMeetService,private location: Location,private userService:UserService,private sportService:SportService,private router: Router, private activatedRoute: ActivatedRoute, private _objService:EventMeetService, private _formBuilder:FormBuilder) {
       
        let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());  
        console.log('userinfo',userInfo) 
        this.userRole = userInfo.userRole
        this.userInfo = userInfo;
        this.getUSAGVerificationMemberIDByFlyp10UserID(this.userInfo._id)  

        // this.startDate = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
        this.minDate = new Date();

        this.getCountrylist()
        this.getAllJudges()
      
        this.AddEventMeetForm = this._formBuilder.group({
        "EventName": ['', Validators.required],       
        "StartDate": ['', Validators.required],
        "EndDate": ['', Validators.required],       
        State : [''],
        Country : ['',Validators.required],
        "active": [false],
        "Sports": ['',Validators.required],
         Levels : ['',Validators.required],
         "inputLevel":[''] ,
         inputEvent:  [''] ,
         Events:['',Validators.required] ,
         EventLevel:[''],
         NjudgePrice:['',Validators.required] ,
         NcompetitorPrice:['',Validators.required],
         NtechnicianPrice:['0',Validators.required],
         SjudgePrice:['',Validators.required] ,
         ScompetitorPrice:['',Validators.required] ,
         StechnicianPrice:['0',Validators.required] ,
         SanctionMeet:[false],
         SanctionID:[''],
         Createdby:[''],
         scoretype:['1']

   });
        
   
        this.AddSportForm= this._formBuilder.group({
          
            Events : ['',Validators.required],      
            Judges : ['',Validators.required],
            Technician:[''],
            JudgePanel:[''],
            "inputLevel":[''],
            "inputEvent":[''],
            "inputSport":[''],
            "inputJudges":['']

        })


        this.AddSportForm.controls.inputSport.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
            
          this.filterSport();
         
        });
     this.AddEventMeetForm.controls.inputLevel.valueChanges
        .pipe(takeUntil(this._onDestroy))
         .subscribe(() => {
            
        
           this.filteredLevel()
     });
        this.AddEventMeetForm.controls.inputEvent.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
            
       
          this.filteredEvent()
        
        });
        this.AddSportForm.controls.inputJudges.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
            
       
          this.filteredJudge()
        
        });
        
    

    }
    formatDate(date){

        return moment(date).format('MM/DD/YYYY')
      }
      
    getMappedCompetitorsForeventmeet() {
        this.eventService.getMappedCompetitorsForeventmeet(this.eventid).subscribe((res)=>{
            console.log(res)
            this.Competitors = res.result;
            console.log(this.Competitors)

        })
    }
    getSanctionByID() {
        this._objService.getSanctionByID(this.sanctionid).subscribe(async (res)=>{
          console.log(res);
          this.SanctionInfo = res;
         // this.getSportsDetails();
          //this.filterSport()
         let USAGSport = this.USAGSports.find((e)=>e.USAG.toLowerCase() == this.SanctionInfo.DisciplineType.toLowerCase())
          let sport = await this.filteredSports.find(sport =>sport.sportName == USAGSport.Flyp10)
          this.AddEventMeetForm.patchValue({
          NjudgePrice:'0.01',
          NcompetitorPrice:'0.01',
          NtechnicianPrice:'0.01',
          SjudgePrice:'0.01',
          ScompetitorPrice:'0.01', 
          StechnicianPrice : '0.01',
          SanctionMeet:true,
          SanctionID:this.SanctionInfo.SanctionID,
            "StartDate":this.SanctionInfo.CompetitionStartDate, 
            "EndDate":this.SanctionInfo.CompetitionEndDate,
            State :this.SanctionInfo.SiteState,
            Country :'USA'
          })
          if(sport._id){
            this.AddEventMeetForm.patchValue({
                "Sports":sport._id, 
            })
            this.OnSportChange();
          }
          
          
        //   this.AddEventMeetForm.value.SanctionMeet = true;
        console.log(this.AddEventMeetForm.value.SanctionID)
          
        })
      }
    
    
    filteredJudge(){
        if (!this.allSports) {
            return;
          }
          // get the search keyword
          let search = this.AddSportForm.controls.inputJudges.value;
          if (!search) {
            this.filteredJudges=this.allJudges.slice();
            return;
          } else {
            search = search.toLowerCase();
          }
          // filter the banks
          this.filteredJudges=this.allJudges.filter(event => event.username.toLowerCase().indexOf(search) > -1)
    }
   
    getUSAGMember() {
        return new Promise((resolve,reject)=>{
            this.userService.getUSAGMember(this.userInfo._id).subscribe((res)=>{
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
    
    async getUSAGVerificationMemberIDByFlyp10UserID(userid) {
        await this.getUSAGMember()
        this._objService.getSanctionMemberIDByFlyp10UserID(this.MemberID).subscribe(res => {
        //this.sanctionEventMeet = res;
        if(res && res.length > 0){
        this.isUSAGMember = true;
        if(this.isUSAGMember) {
            this.userService.getUserListForSanction(1000,1,"2").subscribe(res=>{
              
                this.allJudges = res.dataList
              //   this.filteredJudges = this.allJudges
            },err=>{
                this.errorMessage("Something Bad has happened!")
            })
          }
        }
       
        })
    
      }
filterSport(){
           if (!this.allSports) {
        return;
      }
      // get the search keyword
     let search = this.AddSportForm.controls.inputSport.value;
      if (!search) {
        this.filteredSports=this.allSports.slice();
        return;
      } else {
        search = search.toLowerCase();
      }
      // filter the banks
      this.filteredSports=this.allSports.filter(event => event.sportName.toLowerCase().indexOf(search) > -1)
       
  }
  addjudges(){
      this.showJudges=true
  }
 
filteredEvent(){
        if (!this.allEvents) {
    return;
    }
    // get the search keyword
    let search = this.AddEventMeetForm.controls.inputEvent.value;
    if (!search) {
    this.filteredEvents=this.allEvents.slice();
    return;
    } else {
    search = search.toLowerCase();
    }
    // filter the banks
    this.filteredEvents=this.allEvents.filter(event => event.Event.toLowerCase().indexOf(search) > -1)

}

filteredLevel(){
    if (!this.allLevels) {
return;
}
// get the search keyword
let search = this.AddEventMeetForm.controls.inputLevel.value;
if (!search) {
    if(this.isSanctionEventMeet){
        this.filteredLevels=this.sanctionlevels.slice();
    }
    else {
    this.filteredLevels=this.allLevels.slice();
    }
    return;
} else {
    search = search.toLowerCase();
    if(this.isSanctionEventMeet){
        this.filteredLevels=this.sanctionlevels.filter(event => event.level.toLowerCase().indexOf(search) > -1)
    }
    else {
    this.filteredLevels=this.allLevels.filter(event => event.level.toLowerCase().indexOf(search) > -1)
    }
}


// filter the banks


}
    
    
    ngOnInit() {
        
        this.getSportsDetails();

       
    }
    getSportsDetails(){
        this.sportService.getSportList(1000,1)
    .subscribe(sportres=>{
        //console.log('sports',sportres);
        this.allSports=sportres.dataList;
        this.filteredSports = this.allSports
       
    },err=>this.errorMessage(err));

    this.sportService.getLevelList(10000,1)
    .subscribe(levelres=>{
        //console.log('levelres',levelres)
       this.allLevels=levelres.dataList;
       //this.filteredLevels = this.allLevels
       
    },err=>{
        this.errorMessage(err);
    });

    this.sportService.getSportsEvent(10000,1)
    .subscribe(eventRes=>{
        //console.log('eventRes',eventRes)
        
       this.allEvents=eventRes.dataList;
       // this.filteredEvents = this.allEvents
      
    },err=>{
		this.errorMessage(err);
    })

    this.activatedRoute.params.subscribe(param => {
        //  //console.log("sdsds",param['id'])
          this.eventid = param['eventId']
        
          if(this.eventid){

            this.getEventDetail();
            this.getJudgesPanelByeventmeetId();
            this.getMappedCompetitorsForeventmeet();
              
          }
          this.sanctionid = param['sanctionid']
        
          if(this.sanctionid){
              this.isSanctionEventMeet = true
              
           this.getSanctionByID();
              
          }

        }
         
      );
     

}
getJudgesPanelByeventmeetId() {
    this.eventService.getJudgespanelByeventmeetId(this.eventid).subscribe((res)=>{
        if(res && res.success) {
        this.EventMeetJudgespanelBylevelevent = res.data;
        }
    })
}

    getEventDetail() {

        this.eventService.getEventMeet(this.eventid).subscribe(res=>{
            this.showLevelEvent = false

           

            let response = res.result
            this.AddEventMeetForm.get('Sports').setValue(response.Sport)
            
            //console.log('response',response)


            this.informationToEdit = response;
            this.isSanctionEventMeet = this.informationToEdit.SanctionMeet?true:false;
            this.OnSportChange()
           
            
        })
       
    }
    judgesEvent:any=[]
    onEventChange(){
      
       let tempeventArray=this.AddEventMeetForm.value.Events;
       //console.log(this.AddEventMeetForm.value) 
       this.judgesEvent=[]
       for(let e=0;e<tempeventArray.length;e++){
        let eventObj=tempeventArray[e];
        for(let f=0;f<this.allEvents.length;f++){
              if(eventObj==this.allEvents[f]._id){
                   
                   this.judgesEvent.push(this.allEvents[f]);
              }
        }
    }
    }
    async saveEventMeet() {

        //console.log('form',this.AddEventMeetForm,this.AddEventMeetForm.valid)
        this.isSubmitted = true;
        if(this.AddEventMeetForm.valid){
            if(this.isSanctionEventMeet){
                let name = this.allSports.filter(event=>{
                    return event._id == this.AddEventMeetForm.value.Sports
                })
    
                let sportName = name[0].sportName
    
                this.AddEventMeetForm.value.SportDetails = this.sportDetails
                this.AddEventMeetForm.value.SportName = sportName;
               
               
                if (!this.eventid) {
                    this.AddEventMeetForm.value.Createdby = this.userInfo._id
                    this.eventService.saveEventMeet(this.AddEventMeetForm.value)
                        .subscribe(async(res) => {
                            if(this.AddEventMeetForm.value.SanctionID && this.AddEventMeetForm.value.SanctionMeet){
                                var data = res.response;
                                await this.EnrollEventMeetForSanctionOrganizerAdminstrators(data)
                               
                            }
                            this.resStatusMessage(res)},
                            error =>this.errorMessage(error));
                }
                else { 
                  // console.log('sportDetails',this.sportDetails) 
                   this.AddEventMeetForm.value.Judges=this.sportDetails
                  // console.log('sportDetails',this.AddEventMeetForm.value) 
                    this.eventService.update(this.AddEventMeetForm.value,this.eventid)
                        .subscribe(res => this.resStatusMessage(res),
                            error =>this.errorMessage(error));
                }

            }
            else if (this.AddEventMeetForm.value.Events.length==this.sportDetails.length) {
                // let eventName = []
                // let levelName = []
                // let JudgeName = []
                // for(let i=0;i<this.AddEventMeetForm.value.Events.length;i++){
                    
                //     let name = this.allEvents.filter(event=>{
                //         return event._id == this.AddEventMeetForm.value.Events[i]
                //     })
                //     eventName.push(name[0].Event)
                // }
                // for(let i=0;i<this.AddEventMeetForm.value.Levels.length;i++){
                    
                //     let name = this.allLevels.filter(event=>{
                //         return event._id == this.AddEventMeetForm.value.Levels[i]
                //     })
                //     levelName.push(name[0].level)
                // }
                // for(let i=0;i<this.AddEventMeetForm.value.Judges.length;i++){
                    
                //     let name = this.allJudges.filter(event=>{
                //         return event._id == this.AddEventMeetForm.value.Judges[i]
                //     })
                //     JudgeName.push(name[0].username)
                // }
    
                let name = this.allSports.filter(event=>{
                    return event._id == this.AddEventMeetForm.value.Sports
                })
    
                let sportName = name[0].sportName
    
                // let bodytomerge={
                //     SportName:sportName,
                //     EventName:eventName,
                //     LevelName:levelName,
                //     JudgeName:JudgeName
                // }
                this.AddEventMeetForm.value.SportDetails = this.sportDetails
                this.AddEventMeetForm.value.SportName = sportName
                
               
                // this.AddEventMeetForm.value.LevelName = levelName
                // this.AddEventMeetForm.value.JudgeName = JudgeName
    
                //console.log('for data before upload',this.AddEventMeetForm.value)
                if (!this.eventid) {
                    this.AddEventMeetForm.value.Createdby = this.userInfo._id
                    this.eventService.saveEventMeet(this.AddEventMeetForm.value)
                        .subscribe(res => this.resStatusMessage(res),
                            error =>this.errorMessage(error));
                }
                else { 
                  // console.log('sportDetails',this.sportDetails) 
                   this.AddEventMeetForm.value.Judges=this.sportDetails
                  // console.log('sportDetails',this.AddEventMeetForm.value) 
                    this.eventService.update(this.AddEventMeetForm.value,this.eventid)
                        .subscribe(res => this.resStatusMessage(res),
                            error =>this.errorMessage(error));
                }
            }else{
                Swal("Alert","Please add judges for all the selected event.","info")
            }
        }
       
    }
    EnrollEventMeetForSanctionOrganizerAdminstrators(data){
        return new Promise((resolve,reject)=>{
            this.eventService.EnrollEventMeetForSanctionOrganizerAdminstrators(data).subscribe((res)=>{
                console.log(res)
                resolve()
            })
        })
    }

    resStatusMessage(res:any) {
      //console.log('res',res)
        if(res.success){
            this.triggerCancelForm();
            Swal("Success !", res.message, "success");
        }else{
            Swal("Alert !", res.message, "info");
        }
        
    }

    errorMessage(objResponse:any) {
        Swal("Alert !", objResponse, "info");
    }

    triggerCancelForm() {
        //this.router.navigate(['/event-meets']);
        this.location.back();
    }
    OnEventLevelChange() {
        if(this.AddEventMeetForm.value.EventLevel == '1' ) {
            this.addTechnician = true
        }
        else {
            this.addTechnician = false
        }
    }
    getUSAGSportJudgePanel() {

        this.eventService.getUSAGSportJudgePanel(this.AddEventMeetForm.value.Sports).subscribe((res)=>{
            this.sportjudgepanel = res.data;
        })

    }
    getSanctionInfoBySanctionID() {
        return new Promise((resolve,reject)=>{
            var sanctionid = this.informationToEdit.SanctionID;
            this.eventService.getSanctionInfoBySanctionID(sanctionid).subscribe((res)=>{
                this.SanctionInfo = res;
                resolve();
            })
        })
       
    }
    OnSportChange(){
//this.getUSAGSportJudgePanel();
        this.showLevelEvent = false
	 
        this.sportDetails = []
		this.filteredEvents = []
         this.filteredLevels=[];
        this.JudgesToShow = [];
        this.TechnicianToShow = [];
        this.judgesInfo = [];
        //For Figure skating event level added lower/higer
        if(this.AddEventMeetForm.value.Sports == this.WFigureDkating || this.AddEventMeetForm.value.Sports == this.MFigureSkating){
            this.AddEventMeetForm.get('EventLevel').setValidators([Validators.required]);
            this.AddEventMeetForm.get('EventLevel').updateValueAndValidity();
            this.addEventLevel = true;
        }
        else {
            this.AddEventMeetForm.get('EventLevel').setValidators([]);
            this.AddEventMeetForm.get('EventLevel').clearValidators();
          this.AddEventMeetForm.get('EventLevel').updateValueAndValidity();
            this.addEventLevel = false;
        }
        let name = this.allSports.filter(event=>{
            return event._id == this.AddEventMeetForm.value.Sports
        })

        this.sportName = name[0].sportName
		   this.sportService.getSportDetailsbyMapping(this.AddEventMeetForm.value.Sports).subscribe(
				 async(res)=>{
					 //console.log('res mapped ',res)
					 if(res.length>0){
						 let temp=res[0];
						  let level=[];
						  this.AddSportForm.controls["Events"].setValue("");
						  level=temp.level;
                              
                                for(let j=0;j<level.length;j++){
                                    let templevelid=level[j];
                                    //console.log(templevelid)
                                    let temp=this.allLevels.filter(item=>item._id==templevelid)
                                    //console.log(temp);
                                    if(temp[0]){
                                     this.filteredLevels.push(temp[0]);
                                    }
                               
                                }
                               
                                
                            //    //console.log(" this.filteredLevels", this.filteredLevels)						  
						  
						let eventarray= temp.mappingFieldsVal; 
						for(let e=0;e<eventarray.length;e++){
							let eventObj=eventarray[e];
							for(let f=0;f<this.allEvents.length;f++){
								  if(eventObj.event==this.allEvents[f]._id){
									   
								       this.filteredEvents.push(this.allEvents[f]);
								  }
							}
                        }
                        if(this.isSanctionEventMeet){
                            this.sanctionlevels = [];
                            if(this.eventid){
                            await this.getSanctionInfoBySanctionID();
                            }
                            
                            await this.getAllSanctionLevels();
                            this.allsanctionlevel = _.uniq(this.allsanctionlevel);
                            
                         for(let j=0;j<this.allsanctionlevel.length;j++){
                             let templevelid=this.allsanctionlevel[j];
                             //console.log(templevelid)
                             let temp=this.allLevels.filter(item=>item.level==templevelid)
                             //console.log(temp);
                             if(temp[0]){
                              this.sanctionlevels.push(temp[0]);
                             }
                             else {
                                 this.notinsertSanctionlevels.push(templevelid)
                             }
                             if(j == this.allsanctionlevel.length -1 && this.sanctionlevels.length >0) {
                                 this.filteredLevels = this.sanctionlevels
                             }
                           }
                        }
                        if(this.eventid){

                            console.log('information to edit',this.informationToEdit)
                            this.AddEventMeetForm.patchValue({
                                "EventName": this.informationToEdit.EventName,
                                "StartDate":this.informationToEdit.StartDate, 
                                "EndDate":this.informationToEdit.EndDate,
                                "Sports":this.informationToEdit.Sport, 
                                 Events :this.informationToEdit.Events,
                                 Levels :this.informationToEdit.Levels,
                                 EventLevel :this.informationToEdit.EventLevel ?this.informationToEdit.EventLevel:"0",
                                NjudgePrice:this.informationToEdit.NjudgePrice,
                                NcompetitorPrice:this.informationToEdit.NcompetitorPrice,
                                NtechnicianPrice:this.informationToEdit.NtechnicianPrice?this.informationToEdit.NtechnicianPrice:"0",
                                SjudgePrice:this.informationToEdit.SjudgePrice,
                                ScompetitorPrice:this.informationToEdit.ScompetitorPrice, 
                                StechnicianPrice : this.informationToEdit.StechnicianPrice?this.informationToEdit.StechnicianPrice:"0",
                                State :this.informationToEdit.State,
                                Country :this.informationToEdit.Country,
                                "active":this.informationToEdit.active,
                                SanctionMeet:this.informationToEdit.SanctionMeet?true:false,
                                SanctionID:this.informationToEdit.SanctionID?this.informationToEdit.SanctionID:'',
                                scoretype:this.informationToEdit.scoretype?this.informationToEdit.scoretype:'',
                                Createdby :this.informationToEdit.Createdby?this.informationToEdit.Createdby:this.userInfo._id
                               
                            });
                           // this.isSanctionEventMeet  = this.informationToEdit.SanctionMeet?true:false;
                          
                            this.onEventChange();
                            this.sportDetails = this.informationToEdit.Judges

                            this.minDate = this.informationToEdit.StartDate
                        }

                        this.eventService.getJudgesbySportAndLevel(this.AddEventMeetForm.value.Sports).subscribe(judges=>{

                            //console.log('judges by sport',judges)
                            this.matchedJudges = judges.result

                           

                            if(this.matchedJudges.length){

                               for(let i=0;i<this.allJudges.length;i++){

                                for(let j=0;j<this.matchedJudges.length;j++){

                                    if(this.matchedJudges[j].userid==this.allJudges[i]._id){
                                        if(this.matchedJudges[j].uploadingfor == '1' || this.matchedJudges[j].uploadingfor == '3'){
                                          
                                            this.TechnicianToShow.push(this.allJudges[i]);
                                        }
                                        if(this.matchedJudges[j].uploadingfor == '0' || this.matchedJudges[j].uploadingfor == '2' || this.matchedJudges[j].uploadingfor == '3'){
                                          
                                            this.JudgesToShow.push(this.allJudges[i]);
                                        }
                                        
                                    }

                                }
                               }
                               let judgestoShow =  this.JudgesToShow.filter((obj, pos, arr) => {
                                return arr.map(mapObj => mapObj['_id']).indexOf(obj['_id']) === pos;
                            });
                            let techniciantoShow =  this.TechnicianToShow.filter((obj, pos, arr) => {
                                return arr.map(mapObj => mapObj['_id']).indexOf(obj['_id']) === pos;
                            });
                           
                            this.JudgesToShow = judgestoShow;
                            this.TechnicianToShow = techniciantoShow;
                            }
        
                        })
				
				 }},err=>{
								 this.errorMessage(err)
					})
            //alert(this.sportid);

            
           
		
  }
  getAllSanctionLevels(){
      return new Promise((resolve,reject)=>{
        if(!this.isObject(this.SanctionInfo.Levels[0])){
            this.allsanctionlevel = this.SanctionInfo.Levels;
            resolve()
        }
        else {
            var levels = this.SanctionInfo.Levels[0];
            for(var l in levels){
                if(levels[l].length > 0){
                    this.allsanctionlevel = this.allsanctionlevel.concat(levels[l])
                }
                else{
                    this.allsanctionlevel.push(levels[l])
                }
                resolve();
            }
        }
      })
  }
  onJudgeEventChange(){
    let eventid=this.AddSportForm.value.Events
    let judge=this.sportDetails.filter(item=>item.Event==eventid)
    judge=judge[0]?judge:[]
    if(judge.length>0){
        this.AddSportForm.patchValue({
            Judges:judge[0].Judges
        })
    }else{
       this.AddSportForm.patchValue({
           Judges:''
       })  
    }
  }
  isObject(val){
    if(val){
       let temp=typeof val;
       if(temp=='object'){
          return true;
       }else{
        return false;
       }
    }else{
        return false;
    }
  }
  getCountrylist(){
    this.eventService.getActivecountryCurrency().subscribe(res=>{
        ////console.log("res",res);

        if(res.length>0){
            
            let country = {
                "Country" : "USA",
                "Currency" : "US",
                
            }
                this.statelist=res
                this.statelist.push(country)
                
            
        
        }else{
          Swal("Alert","Unable to load  country.","info")
        }
    },err=>{
       Swal("Alert",err,"info")
    })
  }
  getAllJudges(){
      this.userService.getUserList(1000,1,"2").subscribe(res=>{
          
          this.allJudges = res.dataList
        //   this.filteredJudges = this.allJudges
      },err=>{
          this.errorMessage("Something Bad has happened!")
      })
     
  }
  returnMinDate(){

    if(this.AddEventMeetForm.value.StartDate){

        return new Date(this.AddEventMeetForm.value.StartDate)
    }else{
        return new Date()
    }
      
  }
  viewSanctionInfo(){
      this.isOpenSanction = true;
  }
  saveEventSport(){
    this.isSubmittedSportForm = true
    if (this.AddSportForm.valid) {
        let eventName = []
        let levelName = []
        let JudgeName = [];
        let TechnicianName = '';
       
            let event = this.allEvents.filter(event=>{
                return event._id == this.AddSportForm.value.Events
            })
            eventName = event[0].Event
        //console.log('event',event)
        
        // for(let i=0;i<this.AddSportForm.value.Levels.length;i++){
            
        //     let name = this.allLevels.filter(event=>{
        //         return event._id == this.AddSportForm.value.Levels[i]
        //     })
        //     levelName.push(name[0].level)
        // }
        for(let i=0;i<this.AddSportForm.value.Judges.length;i++){
            
            let name = this.allJudges.filter(event=>{
                return event._id == this.AddSportForm.value.Judges[i]
            })
            JudgeName.push(name[0].username);
        }
        if(this.AddEventMeetForm.value.EventLevel == '1'){
        let technicianName = this.allJudges.filter(event=>{
            return event._id == this.AddSportForm.value.Technician;
        })
        TechnicianName =technicianName[0].username
        
    }
        let name = this.allSports.filter(event=>{
            return event._id == this.AddEventMeetForm.value.Sports
        })

        let sportName = name[0].sportName

        this.AddEventMeetForm.value.SportName = sportName
        this.AddSportForm.value.EventNames = eventName
        // this.AddSportForm.value.LevelName = levelName
        this.AddSportForm.value.JudgeName = JudgeName

        let detailsToAdd = {          
            Event :this.AddSportForm.value.Events,
            Judges :this.AddSportForm.value.Judges,
            Technician: this.AddSportForm.value.Technician,
            EventName:eventName,
            JudgeName:JudgeName,
            TechnicianName :TechnicianName,
            
        }

       
        // this.AddSportForm.get("Sports").disable()
        if(this.sportDetails.length>0){
            for(let e=0;e<this.sportDetails.length;e++){
                let temp=this.sportDetails[e]
                if(temp.Event==this.AddSportForm.value.Events){
                    this.sportDetails[e]=detailsToAdd
                    e=this.sportDetails.length;
                }
                if(e==this.sportDetails.length-1){
                    this.sportDetails.push(detailsToAdd)
                }
    
            }
        }else{
            this.sportDetails.push(detailsToAdd)
        }
        
       // let this.sportDetails.filter(item=>item.Events==this.AddSportForm.value.Events)
        this.AddSportForm.patchValue({           
            Events : '',
            // Levels : '',
            Judges : '',
            Technician:''
        })
        
        this.isSubmittedSportForm = false
        this.myNgForm.reset();
        this.showJudges=false
        window.scroll(0,0)
        //console.log('sportdetails', this.sportDetails)
    }


      
  }
  resetSportForm(){
      this.AddSportForm.reset()
  }
  delete(i){
      this.sportDetails.splice(i,1)
  }
  deletejudge(i,j){
    this.sportDetails[i].Judges.splice(j,1)
    this.sportDetails[i].JudgeName.splice(j,1)
  }
  deletetechnician(i,j){
    this.sportDetails[i].Technician = ''
    this.sportDetails[i].TechnicianName = '';
  }
}
