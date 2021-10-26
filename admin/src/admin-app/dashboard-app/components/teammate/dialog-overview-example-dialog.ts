import { Component, OnInit, Inject, ViewChild, Output, EventEmitter } from "@angular/core";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
// import {AddTeamComponent} from './addteam.component';
import { TeammateService } from './teammate.service';

@Component({
    selector: 'dialog-overview-example-dialog',
    templateUrl: 'dialog-overview-example-dialog.html',
  })
  
  export class DialogOverviewExampleDialog {
    @Output() onFilter: EventEmitter<any> = new EventEmitter();

    // AddTeamComponent:teammateClass;
    // @ViewChild(AddTeamComponent) teammateClass: AddTeamComponent
    passphrase:string="";
    userPassphrase:string="";
    wrongPassphrase:boolean = false;
    constructor(
      public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      private _service: TeammateService
      ) {
         
          this.userPassphrase = data.passphrase;
       }
  
    onNoClick(): void {
      this.dialogRef.close();
    }
  
    addTeammate(){
        if(this.passphrase === this.userPassphrase && this.passphrase.length){
            this.dialogRef.close(this.passphrase);
        }else{
            this.wrongPassphrase = true;
        }
    }
  
  }