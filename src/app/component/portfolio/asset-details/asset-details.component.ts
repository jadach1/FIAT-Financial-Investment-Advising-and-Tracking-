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

  private refresh(){
    window.location.reload();
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

    this.transactionService.getTransactionsByAsset(null, this.symbol, this.portfolioID.toString()).subscribe(
      res => {
        res.forEach(transaction => {
            transactionList.push(transaction);

            this.newAsset.symbol = transaction.symbol;
            if (transaction.currency == true){
              this.newAsset.currency = true;
            }else{
              this.newAsset.currency = false;
            }

            //buy
            var buycount = 0, sellcount = 0;
            if (transaction.transaction == true){
              this.newAsset.shares += transaction.shares;
              this.newAsset.totalMoneyIn += (transaction.shares * transaction.price);
              this.newAsset.sharesBought += transaction.shares;

              buycount+=1;
            //sell
            }else{
              this.newAsset.shares -= transaction.shares;
              this.newAsset.totalMoneyOut += (transaction.shares * transaction.price);
              this.newAsset.sharesSold += transaction.shares;

              sellcount += 1;
            }

            this.newAsset.avgprice = this.newAsset.totalMoneyIn / this.newAsset.sharesBought;
            this.newAsset.avgpriceSold = this.newAsset.totalMoneyOut / this.newAsset.sharesSold;
       
        });

        this.assetService.getPrice(this.symbol).subscribe(
          data => {
            if (this.newAsset.currency == true){
              this.newAsset.currentPrice = (data.data.price*this.exchangeRate);
              this.newAsset.gain = (((data.data.price*this.exchangeRate) - this.newAsset.avgprice) / this.newAsset.avgprice) * 100;
            }else{
              this.newAsset.currentPrice = (data.data.price);
              this.newAsset.gain = (((data.data.price) - this.newAsset.avgprice) / this.newAsset.avgprice) * 100;
            }
            this.stockData = data;
            this.buildChart();
            this.spinnerService.hide();
          }      
        );

        this.transactions = transactionList;
        
      }
    )
  }

  private buildChart(){
    this.context = (<HTMLCanvasElement>this.myCanvas.nativeElement).getContext('2d');

    let stockLabels = new Array();
    let stockPrices = new Array();

    let arr = this.stockData.charts.chartDailyLast5Years.filter(function (value, index, ar) {
      return (index % 30 == 0);
    } );

    arr.forEach(day => {
      stockLabels.push(day.date);
      if (this.newAsset.currency == true){
        stockPrices.push((day.close* this.exchangeRate));
      }else{
        stockPrices.push(day.close);
      }
    });
    
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

