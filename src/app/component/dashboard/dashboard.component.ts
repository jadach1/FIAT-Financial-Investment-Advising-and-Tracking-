import { Component,
         OnInit, 
         ViewChild, 
         ElementRef }           from '@angular/core';
import { Chart }                from 'chart.js';

import { NavbarService }         from '../../service/navbar.service';
import { SidebarService }        from '../../service/sidebar.service';
import { AuthenticationService } from '../../service/authentication.service';
import { UserService }           from '../../service/user.service'
import { AssetService }          from  '../../service/asset.service'
import { PortfolioService }      from '../../service/portfolio.service'
import { User }                  from 'src/app/model/user';
import { NewsService }           from '../../service/news.service'


/*
This is the used by the dashboard dropdown list,
an asset needs to be paired with the portfolio ID,
user needs to see the portfolio Name
*/
interface portfolioNames{
  id  : any,
  name: any
}

/*
This is the used by the dashboard news feed
*/
interface newsObject{
  title:       any
  description: any
  url:         any 
  author:      any
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  user    : User
  pNames  : portfolioNames[]
  assets  : any[]
  assetsInPortfolios = new Array()
  news = {}
  arrayOfNews = [{}]

  constructor( public nav:               NavbarService        , public sidebar:       SidebarService, 
               private authService:      AuthenticationService, private userService:  UserService,
               private PortfolioService: PortfolioService     , private assetService: AssetService,
               private newsService:             NewsService) {

                  this.nav.show(); 
                  this.sidebar.show();
                  this.user = new User();
                  this.userService.currentUser()
                    .subscribe(
                      res => this.user = res,
                      err => console.log("error connecting to database"),
                      ()  => this.fetchPortfolioNames()
                    );
  } // constructor ends
 
  ngOnInit() {
    this.getNews();
  }

  private getNews(){
    this.newsService.getNews("nvda")
    .subscribe(
              res => this.news = res,
              err => console.log("error in get news"),
              () => this.parseNews()
              )
  }

  private parseNews(){
       this.news['articles'].forEach( (element, index) => {

                    // console.log("first index is  " + index)
                    // console.log(Object.keys(element))
                          this.arrayOfNews[index] = {
                              title: element['title'],
                              description: element['description'],
                              author: element['author'],
                              url: element['url']
                              // title: "title",
                              // description: "desc",
                              // author: "author",
                              // url: "url"
                            }
                            //console.log("done " + index)
                        })
                      console.log(this.arrayOfNews)
  }
  /*
    https://newsapi.org/v2/everything?q=nvda&from=2019-03-27&sortBy=publishedAt&apiKey=334280a9530a40ffaf133c91f01013e6
    need today's date in the form or yyyy-mm-dd
    need symbol
    need to reconstruct string

    need to call news service
    news service has an interface
    title
    description
    url 
    author
  */
  private fetchPortfolioNames(): void{
    this.PortfolioService.getPortfolioNames(this.user.username)
      .subscribe(
        res=> this.pNames = res,
        err=> console.log("error connecting to database from fetchP"),
        () => {console.log(this.pNames)}
      )
  }

  private fetchAssets(idNumber: any): void{
    console.log("called")
    this.assetService.getAssetNames(idNumber)
    .subscribe(
      res=> this.assets = res,
      err=> console.log("error connecting to database in dashboard to get assets"),
      ()=> console.log("done")
    )
  }

  public selectName(event): void {

    this.pNames.forEach((element)=>{
        if ( event === element.name)
        {
          console.log(element.name + " matches with " + event)
          this.fetchAssets(element.id)
        }
    }) // end of for loop
  }  // end of selectName

}

