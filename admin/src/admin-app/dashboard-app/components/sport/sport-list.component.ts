import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SportModel, SportResponse } from './sport.model';
import { SportService } from './sport.service';
import { MatTableDataSource } from "@angular/material";
import Swal from "sweetalert2";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: "sport-list",
  templateUrl: "./sport-list.html",
  styles: []
})
export class SportListComponent implements OnInit { 
  objListResponse: SportResponse;
  //"Add Event", "Add Level",,"Add Category", "Add Element","Add Element Group","Add Base"
  displayedColumns = ["SN","Sport ID","Sport Name","Add Notes", "Active", "Actions"];
  dataSource: any;
  totaldataItem:any;
  /* Pagination */
  pageSizeOptions = [5, 10, 25, 50, 100];
  perPage: number = 10;
  currentPage: number = 1;
  totalItems: number = 1;
  /* End Pagination */
  preIndex: number = 0;
  thumbnail:string='';

  constructor(private router:Router,private _objService: SportService,public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.getSportList();
  }

  getSportList() {
    this._objService
      .getSportList(this.perPage, this.currentPage)
      .subscribe(
        objRes => this.bindList(objRes),
        error => this.errorMessage(error)
      );
  }

  edit(sportId: string) {
    this.router.navigate(["/sport/editor", sportId]);
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

  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }

  bindList(objRes: SportResponse) {
    //console.log('obj res', objRes);
    this.objListResponse = objRes;
    
   // console.log('data list', this.objListResponse.dataList);
    this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
    this.totalItems = objRes.totalItems;
	this.totaldataItem=new MatTableDataSource(this.objListResponse.totaldataItem);
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }

  addSport(){
    this.router.navigate(['/sport/editor']);
  }

  delete(id: string) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this Sport !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        let objSlider: SportModel = new SportModel();
        objSlider._id = id;
        objSlider.deleted = true;
        this._objService.deleteSport(objSlider).subscribe(
          res => {
            this.getSportList();
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
    this.getSportList();
  }

}
