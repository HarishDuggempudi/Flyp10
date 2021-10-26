import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { UserService } from "./user.service";
import { UserModel, UserResponse,JudgesResponse,JudgeSportModel } from "./user.model";
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSelectModule } from '@angular/material';

@Component({
    selector: 'expired',
    templateUrl: './expired.html'
})
export class UserexpiredComponent implements OnInit {
    
    displayedColumns = ['SN', 'Username', 'Sport', 'Level', 'Expire Date', 'Actions'];    
    dataSource: any;    
    userId: string;
    objResponse: JudgesResponse;
    /* Pagination */
    pageSizeOptions = [5, 10, 25, 50, 100];
    perPage:number = 10;
    currentPage:number = 1;
    totalItems:number = 1;
    preIndex:number = 0;
    /* End Pagination */

totaldataItem:any
    constructor(private router: Router, private _Service:UserService) {
    }

    ngOnInit() {
		this.getExpiredUserList();
    }
	pageChanged(event: any) {
		this.perPage = event.pageSize;
		this.currentPage = event.pageIndex + 1;
		this.getExpiredUserList();
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
	 getExpiredUserList() {
        this._Service.getexpiredJudgesSport(this.perPage,this.currentPage)
            .subscribe(resUser =>this.bindList(resUser),
                error => this.errorMessage(error));
    }
	 errorMessage(objResponse:any) {
        Swal("Alert !", objResponse, "info");
    }

    bindList(objRes:JudgesResponse) {
		
        this.objResponse = objRes;
        this.dataSource = new MatTableDataSource(this.objResponse.dataList);           
        this.totalItems = objRes.totaldataItem.length?objRes.totaldataItem.length:objRes.totalItems;
		this.totaldataItem=new MatTableDataSource(this.objResponse.totaldataItem);
        this.preIndex = (this.perPage * (this.currentPage - 1));
    }
	view(docId: string) {
		this.router.navigate(["/user-management/judgeSportdetails/", docId]);
	  }
	delete(docId:string) {
		Swal({
		  title: "Are you sure?",
		  text: "You will not be able to recover this Sport!",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes, delete it!"
		}).then(result => {
		  if (result.value) {
			let objTemp: JudgeSportModel = new JudgeSportModel();
			 objTemp._id = docId
			 objTemp.deleted = true;
			this._Service.deleteUsersportDetailbyid(objTemp).subscribe(
			  res => {
				this.getExpiredUserList();
				Swal("Deleted!", res.message, "success");
			  },
			  error => {
			
				Swal("Alert!", error, "info");
			  }
			);
		  }
		});
  }   
}

	