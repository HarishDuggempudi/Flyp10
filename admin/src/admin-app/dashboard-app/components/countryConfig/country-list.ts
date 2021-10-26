import {Component, OnInit} from '@angular/core';
import {CountryModel,CountryResponse} from "./Country.model";
import {CountryService} from "./country.service";
import * as moment from 'moment';
import {ActivatedRoute, Router} from "@angular/router";
import {MatTableDataSource} from '@angular/material';
import Swal from 'sweetalert2';
@Component({
  selector: 'country-list',
  templateUrl: './country-list.html'
})

export class CountryListComponent implements OnInit {

    objCountry:CountryModel = new CountryModel();
    objResponse:CountryResponse = new CountryResponse();
    countryID:string;
    dataSource: any;
    displayedColumns = ['SN','Country', 'Currency','Active','Actions'];  
    /* Pagination */
    pageSizeOptions = [5, 10, 25, 50, 100];
    perPage:number = 10;
    currentPage:number = 1;
    totalItems:number = 1;
    /* End Pagination */
    preIndex: number = 0;
     totaldataItem:any;


  constructor(private _service: CountryService,private router: Router, private activatedRoute: ActivatedRoute) {

  }
  ngOnInit() {
    this.getCountryList();
  }
  addCountry(){
      this.router.navigate(['/country/editor'])
  }
  editCountry(id){
    this.router.navigate(['/country/editor',id])
  }
  delete(id:string) {
    Swal({
          title: "Are you sure?",
          text: "You will not be able to recover this Country !",
          type: "warning",
          showCancelButton: true,
          confirmButtonColor: "#DD6B55",
          confirmButtonText: "Yes, delete it!"
        })
        .then((result)=> {
          if(result.value){
          let objTemp:CountryModel = new CountryModel();
          objTemp.deleted = true;
          this._service.patchcountryCurrency(id,objTemp)
            .subscribe(res=> {
                this.getCountryList();
                Swal("Deleted!", res.message, "success");
              },
              error=> {
                Swal("Alert!", error, "info");
              });
            }
        });
    }
  getCountryList(){
    this._service.getCountryList(this.perPage,this.currentPage).subscribe(res=>{
      console.log(res)
      this.bindList(res)
    },err=>{
        console.log(err)
    })
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
    pageChanged(event: any) {
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getCountryList();
  }
  
  bindList(objRes:CountryResponse) {
    this.objResponse = objRes;
    this.dataSource = new MatTableDataSource(this.objResponse.dataList); 
    this.totaldataItem=new MatTableDataSource(this.objResponse.totaldataItem);	
    this.totalItems = objRes.totalItems;
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }
}

