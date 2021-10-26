import { Component, OnInit, Inject, ViewChild, Output, EventEmitter } from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
// import {AddTeamComponent} from './addteam.component';
// import { TeammateService } from './teammate.service';
import {EventdataModel} from './events.model';
import {Config} from "../../../shared/configs/general.config";
import {RegisterUserModel} from "../user-management/user.model";
import {EventsService} from "./events.service"
import * as moment from 'moment';
@Component({
    selector: 'upload-csv-dialog',
    templateUrl: 'upload-csv-dialog.html',
  })
  
  export class UploadCSVDialog {
    @Output() onFilter: EventEmitter<any> = new EventEmitter();
    eventList:any[]=[];
    events: EventdataModel = new EventdataModel();
    // AddTeamComponent:teammateClass;
    // @ViewChild(AddTeamComponent) teammateClass: AddTeamComponent
    passphrase:string="";
    userPassphrase:string="";
    wrongPassphrase:boolean = false;
    loginuserinfo:RegisterUserModel
    constructor(
      public dialogRef: MatDialogRef<UploadCSVDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any,
        private _objService: EventsService
      ) {
        let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
        this.loginuserinfo=userInfo;
          
          this.userPassphrase = data.passphrase;
       }
  
    onNoClick(): void {
      this.dialogRef.close();
    }

    public changeListener(files: FileList){

		if(files && files.length > 0) {
			 let file : File = files.item(0); 
			
				 let reader: FileReader = new FileReader();
				 reader.readAsText(file);
				 reader.onload = (e) => {
						let csv = reader.result;
					
						const csvAsString = JSON.stringify(csv);
					
						const lineBreaks = csvAsString.split('\\r\\n');
					
						
						for (let i = 0; i < lineBreaks.length; i++) {							
							const element = lineBreaks[i];
							const elementArr = element.split(',');
						
							this.eventList.push(elementArr);
						}	
						
						
				 }
			}
	}

	uploadFromCSV(){
		this.formatEventsByCSV(this.eventList);
	}

	formatEventsByCSV(arr){
	
		for (let i = 1; i < arr.length; i++) {
			const event = arr[i];
		
			if(arr[i] === arr[0]){
			
			}else{
				if(event[3] != ""){
					
					 var compareTo = moment();				 
				     var then = moment(event[8]);
						 
					if (compareTo > then ) {
										                           					
					} else {
							   						
                              	this.events.title = event[3];
								this.events.sportName= event[0];
								this.events.sportid= event[1];
								this.events.start= event[event.length-2];
								this.events.end= event[event.length-1];
								this.events.address= event[4];
								this.events.state= event[6];
								this.events.city= event[5];
								this.events.othertitle= "";
								this.events.Nod= event[2];
								this.events.userid = this.loginuserinfo._id;

								this._objService.saveEventMeet(this.events).subscribe( res => {
									

								}, err => {
									
								}, () => {
									this.dialogRef.close("");
								})
                           					
						}

					
				}
			}
		}
	}
  
    addTeammate(){
        if(this.passphrase === this.userPassphrase && this.passphrase.length){
            this.dialogRef.close(this.passphrase);
        }else{
            this.wrongPassphrase = true;
        }
    }
  
  }