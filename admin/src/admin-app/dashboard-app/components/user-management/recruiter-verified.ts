 import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { UserService } from "./user.service";
import { UserModel, UserResponse,JudgesResponse,JudgeSportModel } from "./user.model";
import { Router } from '@angular/router';
import { MatPaginator, MatTableDataSource, MatSelectModule } from '@angular/material';
import {RegisterUserModel} from './user.model'
import 'rxjs/add/operator/filter';
@Component({
    selector: 'Recruiter-Verify',
    templateUrl: './recruiter-verified.html'
})
export class RecruiterVerifiedComponent implements OnInit {
    
    displayedColumns = ['SN', 'Firstname', 'Lastname','Username', 'Email', 'Actions'];    
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
     totaldataItem:any;

    constructor(private router: Router, private _Service:UserService) {
    }

    ngOnInit() {
	this.getVerifiedRecruiter();
    }
	
	 getVerifiedRecruiter() {
        this._Service.getVerifiedRecruiter(this.perPage,this.currentPage)
            .subscribe(resUser =>this.bindList(resUser),
                error => this.errorMessage(error));
    }
	 errorMessage(objResponse:any) {
        Swal("Alert !", objResponse, "info");
    }
   pageChanged(event: any) {
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getVerifiedRecruiter();
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
    bindList(objRes:JudgesResponse) {
		
        this.objResponse = objRes;
        this.dataSource = new MatTableDataSource(this.objResponse.dataList);           
        this.totalItems = objRes.totalItems;
		this.totaldataItem=new MatTableDataSource(this.objResponse.totaldataItem);
        this.preIndex = (this.perPage * (this.currentPage - 1));
    }
   view(userId:string) {
    this.router.navigate(["/user-management/verifyeditor"],{ queryParams: { userId: userId}});
   }
   delete(userID:string) {
		Swal({
		  title: "Are you sure?",
		  text: "You will not be able to recover this Recruiter!",
		  type: "warning",
		  showCancelButton: true,
		  confirmButtonColor: "#DD6B55",
		  confirmButtonText: "Yes, delete it!"
		}).then(result => {
		  if (result.value) {
		  let objTemp: RegisterUserModel = new RegisterUserModel();
           objTemp._id = userID;
           objTemp.deleted = true;
			this._Service.deleteUser(objTemp).subscribe(
			  res => {
			    this.getVerifiedRecruiter();
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


	