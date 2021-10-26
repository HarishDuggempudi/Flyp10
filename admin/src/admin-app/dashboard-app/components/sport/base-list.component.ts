import { Component, OnInit } from '@angular/core';
import { SportModel, SportResponse } from './sport.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SportService } from './sport.service';
import Swal from "sweetalert2";

@Component({
  selector: "base-list",
  templateUrl: "./base-list.html",
  styleUrls: ["./base.scss"]
})
export class BaseListComponent implements OnInit {
  objListResponse: SportResponse;
  sports:any=[{"id":1,"name":"Diving"},{"id":2,"name":"Irish Dance"},{"id":3,"name":"Wgymnastics"},{"id":4,"name":"Dressage"},];
  levels:any=[{"id":1,"name":"Beginner 1"},{"id":2,"name":"Beginner 2"},{"id":3,"name":"Novice"},{"id":4,"name":"Prizewinner"}]
  events:any=[{"id":1,"name":"1 M - 101A", "desc": "Forward Dive (Straight) 1 Meter"},{"id":2,"name":"1 M - 101B","desc": "Forward Dive (Pike) 1 Meter"},{"id":3,"name":"1 M - 101C", "desc": "Forward Dive (Tuck) 1 Meter"},{"id":4,"name":"1 M - 102A", "desc": "Forward Somersault (Straight) 1 Meter"}]
  selectedSport:any;
  selectedLevels:any=[];
  dispLevels:any = [];
  selectedEvents:any;
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
    this.getSportList();
  }

  addBase(){
      this.router.navigate(['/sport/base-editor'])
  }

  getSportList() {
    this._objService
      .getSportList(this.perPage, this.currentPage)
      .subscribe(
        objRes => this.bindList(objRes),
        error => this.errorMessage(error)
      );
  }

  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }

  bindList(objRes: SportResponse) {
   // console.log('obj res', objRes);
    this.objListResponse = objRes;
    
  //  console.log('data list', this.objListResponse.dataList);
    this.sports = this.objListResponse.dataList
    this.totalItems = objRes.totalItems;
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }

  levelSelectChange(ev){
    this.dispLevels = [];
  //  console.log('val from event ', ev.value);
    this.dispLevels.push(ev.value);
  //  console.log('selectedLevels  ', this.selectedLevels);

  }

}
