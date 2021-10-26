 import{Component, OnInit}from'@angular/core';
import {Validators, FormBuilder, FormGroup, FormControl,FormArray} from "@angular/forms";
import {VideoModel} from "../videoUploadPage/video.model";
import {VideoService} from "../videoUploadPage/video.service";
import { PricingModel } from './sport.model';
import Swal from 'sweetalert2';
import { SportService } from './sport.service';
import { Router,ActivatedRoute } from "@angular/router";
@Component({
    selector: 'pricing-editor',
    templateUrl: './pricing-editor.html',
    styleUrls:['./setting.scss']
})
export class PricingEditorComponent{
    isinvalidfile:boolean;
    videoObj:VideoModel=new VideoModel();
	pricingObj:PricingModel=new PricingModel();
    pricingForm: FormGroup;
    isSubmitted:boolean=false;
    file:File;
	videoForm: FormGroup;
    filemessage:string="* InValid file"
    showDoc:boolean=false;
    editDoc:boolean=true;
	priceid:string;
	sportList:any=[];
	filechanged:boolean=false;
    constructor(private sportservice: SportService,private _formBuilder: FormBuilder,private videoservices:VideoService,private router: Router,private activatedRoute: ActivatedRoute){
        activatedRoute.params.subscribe(param => {      
            this.priceid = param['priceid']}
        );
		
		this.pricingForm = this._formBuilder.group({
            "sport": ['',Validators.required],
            "scoretype": ['',Validators.required],
            "competitor": ['',Validators.required],
            "technician":['',Validators.required],
			"judge":['',Validators.required],
            "active":['']
        });
        //this.getBanner();
    }
	ngOnInit() {
        this.getSportList();
        this.pricingObj.technician = '0';
        if (this.priceid){
			this.getpricingDetaiByid();
		}
        

    }
	
  getpricingDetaiByid(){
	  this.sportservice.getSportPricingDetail(this.priceid).subscribe(res=>{
		   this.pricingObj=res;
	   },err=>{
		   this.errorMessage(err);
	   })
		
  }	
 getSportList() {
    this.sportservice
      .getSportList(1000, 1)
      .subscribe(
        res => {
			this.sportList=res.dataList;
           
        },
        error => this.errorMessage(error)
      );
  }

  triggerCancelForm() {
      this.router.navigate(['/sport/pricing']);
  }
  onSportChange(event){
	 var sportArray=[];
	 this.sportservice.getSportPricingDetailbysportID(event.value,'2').subscribe(res=>{console.log()})
    sportArray=this.sportList.filter(item => item._id == event.value);
	 if(sportArray.length >0){
		 this.pricingObj.sport=sportArray[0].sportName;
	 }
  }
  savepricing(){
		this.isSubmitted=true; 
		if(this.pricingForm.valid){
		  if(!this.priceid){
			   
			  this.sportservice.savePricingConfiguration(this.pricingObj).subscribe(
		    res=>{
				this.triggerCancelForm();
				Swal("Success!", res.message, "success");
			},err=>{
				this.errorMessage(err);
			})
		  }else{
			  this.sportservice.updateSportPricing(this.pricingObj).subscribe(
				res=>{
					this.triggerCancelForm();
					Swal("Success!", res.message, "success");
				},err=>{
					this.errorMessage(err);
			  })
		  }
		   
		}
	 }

    errorMessage(objResponse: any) {
       
        if(objResponse.message){
          Swal("Alert !", objResponse.message, "info");
		  this.triggerCancelForm();	
        }
        else{
          Swal("Alert !", objResponse, "info");
		  this.triggerCancelForm();		
        }
       
      }
}


