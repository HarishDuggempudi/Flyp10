import { Component, OnInit, Inject, PLATFORM_ID, APP_ID } from "@angular/core";
import Swal from "sweetalert2";
import { Services } from '../../shared/services';


@Component({
    selector: 'Mgynastic',
    templateUrl: '../sport-pages/Mgymnastic.html',
    styleUrls: ['../sport-pages/sport.scss']
})

export class MgynasticComponent implements OnInit{
    
    pricelist:any=[];
    
    constructor(private _service: Services) {
        
       

    }

    ngOnInit() {
        this.getSportPricing();
    }
    getSportPricing(){
        //alert("call")
       
           this._service.getPricingList().subscribe( 
                 res =>{
                    
                    this.pricelist=res
                    this.pricelist.sort(function(a,b){
                     return a.sport.localeCompare(b.sport);
                    })
                    console.log(this.pricelist)
                    
                 },
                 error => {
                       //this.errorMessage(error)
                     
                     }
               );
           
     }
     formatDollar(val){ 
 
        if(val && val!='N/A'){ 
             var amt=val.toString(); 
             if(amt.indexOf('.')!=-1){ 
                return "$ "+Number(amt).toFixed(2) 
             }else{ 
                 return "$ "+amt+'.00' 
             } 
        } 
        else if(val=='N/A') { 
              return val
        } 
		 else { 
              return '$ 0.00' 
        } 
    }

      errorMessage(objResponse: any) {
        Swal("Alert !", objResponse, "info");
      }
}