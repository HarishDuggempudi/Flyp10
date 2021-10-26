import { Component, OnInit } from '@angular/core';
import { SportModel, SportResponse, CategoryResponse, CategoryModel } from './sport.model';
import { MatTableDataSource } from "@angular/material";
import { ActivatedRoute, Router } from '@angular/router';
import { SportService } from './sport.service';
import Swal from "sweetalert2";

@Component({
  selector: "category-list",
  templateUrl: "./category-list.html",
  styleUrls: ["./category.scss"]
})
export class CategoryListComponent implements OnInit {
  objListResponse: CategoryResponse;
  displayedColumns = ["SN", "Category Name", "Active", "Actions"];
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
    this.getCategoryList();
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

  addCategory(){
      this.router.navigate(['/sport/category-editor'])
  }
   pageChanged(event: any) {
        this.perPage = event.pageSize;
        this.currentPage = event.pageIndex + 1;
        this.getCategoryList();
    }
  getCategoryList() {
    this._objService
      .getCategoryList(this.perPage, this.currentPage)
      .subscribe(
        objRes => this.bindList(objRes),
        error => this.errorMessage(error)
      );
  }
  delete(id: string) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this Category!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        let objTemp:CategoryModel = new CategoryModel();
        objTemp._id = id;
        objTemp.deleted = true;
        this._objService.deleteCategory(objTemp).subscribe(
          res => {
            this.getCategoryList();
            Swal("Deleted!", res.message, "success");
          },
          error => {
            Swal("Alert!", error, "info");
          }
        );
      }
    });
  }
  edit(id){
    this.router.navigate(['/sport/category-editor',id])
  }
  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }

  bindList(objRes: CategoryResponse) {
 
    this.objListResponse = objRes;
    this.categories = this.objListResponse.dataList
    this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
    this.totalItems = objRes.totalItems;
	this.totaldataItem=new MatTableDataSource(this.objListResponse.totaldataItem);
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }
  
}
