import Swal from 'sweetalert2';
import {Component, OnInit,ViewChild} from '@angular/core';
import {EventModel,ElementModel} from "./sport.model";
import {SportService} from "./sport.service";
import {FormGroup, Validators, FormBuilder,} from "@angular/forms";
import { ActivatedRoute, Router } from '@angular/router';
import {MatSelect} from '@angular/material';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Subject } from 'rxjs/Subject';
import { take, takeUntil } from 'rxjs/operators';
@Component({
    selector: 'blog-elemrnt-editor',
    templateUrl: './element-editor.html'
})

export class ElementEditorComponent implements OnInit {
    elementObj:ElementModel = new ElementModel();
    AddElementForm:FormGroup;
    isSubmitted:boolean = false;
    elementid:string;
	eventList:any=[];
	 public filteredEvents:any=[];
    @ViewChild('singleSelect') singleSelect: MatSelect; 
    /** Subject that emits when the component has been destroyed. */
    private _onDestroy = new Subject<void>();
    sports:any=[{"id":1,"name":"Diving"},{"id":2,"name":"Irish Dance"},{"id":3,"name":"Wgymnastics"},{"id":4,"name":"Dressage"},];
    constructor(private router: Router, private activatedRoute: ActivatedRoute, private _objService:SportService, private _formBuilder:FormBuilder) {
        activatedRoute.params.subscribe(param => {
          
            this.elementid = param['elementid']}
        );
        
        this.AddElementForm = this._formBuilder.group({
                "elementName": ['', Validators.required],
				"skillValue":[0, Validators.required],
				"factor": [0, Validators.required],
				"event": [0, Validators.required],
                "active": [true],
				"inputText":['']
            }
        );
    }

    ngOnInit() {
        this.getEventList();

        if (this.elementid)
        this.getSportelementDetail();
           // load the initial bank list
       
   

    // listen for search field value changes
    this.AddElementForm.controls.inputText.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
		  
        this.filterEvent();
      });
    }
	filterEvent(){
			 if (!this.eventList) {
		  return;
		}
		// get the search keyword
		let search = this.AddElementForm.controls.inputText.value;
		if (!search) {
		  this.filteredEvents=this.eventList.slice();
		  return;
		} else {
		  search = search.toLowerCase();
		}
		// filter the banks
		this.filteredEvents=this.eventList.filter(event => event.Event.toLowerCase().indexOf(search) > -1)
		  
		 
	}
getEventList(){ 
	this._objService.getAllSportsEvent().subscribe(res=>{
		//console.log("eventlist",res)
		this.eventList=res;
		this.filteredEvents=this.eventList;
	},err=>{
		Swal("Alert","Unable to load event data","info")
	})
}
    getSportelementDetail() {
        this._objService.getSportElementDetail(this.elementid)
            .subscribe(res =>{
                this.elementObj = res
               
                   this.elementObj = res
            } ,
                error => this.errorMessage(error));
    }

    saveSportsEvent() {
        this.isSubmitted = true;
        if (this.AddElementForm.valid) {
            if (!this.elementid) {
          
                this._objService.saveSportsElement(this.elementObj)
                    .subscribe(res => this.resStatusMessage(res),
                        error =>this.errorMessage(error));
            }
            else { 
              
                this._objService.updateSportElement(this.elementObj)
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
        this.router.navigate(['/sport/element']);
    }
}