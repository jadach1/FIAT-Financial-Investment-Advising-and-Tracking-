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
import { Portfolio2 } from '../../model/portfolio2'
import { AdvisorService } from '../../service/advisor.service'


/*
This is the used by the dashboard dropdown list,
an asset needs to be paired with the portfolio ID,
user needs to see the portfolio Name
*/
interface portfolioNames{
  id  : any,
  name: any
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  user    : User
  pNames  : portfolioNames[] // list of portfolio names
  assets  : any[]            // list of asset names
  // assetsInPortfolios = new Array() 
  news = {}                  // object to hold the raw json after the fetch
  arrayOfNews = [{}]         // after we parse the news
  hide = true
  searchString:    string  // search box string
  readMoreTitle:   string   // modal
  readMoreContent: string   // modal
  contentURL:      string   // modal
  private pCount = 0; //portfolio count
  private aCount = 0; //advisor count

  /*
  Below we have the variables which we will use to build our URL to fetch news information from
  // example of full url
  // https://newsapi.org/v2/everything?q=nvda&from=2019-03-27&sortBy=publishedAt&apiKey=334280a9530a40ffaf133c91f01013e6
  */
  private url         = "https://newsapi.org/v2/everything?q="
  private searchSymbol
  private appendToURL = "&from="
  private date
  private key         = "&sortBy=publishedAt&apiKey=334280a9530a40ffaf133c91f01013e6"
  private URLstring: any

  constructor( public nav:               NavbarService        , public sidebar:       SidebarService, 
               private authService:      AuthenticationService, private userService:  UserService,
               private PortfolioService: PortfolioService     , private assetService: AssetService,
               private newsService:      NewsService          , private advisorService: AdvisorService) {

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
   
  }

  // gets called when user enters submit button beside search box
  private searchFor() {
    if ( !this.searchString  )
    {
      this.searchString = "Why Donald Trump is so great"
    }
    this.createURL(this.searchString)
  }

  // gets a json object
  private getNews(urlString: string){
    this.newsService.getNews(urlString)
    .subscribe(
              res => this.news = res,
              err => console.log("error in get news, maybe url " + urlString),
              () => this.parseNews()
              )
  }

  // we parse the json object we got into a news reel object
  private parseNews(){
       this.news['articles'].forEach( (element, index) => {
                          this.arrayOfNews[index] = {
                              title: element['title'],
                              description: element['description'],
                              author: element['author'],
                              url: element['url'],
                              content: element['content']
                            }
                        })
  }

  /*
  We make a call to the portfolio service to get all portfolio names associated with this user
  */
  private fetchPortfolioNames(): void{
    this.PortfolioService.getPortfolioNames(this.user.username)
      .subscribe(
        res=> {this.pNames = res,
          res.forEach(element => {
            this.pCount = this.pCount + 1;
          });
        },
        err=> console.log("error connecting to database from fetchP"),
        () => {console.log(this.pNames)}
      );

      //retrive advisor count
      /*this.advisorService.getAllAdvisor(this.user.username).subscribe(
        res => {
          res.forEach(advisor => {
              this.aCount = this.aCount + 1;
            });
          });
        }*/
  }

  /*
  After the user makes a selection from the drop-down menu, we will cross reference there selected 
  portfolio name with the id, and call another function to fetch all the assets associated with that ID
  */
  public selectName(event): void {
    this.pNames.forEach((element)=>{
        if ( event === element.name)
        {
          console.log(element.name + " matches with " + event)
          this.fetchAssets(element.id)
        }
    }) // end of for loop
  }  // end of selectName

  /*
  Once we have all the portfolio names we can fetch all the subsequent assets in those portfolios
  */
  private fetchAssets(idNumber: any): void{
    this.assetService.getAssetNames(idNumber)
    .subscribe(
      res=> {this.assets = res
    },
      err=> console.log("error connecting to database in dashboard to get assets"),
      ()=> console.log("done")
    )
  }

  private hideIt() {
    this.hide = false
  }

  private setUpModal(title: any, content: any) {
    this.readMoreTitle = title
    this.readMoreContent = content
  }


  /*
    this function generates a date in the format
    yyyy-mm-dd
  */
  private  generateDate(): void {
    const dateToday  = new Date()
    const day   = dateToday.getDate()
    const month = dateToday.getMonth()  + 1  // 0 -- 11 , we need to+1 for api date to work
    const year  = dateToday.getFullYear()
    this.date   = year+"-"+month+"-"+day
  }

  private  setSymbol(symbol: string): void {
    this.searchSymbol = symbol
  }

  /*
  This function will create a url for us to fetch the news feed,
  we will generate today's date , and set the search symbol we are interested in,
  we will then return the finished url 
  */
  private async createURL(symbol: string){
      await this.generateDate()
      await this.setSymbol(symbol)
      this.URLstring =  this.url + this.searchSymbol + this.appendToURL + this.date + this.key
      this.getNews(this.URLstring)
      this.hide = false // show the form
  }

  // redirect to desired url
  private redirect(url: any) {
    window.open(url)
  }
}

