import Swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { takeUntil } from "rxjs/operators";

import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";

import { RegisterUserModel } from "../user-management/user.model";
import { Config } from "../../../shared/configs/general.config";

import { Subject } from "rxjs";
import { EventMeetGroupService } from "./event-meet-group.service";
import { TeammateService } from "../teammate/teammate.service";
import { EventMeetGroupModel } from "./event-meet-group.model";
import * as _ from 'lodash';   
@Component({
  selector: "event-meet-group",
  templateUrl: "./event-meet-group.component.html",
  styleUrls:['./eventmeet-group.scss']
 
})

export class EventMeetGroup implements OnInit {
  
  AddEventMeetForm:FormGroup;
  allCompetitors: any;
  filteredCompetitors: any;
  allEvents: any = [];
  private _onDestroy = new Subject<void>();
  @ViewChild('form') myNgForm;
  isSubmitted = false;
  eventmeetgroupObj :EventMeetGroupModel = new EventMeetGroupModel();
  loginuserinfo: RegisterUserModel;
  selectedcompertitors: any =[];
  MappedCompetitors: any =[];
  teammatelist: any[] = [];
  filteredTeamMates: any[];
  selectedeventId: any;
  selectedEventInfo: any;
  eventMeetGroupedUser: any = [];
  Competitors: any= [];
  eventmeetgroups: any = [];
  
  constructor(private eventmeetgroup : EventMeetGroupService,private _formBuilder:FormBuilder,private teammateservice:TeammateService){
    this.AddEventMeetForm = this._formBuilder.group({
      "Events": ['',Validators.required],
       "Competitors" : ['',Validators.required],
       "GroupName":['',Validators.required],
       "inputCompetitors":[''] 
 });
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
 
   this.getLowerEventMeet();
    this.getallCompetitors();
 }
 getallCompetitors() {
  return new Promise((resolve,reject)=>{
    this.eventmeetgroup.getAllCompetitor().subscribe((res)=>{
      console.log(res)
      this.allCompetitors = res.dataList;
    //  this.filteredCompetitors = this.allCompetitors;
      resolve()
  })
  })
     
     // this.filterCompetitors();
  }
 filterCompetitors() {
  if (!this.teammatelist) {
    return;
    }
    // get the search keyword
    let search = this.AddEventMeetForm.controls.inputCompetitors.value;
    if (!search) {
        this.filteredCompetitors=this.teammatelist.slice();
        return;
    } else {
        search = search.toLowerCase();
    }
    // filter the banks
    this.filteredCompetitors=this.teammatelist.filter(comp => comp.username.toLowerCase().indexOf(search) > -1)
}
 getLowerEventMeet() {
   this.eventmeetgroup.getLowerEventMeet().subscribe((res)=>{
    if(res.success) {
      let eventmeet = res.result;
      eventmeet.forEach((event)=>{
        if(event.Sport == Config.WFigureSkating || event.Sport == Config.MFigureSkating){
          this.allEvents.push(event)
        }
      })
      }
   })
 }
 async OnEventMeetChange() {
  this.teammatelist =[];
  this.filteredCompetitors =[];
  this.selectedeventId = this.AddEventMeetForm.value.Events;
  this.selectedEventInfo = this.allEvents.find(event => event._id == this.selectedeventId)
  console.log(this.selectedEventInfo);
  await this.getEventmeetGroupByeventId(this.selectedeventId);
  await this.getMappedCompetitorForEventMeet(this.selectedeventId);
  this.teammatelist = _.uniqBy(this.teammatelist,'_id' );
  console.log(this.filteredCompetitors,this.teammatelist)
  this.filteredCompetitors = this.teammatelist;
 }
 getEventmeetGroupByeventId(eventId){
   return new Promise((resolve,reject)=>{
    this.eventMeetGroupedUser = [];
    this.eventmeetgroups = []
    this.eventmeetgroup.getEventmeetGroupByeventId(eventId).subscribe((res)=>{
      if(res.success){
        this.eventmeetgroups = res.result;
        if(this.eventmeetgroups.length > 0){
         this.eventmeetgroups.forEach((comp)=>{
           comp.competitors.forEach((c)=>{
       this.eventMeetGroupedUser.push(c)
 })
        })
       }      
       resolve()
      }
      else {
        resolve()
      }
      
    })
   })
   
 }
 getMappedCompetitorForEventMeet(eventId) {
  return new Promise((resolve,reject)=>{
  this.teammatelist = [];
 this.eventmeetgroup.getMappedCompetitorsForeventmeet(eventId).subscribe((res)=>{
   console.log(res)
   this.MappedCompetitors = res.result;
   this.MappedCompetitors.forEach(async(comp:any,i)=>{
     await this.getUsersByID(comp.userId,this.teammatelist);
    await this.getTeamMatesForMappedCompetitors(comp.userId);
console.log(this.teammatelist,i)
    resolve()
    
   })
   
 })
})

 }

 getTeamMatesForMappedCompetitors(userId){
  
  /**
* fetching teammate count
* Teammate status
* status 0-pending
* status 2-completed
*/
return new Promise(async(resolve,reject)=>{
  await this.getTeamMateByUID(userId)
  await this.getRequestsByFID(userId)
  resolve()


  })

}
getTeamMateByUID(userId){
  return new Promise(async(resolve,reject)=>{
    this.teammateservice.getTeamMateByUID(userId).subscribe(
      async (response)=>{
            if(response.reqData){
              let res=response.reqData
              if(res.length){
                 
                  for(let i=0;i<res.length;i++){
                     let temp=res[i];
                     if(temp.status=='2'){
                      await this.getUsersByID(temp.FID, this.teammatelist);
                        //this.teammatelist.push(temp)
                        if(i == res.length -1){
                          resolve()
                          }
                     }
                     
                  }
              }
              else {
                resolve()
              }
      
            }             
       },err=>{
           this.errorMessage(err);
           resolve()
       })
      
  })

}
getRequestsByFID(userId){
  return new Promise(async(resolve,reject)=>{
    this.teammateservice.getRequestsByFID(userId).subscribe(
      async(response)=>{
        if(response.reqData){
          let res=response.reqData
          if(res.length){
             
              for(let i=0;i<res.length;i++){
                 let temp=res[i];
                 if(temp.status=='2'){
                 // this.teammatelist.push(temp)
                  await this.getUsersByID(temp.UID, this.teammatelist);
                  if(i == res.length -1){
                  resolve()
                  }
                 }
                }
              }
              else {
                resolve()
              }
            }
       },err=>{
           this.errorMessage(err)
           resolve()
       })
  })

}
 getUsersByID(id:string, arr:any[]){
  return new Promise(async(resolve,reject)=>{
  this.teammateservice.getUserByUserID(id).subscribe(data => {
    let groupedUser = this.eventMeetGroupedUser.filter(user=> user._id == id)
    if(groupedUser.length == 0){
    this.teammatelist.push(data);
    resolve()
      }
      else {
        resolve()
      }
    })
  })
  // this.eventmeetgroup.getUserSportInfoForEventMeetSport(id,this.selectedEventInfo.Sport).subscribe(data => {
  //   //only the user who are assigned the event meet sports
  //   if(data.result.length > 0){
  //     //check aleady user are grouped or not
  //     let groupedUser = this.eventMeetGroupedUser.filter(user=> user._id == id)
  //     if(groupedUser.length == 0){
  //     arr.push(data.result[0].userDetails[0]);
  //     }
  //   }
   
  // })
  
}
errorMessage(objResponse: any) {
 
  if(objResponse.message){
    Swal("Alert !", objResponse.message, "info");
  }
  else{
    Swal("Alert !", objResponse, "info");
  }
 
}
 onCompetitorsChange() {

 }
 cancel() {

 }
 deleteCompetitors(comp){

 }
 groupedCompetitorsInfo() {
   this.Competitors = [];
   let Competitors = this.AddEventMeetForm.controls.Competitors.value;
   Competitors.forEach((comp)=>{
    let user = this.filteredCompetitors.find(user => user._id == comp);
    this.Competitors.push(user);
   } );
  
 }
 saveEventMeetGroup() {
  this.isSubmitted = true;
  this.groupedCompetitorsInfo();
  if(this.AddEventMeetForm.valid){
    this.eventmeetgroupObj.competitors = this.Competitors;
    this.eventmeetgroupObj.eventId = this.AddEventMeetForm.value.Events;
     this.eventmeetgroupObj.addedBy = this.loginuserinfo.username;
     this.eventmeetgroupObj.groupName = this.AddEventMeetForm.value.GroupName;
    this.eventmeetgroup.saveEventMeetGroup(this.eventmeetgroupObj).subscribe((res)=>{
      console.log(res);
      this.myNgForm.resetForm(); 
      Swal("Success","Grouped Successfully",'success');
      // this.getEventmeetGroupByeventId(this.selectedeventId);
      // this.getMappedCompetitorForEventMeet(this.selectedeventId);
      // this.filteredCompetitors = this.teammatelist;
    },err=>{
      console.log(err)
    
        Swal("Info",err,'info')
       
    })
  }

 }
 deletegroup(group) {
   let data ={
     eventId :group.eventId,
     groupName:group.groupName
   }
   this.eventmeetgroup.removeEventMeetGroup(data).subscribe(async (res)=>{
    Swal("Success","Group deleted successfully",'success');
    await this.getEventmeetGroupByeventId(this.selectedeventId);
    await this.getMappedCompetitorForEventMeet(this.selectedeventId);
    this.teammatelist = _.uniqBy(this.teammatelist,'_id' );
    console.log(this.filterCompetitors,this.teammatelist)
    this.filteredCompetitors = this.teammatelist;

   })
 }
}
  

 

