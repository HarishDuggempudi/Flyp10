import Swal from 'sweetalert2';
import {Component, OnInit} from '@angular/core';
import {FaqModel} from "./faq.model";
import {FaqService} from "./faq.service";
import {FormGroup, Validators, FormBuilder,FormControl} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: "faq-editor-component",
  templateUrl: "./faq-editor-component.html"
})
export class FaqEditorComponent implements OnInit {
  
    faqObj:FaqModel = new FaqModel();
    AddFaqForm:FormGroup;
    isSubmitted:boolean = false;
    faqid:string;
    editorFormControl:FormControl = new FormControl('', Validators.required);
    constructor(private router: Router, private activatedRoute: ActivatedRoute, private _objService:FaqService, private _formBuilder:FormBuilder) {
        activatedRoute.params.subscribe(param => {
          //  console.log("sdsds",param['id'])
            this.faqid = param['faqid']}
        );
        
        this.AddFaqForm = this._formBuilder.group({
                "question": ['', Validators.required],
                "answer": this.editorFormControl,
                "assignedTo": ['', Validators.required],
                "active": ['']
            }
        );
    }
    editorValueChange(args: any) {
      
        this.faqObj.answer = args;
      
      }
    
    ngOnInit() {
        
        if (this.faqid)
        this.getfaqDetail();

    }

    getfaqDetail() {
        this._objService.getfaqDetail(this.faqid)
            .subscribe(res =>{
                this.faqObj = res
                
            } ,
                error => this.errorMessage(error));
    }

    saveFaq() {
        this.isSubmitted = true;
        if (this.AddFaqForm.valid) {
            if (!this.faqid) {
           
                this._objService.saveFaq(this.faqObj)
                    .subscribe(res => this.resStatusMessage(res),
                        error =>this.errorMessage(error));
            }
            else { 
              
                this._objService.updateFaq(this.faqObj)
                    .subscribe(res => this.resStatusMessage(res),
                        error =>this.errorMessage(error));
            }
        }
    }

    resStatusMessage(res:any) {
        Swal("Success !", res.message, "success");
        this.triggerCancelForm();
    }

    errorMessage(objResponse:any) {
        Swal("Alert !", objResponse, "info");
    }

    triggerCancelForm() {
        this.router.navigate(['/faq/faqlist']);
    }

}
