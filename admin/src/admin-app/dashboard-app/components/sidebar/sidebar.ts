import {Component, Output, OnInit,EventEmitter} from '@angular/core';
import {menuItem,usermenuItem,judgesmenuItem,recruitermenu,usagJudgesmenuItem, usermenuPremiumItem, usagusermenuItem, usagusermenuPremiumItem} from '../../../shared/configs/menu.config';
import {RegisterUserModel} from "../user-management/user.model";
import {Config} from "../../../shared/configs/general.config";
import { TeammateService } from '../teammate/teammate.service';
@Component({
  selector: 'sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.scss']
})

export class SidebarCmp implements OnInit {
  isActive = false;
  duration: number = 250;
  firstOpen: boolean = true;
  firstDisabled: boolean = false;
  lastOpen: boolean = false;
  public containerSlide: boolean = false;
  @Output() toggleContainerEvent: EventEmitter<any> = new EventEmitter();
  public status: Object = {
    isFirstOpen: false,
    isFirstDisabled: false
  };
  sidebarRoute: any[] = [];
  userInfos : RegisterUserModel;
  userInfo : RegisterUserModel;
  MemberID: any;

  constructor(private _service: TeammateService) {
    //  this.userInfos = JSON.parse(Config.getUserInfoToken());
   
    //   this.getUserDetails(this.userInfos._id);   
  }
  async ngOnInit() {
    this.userInfos = JSON.parse(Config.getUserInfoToken());
    Config.setSidebarchanges('0')
     await this.getUserDetails(this.userInfos._id);   
  }
  getUserDetails(uid){
    return new Promise((resolve,reject)=>{
      this._service.getUserByUserIDWithMemberID(uid).subscribe(data => {
        //console.log('userInfo',data)
   this.userInfo=data;
   
        if(this.userInfo.userRole=='1'){
         this.sidebarRoute = menuItem;
         Config.setSidebarchanges('1')
      }else
       if((this.userInfo.subtype=='2' || this.userInfo.subtype=='3') && this.userInfo.userRole=='3'){
       this.sidebarRoute =usermenuPremiumItem;
       if(this.userInfo['MemberInfo']) {
         this.getUSAGVerificationMemberIDByFlyp10UserID(this.userInfo._id) 
       } else {
        Config.setSidebarchanges('1')
       }
        
     }
      else if(this.userInfo.userRole=='2'){
        this.sidebarRoute =judgesmenuItem;
        if(this.userInfo['MemberInfo']) {
         this.getUSAGVerificationMemberIDByFlyp10UserID(this.userInfo._id) 
       }else {
        Config.setSidebarchanges('1')
       }
      }
      else if(this.userInfo.userRole=='3'){
        this.sidebarRoute =usermenuItem
        if(this.userInfo['MemberInfo']) {
         this.getUSAGVerificationMemberIDByFlyp10UserID(this.userInfo._id) 
       }else {
        Config.setSidebarchanges('1')
       }
      }else if(this.userInfo.userRole=='4'){
       this.sidebarRoute =recruitermenu
       Config.setSidebarchanges('1')
      
     }
      else{
       this.sidebarRoute = menuItem;
       Config.setSidebarchanges('1')
      
      }
      resolve()
      
       
       })
    })
   

  }
  getUSAGMember() {
    return new Promise((resolve,reject)=>{
        this._service.getUSAGMember(this.userInfo._id).subscribe((res)=>{
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
  async getUSAGVerificationMemberIDByFlyp10UserID(userid) {
   // await this.getUSAGMember();
    this._service.getSanctionMemberIDByFlyp10UserID(this.userInfo['MemberInfo'].MemberID).subscribe((res)=>{
      console.log(res)
      Config.setSidebarchanges('1')
    
    // })
    // this._service.getUSAGVerificationMemberIDByFlyp10UserID(userid).subscribe(res => {
    // //  this.sidebarRoute.splice()
    //   console.log(res)
      
      // var eventmeet =  {
      //   route: "/event-meets",
      //   title: "Event Meets",
      //   icon: "fas fa-trophy"
      // }
      // var eventmeetmap =  {
      //   route: "/event-meets-coach-mapping",
      //   title: "Event Meet Mapping",
      //   icon: "fas fa-map-signs"
      // }
      // var eventmeetjudgemap =  {
      //   route: "/event-meets-judge-mapping",
      //   title: "EventMeet Judge Map",
      //   icon: "fa fa-users"
      // }
      if(res && res.length >0){
        if((this.userInfo.subtype=='2' || this.userInfo.subtype=='3') && this.userInfo.userRole=='3'){
          this.sidebarRoute =usagusermenuPremiumItem 
        }
      else if(this.userInfo.userRole=='2'){
      //  let check = this.sidebarRoute[0].menuItem.find((s)=> s.route == '/event-meets-coach-mapping')
       // if(!check){
          this.sidebarRoute =usagJudgesmenuItem 
        //}
       
        console.log(this.sidebarRoute)
      }
      else if(this.userInfo.userRole=='3'){
       // let check = this.sidebarRoute[0].menuItem.find((s)=> s.route == '/event-meets-coach-mapping')
        //if(!check){
          this.sidebarRoute =usagusermenuItem 
      //  }
       
      }
      
    }
    })

  }

  toggleContainer() {
    this.containerSlide = !this.containerSlide;
    this.toggleContainerEvent.emit(this.containerSlide);
  }

  eventCalled() {
    this.isActive = !this.isActive;
  }
}
