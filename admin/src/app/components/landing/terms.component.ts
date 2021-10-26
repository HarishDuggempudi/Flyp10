
import { Component, OnInit, Inject, PLATFORM_ID, APP_ID } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../shared/seo.service';
import { TransferState } from '@angular/platform-browser';
import { Services } from '../../shared/services';
import Swal from "sweetalert2";
import {FaqComponent} from '../landing/faq.component'
import {PrivacyPage} from '../landing/privacy.component'
import {TermsPage} from '../../components/landing/conditons.component'
@Component({
    selector: 'client-landing-terms',
    templateUrl: './terms.component.html'
})

export class TermsComponent implements OnInit{
 
    websiteName: string = "Flyp10";
    websiteDescription: string = "Flyp10";
    websiteImage: string = "assets/client/images/red_icon.png";

    constructor(private _service: Services,@Inject(SeoService)private seo: SeoService, @Inject(PLATFORM_ID) private platformId: Object, @Inject(APP_ID) private appId: string, @Inject(TransferState)private state: TransferState) { }
    termsContent:string;
    ngOnInit() {
		this.getTerms()
        this.setSeoTags();
        const platform = isPlatformBrowser(this.platformId);
      
    }

    setSeoTags() {
        this.seo.setTitle("Flyp10 | Terms of Service");
        this.seo.setSchemaData(this.websiteName, this.websiteDescription, this.websiteImage);
        this.seo.setMetaData(this.websiteName, "Website", this.websiteDescription, "www.Flyp10.com", this.websiteImage);
        this.seo.setTwitterCard("Flyp10", this.websiteName, this.websiteDescription, "Flyp10", this.websiteImage);
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