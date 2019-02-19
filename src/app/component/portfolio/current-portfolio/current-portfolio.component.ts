import { Component, OnInit } from '@angular/core';
import { asset }             from '../../../model/asset';
import { AssetService }      from '../../../service/asset.service';
import { portfolio }         from '../../../model/portfolio';

@Component({
  selector: 'app-current-portfolio',
  templateUrl: './current-portfolio.component.html',
  styleUrls: ['./current-portfolio.component.css']
})
export class CurrentPortfolioComponent implements OnInit {

  assets: asset[];
  portfolio = new portfolio();
  totOut: number = 0;
  totIn: number = 0;
  currTotal: number = 0;
  orgMoney: number = 0;
  
  constructor(private assetService: AssetService) { }
 

  ngOnInit(): void {
   this.getAssets(); 
  }

  getAssets(){
    return this.assetService.getAllAssets()
    .subscribe(
      thisCanBeAnything => {
       this.assets = thisCanBeAnything;
       this.calculate(this.assets);
      }
     );
  }

  calculate(myAssets: asset[]){
    new Promise (res=>{
      myAssets.forEach(element => 
        {
          this.totOut += (element.totalMoneyOut * 1);
          this.totIn += (element.totalMoneyIn * 1);
          this.currTotal += (element.currentTotal * 1);
          this.orgMoney += (element.originalMoney * 1);
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
