import { Component, OnInit, ViewChild, ElementRef }  from '@angular/core';
import { transaction }              from '../../../model/transactions';
import { asset }                    from '../../../model/asset';
import { whatIfAsset }              from '../../../model/whatIfAsset';
import { AssetService }             from '../../../service/asset.service';
import { TransactionsService }      from '../../../service/transaction.service';
import { ActivatedRoute, Params }   from '@angular/router';
import { Location }                 from '@angular/common';
import { NavbarService }            from '../../../service/navbar.service';
import { SidebarService }           from '../../../service/sidebar.service'
import { UserService }              from '../../../service/user.service'
import { AuthenticationService }    from '../../../service/authentication.service'
import { User }                     from '../../../model/user';
import { testAsset }                from '../../../model/testAsset'
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-asset-details',
  templateUrl: './asset-details.component.html',
  styleUrls: ['./asset-details.component.css']
})
export class AssetDetailsComponent implements OnInit {

  @ViewChild('stockChart') myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;
  chart = [];

  portfolioID: number;
  symbol: string;
  newAsset = new testAsset();
  stockData: any;

  myAsset         = new asset();
  displayAsset    = new asset();
  transactions    : transaction[];
  newPrice        : number = 0;
  // what if scenario below
  whatIf           = new whatIfAsset();
  private user : User;

  exchangeRate: any = 1.34; // 1 usd is 1.34 cad

  constructor( 
    private assetService: AssetService,
    private transactionService: TransactionsService,
    private location: Location,
    private route: ActivatedRoute,
    private nav: NavbarService,
    private sidebar: SidebarService,
    private auth: AuthenticationService,
    private userService: UserService,
    private spinnerService: Ng4LoadingSpinnerService
    ) { 
      this.nav.show();
      this.sidebar.show();
      this.spinnerService.show();

      this.portfolioID = parseInt(this.route.snapshot.paramMap.get('portfolioId'));
      this.symbol = this.route.snapshot.paramMap.get('symbol');

      this.user = new User();

      //get latest conversion rate
      this.assetService.getConversion().subscribe(
        res => {
          res = JSON.parse(res);
          this.exchangeRate = res.quotes.USDCAD;
        }
      )

      //get current user
      this.userService.currentUser().subscribe(
        res =>{
          this.user = res;
          this.buildDetails();
        }
      );

    }

  ngOnInit() {
   //this.grabAssetAndConvert();
  }

  //refresh the browser
  private refresh(){
    window.location.reload();
  }

  //delete a transaction, run buildDetails() again to get updated list of transactions
  private deleteTransaction(transactionID: Number){
    this.transactionService.deleteTransaction(transactionID).subscribe(
      ()=> {
        this.transactions = new Array();
        this.buildDetails();
      }
    );
  }

  private buildDetails(){
    let transactionList: transaction[];
    transactionList = new Array();
    this.newAsset.shares = 0;
    this.newAsset.avgprice = 0;
    this.newAsset.avgpriceSold = 0;
    this.newAsset.sharesBought = 0;
    this.newAsset.sharesSold = 0;
    this.newAsset.totalMoneyIn = 0;
    this.newAsset.totalMoneyOut= 0;


    //gets all transactions of the current asset
    this.transactionService.getTransactionsByAsset(null, this.symbol, this.portfolioID.toString()).subscribe(
      res => {
        //for each transaction of the current asset
        res.forEach(transaction => {
            transactionList.push(transaction);

            //set the current asset displayed to the transaction asset
            this.newAsset.symbol = transaction.symbol;

            //set the currency to canadian or us
            if (transaction.currency == true){
              this.newAsset.currency = true;
            }else{
              this.newAsset.currency = false;
            }

            //if transaction is a buy, add to the details
            if (transaction.transaction == true){
              this.newAsset.shares += transaction.shares;
              this.newAsset.totalMoneyIn += (transaction.shares * transaction.price);
              this.newAsset.sharesBought += transaction.shares;
            //if transaction is a sell, subtract from the details
            }else{
              this.newAsset.shares -= transaction.shares;
              this.newAsset.totalMoneyOut += (transaction.shares * transaction.price);
              this.newAsset.sharesSold += transaction.shares;
            }
            //update the total avg price bought and sold
            this.newAsset.avgprice = this.newAsset.totalMoneyIn / this.newAsset.sharesBought;
            this.newAsset.avgpriceSold = this.newAsset.totalMoneyOut / this.newAsset.sharesSold;  
        });

        //get the current price of the asset (from api, in USD)
        this.assetService.getPrice(this.symbol).subscribe(
          data => {
            //if the price could not be found
            if (data.data == undefined){
              //set current price to the average buy price
              this.newAsset.currentPrice = this.newAsset.avgprice;
            }else{
              //if currency is canadian we need to modify the price to match using the exchange rate
              if (this.newAsset.currency == true){
                this.newAsset.currentPrice = (data.data.price*this.exchangeRate);
                this.newAsset.gain = (((data.data.price*this.exchangeRate) - this.newAsset.avgprice) / this.newAsset.avgprice) * 100;
              }else{
                this.newAsset.currentPrice = (data.data.price);
                this.newAsset.gain = (((data.data.price) - this.newAsset.avgprice) / this.newAsset.avgprice) * 100;
              }
              this.stockData = data;
              //call function to build the 5yr chart
              this.buildChart();
              //hide the loading spinner
              this.spinnerService.hide();
            }  
          });
        this.transactions = transactionList;      
      }
    )
  }

  //build the asset 5 year chart
  private buildChart(){
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    let stockLabels = new Array();
    let stockPrices = new Array();

    //build the array of prices using the data retrieved from before, only taking every 20th value so the chart isnt so filled
    let arr = this.stockData.charts.chartDailyLast5Years.filter(function (value, index, ar) {
      return (index % 20 == 0);
    } );

    //for every price in the chart add a label corresponding to the price, also convert currency if necessary
    arr.forEach(day => {
      stockLabels.push(day.date);
      if (this.newAsset.currency == true){
        stockPrices.push((day.close* this.exchangeRate));
      }else{
        stockPrices.push(day.close);
      }
    });
    
    //build the chart using stockData as data, stockLabels as labels
    this.chart = new Chart(this.context, {
      type: 'line',
      data: {
        labels: stockLabels,
        datasets: [{
          label: this.myAsset.symbol,
          backgroundColor: 'rgb(50, 200, 60)',
          borderColor: 'rgb(0, 0, 0)',
          data: stockPrices,
        }]
      },
      options: {
        legend: {
          display: false
        },
        scales: {
          xAxes: [{
            display: true
          }],
          yAxes: [{
            display: true
          }],
        }
      }
    });
  }
}

