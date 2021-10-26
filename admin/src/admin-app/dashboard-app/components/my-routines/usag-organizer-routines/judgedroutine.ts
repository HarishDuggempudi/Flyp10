import { Component, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { USAGRoutineService } from "./usag-routine.service";
import Swal from 'sweetalert2';
import * as moment from 'moment';
import { MatTableDataSource } from "@angular/material";
import { RoutineModel } from "../routine.model";


@Component({
  selector: "judged-routine",
  templateUrl: "./judgedroutine.html",
  styleUrls: ['../routine-list.scss']
})
export class JudgedRoutineListComponent implements OnInit {
    eventid: any;
    displayedColumns = ['SN', 'Title','RoutineId','Athlete','UploadedOn','Score','Actions'];    
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
    constructor(private router:Router,private activatedRoute: ActivatedRoute,private _Service:USAGRoutineService){

    }
    
    

    ngOnInit(): void {  
      this.activatedRoute.params.subscribe(param => {
        //  console.log("sdsds",param['id'])
        this.eventid = this.activatedRoute.parent.params['_value'].eventId
        
          if(this.eventid){
       this.getSanctionEventMeetRoutines();
          }
        })
    }
    getSanctionEventMeetRoutines() {
      this._Service.getSanctionEventMeetRoutines(this.perPage,this.currentPage,this.eventid) .subscribe(res =>this.bindList(res),
      error => this.errorMessage(error));

    
  }
  errorMessage(objResponse:any) {
    Swal("Alert !", objResponse, "info");
}
pageChanged(event: any) {
this.perPage = event.pageSize;
this.currentPage = event.pageIndex + 1;
this.getSanctionEventMeetRoutines();
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
    this.objResponse.dataList.forEach((obj) => {
      if(obj.athleteInfo.length > 0){
        obj['athlete'] = obj.athleteInfo[0].Name
      } 
      else  if(obj.coachInfo.length > 0){
        obj['athlete'] = obj.coachInfo[0].Name
      }
      else {
        obj['athlete'] = obj.userInfo.firstName+ ' '+obj.userInfo.lastName
      }
    })
    this.objResponse.totaldataItem.forEach((obj) => {
      if(obj.athleteInfo.length > 0){
        obj['athlete'] = obj.athleteInfo[0].Name
      } 
      else  if(obj.coachInfo.length > 0){
        obj['athlete'] = obj.coachInfo[0].Name
      }
      else {
        obj['athlete'] = obj.userInfo.firstName+ ' '+obj.userInfo.lastName
      }
    })
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
  this.router.navigate(['/usag-admin-routine/routine-details',routineId]);
}

delete(id: string,routine) {
  Swal({
    title: "Are you sure?",
    text: "You will not be able to recover this Routine!",
    type: "warning",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes, delete it!"
  }).then(result => {
    if (result.value) {
      let objTemp: RoutineModel = new RoutineModel();
      objTemp._id = id;
      objTemp.deleted = true;
      this._Service.deleteRoutine(objTemp).subscribe(
        res => {
          this.getSanctionEventMeetRoutines();
           Swal("Deleted!", res.message, "success");         
        //  this.getdeletedRoutineSportPricing(routine)
        },
        error => {
          Swal("Alert!", error, "info");
        }
      );
    }
  });
}
}