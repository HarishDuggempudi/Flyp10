import Swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { EventMeetService } from "../event-meet-service";
import { MeetResponse,MeetModel } from "../event-meet-model";
import * as moment from 'moment';
import { UserModel } from "../../user-management/user.model";
import { Config } from "../../../../shared/configs/general.config";
import { UserService } from "../../user-management/user.service";
import { userInfo } from "os";
@Component({
  selector: "usag-sanction-list",
  templateUrl: "./usag-sanction-list.component.html"
})

export class USAGSanctionListComponent implements OnInit {


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
  sanctionList:any =[]
  data: any = [];
  isUSAGMeetDirector: boolean = false;
  MemberID: any;
  async ngOnInit() {
    let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());  
    console.log('userinfo',userInfo) 
    this.userRole = userInfo.userRole
      this.objListResponse=new MeetResponse();
     // this.getEventMeet()
    this.userInfo = userInfo;
    
    await this.getUSAGVerificationMemberSanctionByFlyp10UserID(this.userInfo._id)  ;
    
     
        this.displayedColumns = ["SN","SanctionName","SportName","StartDate","EndDate","Actions"];
      

     
  }

  constructor(private _objUserService:UserService,private router: Router, private _objService: EventMeetService) {}
  
 
 
  

getUSAGMember() {
  return new Promise((resolve,reject)=>{
      this._objUserService.getUSAGMember(this.userInfo._id).subscribe((res)=>{
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
getUSAGSanction(userid){
  return new Promise(async(resolve,reject)=>{
  //  await this.getUSAGMember();
    
    if(this.MemberID){
      this._objService.getSanction(this.MemberID).subscribe(res => {
        console.log(res)
            let sanction= res;
            this.sanctionList = sanction;
            this.dataSource = new MatTableDataSource(sanction)
            resolve()
        })
    }
    else {
      resolve()
    }
    
  })
}
getUSAGVerificationMemberSanctionByFlyp10UserID(userid) {
  return new Promise(async(resolve,reject)=>{
    await this.getUSAGMember();
    this._objService.getSanctionMemberIDByFlyp10UserID(this.MemberID).subscribe(async(res) => {
     
        if(res && res.length > 0){
          this.isUSAGMeetDirector = true;
          await this.getUSAGSanction(this.userInfo._id);
        
          resolve()
        }
        else {
          this.isUSAGMeetDirector = false;
          resolve()
        }
      })
  })
  
}


  edit(id: string) {
  //  console.log(id)
    this.router.navigate(["/event-meets/usag-sanction-event-meet", id]);
  }
  setting(id: string) {
    //  console.log(id)
      this.router.navigate(["/event-meets/usag-sanction-setting", id]);
    }
  view(id:string){

    this.router.navigate(["/event-meets/event-meet-view", id]);

   
  }

  addSportsElement() {
    this.router.navigate(["/event-meets/event-meet-editor"]);
  }

  
  
  formatDate(date){

    return moment(date).format('MM/DD/YYYY')
  }

 
}
