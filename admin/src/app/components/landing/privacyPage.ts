 
import { Component, OnInit, Inject, PLATFORM_ID, APP_ID } from "@angular/core";

import { Services } from '../../shared/services';
import Swal from "sweetalert2";
import {FaqComponent} from '../landing/faq.component'
import {PrivacyPage} from '../landing/privacy.component'
import {TermsPage} from '../../components/landing/conditons.component'
@Component({
    selector: 'privacyPolicy',
    templateUrl: './privacy.component.html',
   
})

export class PrivacyPolicyPage {
	privacyContent:string;
   constructor( private _service: Services) {
        
        this.getPrivacy();

    }

    ngOnInit() {
        
    }

    getPrivacy() {
        this._service.getPrivacy()
          .subscribe(
            objRes => {
				if(objRes.htmlModuleContent){
					  this.privacyContent=objRes.htmlModuleContent;
				}
                 
             // console.log("h232323",this.privacyContent);
    
            },
            error => this.errorMessage(error)
          );
      }
      errorMessage(objResponse: any) {
        Swal("Alert !", objResponse, "info");
      }
}