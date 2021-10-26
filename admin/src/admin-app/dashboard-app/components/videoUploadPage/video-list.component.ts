import { Component, OnInit } from "@angular/core";
import { VideoService } from "./video.service";
import { VideoModel,VideoResponse } from "./video.model";
import { Router } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import Swal from "sweetalert2";

@Component({
  selector: "video-list",
  templateUrl: "./video-list.html"
})
export class VideoComponent implements OnInit {
  objListResponse: VideoResponse;
  displayedColumns = ["SN", "Type", "Title","SubTitle","Banner","Actions"];
  dataSource: any;
  /* Pagination */
  pageSizeOptions = [5, 10, 25, 50, 100];
  perPage: number = 10;
  currentPage: number = 1;
  totalItems: number = 1;
  /* End Pagination */
  preIndex: number = 0;

  ngOnInit() {
     this.getBannerList();
  }

  constructor(private _objService: VideoService,private router: Router) {
	  
  }

   getBannerList() {
    this._objService
      .getBannerList(this.perPage, this.currentPage)
      .subscribe(
        objRes => this.bindList(objRes),
        error => this.errorMessage(error)
      );
  }
  errorMessage(objResponse: any) {
    Swal("Alert !", objResponse, "info");
  }
   addBanner() {
    this.router.navigate(["/videoUpload/editor"]);
  }
  bindList(objRes) {
    this.objListResponse = objRes;
    this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
    this.totalItems = objRes.totalItems;
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }
    pageChanged(event: any) {
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getBannerList();
  }
  edit(bannerid: string) {
    this.router.navigate(["/videoUpload/editor", bannerid]);
  }
  delete(id: string) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this banner !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
         let bannerObj: VideoModel = new VideoModel();
         bannerObj._id = id;
         bannerObj.deleted = true;
        this._objService.deleteBanner(bannerObj).subscribe(
          res => {
            this.getBannerList();
            Swal("Deleted!", res.message, "success");
          },
          error => {
            Swal("Alert!", error, "info");
          }
        );
      }
    });
  }
 /*  bindList(objRes: TestimonialResponse) {
    this.objListResponse = objRes;
    this.dataSource = new MatTableDataSource(this.objListResponse.dataList);
    this.totalItems = objRes.totalItems;
    this.preIndex = (this.perPage * (this.currentPage - 1));
  }



  addTestimonial() {
    this.router.navigate(["/testimonial/editor"]);
  }

  delete(id: string) {
    Swal({
      title: "Are you sure?",
      text: "You will not be able to recover this Testimonial !",
      type: "warning",
      showCancelButton: true,
      confirmButtonColor: "#DD6B55",
      confirmButtonText: "Yes, delete it!"
    }).then(result => {
      if (result.value) {
        let objSlider: TestimonialModel = new TestimonialModel();
        objSlider._id = id;
        objSlider.deleted = true;
        this._objService.deleteTestimonial(objSlider).subscribe(
          res => {
            this.getTestimonialList();
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
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getTestimonialList();
  } */
}
