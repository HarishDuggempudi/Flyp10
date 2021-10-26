import { Component, OnInit } from '@angular/core';
import { SportModel, SportResponse, CategoryResponse, LevelResponse, LevelModel } from './sport.model';
import { MatTableDataSource } from "@angular/material";
import { ActivatedRoute, Router } from '@angular/router';
import { SportService } from './sport.service';
import Swal from "sweetalert2";

@Component({
  selector: "sport-level-list",
  templateUrl: "./sport-level-list.html",
  styles: []
})
export class SportLevelComponent implements OnInit {
  objListResponse: LevelResponse;
  displayedColumns = ["SN", "Level","Maximum Score","Active", "Actions"];
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
  categories: any=[];
  constructor(private _objService: SportService, private router: Router) {
  }

  ngOnInit() {
    this.getLevelList();
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
  addLevel(){
      this.router.navigate(['/sport/level-editor'])
  }

  getLevelList() {
    this._objService
      .getLevelList(this.perPage, this.currentPage)
      .subscribe(
        objRes => this.bindList(objRes),
        error => this.errorMessage(error)
      );
  }
  edit(id){
    this.router.navigate(['/sport/level-editor',id])

  }

  
  delete(id: string) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this Level!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        let objTemp: LevelModel = new LevelModel();
        objTemp._id = id;
        objTemp.deleted = true;
        this._objService.deleteLevel(objTemp).subscribe(
          res => {
            this.getLevelList();
            Swal("Deleted!", res.message, "success");
          },
          error => {
            Swal("Alert!", error, "info");
          }
        );
      }
    });
  }
  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }

  bindList(objRes: LevelResponse) {
  //  console.log('obj res', objRes);
    this.objListResponse = objRes;
    
    //console.log('category list', this.objListResponse.dataList);
    this.categories = this.objListResponse.dataList
    this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
    this.totalItems = objRes.totalItems;
	this.totaldataItem=new MatTableDataSource(this.objListResponse.totaldataItem);
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }
   pageChanged(event: any) {
        this.perPage = event.pageSize;
        this.currentPage = event.pageIndex + 1;
        this.getLevelList();
    }
}
