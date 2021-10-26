import { Component, OnInit } from "@angular/core";
import { Router } from '@angular/router';
import {Config} from "../../../shared/configs/general.config";
import {UserModel} from "../user-management/user.model";
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { TeammateRoutineService } from "./teammate-routine.service";
import { MatTableDataSource } from "@angular/material";

@Component({
  selector: "team-routine-list",
  templateUrl: "./teammate-routine-list.html",
  
})
export class TeammateRoutineListComponent implements OnInit {
    eventid: any;
    displayedColumns = ['SN', 'Title','RoutineId','Athlete','UploadedOn','Actions'];    
    dataSource: any;    
    userId: string;
    objResponse;
    /* Pagination */
    pageSizeOptions = [5, 10, 25, 50, 100];
    perPage:number = 10;
    currentPage:number = 1;
    totalItems:number = 1;
    preIndex:number = 0;
    /* End Pagination */
     totaldataItem:any;
    loggedInUser: UserModel;
   /* Pagination */
   constructor(private router:Router,private _service:TeammateRoutineService){
    let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());
  
    this.loggedInUser = userInfo; 
   }
  ngOnInit(){
    this.getTeammateRoutines()
  }
  
  
  getTeammateRoutines() {
    this._service.getTeammateRoutines(this.perPage,this.currentPage) .subscribe(res =>this.bindList(res),
    error => this.errorMessage(error));

  
}
errorMessage(objResponse:any) {
  Swal("Alert !", objResponse, "info");
}
pageChanged(event: any) {
this.perPage = event.pageSize;
this.currentPage = event.pageIndex + 1;
this.getTeammateRoutines();
}
applyFilter(filterValue: string) {
filterValue = filterValue.trim(); // Remove whitespace
filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
this.totaldataItem.filter = filterValue;
      if(filterValue=='' || filterValue==null || !filterValue ){
          this.dataSource = new MatTableDataSource(this.objResponse.dataList);
      }else{
          this.dataSource=this.totaldataItem;
      }
};
bindList(objRes) {
  //console.log(objRes)
  this.objResponse = objRes;
  this.dataSource = new MatTableDataSource(this.objResponse.dataList);           
  this.totalItems = objRes.totaldataItem.length?objRes.totaldataItem.length:0;
  this.totaldataItem=new MatTableDataSource(this.objResponse.totaldataItem);
  this.preIndex = (this.perPage * (this.currentPage - 1));
}
formatId(id){
return id.replace(/.(?=.{4})/g, '.')
}
formatdate(date){
return moment(date).format('MM/DD/YYYY')
}
view(routineId){
this.router.navigate(['/teammate-routine',routineId]);
}


}
