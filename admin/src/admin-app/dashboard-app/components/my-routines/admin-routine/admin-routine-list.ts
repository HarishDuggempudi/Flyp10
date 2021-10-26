import { Component, OnInit} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";


@Component({
  selector: "admin-routine-list",
  templateUrl: "./admin-routine-list.html",
  styleUrls: ['../routine-list.scss']
})
export class AdminRoutineListComponent implements OnInit {
  Isflyp10routine: boolean = true;
  Iseventmeetroutine: boolean = false;
  uploadingType: any;

    constructor(private router:Router,private activatedRoute:ActivatedRoute){
      //console.log(this.router.url,this.router)
      let eventmeet = this.router.url.indexOf("eventmeet");
      let flyp10 =this.router.url.indexOf("flyp10");
        if(eventmeet > 0){
          this.Isflyp10routine  = false;
          this.Iseventmeetroutine = true;
        }
        else {
          
          this.Isflyp10routine  = true;
          this.Iseventmeetroutine = false;
        }
      
     // this.router.navigate(['/admin-routine/routine-management/newRoutine/flyp10'])
    }
    flyp10navLinks: any[] = [
       {label: 'New Routine', path: '/admin-routine/routine-management/newRoutine/flyp10'}, 
       {label: 'Judged Routine', path: '/admin-routine/routine-management/judgedRoutine/flyp10'},
       {label: 'Assigned Routine', path: '/admin-routine/routine-management/assignedRoutine/flyp10'},
       {label: 'In Complete Routine', path: '/admin-routine/routine-management/incompletedRoutine/flyp10'},
       {label: 'In Appropriate Routine', path: '/admin-routine/routine-management/inappropriateRoutine/flyp10'},  
      
      // {label: 'Setting', path: '/profile/setting'}
  ];
  eventmeetnavLinks: any[] = [
    {label: 'New Routine', path: '/admin-routine/routine-management/newRoutine/eventmeet'}, 
    {label: 'InQueue Routine', path: '/admin-routine/routine-management/QueueRoutine/eventmeet'},
    {label: 'Judged Routine', path: '/admin-routine/routine-management/judgedRoutine/eventmeet'},
  
   // {label: 'Review Event Meet Routine', path: '/admin-routine/routine-management/Meet-Routine/eventmeet'}
   // {label: 'Setting', path: '/profile/setting'}
];

flyp10routine() {
  this.Isflyp10routine  = true;
  this.Iseventmeetroutine = false;
  this.router.navigate(['/admin-routine/routine-management/newRoutine/flyp10'])
}
eventmeetroutine() {
  this.Isflyp10routine  = false;
  this.Iseventmeetroutine = true;
  this.router.navigate(['/admin-routine/routine-management/newRoutine/eventmeet'])
}
    ngOnInit(): void {  
       
    }

}