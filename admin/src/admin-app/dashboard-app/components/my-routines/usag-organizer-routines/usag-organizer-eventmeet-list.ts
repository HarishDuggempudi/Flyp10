import { Component, OnInit } from "@angular/core";
import { MatTableDataSource } from "@angular/material";
import { Router } from "@angular/router";
import { Config } from "../../../../shared/configs/general.config";
import { MeetResponse } from "../../events-meet/event-meet-model";
import { RegisterUserModel } from "../../user-management/user.model";
import { USAGRoutineService } from "./usag-routine.service";
import * as moment from 'moment';

@Component({
  selector: "usag-eventmeet-list",
  templateUrl: "./usag-organizer-eventmeet-list.html",
  styleUrls: ['../routine-list.scss']
})
export class USAGEventmeetListComponent implements OnInit {
  MemberID: any;
  loginuserinfo: any;
  perPage: number = 10;
  currentPage: number = 1;
  totalItems: number = 1;
  preIndex: number = 0;
  totaldataItem: any
  objListResponse: any;

  dataSource: any;

  data: any;
  displayedColumns: string[];
  eventMeetList = []


  constructor(private router: Router, private _Service: USAGRoutineService) {
    let userInfo: RegisterUserModel = JSON.parse(Config.getUserInfoToken());
    this.loginuserinfo = userInfo;
    this.displayedColumns = ["SN", "EventName", "SportName", "StartDate", "EndDate", 'active', "Actions"];
  }
  ngOnInit(): void {
    this.getSanctionEventMeet();

  }
  getUSAGMember() {
    return new Promise((resolve, reject) => {
      this._Service.getUSAGMember(this.loginuserinfo._id).subscribe((res) => {
        if (res.success) {

          this.MemberID = res.data['MemberID']
          resolve()



        }
        else {
          resolve()
        }

      })
    })

  }
  bindList(objRes: MeetResponse) {
    console.log(objRes);
    this.objListResponse = objRes;
    this.eventMeetList = this.objListResponse.result
    this.dataSource = new MatTableDataSource(this.objListResponse.result);
  }
  async getSanctionEventMeet() {
    await this.getUSAGMember()
    this._Service.getSanctionEventMeet(this.MemberID).subscribe((res) => {
      console.log(res);

      this.bindList(res)
      if (res && res.success) {
        //    this.allEventMeets = res.result
      }


    })
  }
  pageChanged(event: any) {
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getSanctionEventMeet()

  }
  view(eventMeetId) {
    this.router.navigate(["/usag-admin-routine/routine-management/eventmeet/" + eventMeetId]);
  }
  formatDate(date) {

    return moment(date).format('MM/DD/YYYY')
  }
}