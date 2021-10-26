import { Component, OnInit } from '@angular/core';
import { EventModel } from '../sport/sport.model';
import { SportService } from '../sport/sport.service'
import {FormGroup, Validators, FormBuilder,} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatPaginator, MatTableDataSource } from "@angular/material";

@Component({
  selector: "scorecard",
  templateUrl: "./scorecard.html",
  styles: []
})
export class ScoreCardComponent implements OnInit {
  eventObj:EventModel = new EventModel();
    ScoreCardForm:FormGroup;
    isSubmitted:boolean = false;
    eventid:string;
	sportObj:any=[]
	displayedColumns = ["SN", "Sport","SkillValue","Exeution","Factor","Time","Bonus","Actions"];
  pageSizeOptions = [5, 10, 25, 50, 100];  
  perPage: number = 10;
  currentPage: number = 1;
  totalItems: number = 1;
  preIndex: number = 0;
  dataList:any=[];
  totaldataItem:any=[];
  dataSource:any=[];
    sports:any=[{"id":1,"name":"Diving"},{"id":2,"name":"Irish Dance"},{"id":3,"name":"Wgymnastics"},{"id":4,"name":"Dressage"},];
   cardConfig:any={}
  constructor(private router: Router, private activatedRoute: ActivatedRoute, private _objService:SportService, private _formBuilder:FormBuilder) {
   // activatedRoute.params.subscribe(param => this.eventid = param['id']);
        this.ScoreCardForm = this._formBuilder.group({
                "sportsName": ['0', Validators.required],
                "skillvalue": [true, Validators.required],
                "execution": [true, Validators.required],
                "factor": [true, Validators.required],  
                "time" :[true, Validators.required],
                "bonus" :[true, Validators.required]            
            }
        );
  }

  ngOnInit() {
     this.getSporteventDetail();
	 this.getScoreCardList();
	 //this.dataSource = new MatTableDataSource(this.dataList);
  }
OnSportChange(){
	let sportid=this.ScoreCardForm.controls["sportsName"].value;
	//alert(sportid);
	this.cardConfig={};
	 this._objService.getScoreCardConfigBySportid(sportid)
        .subscribe(res => {
			console.log(res)
			let temp=res;
			if(res.length>0){
				let config=res[0];
				this.cardConfig=config;
				this.ScoreCardForm.controls['skillvalue'].setValue(config.skillvalue)
				this.ScoreCardForm.controls['execution'].setValue(config.execution)
        this.ScoreCardForm.controls['factor'].setValue(config.factor)
        this.ScoreCardForm.controls['time'].setValue(config.time)
        this.ScoreCardForm.controls['bonus'].setValue(config.bonus)
			}else{
				this.ScoreCardForm.controls['skillvalue'].setValue(true)
				this.ScoreCardForm.controls['execution'].setValue(true)
        this.ScoreCardForm.controls['factor'].setValue(true)
        this.ScoreCardForm.controls['time'].setValue(true)
        this.ScoreCardForm.controls['bonus'].setValue(true)
			}
			
		},
            error =>{this.errorMessage(error)});
          
       
}
edit(obj){      
                window.scroll(0,0);
                this.ScoreCardForm.controls['sportsName'].setValue(obj.sportid);
				this.OnSportChange();
	            this.ScoreCardForm.controls['skillvalue'].setValue(obj.skillvalue)
				this.ScoreCardForm.controls['execution'].setValue(obj.execution)
        this.ScoreCardForm.controls['factor'].setValue(obj.factor)
        this.ScoreCardForm.controls['time'].setValue(obj.time)
				this.ScoreCardForm.controls['bonus'].setValue(obj.bonus)
}
  getSporteventDetail() {
       this._objService.getSportList(10000,1)
    .subscribe(sportres=>{
        
        this.sportObj=sportres.dataList;
       
    },err=>this.errorMessage(err));
	

	
  }
  getScoreCardList(){
	  	this._objService.getScoreCardConfig(this.perPage,this.currentPage)
    .subscribe(sportres=>{
        
        console.log(sportres)
       this.bindList(sportres)
    },err=>this.errorMessage(err));
	
  }
   pageChanged(event: any) {
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getScoreCardList();
  }
  bindList(objRes ) {
    
   // this.objListResponse = objRes;
    this.totalItems = objRes.totaldataItem.length;
	this.dataList=objRes.dataList?objRes.dataList:[];
    this.dataSource = new MatTableDataSource(objRes.dataList?objRes.dataList:[]);
	//console.log(this.objListResponse.totaldataItem)
	this.totaldataItem=new MatTableDataSource(objRes.totaldataItem?objRes.totaldataItem:[]);
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }
  saveScoreCardSettings() {
      this.isSubmitted = true;
      if (this.ScoreCardForm.valid) {
		  //console.log("form value ",this.ScoreCardForm.value)
	   if(this.cardConfig._id){
		   //alert("update")
		   let tempObj={
			   sportsName:this.ScoreCardForm.value.sportsName,
			   execution:this.ScoreCardForm.value.execution,
			   skillvalue:this.ScoreCardForm.value.skillvalue,
         factor:this.ScoreCardForm.value.factor,
         time:this.ScoreCardForm.value.time,
         bonus:this.ScoreCardForm.value.bonus,
			   _id:this.cardConfig._id,
			   delete:false
		   }
		    this._objService.updatescoreCardSettings(tempObj,this.ScoreCardForm.value.sportsName)
        .subscribe(res => this.resStatusMessage(res),
            error =>this.errorMessage(error));
          
        
	   }else{
		   this._objService.savescoreCardSettings(this.ScoreCardForm.value)
        .subscribe(res => this.resStatusMessage(res),
            error =>this.errorMessage(error));
          
        } 
	   }
       
  }
   applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
	//console.log(this.totaldataItem)
	//if(filterValue=='' || filterValue==null || !filterValue ){
	//	this.dataSource = new MatTableDataSource(this.dataList);
	//}else{
	//	this.dataSource=this.totaldataItem;
	//}
  };
  resStatusMessage(res:any) {
      Swal("Success !", res.message, "success");
	  this.getScoreCardList();
      this.triggerCancelForm();
  }
 
  errorMessage(objResponse:any) {
      Swal("Alert !", objResponse, "info");
  }

  triggerCancelForm() {
	   this.ScoreCardForm.controls['sportsName'].setValue(0)
	  this.ScoreCardForm.controls['skillvalue'].setValue(true)
				this.ScoreCardForm.controls['execution'].setValue(true)
				this.ScoreCardForm.controls['factor'].setValue(true)
     // this.router.navigate(['/sport/event']);
  }

}
