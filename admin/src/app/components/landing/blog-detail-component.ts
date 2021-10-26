
import { Component, OnInit, Inject, PLATFORM_ID, APP_ID } from "@angular/core";
import { isPlatformBrowser } from '@angular/common';
import { SeoService } from '../../shared/seo.service';
import { TransferState } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Services } from '../../shared/services';
import {FaqComponent} from '../landing/faq.component'
import {PrivacyPage} from '../landing/privacy.component'
import {TermsPage} from '../../components/landing/conditons.component'
@Component({
    selector: 'client-landing-blog-detail',
    templateUrl: './blog-detail-component.html',
    styleUrls: ['./blog-detail.scss']
})

export class BlogDetailComponent implements OnInit{
 
    websiteName: string = "Flyp10";
    websiteDescription: string = "Flyp10";
    websiteImage: string = "assets/client/images/red_icon.png";
    routeId: string = "";
    blogPosts:any[]=[];
    blogDetails: any;
    blogCategories:any[]=[];
    blogCategoryDetails:any[]=[];
    blogTag:any[]=[];
    constructor(@Inject(SeoService)private seo: SeoService, @Inject(PLATFORM_ID) private platformId: Object, @Inject(APP_ID) private appId: string, @Inject(TransferState)private state: TransferState, private ActivatedRoute: ActivatedRoute, private _service: Services) { }
    
    ngOnInit() {
        this.setSeoTags();
        const platform = isPlatformBrowser(this.platformId);
        this.routeId = this.ActivatedRoute.snapshot.paramMap.get('blogid');
       // console.log('blog id is ', this.routeId);
        this.getBlogDetail(this.routeId);
        this.getBlogCategoryList();
        this.getBlogTagList();
        this.getBlogList();
        this.loadScript();
    }

    blogByCategory(id:string, name:string){
        window.open(`/blog/category/${id}/${name}`, '_self');
    }

    blogByTag(id:string, name:string){
        window.open(`/blog/tag/${id}/${name}`, '_self');
    }

    getBlogDetail(id:string){
        this._service.getBlogDetail(id).subscribe( data => {
           // console.log('blog data ', data );
            this.blogDetails = data;
        })
    }

    getBlogCategoryList(){
        this._service.getBlogCategoryList().subscribe( data => {
            this.blogCategories = data.dataList;
            //console.log('blog categories list ', this.blogCategories);
        })
    }

    getBlogTagList(){
        this._service.getBlogTagList().subscribe( data => {
            this.blogTag = data;
           // console.log('blog tag list ', this.blogTag);
        })
    }

    // getCategoryDataById(id:string){
    //     this._service.getBlogCategoryDetail(id).subscribe( data => {
    //         this.blogTag = data;
    //         console.log('blog tag list ', this.blogTag);
    //     })
    // }

    getBlogList(){
        this._service.getBlogList().subscribe( data => {
            this.blogPosts = data.dataList;
           // console.log('blog posts list ', this.blogPosts);
        })
    }


    setSeoTags() {
        this.seo.setTitle("Flyp10 | Blog-details");
        this.seo.setSchemaData(this.websiteName, this.websiteDescription, this.websiteImage);
        this.seo.setMetaData(this.websiteName, "Website", this.websiteDescription, "www.Flyp10.com", this.websiteImage);
        this.seo.setTwitterCard("Flyp10", this.websiteName, this.websiteDescription, "Flyp10", this.websiteImage);
    }

    public loadScript() {        
        var isFound = false;
        var scripts = document.getElementsByTagName("script")
        for (var i = 0; i < scripts.length; ++i) {
            if (scripts[i].getAttribute('src') != null && scripts[i].getAttribute('src').includes("testflyp10-1")) {
                isFound = true;
            }
        }
    
        if (!isFound) {

                let node = document.createElement('script');
                node.src = "https://flyp10.disqus.com/embed.js";
               // node.src = "https://testflyp10-1.disqus.com/embed.js";
                node.type = 'text/javascript';
                node.setAttribute('data-timestamp', ''+new Date());
                node.charset = 'utf-8';
                document.getElementsByTagName('head')[0].appendChild(node);

                let node1 = document.createElement('script');
                node1.src = "//flyp10.disqus.com/count.js";
               // node1.src = "//testflyp10-1.disqus.com/count.js";
                node1.type = 'text/javascript';
                node1.id="dsq-count-scr";
                node1.async=true;
                node1.setAttribute('data-timestamp', ''+new Date());
                node1.charset = 'utf-8';
                document.getElementsByTagName('head')[0].appendChild(node1);
        }
  }
}