import Swal from 'sweetalert2';
import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import {ImageCanvasSizeEnum} from "../../../shared/configs/enum.config";
import {Config} from "../../../shared/configs/general.config";
import {Validators, FormBuilder, FormGroup, FormControl} from "@angular/forms";
import {ValidationService} from "../../../shared/services/validation.service";
import { SportService } from "./sport.service";
import { LevelModel } from './sport.model';
import {Location} from '@angular/common';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/observable/of';

@Component({
  selector: "sport-level-editor",
  templateUrl: "./sport-level-editor.html",
  styles: []
})
export class SportLevelEditorComponent implements OnInit {
  levelId:string;
  isSubmitted:boolean = false;
  levelForm:FormGroup;
  levelObj:LevelModel = new LevelModel();
  constructor(private location: Location, private activatedRoute: ActivatedRoute,private router:Router, private _formBuilder: FormBuilder, private _objService: SportService) {
    activatedRoute.params.subscribe(param => this.levelId = param['levelid']);
  //  console.log('level id', this.levelId);
    this.levelForm = this._formBuilder.group({
        level: ['', Validators.required],
        maxscore: ['', Validators.required],
        active: ['']
    });
  }

  ngOnInit() {
    if(this.levelId){
      this.getLevelDetail()
    }
  }

  public obsItems = (text: string): Observable<string[]> => {
    return Observable.of([
        'item1', 'item2', 'item3'
    ]);
};

  saveLevel() {
    this.isSubmitted = true;
    if (this.levelForm.valid) {
      if (!this.levelId) {
        this._objService.saveLevel(this.levelForm.value)
          .subscribe(res => this.resStatusMessage(res),
            error => this.errorMessage(error));
      }
      else {
      //  console.log("update")
        this._objService.updateLevel(this.levelObj)
            .subscribe(res => this.resStatusMessage(res),
                error =>this.errorMessage(error));
      }
    }
  }

  resStatusMessage(objSave:any) {
    //console.log(objSave)
    this.location.back();
    Swal("Success !", objSave.message, "success")
  }

  triggerCancelForm() {
    this.location.back();
  }

  errorMessage(objResponse:any) {
    //console.log('error message', objResponse);
    Swal("Alert !", objResponse, "info");
  }

  getLevelDetail() {
    this._objService.getLevelDetail(this.levelId)
      .subscribe(res =>{
      //  console.log(res)
         this.levelObj=res
      },
        error => this.errorMessage(error));
       
  }

//   bindDetail(objRes:SportModel) {

//     this.categoryForm.patchValue({
//       categoryName: objRes.categoryName,
//       active: objRes.active,
//     });
//   }

}
