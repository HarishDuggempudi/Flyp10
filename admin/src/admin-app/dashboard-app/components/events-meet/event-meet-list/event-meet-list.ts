import Swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { EventMeetService } from "../event-meet-service";
import { MeetResponse,MeetModel } from "../event-meet-model";
import * as moment from 'moment';
import { UserModel } from "../../user-management/user.model";
import { Config } from "../../../../shared/configs/general.config";
import { UserService } from "../../user-management/user.service";
import { userInfo } from "os";
@Component({
  selector: "event-meet-list",
  templateUrl: "./event-meet-list.html"
})

export class EventMeetComponent implements OnInit {


  dataSource: any;
  displayedColumns:any = []
  objListResponse: any;
  error: any;
  categoryId: string;
  showForm: boolean = false;
  /* Pagination */
  pageSizeOptions = [5, 10, 25, 50, 100];  
  perPage: number = 10;
  currentPage: number = 1;
  totalItems: number = 1;
  preIndex: number = 0;
  totaldataItem:any
  userRole: string;
  usersportObj: any = [];
  userInfo: UserModel;
  eventMeetList: any=[];
  data: any = [];
  isUSAGMeetDirector: boolean = false;
  sanctionid: any;
  SanctionInfo: any;
  isOpenSanction = false;
  MemberID: any;
  isSanctionEventMeetDirector: boolean = false;
  SanctionUsers: any =[];
  isEnablemenu: boolean = true;
  filteredSanctionUser: any =[];
  async ngOnInit() {
    let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());  
    console.log('userinfo',userInfo) 
    this.userRole = userInfo.userRole
      this.objListResponse=new MeetResponse();
     // this.getEventMeet()
    this.userInfo = userInfo;
    this.activatedRoute.params.subscribe(async(param) => {
      //  //console.log("sdsds",param['id'])
        this.sanctionid = param['sanctionid']
      
        if(this.sanctionid){
      
         await this.getSanctionByID();
         await this.getEventMeetBySanctionID();
         
        
         this.displayedColumns = ["SN","EventName","SportName","StartDate","EndDate",'active',"Actions"];
         await this.getSanctionFlyp10UserStatus();
            
        }
        else {
          this.isSanctionEventMeetDirector = false;
await this.getUSAGVerificationMemberIDByFlyp10UserID(this.userInfo._id)
        }
  
      }
       
    );
    if(this.sanctionid){
    
    }
      
      else if(this.userRole != '1'){
       this.displayedColumns = ["SN","EventName","SportName","StartDate","EndDate",'active','enrolled',"Actions"];
        this.getEventMeetCoachMapping(userInfo._id);
     //  this.getJudgesSport(userInfo._id)
      }else{
        this.getEventMeet()
        this.displayedColumns = ["SN","EventName","SportName","StartDate","EndDate",'active',"Actions"];
      }

     
  }

  constructor(private _objUserService:UserService,private activatedRoute: ActivatedRoute,private router: Router, private _objService: EventMeetService) {}
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.totaldataItem.filter = filterValue;
  if(filterValue=='' || filterValue==null || !filterValue ){
  this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
  }else{
    this.dataSource=this.totaldataItem;
  }
  
 
  
}
applyFilterSanctionUser(filterValue: string) {
  filterValue = filterValue.trim(); // Remove whitespace
  filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
  this.filteredSanctionUser=this.SanctionUsers.filter(user => user.Name.toLowerCase().indexOf(filterValue) > -1)
}
getSanctionFlyp10UserStatus() {
  return new Promise((resolve,reject)=>{
    this._objService.getSanctionFlyp10UserStatus( this.SanctionInfo.SanctionID).subscribe((res)=>{
      console.log(res);
      if(res){
        this.SanctionUsers = res.data;
        this.SanctionUsers.forEach((user)=> user['Name'] = user.FirstName+' '+user.LastName)
        this.filteredSanctionUser = this.SanctionUsers;

        resolve()
      }
      else {
        resolve()
      }
    
      
    })
  })
}
getSanctionByID() {
  return new Promise((resolve,reject)=>{
    this._objService.getSanctionByID(this.sanctionid).subscribe((res)=>{
      console.log(res);
    
      this.SanctionInfo = res;
      this.isSanctionEventMeetDirector = true;
      resolve()
    })
  })
 
}
addZ(n) { return n < 10 ? '0' + n : '' + n; }
enableMenu(eventmeet) {
  
  var usaTime = new Date().toLocaleString("en-US", {timeZone: "America/Chicago"});
  var date1 = new Date(usaTime);
  var formatDate1 = date1.getFullYear()+'-'+this.addZ(date1.getMonth()+1)+'-'+this.addZ(date1.getDate())+'T00:00:00'
  if(new Date(eventmeet.EndDate) >= new Date(formatDate1) ){
    this.isEnablemenu = true
  }
  else {
    this.isEnablemenu = false
  }

}
routine(evenmeetId){
  this.router.navigate(["/usag-admin-routine/routine-management/eventmeet/" + evenmeetId]);
}
eventmeetmapping(evenmeetId){
  this.router.navigate(["/event-meets-coach-mapping"],{ queryParams: { eventmeetId: evenmeetId}});
}
eventmeetjudgemap(evenmeetId){
  
  this.router.navigate(["/event-meets-judge-mapping"],{ queryParams: { eventmeetId: evenmeetId}});
}
getEventMeetBySanctionID() {
  return new Promise((resolve,reject)=>{
  this._objService.getEventMeetbyCreatedBySanctionID(this.perPage,this.currentPage,this.userInfo._id,this.SanctionInfo.SanctionID).subscribe(
    
    objRes =>    {

      this.eventMeetList =[]
     
        this.bindList(objRes)
      resolve()
    },
      
      error => {this.errorMessage(error)
        resolve()
      })
  })
}
getUSAGMember() {
  return new Promise((resolve,reject)=>{
      this._objUserService.getUSAGMember(this.userInfo._id).subscribe((res)=>{
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
getUSAGVerificationMemberIDByFlyp10UserID(userid) {
  return new Promise(async (resolve,reject)=>{
    await this.getUSAGMember();
    this._objService.getSanctionMemberIDByFlyp10UserID(this.MemberID).subscribe((res)=>{
      console.log(res)
      if(res && res.length > 0){
        this.isUSAGMeetDirector = true;
        this.router.navigate(["/event-meets/usag-sanction-list"]);
        resolve();
      }
      else {
        this.isUSAGMeetDirector = false;
        resolve()
      }
      
    })
  })
    // this._objService.getUSAGVerificationMemberIDByFlyp10UserID(userid).subscribe(res => {
    //   //  this.sidebarRoute.splice()
    //     //console.log(data)
       
    //   })
  
  
}
getEventMeet(){
  this._objService.getallEventMeet(this.perPage,this.currentPage).subscribe(
    
        objRes =>    {

          let enrolledEvent 
          let eventMeet= objRes.response.dataList
          console.log('eventMeetList',eventMeet)
          let eventMeetList =[]
          if(this.userRole == '1'){
            this.bindList(objRes)
          }else{
            this._objService.getEnrollEventMeetbyId(this.userInfo._id).subscribe(res=>{
              console.log('enrolled',res)
              if(res.success){
                enrolledEvent = res.result
                console.log('enrolled',enrolledEvent)

                for(let i=0;i<eventMeet.length;i++){
                  for(let j=0;j<this.usersportObj.length;j++){
                    if(eventMeet[i].Sport == this.usersportObj[j].sportid){
                      eventMeetList.push(eventMeet[i])
                    }
                  }
                } 
                for(let i=0;i<eventMeetList.length;i++){
                 console.log(eventMeetList[i])
                  let temp=eventMeetList[i]
                  let tempenroll=enrolledEvent.filter(item=>item.eventMeetId==temp._id)
                  console.log(temp,tempenroll)
                  if(tempenroll[0]){
                    eventMeetList[i].enrolled = true
                  }else{
                    eventMeetList[i].enrolled = false
                  }
                  if(i==eventMeetList.length-1){
                    this.eventMeetList = eventMeetList;
                    this.dataSource = new MatTableDataSource(eventMeetList); 
                  }
                 
                }
               //  console.log('eventMeetList',eventMeetList)
                // this.totalItems = eventMeetList.length;
                       
                // this.preIndex = (this.perPage * (this.currentPage - 1));
              }
            })
            
          }
        
        

          
        },
        error => this.errorMessage(error)
  )
}
getEventMeetByCreatedby(){
  this._objService.getEventMeetByCreatedby(this.perPage,this.currentPage,this.userInfo._id).subscribe(
    
    objRes =>    {

      this.eventMeetList =[]
     
        this.bindList(objRes)
      
    },
      
      error => this.errorMessage(error))
}
getEventMeetCoachMapping(userId) {
this._objService.getEventmeetCoachmapping(userId).subscribe((event)=>{
  
  let eventMeet = event.result;
  let eventMeetList = [];
  let  enrolledEvent = [];
  eventMeet.forEach(element => {
    eventMeetList.push(element.eventMeetCoachMapping)
  });
  this._objService.getEnrollEventMeetbyId(this.userInfo._id).subscribe(res=>{
    console.log('enrolled',res)

    if(res.success){
      enrolledEvent = res.result
      console.log('enrolled',enrolledEvent)
    }
    for(let i=0;i<eventMeetList.length;i++){
      console.log(eventMeetList[i])
       let temp=eventMeetList[i]
       let tempenroll=enrolledEvent.filter(item=>item.eventMeetId==temp._id)
       console.log(temp,tempenroll)
       if(tempenroll[0]){
         eventMeetList[i].enrolled = true
       }else{
         eventMeetList[i].enrolled = false
       }
       if(i==eventMeetList.length-1){
         this.eventMeetList = eventMeetList
         this.dataSource = new MatTableDataSource(eventMeetList); 
       }
      }
    })
})
}
getJudgesSport(resUser){
      
  this._objUserService.getJudgesSport(resUser)
  .subscribe(resSport => {
    this.usersportObj=resSport;
         console.log('user sport',this.usersportObj)
         let userSport =  this.usersportObj.filter((obj, pos, arr) => {
          return arr.map(mapObj => mapObj['sportName']).indexOf(obj['sportName']) === pos;
      });
      console.log('userSport',userSport)
      this.usersportObj=userSport;

         this.getEventMeet()

     

  },
    error => {
        this.errorMessage(error)
        
      }); 
}
  // FaqList() {
  //   this._objService
  //     .getFaqlist(this.perPage, this.currentPage)
  //     .subscribe(
  //       objRes => this.bindList(objRes),
  //       error => this.errorMessage(error)
  //     );
  // }

  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }

  bindList(objRes:MeetResponse ) {
   console.log(objRes);
    this.objListResponse = objRes;
    this.totalItems = this.objListResponse.response.totalItems;
    this.dataSource = new MatTableDataSource(this.objListResponse.response.dataList);
    this.data = this.objListResponse.response.dataList
  this.totaldataItem=new MatTableDataSource(this.objListResponse.response.totaldataItem);
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }

  edit(id: string) {
  //  console.log(id)
    this.router.navigate(["/event-meets/event-meet-editor", id]);
  }
  view(id:string){

    this.router.navigate(["/event-meets/event-meet-view", id]);

   
  }

  addSportsElement() {
    if(this.sanctionid){
      this.router.navigate(["/event-meets/usag-sanction-event-meet-editor",this.sanctionid]);
    }
    else {
      this.router.navigate(["/event-meets/event-meet-editor"]);
    }
    
  }

  
  pageChanged(event: any) {
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getEventMeet()
    
  }
  formatDate(date){

    return moment(date).format('MM/DD/YYYY')
  }
  viewSanctionInfo(){
    this.isOpenSanction = true;
  }

 
}
