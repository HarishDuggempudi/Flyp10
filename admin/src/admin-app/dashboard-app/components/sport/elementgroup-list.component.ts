import { Component, OnInit } from "@angular/core";
import { SportService } from "./sport.service";
import { ElementGroupModel,SportsElementgroupResponse} from "./sport.model";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "sport-Elementgroup-list",
  templateUrl: "./elementgroup-list.html"
})
export class ElementGroupComponent implements OnInit {
  dataSource: any;
  displayedColumns = ["SN", "ElementGroup",'active',"Actions"];
  objListResponse: SportsElementgroupResponse;
  totaldataItem:any;
  error: any;
  categoryId: string;
  showForm: boolean = false;
  /* Pagination */
  pageSizeOptions = [5, 10, 25, 50, 100];  
  perPage: number = 10;
  currentPage: number = 1;
  totalItems: number = 1;
  preIndex: number = 0;

  ngOnInit() {
    this.getSportsElementGroupList();
  }

  constructor(private router: Router, private _objService: SportService) {}

  getSportsElementGroupList() {
    this._objService
      .getSportsElementgroup(this.perPage, this.currentPage)
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

  bindList(objRes:SportsElementgroupResponse ) {
   // console.log(objRes);
    this.objListResponse = objRes;
    this.totalItems = objRes.totalItems;
    this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
	this.totaldataItem=new MatTableDataSource(this.objListResponse.totaldataItem);
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }

  edit(id: string) {
    this.router.navigate(["/sport/elementgroup-editor", id]);
  }

  addElementGroup() {
    this.router.navigate(["/sport/elementgroup-editor"]);
  }

  delete(id: string) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this Element Group!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        let objTemp: ElementGroupModel = new ElementGroupModel();
        objTemp._id = id;
        objTemp.deleted = true;
        this._objService.deleteSportsElementgroup(objTemp).subscribe(
          res => {
            this.getSportsElementGroupList();
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
    this.getSportsElementGroupList();
  }
}

