import { Component, OnInit, Inject }     from '@angular/core';
import { asset }                 from '../../../model/asset';
import { AssetService }          from '../../../service/asset.service';
import { portfolio }             from '../../../model/portfolio';
import { NavbarService }         from '../../../service/navbar.service';
import { SidebarService }        from '../../../service/sidebar.service'
import { UserService }           from '../../../service/user.service'
import { AuthenticationService } from '../../../service/authentication.service'
import { testAsset }             from '../../../model/testAsset'
import { ActivatedRoute }        from '@angular/router';
import { Location }              from '@angular/common';
import { AddAssetComponent }     from '../add-asset/add-asset.component'
import { NgbModal }              from '@ng-bootstrap/ng-bootstrap'
import { PortfolioService }      from '../../../service/portfolio.service';
import { TransactionsService }   from '../../../service/transaction.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  selector: 'app-current-portfolio',
  templateUrl: './current-portfolio.component.html',
  styleUrls: ['./current-portfolio.component.css']
})
export class CurrentPortfolioComponent implements OnInit {

  assets: testAsset[];
  portfolio = new portfolio();
  portfolioID: number;
  username: string;
  currentPrice: any = 0;
  gainloss: any = 0;
  totIn: any = 0;
  totOut: number = 0;
  totDiff: any = 0;
  totPercent: any = 0;
  totalPortfolioValue: any = 0;
  loading: boolean;
  
  constructor(private assetService: AssetService, 
    private nav: NavbarService, 
    private sidebar: SidebarService, 
    private auth: AuthenticationService, 
    private userService: UserService, 
    private location: Location,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private portfolioService: PortfolioService,
    private transactionService: TransactionsService,
    private spinnerService: Ng4LoadingSpinnerService
    ) {
    this.nav.show();
    this.sidebar.show();

    this.spinnerService.show();

    this.portfolioID = parseInt(this.route.snapshot.paramMap.get('portfolioId'));

    this.userService.currentUser().subscribe(
      res => {
        this.username = res.username;
        //this.getAssets();
        this.buildPortfolio();
    });
   }
 
  ngOnInit(): void {
  }

  buildPortfolio(): void {
    let assetList: testAsset[];
    assetList = new Array();
    this.transactionService.getAllTransactions(this.portfolioID.toString()).subscribe(
      res => {
        res.forEach(transaction => {
          transaction.price = parseFloat(transaction.price);
          let found = false;

          if (assetList){
            assetList.forEach(asset => {
          
              //if the asset already exists in our list of assets
              if (transaction.symbol == asset.symbol){
                //buy     
                if (transaction.transaction == true){
                  asset.shares += transaction.shares;
                  asset.totalMoneyIn += (transaction.shares * transaction.price);
                  asset.sharesBought += transaction.shares;         
                //sell
                }else{
                  asset.shares -= transaction.shares;
                  asset.totalMoneyOut += (transaction.shares * transaction.price);
                  asset.sharesSold += transaction.shares;
                }

                asset.avgprice = asset.totalMoneyIn / asset.sharesBought;
                asset.avgpriceSold = asset.totalMoneyOut / asset.sharesSold;
                
                found = true;

                if (asset.shares == 0){
                  var i = assetList.findIndex(index => {
                    return index.symbol == transaction.symbol;
                  });
                  assetList.splice(i, 1);
                }
              }
            });
          }

          if (!found){
            var newAsset = new testAsset();
            newAsset.shares = 0;
            newAsset.avgprice = 0;
            newAsset.avgpriceSold = 0;
            newAsset.sharesBought = 0;
            newAsset.sharesSold = 0;
            newAsset.totalMoneyIn = 0;
            newAsset.totalMoneyOut= 0;

            newAsset.symbol = transaction.symbol;
            //buy
            var buycount = 0, sellcount = 0;
            if (transaction.transaction == true){
              newAsset.shares += transaction.shares;
              newAsset.totalMoneyIn += (transaction.shares * transaction.price);
              newAsset.sharesBought += transaction.shares;

              buycount+=1;
            //sell
            }else{
              newAsset.shares -= transaction.shares;
              newAsset.totalMoneyOut += (transaction.shares * transaction.price);
              newAsset.sharesSold += transaction.shares;

              sellcount += 1;
            }

            newAsset.avgprice = newAsset.totalMoneyIn / newAsset.sharesBought;
            newAsset.avgpriceSold = newAsset.totalMoneyOut / newAsset.sharesSold;

            this.assetService.getPrice(transaction.symbol).subscribe(
              data => {newAsset.currentPrice = data.data.price,
                newAsset.gain = ((data.data.price - newAsset.avgprice) / newAsset.avgprice) * 100,
                this.totalPortfolioValue += data.data.price * newAsset.shares,
                this.totPercent = ((this.totalPortfolioValue - this.totDiff) / this.totDiff) * 100,
                this.spinnerService.hide();
              }      
            );

            assetList.push(newAsset);
            
          }
          
        });
        this.assets = assetList;
        this.calculate(this.assets);
        
      }
    );   
  }

  /*getAssets(){
    return this.assetService.getAllAssets()
    .subscribe(
      asset => {
       this.assets = asset;
       //this.calculate(this.assets);
      }
     );
  }*/

  calculate(myAssets: testAsset[]){
    myAssets.forEach(element => 
    {
        this.totIn += element.totalMoneyIn;
        this.totOut += element.totalMoneyOut
        this.totDiff = this.totIn - this.totOut;
    })

    
  }

  openModal(symbol: string, shares: number, portfolio: number){
    const modalRef = this.modalService.open(AddAssetComponent);
    modalRef.componentInstance.username = this.username;
    modalRef.componentInstance.passedInShares = shares;
    if (symbol != '0'){
      modalRef.componentInstance.symbol = symbol;
    }
    modalRef.componentInstance.portfolioId = this.portfolioID;
  }

}
