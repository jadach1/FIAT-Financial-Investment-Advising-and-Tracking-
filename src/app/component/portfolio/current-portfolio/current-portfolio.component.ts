import { Component, OnInit }     from '@angular/core';
import { asset }                 from '../../../model/asset';
import { AssetService }          from '../../../service/asset.service';
import { portfolio }             from '../../../model/portfolio';
import { NavbarService }         from '../../../service/navbar.service';
import { SidebarService }        from '../../../service/sidebar.service'
import { UserService }           from '../../../service/user.service'
import { AuthenticationService } from '../../../service/authentication.service'
import { testAsset }             from '../../../model/testAsset'

@Component({
  selector: 'app-current-portfolio',
  templateUrl: './current-portfolio.component.html',
  styleUrls: ['./current-portfolio.component.css']
})
export class CurrentPortfolioComponent implements OnInit {

  assets:     testAsset[];
  portfolio = new portfolio();
  totOut:     number = 0;
  totIn:      number = 0;
  currTotal:  number = 0;
  orgMoney:   number = 0;
  
  constructor(private assetService: AssetService, private nav: NavbarService, private sidebar: SidebarService, private auth: AuthenticationService, private user: UserService) {
    this.nav.show();
    this.sidebar.show();
   }
 

  ngOnInit(): void {
   this.getAssets(); 
  }

  getAssets(){
    return this.assetService.getAllAssets()
    .subscribe(
      asset => {
       this.assets = asset;
       this.calculate(this.assets);
      }
     );
  }

  calculate(myAssets: testAsset[]){
    new Promise (res=>{
      myAssets.forEach(element => 
        {
          this.totOut += (element.totalMoneyOut * 1);
          this.totIn += (element.totalMoneyIn * 1);
          this.currTotal += (0);
          this.orgMoney += (0);
        })
        return res();
    }).then(res=>{
      this.portfolio.currentTotal = this.currTotal.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      this.portfolio.totalMoneyIn = this.totIn.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      this.portfolio.totalMoneyOut = this.totOut.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      this.portfolio.originalMoney = this.orgMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    })
  }
}
