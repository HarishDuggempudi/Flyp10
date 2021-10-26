import { Component, OnInit } from "@angular/core";
import { SportService } from "./sport.service";
import { SportsEventResponse,EventModel,SportsElementResponse,ElementModel} from "./sport.model";
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { ActivatedRoute,Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "sport-event-details-list",
  templateUrl: "./sport-event-details.html"
})
export class EventDetailsComponent implements OnInit {
  dataSource: any;
  displayedColumns = ["SN", "Element","SkillValue","Factor",'active',"Actions"];
  //objListResponse: SportsEventResponse;
  error: any;
  eventid: string;
  showForm: boolean = false;
  /* Pagination */
  pageSizeOptions = [5, 10, 25, 50, 100];  
  perPage: number = 10;
  currentPage: number = 1;
  totalItems: number = 1;
  preIndex: number = 0;
  eventList:any=[];
  elementVal:any=[]
 eventObj:EventModel = new EventModel();
  count: number=0;
  constructor(private router: Router, private _objService: SportService,private activatedRoute:ActivatedRoute) {
	   activatedRoute.params.subscribe(param => this.eventid = param['eventid']);
  }
  ngOnInit() {
    this.getSportsElementList();
	this.getEventList()
	this.getSporteventDetail();
  }
  getSporteventDetail() {
      this._objService.getSporteventDetail(this.eventid)
          .subscribe(res =>{
              this.eventObj = res
          } ,
              error => this.errorMessage(error));
  }
  getSportsElementList() {

	//  console.log("this.eventid",this.eventid)
	   this._objService.getElementByevent(this.eventid).subscribe(res=>{
		  this.elementVal=res
		  this.bindList(res);
		 
	  },err=>{
		  console.log(err)
	  })
  }
  onEventChanged(){
	  //alert(this.eventObj._id)
	   this.eventid=this.eventObj._id
	   this.getSportsElementList();
  }
  getEventList(){ 
	this._objService.getAllSportsEvent().subscribe(res=>{
		this.eventList=res;
		//console.log(res)
	},err=>{
		Swal("Alert","Unable to load event data","info")
	})
}
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim(); // Remove whitespace
    filterValue = filterValue.toLowerCase(); // MatTableDataSource defaults to lowercase matches
    this.dataSource.filter = filterValue;
  };

  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }

  bindList(objRes) {
  //  console.log('objRes',objRes)
    //this.objListResponse = objRes;
    // var tempArr=[]
    // for(let a=this.count;a<this.count+this.perPage;a++){
    //   tempArr.push(objRes[a])
    // }
    this.totalItems = objRes.length;
    this.dataSource = new MatTableDataSource(objRes);
    this.preIndex = (this.perPage * (this.currentPage - 1));
    this.perPage=10
  }

  edit(id: string) {
  
    this.router.navigate(["/sport/element-editor", id]);
  }

  addSportsElement() {
    this.router.navigate(["/sport/element-editor"]);
  }

  delete(id: string) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this Element!",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        let objTemp: ElementModel = new ElementModel();
        objTemp._id = id;
        objTemp.deleted = true;
        this._objService.deleteSportsElement(objTemp).subscribe(
          res => {
            this.getSportsElementList();
            Swal("Deleted!", res.message, "success");
          },
          error => {
            Swal("Alert!", error, "info");
          }
        );
      }
    });
  }

  pageChanged(event: any) {
    console.log('events',event)
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    
    this.count=this.count+event.pageSize;
    this.getSportsElementList();
  }
}

