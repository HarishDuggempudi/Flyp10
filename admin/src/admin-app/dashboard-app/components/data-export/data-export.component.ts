import Swal from "sweetalert2";
import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { MatTableDataSource } from "@angular/material";
import { takeUntil } from "rxjs/operators";
import * as xlsx from 'xlsx'

import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";

import { RegisterUserModel } from "../user-management/user.model";
import { Config } from "../../../shared/configs/general.config";

import { Subject } from "rxjs";
import { DataExportService } from "./data-export.service";
import {API_URL} from "../../../shared/configs/env.config";
@Component({
  selector: "data-export",
  templateUrl: "./data-export.component.html",
  styleUrls:['./data-export.component.scss']
 
})

export class DataExportComponent implements OnInit {
    displayedColumns = ['SN', 'Collections', 'Actions']; 
    dataSource:any;
    Collections=[];
    objResponse:any={};
    collectionDataList: any = [];
    collectionName: any;
    preIndex = 0
    perPage:number = 10;
    currentPage:number = 1;
    CollectionData: any;
    CollectionKey: any;
    
    constructor(private dataexport:DataExportService){}
 ngOnInit() {
this.getCollections();
 }

 getCollections() {
     this.dataexport.getAllCollections().subscribe((res)=>{
         console.log(res)
         this.Collections = res.data;
          console.log(this.Collections)
         this.dataSource = new MatTableDataSource(this.Collections);
        console.log(this.dataSource)
     })
 }
 
 pageChanged(event: any) {
    this.perPage = event.pageSize;
    this.currentPage = event.pageIndex + 1;
   
  }
 exportExcelCollection(name){
     
     this.dataexport.getCollection(name).subscribe((res)=>{
         console.log(res)
         this.CollectionData = res.data;
         this.CollectionKey = res.key;
         this.exportTable(name)
      //   this.JSONToCSVConvertor(name) 
     })
    
    // var link = document.createElement("a");    
    //   link.href = API_URL+'getCollection?name='+name;
      
    //   //set the visibility hidden so it will not effect on your web-layout
    //   link.hidden = true;
    //   //link.download = name + ".xlsx";
    //   document.body.appendChild(link);
    //   link.click();
    //   document.body.removeChild(link);
 }


 exportTable(name)
  {
    let newArray:any[]=[];
    this.CollectionData.forEach((data, index)=>{
let Obj ={}
      for (var j = 0; j < this.CollectionKey.length; j++) {
        let dataproperty =  data[this.CollectionKey[j]];
        if(dataproperty == undefined){
          dataproperty = "";
        }
    else if(this.isObject(dataproperty)) {
      dataproperty = JSON.stringify(dataproperty)
    }
        Obj[this.CollectionKey[j]] = dataproperty;
     
        if(j == this.CollectionKey.length-1){
          newArray.push(Obj)
        }
      
        
    }
        
      })


    const ws: xlsx.WorkSheet=xlsx.utils.json_to_sheet(newArray);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, name);

    /* save to file */
    xlsx.writeFile(wb, name+'.xlsx');
  }
 JSONToCSVConvertor(file) {
    let JSONData=[];
    JSONData=this.CollectionData;
    var filename=file
      var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
      console.log(arrData[0][this.CollectionKey[9]])
      
      var CSV = '';    []
      //Set Report title in first row or line
      
     // CSV += ReportTitle + '\r\n\n';
  
      //This condition will generate the Label/Header
      if (true) {
          var row = ""
          
          //This loop will extract the label from 1st index of on array
        //   for (var index in arrData[0]) {
              
        //       //Now convert each value to string and comma-seprated
        //       row += index + ',';
        //   }

        for (var j = 0; j < this.CollectionKey.length; j++) {
            row += this.CollectionKey[j] + ';';
        }
  
          row = row.slice(0, -1);
          
          //append Label row with line break
          CSV += row + '\r\n';
      }
      
      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
          var row = "";
          
          //2nd loop will extract each column and convert it in string comma-seprated
        //   for (var index in arrData[i]) {
        //       row += '"' + arrData[i][index] + '",';
        //   }
        for (var j = 0; j < this.CollectionKey.length; j++) {
          let data = arrData[i][this.CollectionKey[j]]
          if(data == undefined){
            data = "";
          }
      else if(this.isObject(data)) {
        data = JSON.stringify(data)
      }
            
          
            row += '"' + data + '";';
        }
          row.slice(0, row.length - 1);
          
          //add a line break after each row
          CSV += row + '\r\n';
      }
  
      if (CSV == '') {        
          alert("Invalid data");
          return;
      }   
  
      var uri = encodeURI('data:text/csv;charset=utf-8,'+CSV)
      var link = document.createElement("a");    
      link.href = uri;
      link.hidden = true;
      link.download = filename + ".csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }
  isObject(val){
    let type=typeof val;

    if(type=='object'){
     
       return true
    }else{
      return false
    }
  } 
}
  

 

