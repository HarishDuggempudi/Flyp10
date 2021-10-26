import { Component, OnInit } from "@angular/core";
import {FaqModel,FaqResponse} from './faq.model'
import {FaqService} from "./faq.service"
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
@Component({
  selector: "faq-list-component",
  templateUrl: "./faq-list-component.html"
})
export class FaqListComponent implements OnInit {
  
    dataSource: any;
    displayedColumns = ["SN", "question","answer","assignedTo",'active',"Actions"];
    objListResponse: FaqResponse;
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
    ngOnInit() {
        this.objListResponse=new FaqResponse();
      this.FaqList();
    }
  
    constructor(private router: Router, private _objService: FaqService) {}
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
    FaqList() {
      this._objService
        .getFaqlist(this.perPage, this.currentPage)
        .subscribe(
          objRes => this.bindList(objRes),
          error => this.errorMessage(error)
        );
    }
  
    errorMessage(objResponse: any) {
      Swal("Alert !", objResponse, "info");
    }
  
    bindList(objRes:FaqResponse ) {
     // console.log(objRes);
      this.objListResponse = objRes;
      this.totalItems = objRes.totalItems;
      this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
	  this.totaldataItem=new MatTableDataSource(this.objListResponse.totaldataItem);
      this.preIndex = (this.perPage * (this.currentPage - 1));
    }
  
    edit(id: string) {
    //  console.log(id)
      this.router.navigate(["/faq/faq-editor", id]);
    }
  
    addSportsElement() {
      this.router.navigate(["/faq/faq-editor"]);
    }
  
    delete(id: string) {
      Swal({
        title: "Are you sure?",
        text: "You will not be able to recover this faq!",
        type: "warning",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, delete it!"
      }).then(result => {
        if (result.value) {
          let objTemp: FaqModel = new FaqModel();
          objTemp._id = id;
          objTemp.deleted = true;
          this._objService.deleteFaq(objTemp).subscribe(
            res => {
              this.FaqList();
              Swal("Deleted!", res.message, "success");
            },
            error => {
              Swal("Alert!", error, "info");
            }
          );
        }
      });
    }
  
    pageChanged(event: any) {
      this.perPage = event.pageSize;
      this.currentPage = event.pageIndex + 1;
      this.FaqList();
    }

}
