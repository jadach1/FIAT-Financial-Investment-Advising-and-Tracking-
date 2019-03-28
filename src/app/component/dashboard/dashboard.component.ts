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

interface portfolioNames{
  id: any,
  name: any
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  public user   : User
  pNames: portfolioNames[]
  assets: any[]
  portfolio: string

  assetsInPortfolios = new Array()

  assetsInPortfolios2: any[][]

 

  constructor( public nav: NavbarService, 
               public sidebar: SidebarService, 
               private authService: AuthenticationService, 
               private userService: UserService,
               private PortfolioService: PortfolioService,
               private assetService: AssetService) {

    this.nav.show(); 
    this.sidebar.show();

    this.user = new User();

    this.userService.currentUser().subscribe(
      res =>this.user = res,
      err => console.log("error connecting to database"),
      ()  => this.fetchP()
    );
  }
 
  ngOnInit() {
      
  }

  private fetchP(): void{
    this.PortfolioService.getPortfolioNames(this.user.username)
      .subscribe(
        res=> this.pNames = res,
        err=> console.log("error connecting to database from fetchP"),
        () => {console.log(this.pNames)}
      )
  }

  private fetchAssets(): void{
    console.log("called")
    this.assetService.getAssetNames("1")
    .subscribe(
      res=> this.assets = res,
      err=> console.log("error connecting to database in dashboard to get assets"),
      ()=> console.log("done")
    )
  }

//   onOptionsSelected(value:string){
//     console.log("the selected value is " + value);
// }

  public selectName(value: any): void{
    // let value = event.target.value;
    // this.portfolio = value;
    // console.log("this is " + value + " and this is " + this.portfolio);
    console.log("this is  " + value)
    this.fetchAssets()
  }
}

