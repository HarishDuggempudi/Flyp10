import { Component, OnInit, ViewChild } from "@angular/core";
import { TeammateService } from '../teammate/teammate.service';
import {Config} from "../../../shared/configs/general.config";
import {UserModel} from "../user-management/user.model";
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import {Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";
import { Subject } from 'rxjs/Subject';
import {API_URL} from "../../../shared/configs/env.config";
import {FileOperrationService} from '../../../shared/services/fileOperation.service';
import { XhrService } from '../../../shared/services/xhr.service';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators/catchError';
import { takeUntil } from "rxjs/operators";
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import Swal from 'sweetalert2';
import { SendNotificationService } from "./sendnotification.service";
import { SendNotificationModel } from "./sendnotification.model";
//import * as _ from "lodash";
import { MatOption, MatCheckbox } from "@angular/material";

@Component({
  selector: "send-notification",
  templateUrl: "./sendnotification.component.html",
  styleUrls: ['./sendnotification.scss']
})
export class SendNotificationComponent implements OnInit {
   SendNotificationForm:FormGroup;
    filterusers: any = [];
    private _onDestroy = new Subject<void>();
    sendNotificationObj :SendNotificationModel= new SendNotificationModel();
    allUsers: any =[];
    selectedUserNotificationId = [];
    isSubmitted = false;
    lengthError: boolean;
    searchText: string;
    typingTimer: NodeJS.Timer;
    doneTypingInterval = 1500;


    @ViewChild('allSelected') private allSelected: MatCheckbox;
  loading: boolean;
  bodyToPass: any = {}
    constructor( private service : SendNotificationService,private _formBuilder:FormBuilder) {
        this.SendNotificationForm = this._formBuilder.group({
          "Message": ['',Validators.required],
           "Users" : ['',Validators.required],
           "inputUsers":['']
     });
     this.SendNotificationForm.controls.inputUsers.valueChanges
     .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filteredUsers()
  });
    }
  
     ngOnInit() {
// this.getUserForSendNotifications();
     }

   
    getUserForSendNotifications() {
      this.bodyToPass["searchString"] = this.searchText
         this.service.getUserForSendNotifications(this.bodyToPass).subscribe((res)=>{
             console.log(res)
             if(res.success) {
               //  this.allUsers =  _.uniqBy(res.result,'UID');
               this.allUsers = res.result
                 this.filterusers = this.allUsers;
             }
         })
     }

     clearSearchInput() {
     
      this.searchText = ""
    
    }
     tosslePerOne(){ 
      if (this.allSelected.checked) {  
       this.allSelected.checked = false;
       return false;
   }
     if(this.SendNotificationForm.controls.Users.value.length==this.filterusers.length)
       this.allSelected.checked = true;
   
   }
     toggleAllSelection() {
       if (!this.allSelected.checked) {
         this.SendNotificationForm.controls.Users
           .patchValue([...this.filterusers.map(item => item._id), 0]);
       } else {
        this.SendNotificationForm.controls.Users.patchValue([]);
       }
     }
     

     applyFilter(ev: string) {
  
      let search = ev
      this.searchText = ev
      clearTimeout(this.typingTimer)
      if (search.length) {
        // this.loading = true
        // this.banks = []
        this.typingTimer = setTimeout(() => {
          this.loading = false
          this.bodyToPass["searchString"] = this.searchText
     
          this.getUserForSendNotifications()
        }, this.doneTypingInterval);
      } else {
        //   this.filteredItems = []
       
        this.loading = false
        delete this.bodyToPass["searchString"] 
        // this.getUserForSendNotifications(this.bodyToPass)
      }
        
  
    }
   
     filteredUsers() {
        if (!this.allUsers) {
          return;
          }
          // get the search keyword
          let search = this.SendNotificationForm.controls.inputUsers.value;
          if (!search) {
              this.filterusers = this.allUsers.slice();
              return;
          } else {
              search = search.toLowerCase();
          }
          // filter the banks
          this.bodyToPass.searchString = search
          this.applyFilter(search)
      }

      checkTextlength() {
        this.lengthError = false;
          if(this.sendNotificationObj.message.length > 40) {
        this.lengthError = true;
          }
      }
      sendNotifications() {
          this.isSubmitted = true;
         // this.lengthError = false;
        
          if(this.SendNotificationForm.valid) {
          this.sendNotificationObj.users =[];
          
          console.log("sendnotifi",this.SendNotificationForm.controls.Users.value)

          let body = {
            user:this.SendNotificationForm.controls.Users.value,
            message:this.sendNotificationObj.message
          }
          console.log('body',body)
          this.service.sendNotificationToUser(body).subscribe((res)=>{
              console.log(res);
              if(res.success) {
                this.SendNotificationForm.reset();   
                this.allSelected.checked = false;
                Swal("Success","Message Send Successfully",'success')
              }
              else {
                  Swal("Info","Something bad happened,Please try again")
              }
          })
        }
        
      }
      Reset() {
          this.isSubmitted = false;
         // this.lengthError = false;
          this.SendNotificationForm.reset();
      }
}
