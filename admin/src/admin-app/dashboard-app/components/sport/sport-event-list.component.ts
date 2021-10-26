import { Component, OnInit } from '@angular/core';
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import { SportService } from './sport.service';
import { EventModel, SportsEventResponse } from './sport.model';

@Component({
  selector: "sport-list",
  templateUrl: "./sport-event-list.html",
  styles: []
})
export class SportEventComponent implements OnInit {
  dataSource: any;
  totaldataItem:any;
  displayedColumns = ["SN","Event","eventFullname","difficultyFactor",'active',"Actions"];
  objListResponse: SportsEventResponse;
  error: any;
  categoryId: string;
  showForm: boolean = false;
  /* Pagination */
  pageSizeOptions = [5, 10, 25, 50, 100];  
  perPage: number = 10;
  currentPage: number = 1;
  totalItems: number = 1;
  preIndex: number = 0;

  constructor(private router: Router, private _objService: SportService) { }

  ngOnInit() {
    this.getSportsEventList();
  }

  getSportsEventList() {
    this._objService
      .getSportsEvent(this.perPage, this.currentPage)
      .subscribe(
        objRes => this.bindList(objRes),
        error => this.errorMessage(error)
      );
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

  bindList(objRes:SportsEventResponse ) {
    //console.log(objRes);
    this.objListResponse = objRes;
    this.totalItems = objRes.totalItems;
    this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
	this.totaldataItem=new MatTableDataSource(this.objListResponse.totaldataItem);
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }

  edit(id: string) {
    this.router.navigate(["/sport/event-editor", id]);
  }

  addCategory() {
    this.router.navigate(["/sport/event-editor"]);
  }
 showEventDetail(id){
	 this.router.navigate(["/sport/event-details",id]);
 }
  delete(id: string) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this sport event !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        let objTemp: EventModel = new EventModel();
        objTemp._id = id;
        objTemp.deleted = true;
        this._objService.deleteSportsEvent(objTemp).subscribe(
          res => {
            this.getSportsEventList();
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
    this.getSportsEventList();
  }

}
