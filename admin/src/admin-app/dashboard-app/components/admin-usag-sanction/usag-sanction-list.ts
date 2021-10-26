import Swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import * as moment from 'moment';
import { userInfo } from "os";
import { UserModel } from "../user-management/user.model";
import { Config } from "../../../shared/configs/general.config";
import { UserService } from "../user-management/user.service";
import { USAGSanctionService } from "./usag-sanction.service";
@Component({
  selector: "sanction-list",
  templateUrl: "./usag-sanction-list.html"
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
      this.objListResponse;
     // this.getEventMeet()
    this.userInfo = userInfo;
    await this.getUSAGAllSanction();
    
     
        this.displayedColumns = ["SN","SanctionName","SportName","StartDate","EndDate","Actions"];
      

     
  }

  constructor(private _objUserService:UserService,private router: Router,private _objService:USAGSanctionService) {}
  
 
 
  


getUSAGAllSanction(){
  return new Promise<void>(async(resolve,reject)=>{
  //  await this.getUSAGMember();
    
    
      this._objService.getAllSanction(this.perPage,this.currentPage).subscribe(res => {
        console.log(res)
            // let sanction= res;
            // this.sanctionList = sanction;
            // this.dataSource = new MatTableDataSource(sanction);
            this.bindList(res)
            resolve()
        })
 
    
  })
}
applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.totaldataItem.filter = filterValue;
  if(filterValue=='' || filterValue==null || !filterValue ){
  this.dataSource = new MatTableDataSource(this.objListResponse.response.dataList);
  }else{
    this.dataSource=this.totaldataItem;
  }
}
bindList(objRes ) {
     this.objListResponse = objRes;
     this.totalItems = this.objListResponse.response.totalItems;
     this.dataSource = new MatTableDataSource(this.objListResponse.response.dataList);
     this.data = this.objListResponse.response.dataList
   this.totaldataItem=new MatTableDataSource(this.objListResponse.response.totaldataItem);
     this.preIndex = (this.perPage * (this.currentPage - 1));
   }

   pageChanged(event: any) {
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getUSAGAllSanction()
    
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
