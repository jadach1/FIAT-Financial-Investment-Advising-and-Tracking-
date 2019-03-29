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
  pNames  : portfolioNames[]
  assets  : any[]
  assetsInPortfolios = new Array()

  constructor( public nav: NavbarService, 
               public sidebar: SidebarService, 
               private authService: AuthenticationService, 
               private userService: UserService,
               private PortfolioService: PortfolioService,
               private assetService: AssetService) {

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

