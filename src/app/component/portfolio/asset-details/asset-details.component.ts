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
          data => {this.newAsset.currentPrice = data.data.price,
            this.newAsset.gain = ((data.data.price - this.newAsset.avgprice) / this.newAsset.avgprice) * 100,
            this.stockData = data;
            console.log(this.stockData);
            console.log(this.newAsset);
            this.buildChart();
            this.spinnerService.hide();
          }      
        );

        this.transactions = transactionList;
        console.log(this.transactions);
        
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
      stockPrices.push(day.close);
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

  /*
  private grabAssetAndConvert(): void {
     // Fetch our asset from DB and convert the numbers into strings, 'symbol' is param passed by router
     this.assetService.getAsset( this.route.snapshot.paramMap.get('symbol'))
     .subscribe(
                value => { // upon success, set value and call function to convert  
                          this.myAsset = value, 
                          this.convert()
                         }, 
                error => alert("This symbol does not exist"),
                ()    => this.displayTransactions("all") 
              );      
  }

  // convert number and decimals like 1111.42 into 1,111.00
  private convert(): void {
    this.displayAsset.shares        = this.myAsset.shares.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.sharesSold    = this.myAsset.sharesSold.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.avgprice      = this.myAsset.avgprice.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.avgpriceSold  = this.myAsset.avgpriceSold.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.originalMoney = this.myAsset.originalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.totalMoneyIn  = this.myAsset.totalMoneyIn.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.totalMoneyOut = this.myAsset.totalMoneyOut.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.price         = this.myAsset.price  .toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.currentTotal  = this.myAsset.currentTotal .toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.realProfit    = this.myAsset.realProfit .toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    //this.displayAsset.realMargin    = this.myAsset.realMargin.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    this.displayAsset.unRealProfit  = this.myAsset.unRealProfit.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    //this.displayAsset.unRealMargin  = this.myAsset.unRealMargin.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }

  private updatePrice(newPrice:number): void {
      // This will update the current price as well as calculate the currentTotal and other totals.
      new Promise(res=>{
        this.myAsset.price = newPrice;
        return res();
      }).then(res=>{
        this.myAsset.currentTotal = this.myAsset.price * this.myAsset.shares;
      }).then(res=> {
        this.myAsset.realProfit = this.myAsset.totalMoneyOut - this.myAsset.totalMoneyIn;
        this.myAsset.unRealProfit = this.myAsset.totalMoneyOut * 1 + this.myAsset.currentTotal - this.myAsset.totalMoneyIn;
      }).then(res=> {
        this.myAsset.realMargin =   this.myAsset.realProfit / this.myAsset.totalMoneyIn  * 100;
        this.myAsset.unRealMargin = this.myAsset.unRealProfit / this.myAsset.totalMoneyIn * 100;
      }).then(res => {
        this.assetService.updateAsset(this.myAsset)
        .subscribe(res=> this.grabAssetAndConvert(), err=> alert("failed to update asset"))
      }).catch(err =>{
          alert("error when trying to update Price " + err)
      });
  }

  private displayTransactions(displayType: string): void {
    // return transactions based on transactions being true, false or all
      this.transactionService.getTransactionsByAsset(displayType,this.myAsset.symbol, this.user.username)
      .subscribe(
                  res=> this.transactions = res,
                  err=> alert("failed to connect to database"),
                  () => this.convertTransactions()
                );
  }

  private whatIfScenario(): void {
      // We will calculate the prices for the what if scenario
      new Promise(res => {
        // how much money we will get out at the what if price
        this.whatIf.totalMoneyOut = this.whatIf.whatIfPrice * this.myAsset.shares;
        return res();
      }).then(res =>{
        // how much profit will we make 
        this.whatIf.pureProfit = this.whatIf.totalMoneyOut - 0;
        return;
      }).then(res =>{
        // calculate profit margin
        this.whatIf.pureProfitMargin = ( this.whatIf.pureProfit  / 0 ) * 100
      }).then(res =>{
        // how many shares do we need to sell to get our ORIGINAL MONEY back
        this.whatIf.sharesToSell = 0 / this.whatIf.whatIfPrice ;
      }).then(res =>{
        // round all the values
        this.whatIf.totalMoneyOut    =  this.whatIf.totalMoneyOut.toFixed(2);
        this.whatIf.pureProfit       = this.whatIf.pureProfit.toFixed(2);
        this.whatIf.pureProfitMargin = this.whatIf.pureProfitMargin.toFixed(2);
        this.whatIf.sharesToSell     = Math.round(this.whatIf.sharesToSell);
      }).then(res=>{
        // convert to strings for user appeal ex 1000 to 1,000
        this.whatIf.totalMoneyOut    =  this.whatIf.totalMoneyOut.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        this.whatIf.pureProfit       = this.whatIf.pureProfit.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        this.whatIf.pureProfitMargin = this.whatIf.pureProfitMargin.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
        this.whatIf.sharesToSell     = this.whatIf.sharesToSell.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      })
  }

  // convert the format of the transactions from 100000 to 1,000,000.00
  private convertTransactions(): void{
    this.transactions.forEach(element => {
      element.price = element.price.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      //element.total = element.total.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
      element.shares = element.shares.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
    });
  }
  */
}

