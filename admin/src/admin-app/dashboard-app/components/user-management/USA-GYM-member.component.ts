import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {Component, OnInit,ViewChild} from '@angular/core';
import {RegisterUserModel, UserResponse} from "../user-management/user.model";
import {UserService} from "../user-management/user.service";
import {Config} from "../../../shared/configs/general.config";
import { SportService } from '../sport/sport.service';
import {Validators, FormBuilder, FormGroup, FormControl,FormArray} from "@angular/forms";
import {JudgeSportModel} from '../user-management/user.model'
import { MatCheckbox } from '@angular/material';
@Component({
    selector: 'usa-gym-membership',
    templateUrl: './USA-GYM-member.component.html'
    
})

export class USAGYMMemberComponent implements OnInit {
    userId:string;  
    objUser:RegisterUserModel = new RegisterUserModel();
	
    isSubmitted: boolean = false;
    objResponse:UserResponse = new UserResponse();
    imageSrc:string=Config.DefaultAvatar;
    usersportObj:any=[]; 
    sportObj:any=[];
    levelObj:any=[];
	levelAllObj:any=[];
	selectedsportid:string;
  selectedlevelid:string;
  MFigureSkating:string = Config.MFigureSkating;
  WFigureSkating:string = Config.WFigureSkating;
    SportjudgeForm: FormGroup;   
    loginobjUser:RegisterUserModel = new RegisterUserModel();
    
    MemberForm: FormGroup;
	
   /* End File Upload handle */
    @ViewChild('f') myNgForm;
    //@ViewChild('technician') private technician: MatCheckbox;
    //@ViewChild('judge') private judge: MatCheckbox;
    technician:boolean = false;
    judge:boolean = false;
  uploadingFor: boolean = true;
  uploadingForValue: string = '0';
  memberType :any = [];
  discipline :any =[];
  memberObj ={};
    isUSAGMember: boolean;
  
	//@ViewChild('sf') myNgForm;
    constructor(private _objUserService:UserService,private activatedRoute: ActivatedRoute, private router: Router,private _formBuilder:FormBuilder) {
        this.activatedRoute.queryParams.subscribe(param=>{
            this.userId=param['username'];
          })
        this.MemberForm=this._formBuilder.group({
            // SanctionID:['',Validators.required],
             MemberID: ['',Validators.required],
             Email:['',Validators.required]
            //MemberType:['',Validators.required],
           // Discipline :['',Validators.required]
            
          });
          this.memberType = [
              {
                value:'a',
                  type:'Athlete'
              },
              {
                  value:'p',
                  type:'Professtional'
              },
              {
                  value:'c',
                  type:'Coach'
              },
              {
                  value:'j',
                  type:'Judge'
              }
          ]
       this.discipline = [
           {
               value:'m',
               disicipline:'Men'
           },
           {
            value:'w',
            disicipline:'Women'
        },
        {
            value:'r',
            disicipline:'Rhythmic'
        },
        {
            value:'t',
            disicipline:'Trampoline & Tumbling'
            
        },
        {
            value:'g',
            disicipline:'Gymnastics for all'
            
        },
       
       ]
        //this.tfaEnabled = userInfo.twoFactorAuthEnabled;
    }
	  
    ngOnInit() {
        this.getUSAGMember()
              
            }
            getUSAGMember() {
                return new Promise((reject,resolve)=>{
                    this._objUserService.getUSAGMember(this.userId).subscribe((res)=>{
                        if(res.success){
                            if(res.data && res.data.MemberID){
                                this.MemberForm.patchValue({
        
                                    "MemberID": res.data.MemberID,
                                    Email: res.data.Email
                                 
                      
                      
                                  });
                             
                               this.isUSAGMember = true
                                resolve()
                            }  else {
                                this.isUSAGMember = false
                                resolve()
                            }
                          
                        }  else {
                            this.isUSAGMember = false
                            resolve()
                        }
                      
                    })
                })
              
            }
            updateUSAGMember(){
                this.memberObj['MemberID'] = this.MemberForm.value.MemberID;
                this.memberObj['Email'] = this.MemberForm.value.Email
                //this.memberObj['Flyp10UserID'] = this.userId
                this._objUserService.updateUSAGMember(this.userId,this.memberObj).subscribe((res)=>{
                    console.log(res)
                    if(res.success) {
                         Swal("Success !", "USAG MemberID updated successfully", "success");
                          //localStorage.setItem('memberid', 'true');
                          this.router.navigate(['/user-management']); 
                       
                        
                    }
                    else {
                        Swal("Alert !", "USAG MemberID is not verified", "info");
                        this.router.navigate(['/profile']);
                    } 
                })
            }
    verifythemembership() {
        console.log(this.MemberForm.value)
        // this.memberObj.SanctionID = this.MemberForm.value.SanctionID;
        // this.memberObj.MemberType = this.MemberForm.value.MemberType;
        this.memberObj['MemberID'] = this.MemberForm.value.MemberID;
        this.memberObj['Email'] = this.MemberForm.value.Email
        this.memberObj['Flyp10UserID'] = this.userId
        // this.memberObj.Discipline = this.MemberForm.value.Discipline;
        this._objUserService.verifyMembership(this.memberObj).subscribe((res)=>{
            console.log(res)
            if(res.success) {
                this.router.navigate(['/user-management']); 
                Swal("Success !", "USAG MemberID verified successfully", "success");
              //  window.location.reload();
            }
            else {
                Swal("Alert !", "USAG MemberID is not verified", "info");
            } 
        })
    }
    CancelForm() {
        this.router.navigate(['/user-management']); 
    }
    
}

