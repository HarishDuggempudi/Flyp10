
import { Component, OnInit, Inject, PLATFORM_ID, APP_ID ,ViewChild,ElementRef} from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../shared/seo.service';
import { TransferState } from '@angular/platform-browser';
import { Services } from '../../shared/services';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {PagerService} from '../../shared/pagerservice';
import {FaqComponent} from '../landing/faq.component'
import {PrivacyPage} from '../landing/privacy.component'
import {TermsPage} from '../../components/landing/conditons.component'
@Component({
    selector: 'client-landing-blog',
    templateUrl: './blog-component.html',
    styleUrls: ['./blog-list.scss']
})

export class BlogComponent implements OnInit{
 
    websiteName: string = "Flyp10";
    websiteDescription: string = "Flyp10";
    websiteImage: string = "assets/client/images/red_icon.png";
    blogData:any[]=[];
    // pager object
    pager: any = {};
    // paged items
    pagedItems: any[];
    categoryRoute:string = "";
    tagId:string = "";
    tagName:string = "";
    categoryName:string = "";
    blogComment:any=""
    constructor(@Inject(SeoService)private seo: SeoService, @Inject(PLATFORM_ID) private platformId: Object, @Inject(APP_ID) private appId: string, @Inject(TransferState)private state: TransferState, private _service: Services, private activatedRoute: ActivatedRoute,private pagerService: PagerService) { 
        this.categoryRoute = this.activatedRoute.snapshot.paramMap.get('categoryid');
        this.categoryName = this.activatedRoute.snapshot.paramMap.get('categoryname');
        this.tagId = this.activatedRoute.snapshot.paramMap.get('tagid');
        this.tagName = this.activatedRoute.snapshot.paramMap.get('tagname');
       // console.log('category id route ===> ', this.categoryRoute);
       // console.log('category name route ===> ', this.categoryName);
      //  console.log('tag name route ===> ', this.tagName);
        //this.loadScript();
    }
    @ViewChild('myDiv') myDiv: ElementRef;
    ngOnInit() {
       
        this.getBlogPostsList();
        this.setSeoTags();
        const platform = isPlatformBrowser(this.platformId);      
    }

    ngAfterViewInit() {
        
    }
    loadurl(){
        return "http://localhost:4200/blog/5ba4f38ea3f2bb9ad03a55f9/Lorem-Ipsum-Is-Simply-Dummy";
    }
    getBlogPostsList(){
        this._service.getBlogList().subscribe( data => {    
            if(this.categoryRoute!=null){
                data.totalDataItem.forEach( item => {
                  //  console.log('item val ', item);
                   // console.log('item cat', item.categoryId);
                   // console.log('cat route', this.categoryRoute);
                    if(item.categoryId == this.categoryRoute){
                        this.blogData.push(item);
                        // initialize to page 1
                         this.setPage(1);
                    }
                })
               // console.log('category tag data ====> ', this.blogData);
            }else if(this.tagId!=null){
                data.totalDataItem.forEach( item => {
                    item.tags.forEach( tag => {
                    //    console.log('tag data ', tag);
                        if(tag._id === this.tagId){
                            this.blogData.push(item);
                            // initialize to page 1
                             this.setPage(1);
                        }
                    })
                })
                //console.log('category tag data ====> ', this.blogData);
            }
            else{
                this.blogData = data['totalDataItem'];
                // initialize to page 1
                this.setPage(1);
                //console.log('received all active blog data', this.blogData);
            }        
            
        })
    }

    setSeoTags() {
        this.seo.setTitle("Flyp10 | Blog");
        this.seo.setSchemaData(this.websiteName, this.websiteDescription, this.websiteImage);
        this.seo.setMetaData(this.websiteName, "Website", this.websiteDescription, "www.Flyp10.com", this.websiteImage);
        this.seo.setTwitterCard("Flyp10", this.websiteName, this.websiteDescription, "Flyp10", this.websiteImage);
    }

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        // get pager object from service
        this.pager = this.pagerService.getPager(this.blogData.length, page);

        // get current page of items
        this.pagedItems = this.blogData.slice(this.pager.startIndex, this.pager.endIndex + 1);
    }
   
    public loadScript() {        
        var isFound = false;
        var scripts = document.getElementsByTagName("script")
        for (var i = 0; i < scripts.length; ++i) {
            if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("flyp10")) {
                isFound = true;
            }
        }
    
        if (!isFound) {

                let node1 = document.createElement('script');
                node1.src ="//flyp10.disqus.com/count.js";
               // node1.src = "//testflyp10-1.disqus.com/count.js";
                node1.type = 'text/javascript';
                node1.id="dsq-count-scr";
                node1.async=true;
                node1.setAttribute('data-timestamp', ''+new Date());
                node1.charset = 'utf-8';
                document.getElementsByTagName('head')[0].appendChild(node1);               
               // var str='<span class="disqus-comment-count" data-disqus-url="http://localhost:4200/blog/5ba4f38ea3f2bb9ad03a55f9/Lorem-Ipsum-Is-Simply-Dummy"></span>';
                
              
        }
  }
}