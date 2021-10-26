
import { Component, OnInit, Inject, PLATFORM_ID, APP_ID } from "@angular/core";
import { Services } from '../../shared/services';
import Swal from "sweetalert2";


@Component({
    selector: 'terms',
    templateUrl: './terms.html',
    styleUrls: ['./terms.scss']
})

export class TermsPage {
	termsContent:string;
    constructor(private _service: Services){
		this.getTerms()
	}
	 
     getTerms() {
        this._service.getTerms()
          .subscribe(
            objRes => {
				if(objRes.htmlModuleContent){
					  this.termsContent=objRes.htmlModuleContent;
				}
                 
            //  console.log("h232323",this.termsContent);
    
            },
            error => this.errorMessage(error)
          );
      }
      errorMessage(objResponse: any) {
        Swal("Alert !", objResponse, "info");
      }
}