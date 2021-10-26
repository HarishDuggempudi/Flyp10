import Swal from 'sweetalert2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {ImageCanvasSizeEnum} from "../../../shared/configs/enum.config";
import {Config} from "../../../shared/configs/general.config";
import {Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {ValidationService} from "../../../shared/services/validation.service";
import { SportService } from "./sport.service";
import { CategoryModel } from './sport.model';
import {Location} from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/of';

@Component({
  selector: "category-editor",
  templateUrl: "./category-editor.html",
  styles: []
})
export class CategoryEditorComponent implements OnInit {
  categoryId:string;
  isSubmitted:boolean = false;
  categoryForm:FormGroup;
  categoryObj:CategoryModel= new CategoryModel();
  constructor(private location: Location, private activatedRoute: ActivatedRoute,private router:Router, private _formBuilder: FormBuilder, private _objService: SportService) {
    activatedRoute.params.subscribe(param => this.categoryId = param['categoryid']);
   
    this.categoryForm = this._formBuilder.group({
        categoryName: ['', Validators.required],
      active: ['']
    });
  }

  ngOnInit() {
    if(this.categoryId){
      this.getCategoryDetail()
    }
  }

  public obsItems = (text: string): Observable<string[]> => {
    return Observable.of([
        'item1', 'item2', 'item3'
    ]);
};

  saveCategory() {
    this.isSubmitted = true;
    if (this.categoryForm.valid) {
      if (!this.categoryId) {
        this._objService.saveCategory(this.categoryForm.value)
          .subscribe(res => this.resStatusMessage(res),
            error => this.errorMessage(error));
      }
      else {
        this._objService.updateCategory(this.categoryObj)
          .subscribe(res => this.resStatusMessage(res),
            error => this.errorMessage(error));
      }
    }
  }

  resStatusMessage(objSave:any) {
    this.location.back();
    Swal("Success !", objSave.message, "success")
  }

  triggerCancelForm() {
    this.location.back();
  }

  errorMessage(objResponse:any) {

    Swal("Alert !", objResponse, "info");
  }

  getCategoryDetail() {
    this._objService.getCategoryDetail(this.categoryId)
      .subscribe(res =>
        this.categoryObj=res,
        error => this.errorMessage(error));
       
  }

//   bindDetail(objRes:SportModel) {

//     this.categoryForm.patchValue({
//       categoryName: objRes.categoryName,
//       active: objRes.active,
//     });
//   }

}
