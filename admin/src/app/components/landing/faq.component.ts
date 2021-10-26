import { Component, OnInit, Inject, PLATFORM_ID, APP_ID } from "@angular/core";
import {FaqService } from '../../../admin-app/dashboard-app/components/faq/faq.service'
import Swal from "sweetalert2";

@Component({
    selector: 'faq',
    templateUrl: './faq.html',
    styleUrls: ['./faq.scss']
})

export class FaqComponent implements OnInit{
    
 faq:any=[];
    
    constructor( private faqservice:FaqService) {
        
        this.FaqList();

    }

    ngOnInit() {
        
    }

    FaqList() {
        this.faqservice.getfaqDetailByuserid("1")
          .subscribe(
            objRes => {
              this.faq=objRes;
            //  console.log("h232323",this.faq);
    
            },
            error => this.errorMessage(error)
          );
      }
      errorMessage(objResponse: any) {
        Swal("Alert !", objResponse, "info");
      }
}