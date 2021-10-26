import { Component, OnInit } from '@angular/core';
import { EventModel } from './sport.model';
import { SportService } from './sport.service'
import {FormGroup, Validators, FormBuilder,} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: "base-editor",
  templateUrl: "./base-editor.html",
  styles: []
})
export class BaseEditorComponent implements OnInit {
  eventObj:EventModel = new EventModel();
    AddEventForm:FormGroup;
    isSubmitted:boolean = false;
    eventid:string;
    sports:any=[{"id":1,"name":"Diving"},{"id":2,"name":"Irish Dance"},{"id":3,"name":"Wgymnastics"},{"id":4,"name":"Dressage"},];

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private _objService:SportService, private _formBuilder:FormBuilder) {
    activatedRoute.params.subscribe(param => this.eventid = param['id']);
        this.AddEventForm = this._formBuilder.group({
                "sportsName": ['', Validators.required],
                "Event": ['', Validators.required],
                "eventFullname": ['', Validators.required],
                "difficultyFactor": ['', Validators.required],
                "active": ['']
            }
        );
  }

  ngOnInit() {
      if (this.eventid)
        this.getSporteventDetail();
  }

  getSporteventDetail() {
      this._objService.getSporteventDetail(this.eventid)
          .subscribe(res =>{
         
              this.eventObj = res
          } ,
              error => this.errorMessage(error));
  }

  saveSportsEvent() {
      this.isSubmitted = true;
      if (this.AddEventForm.valid) {
        this._objService.saveSportsEvent(this.eventObj)
        .subscribe(res => this.resStatusMessage(res),
            error =>this.errorMessage(error));
          
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
      this.router.navigate(['/sport/event']);
  }

}
