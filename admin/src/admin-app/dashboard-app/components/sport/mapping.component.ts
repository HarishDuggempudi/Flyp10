import { Component, OnInit } from '@angular/core';
import { SportModel, SportResponse, MappingModel } from './sport.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SportService } from './sport.service';
import Swal from "sweetalert2";
import { FormGroup, FormControl, FormArray,FormBuilder } from '@angular/forms';
import { forEach } from '@angular/router/src/utils/collection';
import 'rxjs/add/operator/catch';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { takeUntil } from '../../../../../node_modules/rxjs/operators';
import { Subject } from '../../../../../node_modules/rxjs';

@Component({
  selector: "mapping",
  templateUrl: "./mapping.html",
  styleUrls: ["./mapping.scss"]
})
export class MappingComponent implements OnInit {
  objListResponse: SportResponse;
  sports:any=[];
  levels:any=[];
  events:any=[];
  elements:any = [];
  elementGroup:any = [];;
  categories:any=[];
  selectedSport:any='';
  selectedLevels:any=[];
  selectedElements:any=[];
  selectedElementsGroup:any=[];
  selectedEvents:any=[];
  selectedCategories:any=[];
  selectedElement:any=null;
  selectedElementGroup:any=null;
  selectedEvent:any=null;
  selectedCategory:any=null;
  dispLevels:any = [];
  public baseVal:number=null;
  filteredEvents: any=[];
  toggleEvent:Boolean= false;
  toggleLevel:Boolean= false;
  toggleCategory:Boolean= false;
  toggleElement:Boolean= false;
  toggleElementGroup:Boolean= false;
  toggleBase:Boolean= false;
  formSubmitStatus:number = null;
  /* Pagination */
  pageSizeOptions = [5, 10, 25, 50, 100];
  perPage: number = 1000;
  currentPage: number = 1;
  totalItems: number = 1;
  /* End Pagination */
  preIndex: number = 0;
  configFields: any;
  mappingForm:FormGroup;
  selectedOthers = [];
  isFieldsLoaded:Boolean = false;
  AddElementForm:FormGroup;
  private _onDestroy = new Subject<void>();
  filteredElement: any=[];
  filteredeventss:any=[]

  constructor(private _objService: SportService, private fb: FormBuilder,private router: Router,private _formBuilder:FormBuilder) {
    this.mappingForm = this.fb.group({
      mappingFields: this.fb.array([]),
      eventSearch:[''],
      elementSearch:['']
    });

    this.AddElementForm = this._formBuilder.group({
      "sportName": [''],
"levelName":['', ],
"levelSearch":['']

  }
);
  }

  ngOnInit() {
    this.getSportList();
    
    
    this.getCategoryList();
    this.getEventList();
    this.getLevelsList();
    this.getElementList();
    this.getElementGroupList();
    
    this.onAddMappingFields();

    this.AddElementForm.controls.levelSearch.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
    
      this.filterEvent();
    });
    this.mappingForm.controls.eventSearch.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
    
      this.filteredevent();
    });
    this.mappingForm.controls.elementSearch.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
    
      this.filteredelement();
    });
    
  }
  filteredelement(){
    
    if (!this.elements) {
      return;
    }
    // get the search keyword
    let search = this.mappingForm.controls.elementSearch.value;
    if (!search) {
      this.filteredElement=this.elements.slice();
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredElement=this.elements.filter(event => event.elementName.toLowerCase().indexOf(search) > -1)
  }
  filteredevent(){
 

    if (!this.events) {
   return;
 }
 // get the search keyword
 let search = this.mappingForm.controls.eventSearch.value;
 if (!search) {
   this.filteredeventss=this.events.slice();
   return;
 } else {
   search = search.toLowerCase();
 }
 // filter the banks
 this.filteredeventss=this.events.filter(event => event.Event.toLowerCase().indexOf(search) > -1)
  }

  filterEvent(){
  
    if (!this.levels) {
   return;
 }
 // get the search keyword
 let search = this.AddElementForm.controls.levelSearch.value;
 if (!search) {
   this.filteredEvents=this.levels.slice();
   return;
 } else {
   search = search.toLowerCase();
 }
 // filter the banks
 this.filteredEvents=this.levels.filter(event => event.level.toLowerCase().indexOf(search) > -1)
   
  
}

  ngAfterViewInit() {
    
  }

  onAddMappingFields(){

    const control = new FormGroup({
        'event': new FormControl(null),
        'category': new FormControl(null),
        'element': new FormControl(null),
        'elementGroup': new FormControl(null),
        'base': new FormControl(null)
    });
      (<FormArray>this.mappingForm.get('mappingFields')).push(control); 
    console.log("selected event >>>>>>>>>>>>>>> ", this.selectedEvent);
    if(this.selectedEvents.length) this.selectedEvent.push(this.selectedEvents)
    
  }

  addMappingFields(){

    const control = new FormGroup({
        'event': new FormControl(null),
        'category': new FormControl(null),
        'element': new FormControl(null),
        'elementGroup': new FormControl(null),
        'base': new FormControl(null)
    });
      (<FormArray>this.mappingForm.get('mappingFields')).push(control); 
    
    if(this.selectedEvent) this.selectedEvents.push(this.selectedEvent)
    if(this.selectedCategory) this.selectedCategories.push(this.selectedCategory)
    if(this.selectedElement) this.selectedElements.push(this.selectedElement)
    if(this.selectedElementGroup) this.selectedElementsGroup.push(this.selectedElementGroup)
  }

  removeMappingFields(i){
    console.log("index ", i);
    console.log("selected elements group ", this.selectedElementsGroup);
    let totalMappingFields = (<FormArray>this.mappingForm.get('mappingFields'));
    console.log("mapping array value ==========> ", totalMappingFields.at(i).value)
    const eventPos = this.selectedEvents.map(function(e) { return e.id; }).indexOf(totalMappingFields.at(i).value.event),
    elementPos = this.selectedElements.map(function(e) { return e.id; }).indexOf(totalMappingFields.at(i).value.element),
    elementGroupPos = this.selectedElementsGroup.map(function(e) { return e.id; }).indexOf(totalMappingFields.at(i).value.elementGroup),
    categoryPos = this.selectedCategories.map(function(e) { return e.id; }).indexOf(totalMappingFields.at(i).value.category);
    console.log("selected events index ", eventPos);
    console.log("selected elementPos index ", elementPos);
    console.log("selected categoryPos index ", categoryPos);
    console.log("selected elementGroupPos index ", elementGroupPos);
    totalMappingFields.removeAt(i);
    if(eventPos != -1){
      this.selectedEvents.splice(eventPos, 1);
    }
    if(elementGroupPos != -1){
      this.selectedElementsGroup.splice(elementGroupPos, 1);
    }
    if(elementPos != -1){
      this.selectedElements.splice(elementPos, 1);
    }
    if(categoryPos != -1){
      this.selectedCategories.splice(categoryPos, 1);
    }
    console.log("spliced events ", this.selectedEvents);
    console.log("spliced selected Elements Group ", this.selectedElementsGroup);
    console.log("spliced selected Elements ", this.selectedElements);
    console.log("spliced selected Categories ", this.selectedCategories);
    // console.log("mapping fields length ==========> ", totalMappingFields.controls.length-1)
    // console.log("selected events length ==========> ", this.selectedEvents.length)
    // totalMappingFields.removeAt(i);    
    // if(this.selectedEvents.length == (totalMappingFields.controls.length-1)) {
    //   console.log("selected event to remove ", this.selectedEvents[i]);

    //   // delete this.selectedEvents[i];
    //   // this.selectedEvents.splice(i);
    // }
    // console.log("mapping fields length aft ==========> ", totalMappingFields.controls.length)
    // console.log("selected events length aft ==========> ", this.selectedEvents.length)
  }

  sportSelectChange(ev){
    this.isFieldsLoaded = true;
    let mappingForm = (<FormArray>this.mappingForm.get('mappingFields'));
    mappingForm.controls.splice(0);
    this.selectedLevels = [];  
    this.selectedEvents = [];
    this.selectedCategories = [];
    this.selectedElements = [];
    this.selectedElementsGroup = [];
    this.dispLevels = [];
    this.configFields = ev.value.fieldsConfig;
   
    let selectedSportId:string = ev.value._id;
    this._objService.getMappedSportsDataById(selectedSportId).subscribe( val => {
      
      if(val){
       // console.log('mapped data -------->', val);
        for(var i=0; i < val.mappingFieldsVal.length; i++){
          this.onAddMappingFields();
        } 
        this.formSubmitStatus = 1;
        this.bindDetail(val);
      }
    }, (errStatus) => {
   //   console.log("errStatus",errStatus)
       if(errStatus == 404){
         this.onAddMappingFields();
         this.formSubmitStatus = 0;
       }
    }
    
    )
  }

  removeFromObjectByKey(arr){
    for(var i=0; i < arr.length; i++){
      delete arr[i]._id;
    }
    return arr;
  }

  bindDetail(objRes:MappingModel) {
   // console.log('bind data ', objRes);
    this.dispLevels = objRes.level;
    this.showLevelById(this.dispLevels);
    this.updMappingFieldsById(objRes.mappingFieldsVal)
    let mappingForm = (<FormArray>this.mappingForm.get('mappingFields'));
    let idRemArr = this.removeFromObjectByKey(objRes.mappingFieldsVal)
    mappingForm.setValue(idRemArr);  
  }

  getMappedSportsData() {
    this._objService
      .getMappedSportsData(this.perPage, this.currentPage)
      .subscribe(
        objRes => {
        //  console.log('map obj res --------------------> ', objRes);
          // this.bindSportList(objRes)
          let dataList = objRes;
          return dataList;
        },
        error => this.errorMessage(error)
      );
  }

  getSportList() {
    this._objService
      .getSportList(this.perPage, this.currentPage)
      .subscribe(
        objRes => {
          // this.bindSportList(objRes)
          let dataList = objRes.dataList;
          for(var i= 0; i < dataList.length; i++){
            if(dataList[i].active){
              this.sports.push(dataList[i]);
            }
          }
        },
        error => this.errorMessage(error)
      );
  }


  getCategoryList() { 
    this._objService
      .getCategoryList(this.perPage, this.currentPage)
      .subscribe(
        objRes => {
         // console.log('obj Res=======> ', objRes.dataList);
          let dataList = objRes.dataList;
          for(var i= 0; i < dataList.length; i++){
            if(dataList[i].active){
              this.categories.push(dataList[i]);
            }
          }
        },
        error => this.errorMessage(error)
      );
  }

  getEventList() {
    this._objService
      .getSportsEvent(this.perPage, this.currentPage)
      .subscribe(
        objRes => {
        
          let dataList = objRes.dataList;
          for(var i= 0; i < dataList.length; i++){
            if(dataList[i].active){
              this.events.push(dataList[i]);
            }
          }
          this.filteredeventss=this.events
        },
        error => this.errorMessage(error)
      );
  }

  getElementList() {
    this._objService
      .getSportsElement(this.perPage, this.currentPage)
      .subscribe(
        objRes => {
          
          let dataList = objRes.dataList;
          for(var i= 0; i < dataList.length; i++){
            if(dataList[i].active){
              this.elements.push(dataList[i]);
            }
          }
          this.filteredElement=this.elements
        },
        error => this.errorMessage(error)
      );
  }

  getElementGroupList() {
    this._objService
      .getSportsElementgroup(this.perPage, this.currentPage)
      .subscribe(
        objRes => {
         
          let dataList = objRes.dataList;
          for(var i= 0; i < dataList.length; i++){
            if(dataList[i].active){
              this.elementGroup.push(dataList[i]);
            }
          }
          console.log("elements group list ", this.elementGroup);
        },
        error => this.errorMessage(error)
      );
  }

  baseValChange(ev){
  
    this.baseVal = ev.target.value;
  }

  saveSportsEvent(){
    console.log("selected sport ", this.selectedSport);
    console.log("selected level ", this.dispLevels);
    let mappingFormVal = {
      sport: this.selectedSport._id,
      _id: this.selectedSport._id,
      level: this.dispLevels,
      mappingFieldsVal: this.mappingForm.value.mappingFields
    }

    console.log("mapping form val ", mappingFormVal);

    if(this.formSubmitStatus == 0) {
      this._objService.mapSportWithElements(mappingFormVal).subscribe((res) => {
          
            Swal("Success !", "Sport successfully mapped with the selected fields", "success");
        })
    }
    else {
      this._objService.updateMappedData(mappingFormVal).subscribe( data => {
         
          Swal("Success !", "Updated successfully", "success");
      })
    }

    
  }

  

  triggerCancelForm(){
    this.router.navigate(['/sport']);
  }

  getLevelsList() {
    this._objService
      .getLevelList(this.perPage, this.currentPage)
      .subscribe(
        objRes => {
        
          let dataList = objRes.dataList;
          for(var i= 0; i < dataList.length; i++){
            if(dataList[i].active){
              this.levels.push(dataList[i]);
            }
          }
          this.filteredEvents=this.levels

          console.log("levels --> ", this.levels);

        },
        error => this.errorMessage(error)
      );
  }

  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }

  levelSelectChange(ev){
    this.selectedLevels = [];
    console.log("value ", ev.value);
    console.log("all levels ", this.levels);
    const selValues = ev.value;
    selValues.forEach(selVal => {
      this.levels.forEach(level => {
        // console.log("level ====> ", level);
        if(selVal == level._id){
          console.log("match found -------------> ", level);
          this.selectedLevels.push(level.level)
        }
      });  
    });
     
    console.log("on complete ", this.selectedLevels) ;
  }

  showLevelById(val){
    this.selectedLevels = [];
    console.log("value ", val);
    console.log("all levels ", this.levels);
    const selValues = val;
    selValues.forEach(selVal => {
      this.levels.forEach(level => {
        // console.log("level ====> ", level);
        if(selVal == level._id){
          console.log("match found -------------> ", level);
          this.selectedLevels.push(level.level)
        }
      });  
    });
    console.log("on complete ", this.selectedLevels) ;
  }

  showSelectedEventsById(val){
    this.selectedEvent = null;
    console.log("passed val is ", val);
    this.events.forEach(event => {
      if(val.value == event._id){
        console.log("event to push ===> ", event)
          const eventFullName = event.eventFullname
          const eventObj = {
            id: event._id,
            name: eventFullName
          }
          this.selectedEvents.push(eventObj);
      }
    });
    console.log("selected event after ", this.selectedEvents);
  }

  showSelectedCategoriesById(val){
    this.selectedCategory = null;
    console.log("passed val is ", val);
    this.categories.forEach(cat => {
      if(val.value == cat._id){
        console.log("event to cat ===> ", cat)
          const catObj = {
            id: cat._id,
            name: cat.categoryName
          }
          this.selectedCategories.push(catObj);
      }
    });
    console.log("selected events after ", this.selectedCategories);
  }

  showSelectedElementsById(val){
    this.selectedElement = null;
    console.log("passed val is ", val);
    console.log("selected events before ", this.selectedElements);
    this.elements.forEach(elem => {
      if(val.value == elem._id){
        console.log("event to cat ===> ", elem)
          const elemObj = {
            id: elem._id,
            name: elem.elementName
          }
          this.selectedElements.push(elemObj);
      }
    });
    console.log("selectedElements after ", this.selectedElements);
  }

  showSelectedElementGroupsById(val){
    this.selectedElement = null;
    console.log("passed val is ", val);
    console.log("selected events before ", this.selectedElementsGroup);
    this.elementGroup.forEach(elemGroup => {
      if(val.value == elemGroup._id){
        console.log("elementGroup to push ===> ", elemGroup)
          const elemObj = {
            id: elemGroup._id,
            name: elemGroup.elementGroup
          }
          this.selectedElementsGroup.push(elemObj);
      }
    });
    console.log("selected Elements Group after ", this.selectedElementsGroup);
  }

  updMappingFieldsById(val){
    this.isFieldsLoaded = false;
    Swal({
          title: 'Updating fields.. Please wait..'
    });
    Swal.showLoading();
    
    val.forEach(obj => {     
      console.log('category obj ', obj) 
      this.elements.forEach(elem => {
        if(obj.element == elem._id){
          console.log("event to cat ===> ", elem)
          const elemObj = {
            id: elem._id,
            name: elem.elementName
          }
          this.selectedElements.push(elemObj);
        }
      });
      this.categories.forEach(cat => {
        if(obj.category == cat._id){
          console.log("event to cat ===> ", cat)
          const catObj = {
            id: cat._id,
            name: cat.categoryName
          }
          this.selectedCategories.push(catObj);
        }
      });
      this.events.forEach(event => {
        if(obj.event == event._id){
          console.log("event to push ===> ", event)
          const eventFullName = event.eventFullname
          const eventObj = {
            id: event._id,
            name: eventFullName
          }
          this.selectedEvents.push(eventObj);
        }
      });
      this.elementGroup.forEach(elemGroup => {
        if(obj.elementGroup == elemGroup._id){
          console.log("elementGroup to push ===> ", elemGroup)
          const elemObj = {
            id: elemGroup._id,
            name: elemGroup.elementGroup
          }
          this.selectedElementsGroup.push(elemObj);
        }
      });
    });  
    this.isFieldsLoaded = true;
    Swal.close();
    console.log("selected Elements ", this.selectedElements)  
  }

}
