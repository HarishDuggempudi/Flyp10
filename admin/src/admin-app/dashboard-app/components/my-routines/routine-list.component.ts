import { Component, OnInit, EventEmitter, ViewChild, } from "@angular/core";
import { UploadOutput, UploadInput, UploadFile, humanizeBytes, UploaderOptions } from 'ngx-uploader';
import { SportService } from '../sport/sport.service';
import Swal from 'sweetalert2';
import { Config } from '../../../shared/configs/general.config';
import { RegisterUserModel } from "../user-management/user.model";
import { Validators, FormBuilder, FormGroup, FormControl } from "@angular/forms";
import { RoutineModel } from "./routine.model";
import { RoutineService } from "./routines.service";
import * as moment from 'moment';
import { TeammateService } from '../teammate/teammate.service';
import { UserService } from "../user-management/user.service";
import { ShareButtons } from '@ngx-share/core';
import { Router } from '@angular/router'
import { JudgeSportModel } from '../user-management/user.model'
import { TermsPage } from '../../../../app/components/landing/conditons.component'
import { WalletService } from "../wallet/wallet.service";
import { WalletModel } from "../wallet/wallet.model";
import { EventMeetService } from "../events-meet/event-meet-service";
import { resolve } from "url";
import { identifierModuleUrl } from "@angular/compiler";
@Component({
  selector: "routine-list",
  templateUrl: "./routine-list.html",
  styleUrls: ['./routine-list.scss']
})
export class RoutineListComponent implements OnInit {
  @ViewChild('f') myNgForm;
  @ViewChild('rf') myNgrfForm;
  @ViewChild('ef') myNgevfForm
  options: UploaderOptions;
  formData: FormData;
  files: UploadFile[];
  reftitle: string
  uploadInput: EventEmitter<UploadInput>;
  humanizeBytes: Function;
  dragOver: boolean;
  routineForm: FormGroup;
  judgedroutineForm: FormGroup;
  ownsportObj: any = [];
  userownsportObj: any = [];
  teamownsportObj: any = [];
  sportObj: any = [];
  levelObj: any = [];
  eventObj: any = [];
  levelAllObj: any = [];
  eventAllObj: any = [];
  selectedlevel: string;
  selectedevent: string;
  walletObj: WalletModel = new WalletModel();
  loginuserinfo: RegisterUserModel;
  userDetails: RegisterUserModel = new RegisterUserModel();
  routineObj: RoutineModel = new RoutineModel();
  judgedRoutineObj: RoutineModel = new RoutineModel();
  isSubmitted: boolean = false;
  Routinefile: any;
  fileduration: string;
  routineList: any = [];
  judgedRoutineList: any = [];
  draggedfilename: string;
  fileformaterror: boolean = false;
  teammatelist: any = [];
  toggleSportlist: boolean = false;
  isRequiredJudgesNotes: boolean = false;
  showAll: boolean = false;
  sportid: string;
  sportval: JudgeSportModel = new JudgeSportModel()
  eventMeet: any = [];
  eventSport: any;
  selectedEventMeet: any;
  eventMeetLevels: any;
  eventMeetEvents: any;
  fileDurationError: boolean = false;
  draggedFileDuration: any;
  Technician: any;
  eventMeetGroupedUser: any[];
  eventmeetgroups: any[];
  filteredTeamMates: any = [];
  isSanctionEventMeet:boolean = false;
  IsAlreadyExists: boolean = false;
  constructor(private _objService: EventMeetService, private walletservice: WalletService, private route: Router, private share: ShareButtons, private userServices: UserService, private teammateservice: TeammateService, private sportService: SportService, private _formBuilder: FormBuilder, public routineservice: RoutineService) {
    let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.loginuserinfo = userInfo;
    this.routineForm = this._formBuilder.group({
      title: ['', Validators.required],
      sport: ['', Validators.required],
      level: ['', Validators.required],
      event: ['', Validators.required],
      eventMeet: [''],
      scoretype: ['1', Validators.required],
      submissionfor: ['1', Validators.required],
      htmlfile: [''],
      file: ['', Validators.required],
      description: [''],
      terms: [false],
      teammate: ['']
    });



    this.judgedroutineForm = this._formBuilder.group({
      title: ['', Validators.required],
      RoutineID: ['', Validators.required],
      description: [''],
      scoretype:[''],
      terms: [false],
    });

  }

  formatdate(date) {
    return moment(new Date(date)).format('L');
  }
  pad(num) {
    return ("0" + num).slice(-2);
  }
  formatduration(secs) {
    var minutes = Math.floor(secs / 60);
    secs = Math.floor(secs % 60)

    var hours = Math.floor(minutes / 60)
    minutes = minutes % 60;
    return this.pad(hours) + ":" + this.pad(minutes) + ":" + this.pad(secs);
  }
  ngOnInit() {
    // this.options = { concurrency: 1, maxUploads:2};
    this.files = []; // local uploading files array
    this.uploadInput = new EventEmitter<UploadInput>(); // input events, we use this to emit data to ngx-uploader
    this.humanizeBytes = humanizeBytes;
    this.getJudgesSport(this.loginuserinfo._id)
    this.getEventMeet()
    this.getAllSportDetail();
    this.getMywalletinfo();
    this.getConnectedTeammate();
    this.getUserDetail()

  }
  getEventMeet() {
    let eventMeetList = []
    this._objService.getenrollStartEndDate(this.loginuserinfo._id).subscribe(responseForEnrol => {
      //console.log('enrolled',responseForEnrol)
      if (responseForEnrol.success) {
        let eventMeet = responseForEnrol.result
        for (let i = 0; i < eventMeet.length; i++) {

          eventMeetList.push(eventMeet[i].MeetInfo)
        }

        //console.log('eventMeetList after ',eventMeetList)
        // this.totalItems = eventMeetList.length;
        this.eventMeet = eventMeetList;
        if(this.eventMeet.length > 0){
          this.routineObj.uploadingType = '2'
          this.routineObj.scoretype = '1'
        }
      }
      else {
        Swal("Alert!", "Unable to load signed event.", "info")
      }
    })

  }
  getMywalletinfo() {
    this.walletservice.getWalletInfo(this.loginuserinfo._id).subscribe(res => {

      if (res.length > 0) {
        this.walletObj = res[0];
      }

    }, err => {
      this.errorMessage(err)
    })
  }

  getUserDetail() {
    this.userServices.getUserDetail(this.loginuserinfo._id)
      .subscribe(resUser => {
        this.userDetails = resUser;
      },
        error => this.errorMessage(error));
  }
  addSportdetail(sportval) {
    this.sportval.sportName = sportval.sportName;
    this.sportval.level = sportval.level;
    this.sportval.docdescription = " ";
    this.sportval.active = true;
    this.sportval.sportid = this.sportid;
    this.sportval.levelid = this.selectedlevel;
    if (this.routineObj.teammate) {

      this.sportval.username = this.routineObj.teammate;
      this.sportval.userid = this.routineObj.userid;
    }
    else {

      this.sportval.username = this.loginuserinfo.username;
      this.sportval.userid = this.loginuserinfo._id;
    }


    this.userServices.saveuserSport(this.sportval)
      .subscribe(resUser => {

        this.isSubmitted = false;
        this.myNgForm.resetForm();
        this.myNgrfForm.resetForm();
        this.myNgevfForm.resetForm();
        this.routineForm.controls['submissionfor'].setValue("1");
        this.routineForm.controls['scoretype'].setValue("2");
        this.draggedfilename = '';
        this.routineObj.scoretype = "2";
        if(this.routineObj.uploadingType == '2'){
          this.routineObj.scoretype = "1";
          this.routineForm.controls['scoretype'].setValue("1");
        }
        this.routineObj.submissionfor = '1'
        this.getJudgesSport(this.loginuserinfo._id)
      },
        error => {
          this.errorMessage(error);
          this.isSubmitted = false;
          this.myNgForm.resetForm();
          this.myNgrfForm.resetForm();
          this.myNgevfForm.resetForm();
          this.routineObj.submissionfor == '1'
          this.routineForm.controls['scoretype'].setValue("2");
          this.routineForm.controls['submissionfor'].setValue("1");
          this.draggedfilename = '';
          this.routineObj.scoretype = "2";
          if(this.routineObj.uploadingType == '2'){
            this.routineObj.scoretype = "1";
            this.routineForm.controls['scoretype'].setValue("1");
          }
          this.getJudgesSport(this.loginuserinfo._id)
        });
  }
  getJudgesSport(resUser) {

    this.userServices.getJudgesSport(resUser)
      .subscribe(resSport => {
        this.ownsportObj = resSport;
        //console.log(this.ownsportObj)
        this.userownsportObj = resSport;
        let array = resSport;
        if (resSport.length <= 0) {
          this.toggleSportlist = true;
          this.showAll = true;
        }


      },
        error => this.errorMessage(error));
  }
  /*
    * on teammate change get teammate sports and teammate details;
   */
  onteammateChange() {

    /*
 * get teammate sports
 */


    /*
     * find teammate userid
     */
    let tempArray = []
    tempArray = this.teammatelist.filter(
      sport => sport.username === this.routineObj.teammate);
    if (tempArray.length > 0) {
      let tempTeammate = tempArray[0];
      this.routineObj.userid = tempTeammate._id;
      this.routineObj.uid = tempTeammate._id;
      this.routineObj.athlete = tempTeammate.username;
      this.routineObj.state = tempTeammate.address;
      // this.eventmeetgroups.forEach((group)=>{
      //   let comp = group.competitors.filter((com)=> com._id == tempTeammate._id)
      //   if(comp.length>0){
      //     this.routineObj.groupId = group._id;
      //   }

      // })
      this.userServices.getJudgesSport(tempTeammate._id)
        .subscribe(resSport => {
          this.teamownsportObj = resSport;
          this.ownsportObj = this.teamownsportObj
          let array = resSport;
          if (resSport.length <= 0) {
            this.toggleSportlist = true;
            this.showAll = true;
          }

        },
          error => this.errorMessage(error));
    }
    else {
      this.toggleSportlist = true;
      this.showAll = true;
    }
  }
  onLevelChange(val) {
    var tempArray = [];
    tempArray = this.levelAllObj.filter(item => item.level.toLowerCase() == val.toLowerCase())
    if (tempArray.length > 0) {
      this.selectedlevel = tempArray[0]._id;

    }
  }
  Judges: any = [];
  judgesCount: any = 1
  onEventChange(val) {
    var tempArray = [];
    tempArray = this.eventAllObj.filter(item => item.Event.toLowerCase() == val.toLowerCase())
    if (tempArray.length > 0) {
      this.selectedevent = tempArray[0]._id;
      let eventMeet = this.routineForm.value.eventMeet;
      this.routineObj.eventlevel = eventMeet.EventLevel
      let findjudges = eventMeet.Judges
      for (let i = 0; i < findjudges.length; i++) {
        let temp = findjudges[i]
        //console.log(temp)
        //temp.technician
        if (temp.Event == this.selectedevent) {
          this.Judges = temp.Judges
          this.judgesCount = this.Judges.length;
          this.routineObj.judges = this.Judges
          if (temp.Technician) {
            this.Technician = temp.Technician;
            this.routineObj.technician = this.Technician;
          }
        }
      }


    }

  }

  OnSportChange() {

    var sporttempObj = [];
    sporttempObj = this.sportObj.filter(item => item.sportName == this.routineForm.value.sport);
    this.levelObj = [];
    this.eventObj = [];
    if (sporttempObj.length > 0) {
      this.sportid = sporttempObj[0]._id;
      this.sportService.getSportDetailsbyMapping(this.sportid).subscribe(
        res => {

          if (res.length > 0) {
            let temp = res[0];
            let level = [];
            this.routineForm.controls["level"].setValue("");
            this.routineForm.controls["event"].setValue("");
            level = temp.level;
            this.levelObj = [];
            if (this.toggleSportlist) {
              /* for(let i=0;i<level.length;i++){
               let obj={"level":level[i]} ;
               this.levelObj.push(obj);
              } */
              //console.log('level',level,this.levelAllObj)
              for (let j = 0; j < level.length; j++) {
                let templevelid = level[j];
                for (let i = 0; i < this.levelAllObj.length; i++) {

                  if (this.levelAllObj[i]._id == templevelid) {
                    let obj = { "level": this.levelAllObj[i].level };
                    this.levelObj.push(obj);
                    ////console.log(this.levelObj)
                  }

                }
              }


            } else {
              let templevel = [];
              templevel = this.ownsportObj.filter(item => item.sportinfo.sportName == this.routineForm.value.sport);
              ////console.log('templevel',templevel,this.ownsportObj,this.routineForm.value.sport)
              if (templevel.length) {
                for (let l = 0; l < templevel.length; l++) {
                  let obj = { "level": templevel[l].levelinfo.level };
                  this.levelObj.push(obj);
                }
              } else {
                this.levelObj = [];
              }

            }
            let eventarray = temp.mappingFieldsVal;
            for (let e = 0; e < eventarray.length; e++) {
              let eventObj = eventarray[e];
              for (let f = 0; f < this.eventAllObj.length; f++) {
                if (eventObj.event == this.eventAllObj[f]._id) {
                  let event = { "event": this.eventAllObj[f].Event };
                  this.eventObj.push(event);
                }
              }
            }
            //console.log(eventarray,this.eventAllObj,this.eventObj)
            //this.eventObj=temp.mappingFieldsVal;
          }
        }, err => {
          this.errorMessage(err)
        })
      //alert(this.sportid);
    }
  }
  SubmissionChange() {

    if (this.routineObj.submissionfor == "2") {
      this.toggleSportlist = false;
      this.showAll = false;
      this.ownsportObj = this.teamownsportObj;
      this.routineForm.controls['eventMeet'].setValue('');

    }
    else {
      this.toggleSportlist = false;
      this.showAll = false;
      this.ownsportObj = this.userownsportObj;
    }
  }
  toggleSports($event) {

    if ($event.checked) {
      this.toggleSportlist = true;
    }
    else {
      this.toggleSportlist = false;
    }
  }
  onUploadOutput(output: UploadOutput): void {
    if (output.type === 'allAddedToQueue') {
      // when all files added in queue
      // uncomment this if you want to auto upload files when added
      // const event: UploadInput = {
      //   type: 'uploadAll',
      //   url: '/upload',
      //   method: 'POST',
      //   data: { foo: 'bar' }
      // };
      // this.uploadInput.emit(event);

      this.handleDragfile()

    } else if (output.type === 'addedToQueue' && typeof output.file !== 'undefined') { // add file to array when added
      this.files.push(output.file);
    } else if (output.type === 'uploading' && typeof output.file !== 'undefined') {
      // update current data in files array for uploading file
      const index = this.files.findIndex(file => typeof output.file !== 'undefined' && file.id === output.file.id);
      this.files[index] = output.file;

    } else if (output.type === 'removed') {
      // remove file from array when removed
      this.files = this.files.filter((file: UploadFile) => file !== output.file);
    } else if (output.type === 'dragOver') {
      this.dragOver = true;
      this.files = []
    } else if (output.type === 'dragOut') {
      this.dragOver = false;
    } else if (output.type === 'drop') {
      this.dragOver = false;
    }
  }
  handleDragfile() {
    let selectedRoutine = []

    let file = this.files[0].nativeFile; // <--- File Object for future use.
    if (file.size < 600000000) {
      this.Routinefile = file;
      selectedRoutine.push(file);

      var filetype = file.type;
      var index = filetype.indexOf("video");

      this.draggedfilename = file.name;
      if (index != -1) {
        this.fileformaterror = false;
        this.fileDurationError = false;
        var video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          var duration = video.duration;
          selectedRoutine[selectedRoutine.length - 1].duration = duration;

          checkDuration();
          //updateInfos();

        }
        var checkDuration = () => {
          this.draggedFileDuration = selectedRoutine[selectedRoutine.length - 1].duration;
          this.validateVideoFileDuration();

        };
        this.routineForm.controls['file'].setValue(file.name);
        this.draggedfilename = file.name;
        video.src = URL.createObjectURL(file);;
      }
      else {
        this.fileformaterror = true;
        this.fileDurationError = false;
      }
    } else {
      Swal("File size restriction!", "Selected file size should be less then 10MB", "error");
    }


  }

  startUpload(): void {
    const event: UploadInput = {
      type: 'uploadAll',
      url: 'http://ngx-uploader.com/upload',
      method: 'POST',
      data: { foo: 'bar' }
    };

    this.uploadInput.emit(event);
  }
  validateVideoFileDuration() {
    if (this.routineObj.scoretype == '3' && this.draggedFileDuration > 20) {
      this.fileDurationError = true;
      this.draggedfilename = '';
      // this.fileformaterror=true;
    }
  }
  cancelUpload(id: string): void {
    this.uploadInput.emit({ type: 'cancel', id: id });
  }

  removeFile(id: string): void {
    this.uploadInput.emit({ type: 'remove', id: id });
  }

  removeAllFiles(): void {
    this.uploadInput.emit({ type: 'removeAll' });
  }
  refreshRoutine() {
    this.routineservice.getRotineByuserId(this.loginuserinfo._id).subscribe(
      res => {
        this.routineList = res;

      },
      err => {
        this.errorMessage(err);
      }
    )
  }

  getAllSportDetail() {

    this.routineservice.getRotineByuserId(this.loginuserinfo._id).subscribe(
      res => {
        this.routineList = res;
        this.filterJudgedRoutine()
      },
      err => {
        this.errorMessage(err);
      }
    )
    this.sportService.getSportList(1000, 1)
      .subscribe(sportres => {

        this.sportObj = sportres.dataList;

      }, err => this.errorMessage(err));

    this.sportService.getLevelList(10000, 1)
      .subscribe(levelres => {
        this.levelAllObj = levelres.dataList;

      }, err => {
        this.errorMessage(err);
      });

    this.sportService.getSportsEvent(10000, 1)
      .subscribe(eventRes => {
        this.eventAllObj = eventRes.dataList;

      }, err => {
        this.errorMessage(err);
      })
  }
  setTitle(valtype) {
    this.routineObj.title = this.routineObj.sport + " " + this.routineObj.event + " " + moment().format("MM/DD/YY");
    this.reftitle = this.routineObj.sport + " " + this.routineObj.event + " " + moment().format("MM/DD/YY");
    if (valtype == 's') {
      this.OnSportChange();
      let tempArray = this.sportObj.filter(
        sport => sport.sportName === this.routineObj.sport);

      if (tempArray.length) {
        if (tempArray[0].addnotes) {
          this.isRequiredJudgesNotes = true;
          //  this.routineObj.scoretype="2";
        } else {
          this.isRequiredJudgesNotes = false;
          //this.routineObj.scoretype="2";
        }
        if (this.routineObj.scoretype == '1') {
          this.routineObj.scoretype = "2";
        }
      }
      //this.OnSportChange();
    } else {
      this.onEventChange(this.routineObj.event)
    }
  }
  errorMessage(objResponse: any) {

    if (objResponse.message) {
      Swal("Alert !", objResponse.message, "info");
    }
    else {
      Swal("Alert !", objResponse, "info");
    }

  }
  saveUserStatusMessage(objResponse: any) {
    if (this.routineObj.uploadingType == "2") {
      Swal({
        title: "Success",
        html: objResponse.message + "<br>.Do you want to upload another routine?",
        type: "success",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes",
        cancelButtonText: "No"
      }).then((result: any) => {

        if (result.value) {
          this.checkIsExistSport(1);
        }
        else {
          this.checkIsExistSport(2);
        }
      })
    }
    else {
      Swal("Success !", objResponse.message, "success");
      this.checkIsExistSport(2);
    }

  }
  checkIsExistSport(val) {
    let sportval = this.routineObj.sport;
    let levelval = this.routineObj.level;
    //console.log(this.ownsportObj,sportval,levelval)
    let tempArray = this.ownsportObj.filter(
      sport => sport.sportid === this.sportid && sport.levelid === this.selectedlevel);
    if (tempArray.length > 0) {
      this.isSubmitted = false;
      if (val == 1) {
        this.draggedfilename = '';
        this.routineForm.controls['submissionfor'].setValue(this.routineObj.submissionfor)
        // this.routineForm.controls.teammate.setValue('');

      }
      else {
        this.myNgForm.resetForm();
        this.myNgrfForm.resetForm();
        this.myNgevfForm.resetForm();
        this.routineForm.controls['submissionfor'].setValue("1");
        this.routineForm.controls['scoretype'].setValue("1");
        this.routineObj.submissionfor = '1'
        this.draggedfilename = '';

      }

      this.getAllSportDetail();
    } else {

      let tempobj = { "sportName": sportval, "level": levelval }
      this.addSportdetail(tempobj);
      this.getAllSportDetail();

    }

  }
  onFileChange($event) {
    let selectedRoutine = []
    let file = $event.target.files[0]; // <--- File Object for future use.

    this.Routinefile = file;
    selectedRoutine.push(file);
    var video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src);
      var duration = video.duration;
      selectedRoutine[selectedRoutine.length - 1].duration = duration;
      // updateInfos();

    }
    this.Routinefile = selectedRoutine[0];
    this.routineForm.controls['file'].setValue(file.name);
    this.draggedfilename = "";
    video.src = URL.createObjectURL(file);;
  }
  OnsubmitRoutine() {
    this.validateVideoFileDuration();
    this.isSubmitted = true;
    if (this.routineForm.value.submissionfor != '2') {
      if (this.routineForm.valid) {

        if (this.routineForm.value.terms) {
          if (this.routineObj.uploadingType == '1') {
            this.getSportPricing();
          } else {
            this.getPricingForEventMeet();
          }


        }
        else {
          Swal("Alert!", "You must agree to the terms and conditions before submitting your routine", "info");
        }
      } else {

      }
    }
    else {
      if (this.routineForm.value.teammate) {
        if (this.routineForm.valid) {

          if (this.routineForm.value.terms) {
            if (this.routineObj.uploadingType == '1') {
              this.getSportPricing();
            } else {
              this.getPricingForEventMeet();
            }

          }
          else {
            Swal("Alert!", "You must agree to the terms and conditions before submitting your routine", "info");
          }
        } else {

        }
      } else {
        Swal("Alert!", "Please select teammate", "info");
      }
    }

  }
  formatDollar(val) {
    if (val) {
      var amt = val.toString();
      if (amt.indexOf('.') != -1) {
        return amt
      } else {
        return amt + '.00'
      }
    }
    else {
      return '0.00'
    }

  }
checkExistRoutine() {
  return new Promise((resolve,reject)=>{
    this.routineObj.sid = this.sportid;
    this.routineObj.lid = this.selectedlevel;
    this.routineObj.eid = this.selectedevent;
    this.routineObj.eventMeetId = this.selectedEventMeet;
    if (this.routineObj.submissionfor == '1') {
      this.routineObj.uid = this.loginuserinfo._id;
    }
    this.routineservice.checkExistRoutine(this.routineObj).subscribe(async(res)=>{
      if(res.success && res.response.length > 0) {
        var routine = res.response[0];
        var judgesInfo = routine.judgeInfo;
        if (routine.routinestatus == '1' && judgesInfo.length > 0) {
          let judgeswithinappropriatestatus  = judgesInfo.filter(item => item.routinestatus == '4')
          let judgeswithForpoorquality  = judgesInfo.filter(item => item.routinestatus == '3')
          let totalCountForInappriateAndPQ = judgeswithinappropriatestatus.length + judgeswithForpoorquality.length;
          if(totalCountForInappriateAndPQ == judgesInfo.length) {
            this.IsAlreadyExists = false;
            resolve()
          } else {
            await this.duplicateroutineAlert()
            resolve()
          }
         
        } else {
          await this.duplicateroutineAlert()
          resolve()
        }
        
      
        
      }
      else {
        this.IsAlreadyExists = false
        resolve()
      }
  
    }) 
  })
  
}

duplicateroutineAlert() {
  return new Promise((resolve,reject)=>{
  Swal({
    title: "Duplicate routine!",
    html: "Are you sure want to continue?",
    type: "question",
    showCancelButton: true,
    confirmButtonColor: "#DD6B55",
    confirmButtonText: "Yes",
    cancelButtonText: "No"
  }).then(result => {
    if (result.value) {
      this.IsAlreadyExists = false
      resolve()
    }
    else {
      this.IsAlreadyExists = true;
      this.isSubmitted = false;
      this.myNgForm.resetForm();
      this.myNgrfForm.resetForm();
      this.myNgevfForm.resetForm();
      this.routineForm.controls['submissionfor'].setValue("1");
      this.routineForm.controls['scoretype'].setValue("1");
      this.routineObj.submissionfor = '1'
      this.draggedfilename = '';
      resolve()
    }
  })
})
}

  async submitRoutine(amount) {
    
    this.isSubmitted = true;
    if (this.routineForm.valid) {
      var debitMsg = '';
      if(Number(amount) > 0.01){
        debitMsg = "$ " +  this.formatDollar(amount) + " debited from your wallet.for routine submission."
      }
      Swal({
        title: "Are you sure want to submit?",
        html: "You will not be able to edit this routine after submit!<br> " +debitMsg,
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Submit!"
      }).then(async(result) => {
        if (result.value) {
          if(this.routineObj.uploadingType =='2'){
            await this.checkExistRoutine()
            }
            else {
              this.IsAlreadyExists = false
            }
          if(!this.IsAlreadyExists) {
          this.routineObj.duration = this.Routinefile.duration;
          this.routineObj.originalfilename = this.Routinefile.name;
          this.routineObj.filesize = this.Routinefile.size;
          this.routineObj.filetype = this.Routinefile.type;
          this.routineObj.routinestatus = '0';
          this.routineObj.sportid = this.sportid;
          this.routineObj.sid = this.sportid;
          this.routineObj.lid = this.selectedlevel;
          this.routineObj.eid = this.selectedevent;
          this.routineObj.eventMeetId = this.selectedEventMeet;
          this.routineObj.submittedBy = this.loginuserinfo.username;
          this.routineObj.submittedByID = this.loginuserinfo._id;

          if (this.routineObj.submissionfor == '1') {
            this.routineObj.userid = this.loginuserinfo._id;
            this.routineObj.uid = this.loginuserinfo._id;
            this.routineObj.athlete = this.loginuserinfo.username;
            this.routineObj.state = this.userDetails.address;
          }

          //console.log('this.routineObj',this.routineObj)
          this.routineservice.uploadRoutine(this.routineObj, this.Routinefile)
            .subscribe(resUser => {
              this.debitwallet(amount);
              this.saveUserStatusMessage(resUser)
            },
              err => {
                this.errorMessage(err);
              })
            }
        }
      });

    }
    else {

    }
  }
  debitwallet(amount) {
    
    if (Number(amount) > 0.01) {
      let walletObj = {
        "type": 'd',
        "userid": this.loginuserinfo._id,
        "balance": amount
      }
      this.walletservice.creditUserWallet(walletObj).subscribe(res => {

        this.saveTransaction(amount);
      }, err => {

      })
    }
  }

  uploadingforchange() {
    this.routineForm.get('sport').enable();
    this.myNgForm.resetForm();
    this.myNgrfForm.resetForm();
    this.myNgevfForm.resetForm();
    this.routineForm.controls['submissionfor'].setValue("1");
    this.routineForm.controls['scoretype'].setValue("2");
    if(this.routineObj.uploadingType =='2'){
      this.routineForm.controls['scoretype'].setValue("1");
    }
    this.routineObj.submissionfor = '1'
    this.draggedfilename = '';
  }
  saveTransaction(Amount) {

    //console.log('routine uploader name',this.routineObj)
    var desc = 'Routine submission - ' + this.reftitle + " - " + this.routineObj.athlete;
    var time = moment(new Date()).format("MM/DD/YYYY HH:mm:ss A").toString();
    var transactionObj = {
      userid: this.loginuserinfo._id,
      txn_amount: Amount,
      txn_type: 'd',
      txn_id: Math.random().toString(36).substr(2, 9),
      txn_token: '',
      txn_desc: desc,
      txn_date: time,
      promocode: '0'
    }
    this.walletservice.saveTransaction(transactionObj).subscribe(res => {

    }, err => {

    })
  }
  delete(id: string, routine) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this Routine!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        let objTemp: RoutineModel = new RoutineModel();
        objTemp._id = id;
        objTemp.deleted = true;
        this.routineservice.deleteRoutine(objTemp).subscribe(
          res => {
            this.getAllSportDetail();
            Swal("Deleted!", res.message, "success");
            this.getdeletedRoutineSportPricing(routine)
          },
          error => {
            Swal("Alert!", error, "info");
          }
        );
      }
    });
  }

  getPricingForEventMeet() {
    let eventObj = this.routineForm.value.eventMeet
    let NCompetitor = Number(eventObj.NcompetitorPrice)
    let SCompetitor = Number(eventObj.ScompetitorPrice);

    let competitor = 0;
    if (this.routineForm.value.scoretype == '1') {
      competitor = SCompetitor
    } else {
      competitor = NCompetitor
    }
    //console.log(competitor,"competitor",this.judgesCount)
    var walletbalance = Number(this.walletObj.balance);
    if (eventObj.EventLevel == '1' && (this.sportid == Config.WFigureSkating || this.sportid == Config.MFigureSkating)) {
      var sportprice = (Number(competitor) * Number(this.judgesCount + 1));
    }
    else {
      var sportprice = (Number(competitor) * Number(this.judgesCount));
    }
    if(Number(competitor) > 0.01){
    //console.log(sportprice,"sportprice")
    if (!isNaN(walletbalance) && !isNaN(sportprice)) {
      if (walletbalance >= sportprice) {
        this.submitRoutine(sportprice);
      } else {

        Swal("Alert!", "Insufficient balance;Please fill up you wallet;", "info");
      }

    }
    else {

      Swal("Alert!", "Insufficient balance;Please fill up your wallet;", "info");
    }
  }
  else {
    this.submitRoutine(Number(competitor));
  }
  }
  getSportPricing() {

    //console.log('sport id',this.sportid,this.routineForm.value)

    this.sportService.getSportPricingDetailbysportID(this.sportid, this.routineForm.value.scoretype)
      .subscribe(res => {

        //console.log('ressss',res)

        if (res.length > 0 && res[0].competitor) {
          var walletbalance = Number(this.walletObj.balance);
          var sportprice = Number(res[0].competitor);
          if (!isNaN(walletbalance) && !isNaN(sportprice)) {
            if (walletbalance >= sportprice) {
              this.submitRoutine(res[0].competitor);
            } else {

              Swal("Alert!", "Insufficient balance;Please fill up you wallet;", "info");
            }

          }
          else {

            Swal("Alert!", "Insufficient balance;Please fill up your wallet;", "info");
          }

        }
        else {
          Swal("Alert!", "There was a problem while uploading the routine; please contact our administrator.", "info");
        }
      }, err => {

      })
  }

  getConnectedTeammate() {

    /**
 * fetching teammate count
 * Teammate status
 * status 0-pending
 * status 2-completed
 */
    return new Promise<void>(async (resolve, reject) => {
      this.teammatelist = [];
      await this.getTeamMateByUID();
      await this.getRequestsByFID();
      console.log(this.teammatelist)
      resolve();
    })

  }
  getRequestsByFID() {
    return new Promise<void>(async (resolve, reject) => {
      this.teammateservice.getRequestsByFID(this.loginuserinfo._id).subscribe(
        response => {
          if (response.reqData) {
            let res = response.reqData
            if (res.length) {

              for (let i = 0; i < res.length; i++) {
                let temp = res[i];
                if (temp.status == '2') {
                  // this.teammatelist.push(temp)
                  this.getUsersByID(temp.UID, this.teammatelist);
                }
                if (i == res.length - 1) {
                  resolve();
                }
              }
            }
            else {
              resolve()
            }
          }
          else{
            resolve()
          }
        }, err => {
          this.errorMessage(err)
        })
    })
  }
  getTeamMateByUID() {
    return new Promise<void>(async (resolve, reject) => {
      this.teammateservice.getTeamMateByUID(this.loginuserinfo._id).subscribe(
        response => {
          if (response.reqData) {
            let res = response.reqData
            if (res.length) {

              for (let i = 0; i < res.length; i++) {
                let temp = res[i];
                if (temp.status == '2') {
                  this.getUsersByID(temp.FID, this.teammatelist);
                  //this.teammatelist.push(temp)
                }
                if (i == res.length - 1) {
                  resolve()
                }
              }
            }
            else{
              resolve()
            }


          }
          else {
            resolve()
          }
        }, err => {
          this.errorMessage(err)
        })
    })
  }

  /** teammate count fetching end here */
  getUsersByID(id: string, arr: any[]) {
    this.teammateservice.getUserByUserID(id).subscribe(data => {
      arr.push(data);
      console.log(this.teammatelist,"teammatelist")
      this.teammatelist.sort((a, b) => a.firstName.localeCompare(b.firstName))
    })
  }
  open(id: string) {
    this.route.navigate(['/share', id]);
  }
  commentPage(routineId: string) {
    this.route.navigate(['/routine/details', routineId]);
  }


  getdeletedRoutineSportPricing(routine) {
    // console.log(routine)

    if (routine.uploadingType == '1') {
      this.sportService.getSportPricingDetailbysportID(routine.sportid, routine.scoretype)
        .subscribe(res => {

          if (res) {
            this.RefundWallet(res[0], routine)
            //this.pricinginfo=res[0];
          }

        }, err => {

        })
    } else {
      //eventMeetId
      this._objService.getEventMeet(routine.eventMeetId).subscribe(res => {
        if (res.success) {
          let result = res.result
          let price = 0
          if (routine.scoretype == '1') {
            price = result.ScompetitorPrice
          } else {
            price = result.NcompetitorPrice
          }
          
          let findjudges = result.Judges
          for (let i = 0; i < findjudges.length; i++) {
            let temp = findjudges[i]
            //console.log(temp)
            if (temp.Event == routine.eid) {
              let Judges = temp.Judges
              let judgesCount = Judges.length
              let Amt = (Number(price) * Number(judgesCount))
              let response = {
                competitor: Amt,
                judge: Amt
              }
   if(Number(price) > 0.01){
              this.RefundWallet(response, routine)
           }
            }
          }
        }
      })
    }

  }

  RefundWallet(response, routine) {
    if (Number(response.competitor) > 0.01) {
      let walletObj = {
        "type": 'c',
        "userid": routine.submittedByID,
        "balance": response.competitor
      }

      this.walletservice.creditUserWallet(walletObj).subscribe(res => {

        //Swal("Info!", res.message, "info");
        this.saveRefundTransaction(response.competitor, routine);
      }, err => {

      })
    }
  }

  saveRefundTransaction(Amount, routine) {
    var desc = 'Refund -' + routine.title;
    var time = moment(new Date()).format("MM/DD/YYYY HH:mm:ss A").toString();
    var transactionObj = {
      userid: routine.userid,
      txn_amount: Amount,
      txn_type: 'c',
      txn_id: Math.random().toString(36).substr(2, 9),
      txn_token: '',
      txn_desc: desc,
      txn_date: time,
      promocode: '0'
    }

    this.walletservice.saveTransaction(transactionObj).subscribe(res => {

    }, err => {

    })
  }

  OnjudgedsubmitRoutine() {
    this.isSubmitted = true;
    if (this.judgedroutineForm.valid) {

      if (this.judgedroutineForm.value.terms) {
        this.getSportPricingforReSubmission();
      }
      else {
        Swal("Alert!", "You must agree to the terms and conditions before submitting your routine", "info");
      }
    } else {

    }

  }
  getSportPricingforReSubmission() {

    //console.log('sport id',this.sportid,this.routineForm.value)

    this.sportService.getSportPricingDetailbysportID(this.judgedRoutineObj.sportid, this.judgedRoutineObj.scoretype)
      .subscribe(res => {

        //console.log('ressss',res)

        if (res.length > 0 && res[0].competitor) {
          var walletbalance = Number(this.walletObj.balance);
          var sportprice = Number(res[0].competitor);
          if (!isNaN(walletbalance) && !isNaN(sportprice)) {
            if (walletbalance >= sportprice) {
              this.submitJudgedRoutine(res[0].competitor);
            } else {

              Swal("Alert!", "Insufficient balance;Please fill up you wallet;", "info");
            }

          }
          else {

            Swal("Alert!", "Insufficient balance;Please fill up your wallet;", "info");
          }

        }
        else {
          Swal("Alert!", "There was a problem while uploading the routine; please contact our administrator.", "info");
        }
      }, err => {

      })
  }
  filterJudgedRoutine() {
    if (this.routineList.length > 0) {
      this.judgedRoutineList = this.routineList.filter((item) => item.routinestatus == '1');
      ///console.log(this.judgedRoutineList)
    }
  }
  setJudgedroutineTitle() {
    if (this.judgedRoutineObj.RoutineID) {
      let tempArray = [];
      tempArray = this.judgedRoutineList.filter(item => item._id == this.judgedRoutineObj.RoutineID);
      if (tempArray.length > 0) {
        let routineObj = tempArray[0];
        //console.log(routineObj)
        this.judgedRoutineObj.sportid = routineObj.sportid;
        this.judgedRoutineObj.state = routineObj.state;
        this.judgedRoutineObj.submissionfor = '1';
        this.judgedRoutineObj.submittedBy = this.loginuserinfo.username;
        this.judgedRoutineObj.active = true;
        this.judgedRoutineObj.athlete = this.loginuserinfo.username;
        this.judgedRoutineObj.duration = routineObj.duration;
        this.judgedRoutineObj.eid = routineObj.eid;
        this.judgedRoutineObj.event = routineObj.event;
        this.judgedRoutineObj.filesize = routineObj.filesize;
        this.judgedRoutineObj.filetype = routineObj.filetype;
        this.judgedRoutineObj.level = routineObj.level;
        this.judgedRoutineObj.lid = routineObj.lid;
        this.judgedRoutineObj.originalfilename = routineObj.originalfilename;
        this.judgedRoutineObj.routinestatus = '0';
        this.judgedRoutineObj.scoretype = routineObj.scoretype;
        this.judgedRoutineObj.sid = routineObj.sid;
        this.judgedRoutineObj.sport = routineObj.sport;
        this.judgedRoutineObj.submittedByID = this.loginuserinfo._id;
        this.judgedRoutineObj.uid = this.loginuserinfo._id;
        this.judgedRoutineObj.userid = this.loginuserinfo._id;
        this.judgedRoutineObj.assignedTo = routineObj.assignedTo;
        this.judgedRoutineObj.isConverted = routineObj.isConverted ? routineObj.isConverted : '';
        this.judgedRoutineObj.routinePropertystring1 = routineObj.routineProperty.routineExtension;
        this.judgedRoutineObj.routinePropertystring2 = routineObj.routineProperty.routinePath;
        this.judgedRoutineObj.videofilename = routineObj.videofilename;
        this.judgedRoutineObj.thumbnailPath = routineObj.thumbnailPath ? routineObj.thumbnailPath : ''
        this.judgedRoutineObj.convertedfileName = routineObj.convertedfileName ? routineObj.convertedfileName : '';
        if (routineObj.isResubmitted == '1') {

          this.judgedRoutineObj.sourceID = routineObj.sourceID ? routineObj.sourceID : this.judgedRoutineObj.RoutineID
        } else {
          this.judgedRoutineObj.sourceID = this.judgedRoutineObj.RoutineID;

        }
        this.judgedRoutineObj.assignedTo = routineObj.assignedTo;
        this.judgedRoutineObj.isResubmitted = '1';
        this.judgedRoutineObj.title = routineObj.sport + " " + routineObj.event + " " + moment().format("MM/DD/YY");
        this.reftitle = this.judgedRoutineObj.sport + " " + this.judgedRoutineObj.event + " " + moment().format("MM/DD/YY");
      }
    }
  }
  submitJudgedRoutine(amount) {
    this.isSubmitted = true;
    var debitMsg = '';
    if(Number(amount) > 0.01){
      debitMsg ="$ "+ this.formatDollar(amount) + " debited from your wallet.for routine submission."
    }
    if (this.judgedroutineForm.valid) {

      Swal({
        title: "Are you sure want to submit?",
        html: "You will not be able to edit this routine after submit!<br> " + debitMsg,
        type: "question",
        showCancelButton: true,
        confirmButtonColor: "#DD6B55",
        confirmButtonText: "Yes, Submit!"
      }).then(result => {
        if (result.value) {


          //  //console.log(this.routineObj)
          this.routineservice.uploadjudgedRoutine(this.judgedRoutineObj)
            .subscribe(resUser => {
              this.routineObj = this.judgedRoutineObj
              this.debitwallet(amount);
              this.saveUserStatusMessage(resUser)
            },
              err => {
                this.errorMessage(err);
              })
        }
      });

    }
    else {

    }
  }
  toggleCustomshareButton: boolean = false;
  selectedsharebuttion: any
  secondaryTeammatelist: any = [];
  toggleScustomshare(i) {
    this.toggleCustomshareButton = true;
    this.selectedsharebuttion = i;
  }

  shareRoutine(routine, type) {
    if (this.teammatelist.length > 0) {
      if (type == 1) {
        this.toggleCustomshareButton = false;
        let sharedteammate = this.teammatelist;
        this.selectedsharebuttion = null
        this.insertSharedRoutine(routine, sharedteammate)
      } else {

      }
    } else {
      Swal("Info", "No teammates found.", "info")
    }

  }
  insertSharedRoutine(routine, teammatelist) {

    let sharedwith = []
    for (let i = 0; i < teammatelist.length; i++) {
      let temp = teammatelist[i]
      sharedwith.push(temp._id);
      if (i == teammatelist.length - 1) {
        let data = {
          RoutineID: routine._id,
          SubmittedBy: routine.uid,
          sharedwith: sharedwith
        }
        this.routineservice.shareRoutine(data).subscribe(res => {
          //console.log("res",res)
          Swal("Success!", res.message ? res.message : res, "success");
          this.pushNotificationbyuid(sharedwith, routine)
          window.scrollTo(0, 0);
        }, err => {
          //console.log("err",err)
          Swal("Alert!", err.message ? err.message : err, "info")
        })
      }
    }

  }
  shareselectedTeammates(teammatelist) {
    // //console.log('teammate',teammatelist)
    let sharedwith = []
    let routine = this.selectedShareRoutine
    for (let i = 0; i < teammatelist.length; i++) {
      let temp = teammatelist[i]

      if (temp.isClicked) {
        sharedwith.push(temp._id);

      } else {

      }
      if (i == teammatelist.length - 1) {
        if (sharedwith.length > 0) {
          let data = {
            RoutineID: routine._id,
            SubmittedBy: routine.uid,
            sharedwith: sharedwith
          }
          this.routineservice.shareRoutine(data).subscribe(res => {
            // //console.log("res",res)
            Swal("Success!", res.message ? res.message : res, "success");
            this.pushNotificationbyuid(sharedwith, routine)
            window.scrollTo(0, 0)
          }, err => {
            // //console.log("err",err)
            Swal("Alert!", err.message ? err.message : err, "info")
          })
        } else {
          Swal("Alert!", "Please select teammate", "info")
        }

      }
    }
  }
  selectedShareRoutine: any = {}
  clearPopover(routine) {
    this.secondaryTeammatelist = [];
    ////console.log(this.secondaryTeammatelist,this.teammatelist)
    let temp = []
    for (let i = 0; i < this.teammatelist.length; i++) {
      let tempobj = this.teammatelist[i];
      tempobj.isClicked = false;
      temp.push(tempobj)
      if (i == this.teammatelist.length - 1) {
        this.secondaryTeammatelist = temp
      }
    }

    this.selectedsharebuttion = null;
    this.toggleCustomshareButton = false;
    this.selectedShareRoutine = routine;
  }
  pushNotificationbyuid(userArray, routine) {
    for (let i = 0; i < userArray.length; i++) {
      let msg = routine.athlete + " shared routine with you."
      this.pushNotification(msg, userArray[i]);
    }
  }
  pushNotification(msg, uid) {
    const notificationitem = {
      UID: uid,
      type: 5,
      read: false,
      message: msg,
      notificationProperties: {
        FID: '',
        RID: ''
      }
    }
    this.teammateservice.saveNotification(notificationitem).subscribe(response => {
      ////console.log('Notification saved')
    }, err => {
      ////console.log('err ', err);
    })
  }
  async onEventMeetNameChange(event) {
    this.eventMeetLevels = []
    this.eventMeetEvents = []
    //console.log('event',event)
    this.routineForm.controls['level'].setValue('');
    this.routineForm.controls['event'].setValue('');
    this.routineForm.controls['sport'].setValue('');
    for (let i = 0; i < this.eventMeet.length; i++) {
      if (event.value.EventName == this.eventMeet[i].EventName) {
if(this.eventMeet[i].SanctionMeet){
  this.isSanctionEventMeet = this.eventMeet[i].SanctionMeet?true:false;
 // this.routineObj.SanctionRoutine = true;
  this.routineForm.controls['scoretype'].setValue(this.eventMeet[i].scoretype);
}
          
        this.routineForm.get('sport').setValue(this.eventMeet[i].SportName)
        this.sportid = this.eventMeet[i].Sport;
        this.routineForm.get('sport').disable();
        this.selectedEventMeet = this.eventMeet[i];
      }
    }

    for (let i = 0; i < this.levelAllObj.length; i++) {

      for (let j = 0; j < this.selectedEventMeet.Levels.length; j++) {

        if (this.levelAllObj[i]._id == this.selectedEventMeet.Levels[j]) {

          this.eventMeetLevels.push(this.levelAllObj[i])

        }

      }
    }

    for (let i = 0; i < this.eventAllObj.length; i++) {

      for (let j = 0; j < this.selectedEventMeet.Events.length; j++) {

        if (this.eventAllObj[i]._id == this.selectedEventMeet.Events[j]) {

          this.eventMeetEvents.push(this.eventAllObj[i])

        }

      }
    }
    if (this.routineObj.submissionfor == '2') {
      await this.getConnectedTeammate();
      let eventObj = this.routineForm.value.eventMeet;
      this.routineObj.eventlevel = eventObj.EventLevel;
      console.log(this.teammatelist,"teammatelist")
      if (eventObj.EventLevel == '0' && (this.sportid == Config.WFigureSkating || this.sportid == Config.MFigureSkating)) {
     
      this.getEventMeetGrouppedCompetitors();
      }
    }
    //console.log('eventMeetEvents',this.eventMeetEvents)

  }
  getEventMeetGrouppedCompetitors() {
    this.eventMeetGroupedUser = [];
    this.eventmeetgroups = []
    let eventId = this.routineForm.value.eventMeet._id;
    this.routineservice.getEventmeetGroupByeventId(eventId).subscribe((res) => {
      if (res.success) {
        this.eventmeetgroups = res.result;
        if (this.eventmeetgroups.length > 0) {
          this.eventmeetgroups.forEach((comp, i) => {
            comp.competitors.forEach((c) => {
              this.eventMeetGroupedUser.push(c);
            })
            if (i == this.eventmeetgroups.length - 1) {
              this.getGroupedTeammates();
            }
          })
        }
        else {
          this.teammatelist = [];
        }
      }

    })

  }
  getGroupedTeammates() {
    this.filteredTeamMates = []; 
    if (this.eventMeetGroupedUser.length > 0) {
      this.teammatelist.forEach((teammate, i) => {
        let groupedUser = this.eventMeetGroupedUser.filter(user => user._id == teammate._id)
        if (groupedUser.length > 0) {
          this.filteredTeamMates.push(groupedUser[0])
        }
        if (i == this.teammatelist.length - 1) {
          this.teammatelist = this.filteredTeamMates;
        }
      });
    }
    else {
      this.teammatelist = this.filteredTeamMates;
    }
  }

}
