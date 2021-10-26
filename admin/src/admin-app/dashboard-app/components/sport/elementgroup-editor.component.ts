import Swal from 'sweetalert2';
import {Component, OnInit} from '@angular/core';
import {EventModel,ElementGroupModel} from "./sport.model";
import {SportService} from "./sport.service";
import {FormGroup, Validators, FormBuilder,} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'element-elemrnt-editor',
    templateUrl: './elementgroup-editor.html'
})

export class ElementGroupEditorComponent implements OnInit {
    elementgroupObj:ElementGroupModel = new ElementGroupModel();
    AddElementGroupForm:FormGroup;
    isSubmitted:boolean = false;
    elementgroupid:string;
    sports:any=[{"id":1,"name":"Diving"},{"id":2,"name":"Irish Dance"},{"id":3,"name":"Wgymnastics"},{"id":4,"name":"Dressage"},];
    constructor(private router: Router, private activatedRoute: ActivatedRoute, private _objService:SportService, private _formBuilder:FormBuilder) {
        activatedRoute.params.subscribe(param => this.elementgroupid = param['elementgroupid']);
        this.AddElementGroupForm = this._formBuilder.group({
                "elementGroup": ['', Validators.required],
                "active": ['']
            }
        );
    }

    ngOnInit() {
        if (this.elementgroupid)
         this.getSportelementDetail();

    }

    getSportelementDetail() {
        this._objService.getSportElementDetailgroup(this.elementgroupid)
            .subscribe(res =>{
               // console.log(res)
                this.elementgroupObj = res
            } ,
                error => this.errorMessage(error));
    }

    saveSportsElementGroup() {
        this.isSubmitted = true;
        if (this.AddElementGroupForm.valid) {
            if (!this.elementgroupid) {
          
                this._objService.saveSportsElementgroup(this.elementgroupObj)
                    .subscribe(res => this.resStatusMessage(res),
                        error =>this.errorMessage(error));
            }
            else { 
             // console.log("update")
                this._objService.updateSportElementgroup(this.elementgroupObj)
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
        this.router.navigate(['/sport/elementgroup']);
    }
} 
