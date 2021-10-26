import {Component, OnInit} from '@angular/core';
import {CountryModel} from "./Country.model";
import {CountryService} from "./country.service";
import {coutryList,currencyList} from '../../../shared/configs/countries'
import * as moment from 'moment';
import {ActivatedRoute, Router} from "@angular/router";
import { FormGroup,FormBuilder,Validators } from '@angular/forms';
import Swal from 'sweetalert2';
@Component({
  selector: 'country-editor',
  templateUrl: './country-editor.html'
})

export class CountryEditorComponent implements OnInit {

 isSubmitted:boolean=false
  countryForm:FormGroup;
  countrylist:any=[];
  currencylist:any=[];
  filteredCurrencyList:any=[];
  countryId:any
  ngOnInit() {
    
  }

  constructor(private _service: CountryService ,private router: Router, private activatedRoute: ActivatedRoute,private _formbuilder:FormBuilder) {
    activatedRoute.params.subscribe(param => this.countryId = param['Id']);
    this.countryForm=this._formbuilder.group({
           country:['',Validators.required],
           currency:['',Validators.required],
           decimalpoint:['',Validators.required],
           active:[false]
      }) 
      this.countrylist=coutryList
      this.currencylist=currencyList
      if(this.countryId){
          this.getCountryDetailsById()
      }
  }
  getCountryDetailsById(){
     this._service.getcountryCurrencyByID(this.countryId).subscribe(res=>{
              console.log(res)
              if(res.length>0){
                this.countryForm.controls["currency"].setValue(res[0].Currency);
                this.countryForm.controls["decimalpoint"].setValue(res[0].Exponents);
                this.countryForm.controls["country"].setValue(res[0].Country);
                this.countryForm.controls["active"].setValue(res[0].active);
              }
     },err=>{
          Swal("Alert",err,"info")
     })
  } 
  onchangeCountry($event){
    this.countryForm.controls["currency"].setValue('');
    this.countryForm.controls["decimalpoint"].setValue('')
      let country=$event.value
      if(country){
          let filteredCurrencyList=this.currencylist.filter(item=>item.countryname.toLowerCase()==country.toLowerCase())
          this.filteredCurrencyList=filteredCurrencyList;
         // console.log(this.filteredCurrencyList)
          if(filteredCurrencyList.length>0){
              let val=filteredCurrencyList[0].currencycode?filteredCurrencyList[0].currencycode:''
              let minorunit=filteredCurrencyList[0].minnorUnit?filteredCurrencyList[0].minnorUnit:''
              this.countryForm.controls["currency"].setValue(val);
              this.countryForm.controls["decimalpoint"].setValue(minorunit)
          }
      }
  }
  onChangecurrency(){
    //   let val=this.countryForm.controls['currency'].value;
    //   let filteredCurrencyList
  }
  saveCountry(){
       this.isSubmitted=true;
       if(this.countryForm.valid){
         // console.log("Valid")
          let CountryEntity=new CountryModel();
          CountryEntity.Country=this.countryForm.controls["country"].value;
          CountryEntity.Currency=this.countryForm.controls["currency"].value;
          CountryEntity.Exponents=this.countryForm.controls["decimalpoint"].value;
          CountryEntity.active=this.countryForm.controls["active"].value;
          CountryEntity.deleted=false;
          if(this.countryId){            
            this._service.patchcountryCurrency(this.countryId,CountryEntity).subscribe(res=>{
                //console.log("response",res)
                Swal("Success!",res.message,"success");
                this.triggerCancelForm()
            },err=>{
                console.log(err)
                Swal("Alert",err,"info")
            })      
          }else{
            this._service.postcountryCurrency(CountryEntity).subscribe(res=>{
                //console.log("response",res)
                Swal("Success!",res.message,"success");
                this.triggerCancelForm()
            },err=>{
                console.log(err)
                Swal("Alert",err,"info")
            })
          }

       }else{
        // console.log("In Valid")
       }
  }
  triggerCancelForm(){
      this.countryForm.reset();
      this.router.navigate(['/country/list']);
  }

  
}

