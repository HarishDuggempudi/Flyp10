import { Component, OnInit } from '@angular/core';
import { SportModel, SportResponse,PricingModel } from './sport.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SportService } from './sport.service';
import Swal from "sweetalert2";
import { MatTableDataSource } from "@angular/material";
@Component({
  selector: "setting",
  templateUrl: "./setting.component.html",
  styleUrls: ["./setting.scss"]
})
export class SettingComponent implements OnInit {
  objListResponse: SportResponse;

  
  displayedColumns = ["SN","Sport" ,"ScoreType", "Competitor","Judge","Technician","Actions"];
  dataSource: any;
   totaldataItem:any;
  /* Pagination */
  pageSizeOptions = [5, 10, 25, 50, 100];
  perPage: number = 10;
  currentPage: number = 1;
  totalItems: number = 1;
  /* End Pagination */
  preIndex: number = 0;

  constructor(private _objService: SportService, private router: Router) {
  }

  ngOnInit() {
     this.getPricingList();
  }
  addpricing(){
      this.router.navigate(['/sport/pricing-editor'])
  }
  edit(priceid: string) {
    this.router.navigate(["/sport/pricing-editor", priceid]);
  }
  formatdollar(amount){
    if(amount == undefined || amount == '0'){
      return 'N/A'
    }
   else {
  amount=parseFloat(amount);
  return  amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
   }
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
     this.totaldataItem.filter = filterValue;
	if(filterValue=='' || filterValue==null || !filterValue ){
		this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
	}else{
		this.dataSource=this.totaldataItem;
	}
  };
 getPricingList() {
    this._objService
      .getPricingList(this.perPage, this.currentPage)
      .subscribe(
        objRes => this.bindList(objRes),
        error => this.errorMessage(error)
      );
  }
  errorMessage(objResponse: any) {
	  if(objResponse.message){
		  Swal("Alert !", objResponse.message, "info");
	  }else{
		  Swal("Alert !", objResponse, "info");
	  }
    
  }
  bindList(objRes) {
	//  console.log("objRes",objRes)
    this.objListResponse = objRes;
    this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
    this.totalItems = objRes.totaldataItem.length;
	this.totaldataItem=new MatTableDataSource(this.objListResponse.totaldataItem);
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }
    pageChanged(event: any) {
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getPricingList();
  }
 delete(id: string) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this sports pricing !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
         let priceObj: PricingModel = new PricingModel();
         priceObj._id = id;
         priceObj.deleted = true;
        this._objService.deletePricing(priceObj).subscribe(
          res => {
            this.getPricingList();
            Swal("Deleted!", res.message, "success");
          },
          error => {
            this.errorMessage(error)
          }
        );
      }
    });
  }

}
