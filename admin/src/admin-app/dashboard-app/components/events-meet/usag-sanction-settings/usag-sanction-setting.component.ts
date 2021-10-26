import Swal from "sweetalert2";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { EventMeetService } from "../event-meet-service";
import { MeetResponse,MeetModel } from "../event-meet-model";
import * as moment from 'moment';
import { UserModel } from "../../user-management/user.model";
import { Config } from "../../../../shared/configs/general.config";
import { UserService } from "../../user-management/user.service";
import { userInfo } from "os";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Location } from "@angular/common";
@Component({
  selector: "usag-sanction-setting",
  templateUrl: "./usag-sanction-setting.component.html"
})

export class USAGSanctionSettingComponent implements OnInit {


 
  objListResponse: any;
  userRole: string;
  usersportObj: any = [];
  userInfo: UserModel;
  SanctionSettingForm:FormGroup;
  isSubmitted= false
    sanctionid: any;
    SanctionInfo: any;
    USAGSports = Config.USAGSportsInFlyp10;
  isCustomLevelSortAvailable: boolean;
  
 
  async ngOnInit() {
    let userInfo: UserModel = JSON.parse(Config.getUserInfoToken());  
    console.log('userinfo',userInfo) 
    this.userRole = userInfo.userRole
      this.objListResponse=new MeetResponse();
     this.userInfo = userInfo;
     this.getSanctionInfoBySanctionID()
    
  }

  constructor(private _objUserService:UserService,private activatedRoute: ActivatedRoute,private location: Location,private _formBuilder:FormBuilder,private router: Router, private _objService: EventMeetService) {
    this.activatedRoute.params.subscribe(async(param) => {
        //  //console.log("sdsds",param['id'])
          this.sanctionid = param['sanctionid']
       })
    this.SanctionSettingForm = this._formBuilder.group({
        "SortForJudges": ['DateTimeAsc',Validators.required],
        "SanctionID":['']
   });
   
  }
  getSanctionInfoBySanctionID() {
    return new Promise((resolve,reject)=>{
        
        this._objService.getSanctionByID(this.sanctionid).subscribe((res)=>{
            this.SanctionInfo = res;
            let USAGSport = this.USAGSports.find((e)=>e.USAG.toLowerCase() == this.SanctionInfo.DisciplineType.toLowerCase())
            this.getSportLevelSortOrder(USAGSport.ID)
            this.SanctionSettingForm.patchValue({
                SortForJudges:this.SanctionInfo.Settings.SortForJudges
            })
            resolve();
        })
    })
   
}
getSportLevelSortOrder(sportId) {
  this._objService.getSportLevelSortOrder(sportId).subscribe((res) =>{
    if(res.length >0) {
      this.isCustomLevelSortAvailable = true
    } else {
      this.isCustomLevelSortAvailable = false
    }
  })
}
  saveSanctionSetting(){
    this.isSubmitted = true;
    if((this.SanctionSettingForm.value.SortForJudges == 'CustomLevelAsc'|| this.SanctionSettingForm.value.SortForJudges == 'CustomLevelDesc' ) && !this.isCustomLevelSortAvailable) {
      Swal("Alert !", "Custom level sort order is not configured. Please contact superadmin", "info");
      this.SanctionSettingForm.patchValue({
        SortForJudges:this.SanctionInfo.Settings.SortForJudges
    })
  }
  else {
    this.SanctionInfo.Settings.SortForJudges = this.SanctionSettingForm.value.SortForJudges;
    this._objService.saveSanctionSetting(this.SanctionInfo).subscribe((res)=>{
        this.resStatusMessage(res)},
        error =>this.errorMessage(error));
    
  }
    
  

  }
  resStatusMessage(res:any) {
    //console.log('res',res)
      if(res.success){
          Swal("Success !", res.message, "success");
          this.location.back();

      }else{
          Swal("Alert !", res.message, "info");
      }
      
  }
 

  errorMessage(objResponse:any) {
      Swal("Alert !", objResponse, "info");
  }
  cancel(){
    this.location.back();
  }
 
  

 
}
