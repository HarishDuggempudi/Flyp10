import Swal from "sweetalert2";
import {
  Component,
  OnInit
} from "@angular/core";
import { PricingSettingService } from "./pricing-setting.service";
import { PricingModel } from "./pricing-setting.model";
import { FormControlMessages } from "../../../shared/components/control-valdation-message.component";
import { Alert } from "../../../shared/components/alert/alert";
import { AlertModel } from "../../../shared/models/alert.model";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { ValidationService } from "../../../shared/services/validation.service";

@Component({
  selector: "pricing-setting",
  templateUrl: "./pricing-setting.html",
  styleUrls: ['./pricing.scss'],
})
export class PricingSettingComponent implements OnInit {
  pricingId:any; 
  objAlert: AlertModel = new AlertModel();
  isPost: boolean;
  isSubmitted: boolean = false;
  PricingForm: FormGroup;
  emailservise:PricingModel=new PricingModel();
  constructor(
    private _objEmailService: PricingSettingService,
    private _formBuilder: FormBuilder
  ) {
    this.PricingForm = this._formBuilder.group({
      premium: ["", Validators.required],
      premiumPlus: ["",Validators.required],
      addCredits: ["", Validators.required],
    });
  }

  ngOnInit() {
    this.getPricing();
  }

    getPricing() {
    this._objEmailService
      .getPricing()
      .subscribe(
        res => {
			if(res.length>0){
				 this.bindDetail(res[0])
			}
			
	   },
        error => this.errorMessage(error)
      );
  }  

  bindDetail(objPricing: PricingModel) {

	  
     this.pricingId = objPricing._id;
     this.PricingForm.setValue({
      premium: objPricing.premium,
      premiumPlus: objPricing.premiumPlus,
	  addCredits:objPricing.addCredits    
    }); 
  }

  savePricesetting() {
    this.isSubmitted = true;
    if (this.validateForm() && this.PricingForm.valid) {
      if (!this.pricingId) {
        this.isPost = true;
        this._objEmailService
          .savePricesetting(this.PricingForm.value)
          .subscribe(
            res => this.resStatusMessage(res),
            error => this.errorMessage(error)
          );
      } else {
        this.isPost = false;
        this._objEmailService
          .updatePricesetting(this.PricingForm.value, this.pricingId)
          .subscribe(
            res => this.resStatusMessage(res),
            error => this.errorMessage(error)
          ); 
      } 
    } 
  }

  validateForm() {
     if (
      (this.PricingForm.value.premium != "" &&
        typeof this.PricingForm.value.premium != "undefined" && this.PricingForm.value.premium > 0) ||
      (this.PricingForm.value.premiumPlus != "" &&
        typeof this.PricingForm.value.premiumPlus != "undefined" && this.PricingForm.value.premiumPlus > 0)
    )
      return true;
    else {
      this.objAlert.showAlert(
        "danger",
        "Alert !!",
        "Invalid data"
      );
    } 
  }

  resStatusMessage(res: any) {
	 
    this.objAlert.hideAlert();
    //this.getPricing();
    Swal("Success !", res.message, "success");
  }

  errorMessage(res: any) {
    let errorMessage: string = "";
    // if (res.length > 0) {
    //   for (let i in res) {
    //     if (i + 1 < res.length)
    //       errorMessage += res[i].msg + " & ";
    //       console.log('err => ', errorMessage);
    //     else errorMessage += res[i].msg;
    //     console.log('errMsg => ', errorMessage);
    //   }
    // } else {
      errorMessage = res;
    // }
    this.objAlert.showAlert("danger", "Alert !!", errorMessage, true);
  }
}
