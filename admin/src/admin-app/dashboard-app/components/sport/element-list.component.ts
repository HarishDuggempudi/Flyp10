import { Component, OnInit } from "@angular/core";
import { SportService } from "./sport.service";
import { SportsEventResponse,EventModel,SportsElementResponse,ElementModel} from "./sport.model";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "sport-Element-list",
  templateUrl: "./element-list.html"
})
export class ElementListComponent implements OnInit {
  dataSource: any;
  totaldataItem:any;
 
  objListResponse: SportsEventResponse;
  error: any;
  categoryId: string;
  showForm: boolean = false;
  /* Pagination */
   displayedColumns = ["SN", "Element","Event","SkillValue","Factor",'active',"Actions"];
  pageSizeOptions = [5, 10, 25, 50, 100];  
  perPage: number = 10;
  currentPage: number = 1;
  totalItems: number = 1;
  preIndex: number = 0;

  ngOnInit() {
    this.getSportsElementList();
  }

  constructor(private router: Router, private _objService: SportService) {}

  getSportsElementList() {
    this._objService
      .getSportsElement(this.perPage, this.currentPage)
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

  bindList(objRes:SportsElementResponse ) {
    
    this.objListResponse = objRes;
    this.totalItems = objRes.totalItems;
    this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
	//console.log(this.objListResponse.totaldataItem)
	this.totaldataItem=new MatTableDataSource(this.objListResponse.totaldataItem);
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }

  edit(id: string) {
  
    this.router.navigate(["/sport/element-editor", id]);
  }

  addSportsElement() {
    this.router.navigate(["/sport/element-editor"]);
  }

  delete(id: string) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this Element!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        let objTemp: ElementModel = new ElementModel();
        objTemp._id = id;
        objTemp.deleted = true;
        this._objService.deleteSportsElement(objTemp).subscribe(
          res => {
            this.getSportsElementList();
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
    this.getSportsElementList();
  }
}

