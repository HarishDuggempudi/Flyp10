import { Component, OnInit, EventEmitter ,ViewChild } from "@angular/core";
import {ActivatedRoute, Router } from '@angular/router';
import {RoutineService} from '../my-routines/routines.service';
import {RoutineModel,RoutineResponse} from '../my-routines/routine.model';
@Component({
    selector: "sharepage",
    templateUrl: "./sharepage.html",
    styleUrls: ['./sharepage.scss']
  })

  export class SharePage implements OnInit {
    routineId:string;
    routineObj:RoutineModel= new RoutineModel();
    constructor(private router: Router,private activatedRoute: ActivatedRoute ,private routineservice: RoutineService){
      activatedRoute.params.subscribe(param => this.routineId = param['routineId']);
      
    }
    ngOnInit(){
       this.getRoutineDetail();
    }
    getRoutineDetail(){
      this.routineservice.getRoutinebyroutineid(this.routineId).subscribe(
        res=>{
          this.routineObj=res;
          
        },
        err=>{
          
        }
      )
    }
}
    