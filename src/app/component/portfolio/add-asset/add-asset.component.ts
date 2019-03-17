import { Component, OnInit, Input }      from '@angular/core'
import { NavbarService }          from '../../../service/navbar.service'
import { SidebarService }         from '../../../service/sidebar.service'
import { UserService }            from '../../../service/user.service'
import { AuthenticationService }  from '../../../service/authentication.service'
import { transaction }            from '../../../model/transactions';
import { asset }                  from '../../../model/asset';
import { AssetService }           from '../../../service/asset.service';
import { TransactionsService }    from '../../../service/transaction.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Location }               from '@angular/common';
import { User }                   from '../../../model/user'

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.css']
})
export class AddAssetComponent implements OnInit {
  @Input() public username;
  @Input() public symbol;
  @Input() public passedInShares;
  @Input() public portfolioId;

  Transaction   = new transaction();
  submitted     = false;
  assetIsNew    = true;
  newAsset      = new asset();
  existingAsset = new asset();
  shareCount:     string;
  stringUsername: string;
  stringSymbol: string;
  
  constructor(
    public nav: NavbarService, 
    public sidebar: SidebarService, 
    private authService: AuthenticationService, 
    private userService: UserService,
    private assetService: AssetService,
    private transactionService: TransactionsService,
    private location: Location,
    private route: ActivatedRoute ) 
    { 
      this.nav.show();
      this.sidebar.show();  
    }

   // upon initialization set the transaction to true/buy and the colors to green
   ngOnInit()
   {
       this.stringUsername = this.username.toString();
       if ( this.passedInShares )
       { this.shareCount = "You currently have this many shares : "+this.passedInShares;}
       if (this.symbol != null)
       {
         this.assetIsNew = false;
         this.stringSymbol = this.symbol.toString();
       }

       console.log(this.passedInShares);
   }
 
   // new form, reset the state excep for the transaction state we will keep that the same
   newTransaction(): void {
     const saveTransaction = this.Transaction.transaction;
     this.Transaction = new transaction();
     this.newAsset = new asset();
     this.existingAsset = new asset();
     this.submitted = false;
     this.assetIsNew = true;
   }

   //just reload the page to update
   back(): void{
     window.location.reload();
   }
 
    // This function will grab the asset with the symbolName from the database and call the updateAsset functio, 
   // or return an error
   /*private grabAsset(symbolName: string): void{
     this.assetService.getAsset(symbolName)
       .subscribe(value => this.existingAsset = value ,
                  error =>  alert("Error connecting to database to grab an asset") , 
                  ()  => this.verifyIfAssetExists()
                 );           
    }*/
 
 // Establish if an asset exists or not
  verifyIfAssetExists() {
    /*// validate symbol name
    if (this.Transaction.symbol.length > 6 )
    {
       alert("Error:  Symbol must be less than 6 characters long")
    }else {
      new Promise(res=>{
         // set total
         //this.Transaction.total = this.Transaction.shares * this.Transaction.price;
         // start process to check if asset exists by grabbing asset synbol from database
         // check to see if we successfully pulled the asset from the database
         if (this.existingAsset == null)
         {
           // If we reached here it means the asset DOES NOT EXIST 
           if(this.Transaction.transaction === false)
           {
             throw "Error, You cannot have a sell order for an Asset you do not own";
           }
           return res();
         }
           else
           {
           this.assetIsNew = false;
           return res();
           }
      }).then(res=>{
         if (this.assetIsNew === false)
         {
           // If we successfully grabbed the asset from the database
           this.updateExistingAsset(this.existingAsset, this.Transaction, this.assetService,this.transactionService) 
         } else {
           // If this is a new asset, set the symbol and all params to 0 and pass it
           this.newAsset.symbol = this.Transaction.symbol;
           this.updateExistingAsset(this.newAsset, this.Transaction, this.assetService,this.transactionService) 
         }
      }).catch(err=>{
           alert(err);
      })
    }*/
  }
 
   // This takes 5 arguments and updates the asset in the database with the transaction recorded
   // depending on whether it is a buy or a sell order we will increase/decrease the totals
   /*private updateExistingAsset(assetToUpdate : asset, currentTransaction : transaction,
                                currentAssetService : AssetService, 
                               currentTransactionService : TransactionsService): void {   
       // Because some calculations rely on others to complete first, we will execute these in a nested promise
       new Promise( function(resolve, reject) { 
             // Check to make sure use is not trying to buy over the limit
             var regexp2 = /^\d{7}$/;
             if ( regexp2.test(currentTransaction.shares.toString()) )
             {
               throw("The number of shares you are trying to purchase is too high")
             }
             return resolve();
       }).then(res=>{
             // Check to see whether this is a buy(true) or sell(false) and act accordingly
             if (currentTransaction.transaction === true )
             {
               assetToUpdate.shares += currentTransaction.shares;
               //assetToUpdate.totalMoneyIn =   assetToUpdate.totalMoneyIn * 1 +  currentTransaction.total;
             }
             else {
               assetToUpdate.shares -= currentTransaction.shares;
               assetToUpdate.sharesSold += currentTransaction.shares;
               //assetToUpdate.totalMoneyOut = assetToUpdate.totalMoneyOut * 1 + currentTransaction.total;
             }
             return ;
       }).then(res=> { 
             // check and throw an error if this order will push shares below 0
             if ( assetToUpdate.shares < 0 )
             {
               alert("shares " + assetToUpdate.shares)
               throw ("Sorry, you do not have enough shares to fill this order");
             }
             // check to make sure the shares we are trying to buy are a whole number
             if ( !Number.isInteger(assetToUpdate.shares) )
             {
               throw ("The number of shares entered is NOT a whole number");
             }
             assetToUpdate.originalMoney = assetToUpdate.totalMoneyIn - assetToUpdate.totalMoneyOut;
             // set the price to be the user entered transaction price
             assetToUpdate.price = currentTransaction.price;
             return ;
       }).then(res=>{
             // If originalMoney is less than 0, change the value to 0, means "we are in the money"
             if (assetToUpdate.originalMoney < 0 )
             {
               assetToUpdate.originalMoney = 0;
             }
             // Calculate current Total 
             assetToUpdate.currentTotal = assetToUpdate.shares * assetToUpdate.price;
       }).then(res=> {
            // Calculate the Realized and Unrealized profit
             assetToUpdate.realProfit = assetToUpdate.totalMoneyOut - assetToUpdate.totalMoneyIn;
             assetToUpdate.unRealProfit = (assetToUpdate.totalMoneyOut - assetToUpdate.totalMoneyIn) + assetToUpdate.currentTotal;
             return;
       }).then(res=> {
            // Calculate the Realized and Unrealized Margins
             assetToUpdate.realMargin = (assetToUpdate.realProfit / assetToUpdate.totalMoneyIn) * 100;
             assetToUpdate.unRealMargin = (assetToUpdate.unRealProfit / assetToUpdate.totalMoneyIn) * 100;
             return;
        }).then(res=> { 
             // calculate avgPrices only if shares are greate than 0
             if ( assetToUpdate.shares > 0  && assetToUpdate.originalMoney > 0)
             {
               assetToUpdate.avgprice = assetToUpdate.originalMoney / assetToUpdate.shares;
             }
             // Calculate avgPrirce of assets sold if transaction is a sell order
             if (currentTransaction.transaction === false )
             {
               assetToUpdate.avgpriceSold = assetToUpdate.totalMoneyOut  / assetToUpdate.sharesSold ;
             }
             return ;         
       }).then(res=>{
           // Calculate gain on the transaction
            //currentTransaction.gain = (currentTransaction.price - assetToUpdate.avgprice) / assetToUpdate.avgprice * 100;
           // if this is NOT a new asset we will call updateAsset, otherwise we will create the new asset
           if (this.assetIsNew === false)
           {
             currentAssetService.updateAsset(assetToUpdate)
             .subscribe(
                 success => this.submitted = true,
                 error   => {throw"Failed to update asset"}
             )
           } else {
             this.assetService.createAsset(assetToUpdate)
             .subscribe( 
                         value =>   this.submitted = true ,
                         error =>  alert("Could not add this asset !")
                       );
           }
             return ;  
       }).then(res=>{
             // If we have made it up to this point then it is safe to save the transaction as well.
             currentTransactionService.addTransaction(currentTransaction, this.username)
             .subscribe();
             // And we can also set the submit variable to true, indicating a successful transaction
             
       }).catch(error=>{
             // Catch any errors that occur
             alert("error occured: " + error);
       });
 
   }*/
   
   goBack(): void {
     this.location.back();
   }

   addTransaction() : void {
    this.submitted = true;
    console.log(this.portfolioId);

    this.transactionService.addTransaction(this.Transaction, this.portfolioId).subscribe();
   }

}
