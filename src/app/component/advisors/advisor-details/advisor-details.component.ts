import { Component, OnInit, Inject, ViewChild, ElementRef }     from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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
import { AddAssetComponent }     from '../../portfolio/add-asset/add-asset.component'

import { NgbModal }              from '@ng-bootstrap/ng-bootstrap'
import { PortfolioService }      from '../../../service/portfolio.service';
import { TransactionsService }   from '../../../service/transaction.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-advisor-details',
  templateUrl: './advisor-details.component.html',
  styleUrls: ['./advisor-details.component.css']
})
export class AdvisorDetailsComponent implements OnInit {

  @ViewChild('portfolioChart') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;
  chart = [];
  stockPrices = new Array();

  userPortfolio: any;

  cadAssets: testAsset[];
  usdAssets: testAsset[];
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
  exchangeRate: any = 1; // set 1 for now
  
  constructor(private assetService: AssetService, 
    private nav: NavbarService, 
    private sidebar: SidebarService, 
    private http: HttpClient,
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

    //get portfolioid
    this.portfolioID = parseInt(this.route.snapshot.paramMap.get('portfolioId'));

    //get currency user
    this.userService.currentUser().subscribe(
      res => {
        this.username = res.username;
        this.buildPortfolio();
    });

    //get latest conversion rate
    this.assetService.getConversion().subscribe(
      res => {
        res = JSON.parse(res);
        this.exchangeRate = res.quotes.USDCAD;
      }
    )

    console.log(this.exchangeRate);

    //retrieve portfolio transactions
    this.portfolioService.getPortfolio(this.portfolioID).subscribe(
      res => {
        this.userPortfolio = res;
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

                asset.avgprice = asset.totalMoneyIn / (asset.sharesBought);
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
            if (transaction.currency == true){
              newAsset.currency = true;
            }else{
              newAsset.currency = false;
            }

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

            newAsset.avgprice = newAsset.totalMoneyIn / (newAsset.sharesBought);
            newAsset.avgpriceSold = newAsset.totalMoneyOut / newAsset.sharesSold;

            this.assetService.getPrice(transaction.symbol).subscribe(
              data => {            
                //if canadian convert to cad
                if (transaction.currency == true){
                  newAsset.currentPrice = (data.data.price*this.exchangeRate);
                  newAsset.gain = (((data.data.price*this.exchangeRate) - newAsset.avgprice) / newAsset.avgprice) * 100;
                }else{
                  newAsset.currentPrice = (data.data.price);
                  newAsset.gain = (((data.data.price) - newAsset.avgprice) / newAsset.avgprice) * 100;
                }
                if (!data.data.price){
                  this.totalPortfolioValue += (newAsset.shares * newAsset.avgprice);
                }else{
                  this.totalPortfolioValue += (data.data.price*this.exchangeRate) * newAsset.shares;
                }
                this.totPercent = ((this.totalPortfolioValue - this.totDiff) / this.totDiff) * 100;  
              }      
            );
            assetList.push(newAsset);       
          }
          
        });
        this.cadAssets = assetList.filter(x => x.currency == true);
        this.usdAssets = assetList.filter(x => x.currency == false);
        this.assets = assetList;
        this.calculate(this.cadAssets); 
        this.calculate(this.usdAssets); 
        this.buildChart();       
      }   
    );   
  }

  calculate(myAssets: testAsset[]){
    myAssets.forEach(element => 
    {
      //if currency is usd convert usd to cad
      if (element.currency == false){
        this.totIn += (element.totalMoneyIn*this.exchangeRate);
        this.totOut += (element.totalMoneyOut*this.exchangeRate);
        this.totDiff = this.totIn - this.totOut;
      }
      //if currency is usd leave as is
      else{
        this.totIn += element.totalMoneyIn;
        this.totOut += element.totalMoneyOut
        this.totDiff = this.totIn - this.totOut;
      }  
    });
  }

  private buildChart(){

    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    let assetLabels = new Array();
    let assetAmounts = new Array();
    let colourList = new Array();

    var dynamicColors = function() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgba(" + r + "," + g + "," + b + ", 1)";
   };

    this.assets.forEach(asset => {
      assetLabels.push(asset.symbol);
      colourList.push(dynamicColors());
      this.assetService.getPrice(asset.symbol).subscribe(
        data => {
          assetAmounts.push(Math.round(data.data.price * asset.shares));
          this.spinnerService.hide();
        },
        err => {
          console.log("There was an error in portfolio whilst trying to connect to the database")
        },
        // Chart will be built here
        () => {
          var myChart = new Chart(this.context, {
            type: 'pie',
            data: {
              labels: assetLabels,
              datasets: [{
                label: '# of Tomatoes',
                data: assetAmounts,
                backgroundColor: colourList,
                borderColor: colourList,
                borderWidth: 1
              }]
            },
            options: {
               cutoutPercentage: 20,
               responsive: true  
            }
          });
        }      
      );
    });
  
    
  }

  openModal(symbol: string, shares: number, portfolio: number, currency: boolean){
    const modalRef = this.modalService.open(AddAssetComponent);
    modalRef.componentInstance.username = this.username;
    modalRef.componentInstance.passedInShares = shares;
    if (symbol != '0'){
      modalRef.componentInstance.symbol = symbol;
    }
    modalRef.componentInstance.portfolioId = this.portfolioID;
    modalRef.componentInstance.currencyType = currency;
  }
}
