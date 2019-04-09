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
import { AddAssetComponent }     from '../add-asset/add-asset.component'
import { NgbModal }              from '@ng-bootstrap/ng-bootstrap'
import { PortfolioService }      from '../../../service/portfolio.service';
import { TransactionsService }   from '../../../service/transaction.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-current-portfolio',
  templateUrl: './current-portfolio.component.html',
  styleUrls: ['./current-portfolio.component.css']
})
export class CurrentPortfolioComponent implements OnInit {

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
    //show to loading spinner
    this.spinnerService.show();

    //get portfolioid
    this.portfolioID = parseInt(this.route.snapshot.paramMap.get('portfolioId'));

    //get current user
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

    //retrieve portfolio info
    this.portfolioService.getPortfolio(this.portfolioID).subscribe(
      res => {
        this.userPortfolio = res;
    });
   }
 
  ngOnInit(): void {
  }

  //builds the portfolio array
  buildPortfolio(): void {
    let assetList: testAsset[];
    assetList = new Array();
    //retrieves all transactions on the portfolio
    this.transactionService.getAllTransactions(this.portfolioID.toString()).subscribe(
      res => {
        //for every portfolio in the list
        res.forEach(transaction => {
          transaction.price = parseFloat(transaction.price);
          let found = false;

          //if the assetList has any assets added yet
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

                //modify the asset avgprices
                asset.avgprice = asset.totalMoneyIn / (asset.sharesBought);
                asset.avgpriceSold = asset.totalMoneyOut / asset.sharesSold;
                
                found = true;

                //if there are transactions on the asset but the currently owned shares are 0, remove it from the array so it wont display
                if (asset.shares == 0){
                  var i = assetList.findIndex(index => {
                    return index.symbol == transaction.symbol;
                  });
                  assetList.splice(i, 1);
                }
              }
            });
          }

          //if the asset does not already exist in the list we need to add it as a new asset
          if (!found){
            var newAsset = new testAsset();
            newAsset.shares = 0;
            newAsset.avgprice = 0;
            newAsset.avgpriceSold = 0;
            newAsset.sharesBought = 0;
            newAsset.sharesSold = 0;
            newAsset.totalMoneyIn = 0;
            newAsset.totalMoneyOut= 0;
            //set currencytype
            if (transaction.currency == true){
              newAsset.currency = true;
            }else{
              newAsset.currency = false;
            }
            //set symbol
            newAsset.symbol = transaction.symbol;
            //buy
            if (transaction.transaction == true){
              newAsset.shares += transaction.shares;
              newAsset.totalMoneyIn += (transaction.shares * transaction.price);
              newAsset.sharesBought += transaction.shares;
            //sell
            }else{
              newAsset.shares -= transaction.shares;
              newAsset.totalMoneyOut += (transaction.shares * transaction.price);
              newAsset.sharesSold += transaction.shares;
            }

            //set the avgprices
            newAsset.avgprice = newAsset.totalMoneyIn / (newAsset.sharesBought);
            newAsset.avgpriceSold = newAsset.totalMoneyOut / newAsset.sharesSold;

            //retrieve the current price (in USD) of the asset from the API
            this.assetService.getPrice(transaction.symbol).subscribe(
              data => {
                //if the price cannot be retrieved we use the avgprice as the current price and update values accordingly         
                if (data.data === undefined){
                  this.totalPortfolioValue += (newAsset.shares * newAsset.avgprice);
                }else{
                  this.totalPortfolioValue += (data.data.price*this.exchangeRate) * newAsset.shares;

                  //if canadian convert to cad
                  if (transaction.currency == true){
                    newAsset.currentPrice = (data.data.price*this.exchangeRate);
                    newAsset.gain = (((data.data.price*this.exchangeRate) - newAsset.avgprice) / newAsset.avgprice) * 100;
                  }else{
                    //usd
                    newAsset.currentPrice = (data.data.price);
                    newAsset.gain = (((data.data.price) - newAsset.avgprice) / newAsset.avgprice) * 100;
                  }

                }
                //calculate the total percent gain of the portfolio
                this.totPercent = ((this.totalPortfolioValue - this.totDiff) / this.totDiff) * 100;  
              }
            );
            //add the new asset to the list
            assetList.push(newAsset);       
          }
          
        });
        //split the array based on currencytype to create an array of canadian assets and array of us assets
        this.cadAssets = assetList.filter(x => x.currency == true);
        this.usdAssets = assetList.filter(x => x.currency == false);
        this.assets = assetList;
        //calculate totals
        this.calculate(this.cadAssets); 
        this.calculate(this.usdAssets); 
        this.buildChart();       
      }   
    );   
  }

  //this function calculates the totals at the top of the portfolio based on the assets in the portfolio that were previously built
  calculate(myAssets: testAsset[]){
    myAssets.forEach(element => 
    {
      //if currency is usd convert usd to cad
      if (element.currency == false){
        //calculate the totalin and totalout
        this.totIn += (element.totalMoneyIn*this.exchangeRate);
        this.totOut += (element.totalMoneyOut*this.exchangeRate);
        this.totDiff = this.totIn - this.totOut;
      }
      //if currency is usd leave as is
      else{
        //calculate the totalin and totalout
        this.totIn += element.totalMoneyIn;
        this.totOut += element.totalMoneyOut
        this.totDiff = this.totIn - this.totOut;
      }  
    });
  }

  //this function builds the pie chart on the right side of the screen
  private buildChart(){

    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    let assetLabels = new Array();
    let assetAmounts = new Array();
    let colourList = new Array();

    //this function creates a random rgb colour value
    var dynamicColors = function() {
      var r = Math.floor(Math.random() * 255);
      var g = Math.floor(Math.random() * 255);
      var b = Math.floor(Math.random() * 255);
      return "rgba(" + r + "," + g + "," + b + ", 1)";
   };

   //for every asset in the assetlist
    this.assets.forEach(asset => {
      //add the symbol to the labels
      assetLabels.push(asset.symbol);
      //add a new random colour to the colours
      colourList.push(dynamicColors());
      //get the price of the asset
      this.assetService.getPrice(asset.symbol).subscribe(
        data => {
          //if the price could not be found, use the average buy price
          if (data.data === undefined){
            assetAmounts.push(Math.round(asset.shares*asset.avgprice));
          }
          //if the price is found use the current price
          else{
            assetAmounts.push(Math.round(data.data.price * asset.shares));
          } 
          //hide the loading spinner
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
               responsive: true,
               legend: {
                display: false
               },  
            }
          });
        }      
      );
    });
  
    
  }

  //this function opens the transaction modal, passing in the stock symbol, shares, portfolioId, and currency type (CAD/USD)
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


