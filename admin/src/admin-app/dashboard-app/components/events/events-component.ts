import { Component, OnInit, ViewChild, NgZone } from "@angular/core";
import {EventsService} from "./events.service"
import { MatPaginator, MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import Swal from "sweetalert2";
import {Config} from "../../../shared/configs/general.config";
import {RegisterUserModel} from "../user-management/user.model";
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
import {EventdataModel} from './events.model';
import { UploadCSVDialog } from './upload-csv-dialog';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import swal from "sweetalert2";
import * as moment from 'moment';
import {UserService} from "../user-management/user.service";
@Component({
  selector: "events-component",
  templateUrl: "./events-component.html",
  styleUrls: ['./events.scss']
})
export class EventsComponent implements OnInit {
  calendarOptions: Options;
  @ViewChild(CalendarComponent) ucCalendar: CalendarComponent; 
  @ViewChild('content1') content1: NgbModal; 

  loginuserinfo:RegisterUserModel
	displayEvent:any;
	title:any;
	start:any;
	country:any;
	ownsportObj:any[]=[];
	displayedColumns = ["Event", "State", "Starts", "Ends", "addrem"];
  eventList: any[] =[];
  futureeventList:any=[];
  allEvents: any[] =[];
	faqlist:any=[];
	dataSource:any=[];
	sports = [];
	eventss:any[]=[];
	states = [
		{
				"name": "Alabama",
				"abbreviation": "AL"
		},
		{
				"name": "Alaska",
				"abbreviation": "AK"
		},
		{
				"name": "American Samoa",
				"abbreviation": "AS"
		},
		{
				"name": "Arizona",
				"abbreviation": "AZ"
		},
		{
				"name": "Arkansas",
				"abbreviation": "AR"
		},
		{
				"name": "California",
				"abbreviation": "CA"
		},
		{
				"name": "Colorado",
				"abbreviation": "CO"
		},
		{
				"name": "Connecticut",
				"abbreviation": "CT"
		},
		{
				"name": "Delaware",
				"abbreviation": "DE"
		},
		{
				"name": "District Of Columbia",
				"abbreviation": "DC"
		},
		{
				"name": "Federated States Of Micronesia",
				"abbreviation": "FM"
		},
		{
				"name": "Florida",
				"abbreviation": "FL"
		},
		{
				"name": "Georgia",
				"abbreviation": "GA"
		},
		{
				"name": "Guam",
				"abbreviation": "GU"
		},
		{
				"name": "Hawaii",
				"abbreviation": "HI"
		},
		{
				"name": "Idaho",
				"abbreviation": "ID"
		},
		{
				"name": "Illinois",
				"abbreviation": "IL"
		},
		{
				"name": "Indiana",
				"abbreviation": "IN"
		},
		{
				"name": "Iowa",
				"abbreviation": "IA"
		},
		{
				"name": "Kansas",
				"abbreviation": "KS"
		},
		{
				"name": "Kentucky",
				"abbreviation": "KY"
		},
		{
				"name": "Louisiana",
				"abbreviation": "LA"
		},
		{
				"name": "Maine",
				"abbreviation": "ME"
		},
		{
				"name": "Marshall Islands",
				"abbreviation": "MH"
		},
		{
				"name": "Maryland",
				"abbreviation": "MD"
		},
		{
				"name": "Massachusetts",
				"abbreviation": "MA"
		},
		{
				"name": "Michigan",
				"abbreviation": "MI"
		},
		{
				"name": "Minnesota",
				"abbreviation": "MN"
		},
		{
				"name": "Mississippi",
				"abbreviation": "MS"
		},
		{
				"name": "Missouri",
				"abbreviation": "MO"
		},
		{
				"name": "Montana",
				"abbreviation": "MT"
		},
		{
				"name": "Nebraska",
				"abbreviation": "NE"
		},
		{
				"name": "Nevada",
				"abbreviation": "NV"
		},
		{
				"name": "New Hampshire",
				"abbreviation": "NH"
		},
		{
				"name": "New Jersey",
				"abbreviation": "NJ"
		},
		{
				"name": "New Mexico",
				"abbreviation": "NM"
		},
		{
				"name": "New York",
				"abbreviation": "NY"
		},
		{
				"name": "North Carolina",
				"abbreviation": "NC"
		},
		{
				"name": "North Dakota",
				"abbreviation": "ND"
		},
		{
				"name": "Northern Mariana Islands",
				"abbreviation": "MP"
		},
		{
				"name": "Ohio",
				"abbreviation": "OH"
		},
		{
				"name": "Oklahoma",
				"abbreviation": "OK"
		},
		{
				"name": "Oregon",
				"abbreviation": "OR"
		},
		{
				"name": "Palau",
				"abbreviation": "PW"
		},
		{
				"name": "Pennsylvania",
				"abbreviation": "PA"
		},
		{
				"name": "Puerto Rico",
				"abbreviation": "PR"
		},
		{
				"name": "Rhode Island",
				"abbreviation": "RI"
		},
		{
				"name": "South Carolina",
				"abbreviation": "SC"
		},
		{
				"name": "South Dakota",
				"abbreviation": "SD"
		},
		{
				"name": "Tennessee",
				"abbreviation": "TN"
		},
		{
				"name": "Texas",
				"abbreviation": "TX"
		},
		{
				"name": "Utah",
				"abbreviation": "UT"
		},
		{
				"name": "Vermont",
				"abbreviation": "VT"
		},
		{
				"name": "Virgin Islands",
				"abbreviation": "VI"
		},
		{
				"name": "Virginia",
				"abbreviation": "VA"
		},
		{
				"name": "Washington",
				"abbreviation": "WA"
		},
		{
				"name": "West Virginia",
				"abbreviation": "WV"
		},
		{
				"name": "Wisconsin",
				"abbreviation": "WI"
		},
		{
				"name": "Wyoming",
				"abbreviation": "WY"
		}
	];
	eventsFromAdmin:any[]= [];
	events:EventdataModel = new EventdataModel();
	id: any;
  constructor(private modalService: NgbModal,private router: Router, private _objService: EventsService, public dialog: MatDialog, private zone:NgZone,public userServices:UserService) {
    let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
		this.loginuserinfo=userInfo;
		
  }
   
formatdate(date){
	return moment(new Date(date)).format('L');
}
  openVerticallyCentered(content) {
    this.modalService.open(content, { centered: true });
  }
  ngOnInit() {
		if(this.loginuserinfo.userRole=="1"){
			
			this.getEventlist();
		}else{
			this.getJudgesSport(this.loginuserinfo._id);
			
			this.getEventMeetListById();	
		} 
	}

	loadEvents() {
		this._objService.getEventMeetListByuserId(this.loginuserinfo._id).subscribe(data => {
			this.eventss = data; 
		})
	}
	


  getJudgesSport(resUser){
    this.userServices.getJudgesSport(resUser)
    .subscribe(resSport => { 
	  if(resSport.length>0){
		    this.ownsportObj=this.groupBy(resSport,'sportid');
            this.getEventsListOnly();
           //console.log("resSport",this.ownsportObj);   
	  }
         
    },
      error => this.errorMessage(error));
  }
  groupBy(collection,property){
	   if(!collection) {
            return [];
        }

        const groupedCollection = collection.reduce((previous, current)=> {
            if(!previous[current[property]]) {
                previous[current[property]] = [current];
            } else {
                previous[current[property]].push(current);
            }

            return previous;
        }, {});

        // this will return an array of objects, each object containing a group of objects
        return Object.keys(groupedCollection).map(key => ({ key, value: groupedCollection[key] }));
  }
	addEventToProfile(event){
	//	console.log('selected event ', event.end);
		event.userid = this.loginuserinfo._id;
		this._objService.saveUserEventList(event).subscribe( data => {
				//console.log('saved user response ', data);
				if(data){
					Swal("Success!","Event has been added to your profile successfully ","success");
					// this.ucCalendar.fullCalendar('refreshEvents');
					this.loadEvents()
				}
			},err=>{
				if(err.message){
					Swal("Alert!",err.message,"info");
				
				}else{
					Swal("Alert!",err,"info");
								}
				

				//console.log(err); 
			}
		)
	}
	removeEvent(){
		let eventObj={
			title: this.title,
			start:this.start,
			state:this.country,
			id:this.id
		}
	//	console.log(this.id);
       this._objService.RemoveEventList(eventObj,this.id).subscribe (data =>{
		Swal("Success!","Event removed Successfully.","success")
		this.loadEvents();
	//	console.log(data)
	   },err=>{
		if(err.message){
			Swal("Alert!",err.message,"info");
		
		}else{
			Swal("Alert!",err,"info");
						}

		 //  console.log(err);
	   })

	   }
	

	filterByState(ev){
		this._objService.getEventList().subscribe(
			res=>{
			//	console.log('events list ', res);
					if(res.length>0){
						this.eventsFromAdmin = res;
						this.dataSource = res;
						this.dataSource = new MatTableDataSource(res);
					//	console.log("events from admin ", this.eventsFromAdmin);
			 }
			 else{				 
			 }
			},err=>{
				this.errorMessage(err);
			}, () => {
				let val = ev.value;
			//	console.log('state value ', ev )
				this.eventsFromAdmin = this.eventsFromAdmin.filter((item) => {
					if(item.state && val){
							if(item.state.toLowerCase().indexOf(val.toLowerCase()) > -1){
								return true;
							}else{
								return false;
							}
						}
					});
				//	console.log('USER DETAILS ', this.eventsFromAdmin);
					this.futureeventList=[];
					for(let i=0;i<this.eventsFromAdmin.length;i++){
						  var element=this.eventsFromAdmin[i];
						  var compareTo = moment();				 
				          var then = moment(element.end);
						  //console.log(compareTo,then)
						if (compareTo > then ) {
							//console.log('Date is past');							                           					
						} else {
							//console.log('Date is future');	
                            for(let j=0;j<this.ownsportObj.length;j++){
								 let temp=this.ownsportObj[j];
								 if(temp.key==element.sportid){
									  this.futureeventList.push(element);	
								 }
							}					
						}
					}
					this.futureeventList=this.futureeventList.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
					this.dataSource = new MatTableDataSource(this.futureeventList);
			}
		)
		
	}

	filterBySport(ev){
		this._objService.getEventList().subscribe(
			res=>{
			//	console.log('events list ', res);
					if(res.length>0){
						this.eventsFromAdmin = res;
						this.dataSource = res;
						this.dataSource = new MatTableDataSource(res);
					//	console.log("events from admin ", this.eventsFromAdmin);
			 }
			 else{				 
			 }
			},err=>{
				this.errorMessage(err);
			}, () => {
				let val = ev.value;
			//	console.log('state value ', ev )
				this.eventsFromAdmin = this.eventsFromAdmin.filter((item) => {
				//	console.log(item.sportinfo.sportName,item.sportinfo.sportName.toLowerCase().indexOf(val.toLowerCase()));
					if(item.sportinfo.sportName){
							if(item.sportinfo.sportName.toLowerCase().indexOf(val.toLowerCase()) > -1){
								return true;
							}else{
								return false;
							}
						}
					});
				//	console.log('USER DETAILS ', this.eventsFromAdmin);
					this.futureeventList=[];
					for(let i=0;i<this.eventsFromAdmin.length;i++){
						  var element=this.eventsFromAdmin[i];
						  var compareTo = moment();				 
				          var then = moment(element.end);
						  //console.log(compareTo,then)
						if (compareTo > then ) {
						//	console.log('Date is past');							                           					
						} else {
						//	console.log('Date is future');	
                           for(let j=0;j<this.ownsportObj.length;j++){
								 let temp=this.ownsportObj[j];
								 
								 if(temp.key==element.sportid){
									  this.futureeventList.push(element);	
								 }
							}					
						}
					}
					this.futureeventList=this.futureeventList.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
					this.dataSource = new MatTableDataSource(this.futureeventList);
			}
		)
	}

	getEventsListOnly(){
	//	console.log('inside get event list');
		var data=this.ownsportObj
		var groupBySport = [];
		var groupByuniqueSport=[];
		data.forEach(function (a) {
			groupBySport [a.sportid] = groupBySport[a.sportid] || [];
		    groupBySport [a.sportid].push({ level: a.level});
			groupByuniqueSport.push(a.sportid)
		});
	//	console.log("groupBySport",groupByuniqueSport)
	this._objService.getEventList().subscribe(
	  res=>{
		//	console.log('events list ', res);
		  if(res.length>0){
				this.eventsFromAdmin = res;
				this.sports = res;

				//console.log('this.so=ports top',this.sports)
				let tempArrSport = [];
				let tempArrStates = [];
				for (let i = 0; i < this.sports.length; i++) {
					const element = this.sports[i];
					tempArrSport.push(element.sportinfo.sportName);
					tempArrStates.push(element.state);
					//console.log('element',this.sports);
					 var compareTo = moment();				 
				     var then = moment(element.end);
					//	 console.log(compareTo,then)
						if (compareTo > then ) {
						//	console.log('Date is past');							                           					
						} else {
						//	console.log('Date is future');	
							
							for(let j=0;j<this.ownsportObj.length;j++){
								 let temp=this.ownsportObj[j];
								 if(temp.key==element.sportid){
									  this.futureeventList.push(element);	
								 }
							}
                           					
						}
				}
			//	console.log('tempArrSport before ', tempArrSport);
			//	console.log('tempArrStates before ', tempArrStates);
				tempArrSport = tempArrSport.filter( function(item, index, arr) {
					return arr.indexOf(item) == index;
				})

				tempArrStates = tempArrStates.filter( function(item, index, arr) {
					return arr.indexOf(item) == index;
				})
			//	console.log('tempArr ', tempArrSport);
			//	console.log('tempArrStates ', tempArrStates);
				this.sports = tempArrSport;
				this.states = tempArrStates;
				this.futureeventList=this.futureeventList.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
				this.dataSource = new MatTableDataSource(this.futureeventList);
			//	console.log("events from admin ", this.futureeventList);
			//console.log('this.sports',this.sports)
		  }
		  else{
		 	 
		  }
	  },err=>{
		  this.errorMessage(err);
		    this.calendarOptions = {
					  editable: true,
					  eventLimit: false,
					  header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek,agendaDay,listMonth'
					  },
					   //events: data
					};
	  }, () => {
			// this.filterEvents('TX');
			this.zone.run(() => {
					//console.log('enabled time travel');
			});
		}
	)
}



addEvent(){
	this.router.navigate(['/events/events-editor']);
}

  eventClick(model: any) {
	  if(this.loginuserinfo.userRole!='1'){
		  this.openVerticallyCentered(this.content1);
	  }
	
	//console.log("model",model);
    model = {
      event: {
        id: model.event._id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title,
        allDay: model.event.allDay,
		// other params
		state:model.event.state
      },
      duration: {}
    }
	this.displayEvent = model;
	this.title=model.event.title;
	this.start=model.event.start;
	this.country=model.event.state;
	this.id=model.event.id;
//	console.log("eventclickid" ,this.id)
//	console.log(this.displayEvent);
	}
	 
	edit(event){
		this.router.navigate([`/events/events-editor/${event._id}`])
	}

	deleteEvent(event) {
		this._objService.deleteEvent(event).subscribe( data => {
		//	console.log('response from event ', data);
			Swal("Success!","Event removed Successfully.","success")
		}, err => {
		//	console.log('error ', err);
		}, () => {
			if(this.loginuserinfo.userRole=="1"){
			
				this.getEventlist();
			}else{
				this.getEventMeetListById();	
			} 
		})
	}

// 	getUserEventlist(){
// 		console.log('inside get event list');
// 	this._objService.getUserEventList().subscribe(
// 	  res=>{
// 			console.log('events list ', res);
// 		    if(res.length>0){
// 					this.allEvents = res;
// 			    this.calendarOptions = {
// 					  editable: true,
// 					  eventLimit: false,
// 					  header: {
// 						left: 'prev,next today',
// 						center: 'title',
// 						right: 'month,agendaWeek,agendaDay,listMonth'
// 					  },
// 					   events: res
// 					};
// 		 }
// 		 else{
// 			 this.calendarOptions = {
// 					  editable: true,
// 					  eventLimit: false,
// 					  header: {
// 						left: 'prev,next today',
// 						center: 'title',
// 						right: 'month,agendaWeek,agendaDay,listMonth'
// 					  },
// 					   //events: data
// 					};
// 		 }
// 	  },err=>{
// 		  this.errorMessage(err);
// 		    this.calendarOptions = {
// 					  editable: true,
// 					  eventLimit: false,
// 					  header: {
// 						left: 'prev,next today',
// 						center: 'title',
// 						right: 'month,agendaWeek,agendaDay,listMonth'
// 					  },
// 					   //events: data
// 					};
// 	  }, () => {
// 			this.zone.run(() => {
// 					console.log('enabled time travel');
// 			});
// 		}
// 	)
// }
  
  getEventlist(){
		//console.log('inside get event list');
	this._objService.getEventList().subscribe(
	  res=>{
		//	console.log('events list ', res);
		    if(res.length>0){
					this.allEvents = res;
				//	console.log("before sort",this.allEvents);
			    if(res.length>0){
					this.allEvents=this.allEvents.sort((a, b) => new Date(b.start).getTime() - new Date(a.start).getTime())
				 //   console.log("after sort",this.allEvents);
				}		    
			    this.calendarOptions = {
					  editable: true,
					  eventLimit: false,
					  header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek,agendaDay,listMonth'
					  },
					   events: res
					};
		 }
		 else{
			 this.calendarOptions = {
					  editable: true,
					  eventLimit: false,
					  header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek,agendaDay,listMonth'
					  },
					   //events: data
					};
		 }
	  },err=>{
		  this.errorMessage(err);
		    this.calendarOptions = {
					  editable: true,
					  eventLimit: false,
					  header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek,agendaDay,listMonth'
					  },
					   //events: data
					};
	  }, () => {
			this.zone.run(() => {
				//	console.log('enabled time travel');
			});
		}
	)
}
  getEventMeetListById(){
	this._objService.getEventMeetListByuserId(this.loginuserinfo._id).subscribe(
	  res=>{
		 // console.log("rwdwewwwwwwwww",res);
		  if(res.length>0){
			    this.calendarOptions = {
					  editable: true,
					  eventLimit: false,
					  header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek,agendaDay,listMonth'
					  },
					   events: res
					};
		 }
		 else{
			 this.calendarOptions = {
					  editable: true,
					  eventLimit: false,
					  header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek,agendaDay,listMonth'
					  },
					   //events: data
					};
		 }
	  },err=>{
		  this.errorMessage(err);
		  this.calendarOptions = {
					  editable: true,
					  eventLimit: false,
					  header: {
						left: 'prev,next today',
						center: 'title',
						right: 'month,agendaWeek,agendaDay,listMonth'
					  },
					   //events: data
					};
	  }
	)
}
  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }

}
