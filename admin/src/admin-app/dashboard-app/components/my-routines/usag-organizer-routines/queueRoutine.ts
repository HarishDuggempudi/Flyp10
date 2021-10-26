import { Component, OnInit} from "@angular/core";
import { MatPaginator, MatTableDataSource, MatSelectModule } from '@angular/material';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { RoutineResponse, RoutineModel } from "../routine.model";
import { JudgesResponse } from "../../user-management/user.model";

import { WalletService } from "../../wallet/wallet.service";
import { SportService } from "../../sport/sport.service";
import * as moment from 'moment';
import { USAGRoutineService } from "./usag-routine.service";
@Component({
  selector: "queue-routine-list",
  templateUrl: "./queueRoutine.html",
  styleUrls: ['../routine-list.scss']
})
export class QueueRoutineComponent implements OnInit {
    displayedColumns = ['SN', 'Title','RoutineId','Athlete','UploadedOn','Actions'];    
    dataSource: any;    
    userId: string;
    objResponse:JudgesResponse;
    /* Pagination */
    pageSizeOptions = [5, 10, 25, 50, 100];
    perPage:number = 10;
    currentPage:number = 1;
    totalItems:number = 1;
    preIndex:number = 0;
    /* End Pagination */
     totaldataItem:any;
  uploadingType: any;
  eventid: any;

    constructor(private route:Router,private activatedRoute:ActivatedRoute,private _Service:USAGRoutineService,private walletservice: WalletService,private sportService:SportService){
     
    }
    
   
formatId(id){
  return id.replace(/.(?=.{4})/g, '.')
}
    ngOnInit() {
      this.activatedRoute.params.subscribe(param => {
        //  console.log("sdsds",param['id'])
          this.eventid = this.activatedRoute.parent.params['_value'].eventId
        
          if(this.eventid){
            this.getQueueRoutine();
          }
        })
    }
          
        
        view(routineId:string){
          this.route.navigate(['/usag-admin-routine/routine-details',routineId]);
        } 
        getQueueRoutine() {
             this._Service.getQueueRoutine(this.eventid,this.perPage,this.currentPage)
                 .subscribe(res =>this.bindList(res),
                     error => this.errorMessage(error));
        }
         errorMessage(objResponse:any) {
            Swal("Alert !", objResponse, "info");
        }
       pageChanged(event: any) {
        this.perPage = event.pageSize;
        this.currentPage = event.pageIndex + 1;
        this.getQueueRoutine();
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
        bindList(objRes:JudgesResponse) {
           // console.log(objRes)
            
            this.objResponse = objRes;
            this.objResponse.dataList.forEach((obj:any) => {
              if(obj.routine.athleteInfo.length > 0){
                obj['athlete'] = obj.routine.athleteInfo[0].Name
              } 
              else  if(obj.routine.coachInfo.length > 0){
                obj['athlete'] = obj.routine.coachInfo[0].Name
              }
              else {
                obj['athlete'] = obj.routine.userInfo.firstName+ ' '+obj.routine.userInfo.lastName
              }
            })
            this.objResponse.totaldataItem.forEach((obj:any) => {
              if(obj.routine.athleteInfo.length > 0){
                obj['athlete'] = obj.routine.athleteInfo[0].Name
              } 
              else  if(obj.routine.coachInfo.length > 0){
                obj['athlete'] = obj.routine.coachInfo[0].Name
              }
              else {
                obj['athlete'] = obj.routine.userInfo.firstName+ ' '+obj.routine.userInfo.lastName
              }
            })
           // this.objResponse.dataList = this.objResponse.dataList.filter((data:any)=> data.judgeInfo.length > 0)
            this.dataSource = new MatTableDataSource(this.objResponse.dataList);           
            this.totalItems = objRes.totaldataItem.length?objRes.totaldataItem.length:0;
            this.totaldataItem=new MatTableDataSource(this.objResponse.totaldataItem);
            this.preIndex = (this.perPage * (this.currentPage - 1));
        }
      
  formatdate(date){
    date = date.replace(/\..+$/, '');
    return moment(new Date(date)).format('L');
  }
   
}