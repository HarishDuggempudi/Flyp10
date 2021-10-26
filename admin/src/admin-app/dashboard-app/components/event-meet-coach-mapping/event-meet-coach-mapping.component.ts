import Swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { takeUntil } from "rxjs/operators";
import { EventMeetCoachMappingService } from './event-meet-coach-map.service';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { EventMeetCoachMappingModel } from "./eventmeetcoachmap.model";
import { RegisterUserModel } from "../user-management/user.model";
import { Config } from "../../../shared/configs/general.config";
import * as _ from 'lodash';   
import { Subject } from "rxjs";
@Component({
  selector: "event-meet-coach-mapping",
  templateUrl: "./event-meet-coach-mapping.component.html",
  styleUrls:['./eventmeet-map.scss']
 
})

export class EventMeetCoachMapping implements OnInit {

  AddEventMeetForm:FormGroup;
  allCompetitors = [];
  filteredCompetitors: any;
  sanctionCompetitors =[];
  filteredSanctionCompetitors=[]
  allEvents: any;
  private _onDestroy = new Subject<void>();
  @ViewChild('form') myNgForm;
  isSubmitted = false;

  eventmeetcoachmapObj :EventMeetCoachMappingModel = new EventMeetCoachMappingModel();
  loginuserinfo: RegisterUserModel;
  selectedcompertitors: any =[];
  MappedCompetitors: any =[];
  Alreadyselectedcompetitors: any =[];
  informationToEdit: any;
  isSanctionEventMeet: boolean;
  MemberID: any;
  eventmeetId: any;
    constructor( private eventmap : EventMeetCoachMappingService,private activatedRoute:ActivatedRoute,private _formBuilder:FormBuilder) {
      this.AddEventMeetForm = this._formBuilder.group({
        "Events": ['',Validators.required],
         "Competitors" : ['',Validators.required],
         "inputCompetitors":[''] 
   });
   this.activatedRoute.queryParams.subscribe(param=>{
    this.eventmeetId=param['eventmeetId'];
    this.AddEventMeetForm.controls.Events.setValue(this.eventmeetId)
    this.OnEventMeetChange()
  })
   this.AddEventMeetForm.controls.inputCompetitors.valueChanges
        .pipe(takeUntil(this._onDestroy))
         .subscribe(() => {
           this.filterCompetitors()
     });
    }

  ngOnInit() {
    let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.loginuserinfo=userInfo;
    console.log(this.loginuserinfo)
    this.getallCompetitors();
   if(this.loginuserinfo.userRole == '1'){
    this.getEventList()
  
   }
   else {
     this.getSanctionEventMeet()
   }
   
  }
  getUSAGMember() {
    return new Promise((resolve,reject)=>{
        this.eventmap.getUSAGMember(this.loginuserinfo._id).subscribe((res)=>{
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
    this.eventmap.getSanctionEventMeet(this.MemberID).subscribe((res)=>{
      console.log(res);
    if(res && res.success){
      this.allEvents = res.result
    }
      
      
    })
  }

getEventList() {
  this.eventmap.getEventList().subscribe((res)=>{
    console.log(res);
    if(res.success) {
    this.allEvents = res.result
    }
  })
}

getallCompetitors() {
  return new Promise((resolve,reject)=>{
    this.eventmap.getAllCompetitor().subscribe((res)=>{
      console.log(res)
      this.allCompetitors = res.dataList;
      this.filteredCompetitors = this.allCompetitors;
      resolve()
  })
  })
     
     // this.filterCompetitors();
  }

  filterCompetitors() {
    if (!this.allCompetitors) {
      return;
      }
      // get the search keyword
      let search = this.AddEventMeetForm.controls.inputCompetitors.value;
      if (!search) {
        if(this.isSanctionEventMeet){
          this.filteredSanctionCompetitors=this.sanctionCompetitors.slice();
        }
        else {
          this.filteredCompetitors=this.allCompetitors.slice(); 
        }
         

          return;
      } else {
          search = search.toLowerCase();
          if(this.isSanctionEventMeet){
            this.filteredSanctionCompetitors=this.sanctionCompetitors.filter(comp => comp.Name.toLowerCase().indexOf(search) > -1)
          }
          else {
            this.filteredCompetitors=this.allCompetitors.filter(comp => comp.username.toLowerCase().indexOf(search) > -1)
          }
      }
      // filter the banks
      
  }
  getMappedCompetitorsForeventmeet(eventId) {
    this.eventmap.getMappedCompetitorsForeventmeet(eventId).subscribe((res)=>{
        console.log(res)
        this.MappedCompetitors = res.result;
        console.log(this.MappedCompetitors)

    })
}
getEventDetail() {
  return new Promise((resolve,reject)=>{
    let eventId = this.AddEventMeetForm.value.Events;
    this.eventmap.getEventMeet(eventId).subscribe(async (res)=>{
        let response = res.result
      
        this.informationToEdit = response;
        this.isSanctionEventMeet = this.informationToEdit.SanctionMeet?true:false;
        if(this.isSanctionEventMeet) {
        await  this.getCompetitorsByEventmeetSanction(this.informationToEdit.SanctionID);
        resolve()
        }
        else {
          resolve()
        }
        
       
        
    })
  })
  
 
}
  async OnEventMeetChange() {
    this.selectedcompertitors = [];
   
    //this.AddEventMeetForm.controls.Competitors = new FormControl(this.selectedcompertitors);
    let eventId = this.AddEventMeetForm.value.Events;
   // this.getMappedCompetitorsForeventmeet(eventId);
   if(this.allCompetitors.length == 0) {
   await this.getallCompetitors();
   }
    await this.getEventDetail();

    this.eventmap.getEventMeetCoachMappingList(eventId).subscribe((res)=>{
      console.log(res);
      let competitors = res.result;
      
      competitors.forEach((comp,i)=>{
        i++;
        this.selectedcompertitors.push(comp.userId);
        this.Alreadyselectedcompetitors.push(comp.userId)
        if(i == competitors.length) {
          this.AddEventMeetForm.controls.Competitors= new FormControl(this.selectedcompertitors);
          this.getMappedCompetitors();
        }
      })
    })
  }
  onCompetitorsChange() {
    this.getMappedCompetitors()
  }
  getMappedCompetitors() {
    this.MappedCompetitors = [];
    let Competitors = this.AddEventMeetForm.controls.Competitors.value;
    if(this.isSanctionEventMeet) {
      Competitors.forEach((id) => {
        let selectedcomp = this.filteredSanctionCompetitors.find(c=>  c._id == id );
        if(selectedcomp)
        this.MappedCompetitors.push(selectedcomp)
      });
    }
    else {
    Competitors.forEach((id) => {
      let selectedcomp = this.allCompetitors.find(c=>  c._id == id );
      if(selectedcomp)
      this.MappedCompetitors.push(selectedcomp)
    });
  }
  }
  deleteCompetitors(competitors) {
    let selectedcompertitors =[];
    selectedcompertitors = this.AddEventMeetForm.controls.Competitors.value;
    let index = selectedcompertitors.findIndex(id => id == competitors._id);
    selectedcompertitors.splice(index,1);
    this.AddEventMeetForm.controls.Competitors= new FormControl(selectedcompertitors);
    this.getMappedCompetitors()
  }
saveEventMeetCoachMap() {
   this.isSubmitted = true;
    let Competitors = this.AddEventMeetForm.controls.Competitors.value;
    Competitors.forEach(user => {
      this.eventmeetcoachmapObj.userId = user;
      this.eventmeetcoachmapObj.eventId = this.AddEventMeetForm.value.Events;
       this.eventmeetcoachmapObj.addedBy = this.loginuserinfo.username;
      this.eventmap.saveEventMeetCoachMapping(this.eventmeetcoachmapObj).subscribe((res)=>{
        console.log(res);
        this.myNgForm.resetForm(); 
        this.MappedCompetitors = [];  
        Swal("Success","Mapped Successfully",'success')
      })
    });
   
    this.Alreadyselectedcompetitors.forEach(id => {
      let user = Competitors.find(user => user === id);
   if(!user) {
     this.deleteEventMeetCoachMap(id,this.eventmeetcoachmapObj.eventId )
   }
  })
  
}
getCompetitorsByEventmeetSanction(sanctionid){
return new Promise((resolve,reject)=>{
  this.eventmap.getCompetitorsByEventmeetSanction(sanctionid).subscribe((res)=>{
    this.filteredSanctionCompetitors = []
    let USAGSanctionCompetitors = res.data;
    for (var i =0;i<USAGSanctionCompetitors.length;i++){
    let comp = this.allCompetitors.filter((comp)=>comp._id == USAGSanctionCompetitors[i].Flyp10UserID )
if(comp.length>0) {
  comp[0]['MemberID'] = USAGSanctionCompetitors[i].MemeberID;
  comp[0]['FirstName'] = USAGSanctionCompetitors[i].FirstName;
  comp[0]['LastName'] =USAGSanctionCompetitors[i].LastName;
  comp[0]['Type'] =USAGSanctionCompetitors[i].Type;
  comp[0]['Name'] =USAGSanctionCompetitors[i].Name;
  this.filteredSanctionCompetitors.push(comp[0])
  
}
if(i == USAGSanctionCompetitors.length-1){
  this.filteredSanctionCompetitors = _.uniqBy(this.filteredSanctionCompetitors,'_id' );
  this.sanctionCompetitors = this.filteredSanctionCompetitors;
  resolve()
}
    }

  })

})
  
}
cancel() {
   this.myNgForm.resetForm();   
   this.MappedCompetitors = [];
}
deleteEventMeetCoachMap(userId,eventId) {
this.eventmap.removeEventMeetCoachMapping(userId,eventId).subscribe((res)=>{
  console.log(res)
})
}
}
  

 

