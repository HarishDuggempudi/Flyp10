import { Component, OnInit} from "@angular/core";
import { MatPaginator, MatTableDataSource, MatSelectModule } from '@angular/material';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { RoutineResponse, RoutineModel } from "../routine.model";
import { JudgesResponse } from "../../user-management/user.model";
import { AdminRoutineService } from "./Admin-routines.service";
import { WalletService } from "../../wallet/wallet.service";
import { SportService } from "../../sport/sport.service";
import * as moment from 'moment';
@Component({
  selector: "incompleted-routine-list",
  templateUrl: "./incompletedRoutine.html",
  styleUrls: ['../routine-list.scss']
})
export class InCompletedRoutineListComponent implements OnInit {
    displayedColumns = ['SN', 'Title','RoutineId','Athlete','Judge','UploadedOn','JudgedOn','Actions'];    
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

    constructor(private route:Router,private _Service:AdminRoutineService,private walletservice: WalletService,private sportService:SportService){

    }
    
    formatId(id){
      return id.replace(/.(?=.{4})/g, '.')
    }

    ngOnInit() {
          this.getRoutine();
        }
        
         getRoutine() {
             this._Service.getAllinCompleteRoutine(this.perPage,this.currentPage)
                 .subscribe(res =>this.bindList(res),
                     error => this.errorMessage(error));
        }
         errorMessage(objResponse:any) {
            Swal("Alert !", objResponse, "info");
        }
       pageChanged(event: any) {
        this.perPage = event.pageSize;
        this.currentPage = event.pageIndex + 1;
        this.getRoutine();
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
            //console.log(objRes)
            this.objResponse = objRes;
            this.dataSource = new MatTableDataSource(this.objResponse.dataList);           
            this.totalItems = objRes.totaldataItem.length?objRes.totaldataItem.length:0;
            this.totaldataItem=new MatTableDataSource(this.objResponse.totaldataItem);
            this.preIndex = (this.perPage * (this.currentPage - 1));
        }

   view(routineId:string){
    this.route.navigate(['/admin-routine/routine-details',routineId]);
  }

  formatdate(date){
    date = date.replace(/\..+$/, '');
    return moment(new Date(date)).format('L');
  }
     formatBytes(a,b){if(0==a)return"0 Bytes";var c=1024,d=b||2,e=["Bytes","KB","MB","GB","TB","PB","EB","ZB","YB"],f=Math.floor(Math.log(a)/Math.log(c));return parseFloat((a/Math.pow(c,f)).toFixed(d))+" "+e[f]}
}