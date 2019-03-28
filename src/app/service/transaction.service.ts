import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { transaction } from '../model/transactions';
import { User } from '../model/user'
import { UserService } from '../service/user.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {

  //private Url = 'http://myvmlab.senecacollege.ca:6349/portfolio/';  // URL to web api
  private Url = 'http://localhost:8080/portfolio/';
  private user: User;

  constructor(private http: HttpClient, private userService: UserService) { 
  }
 
  // get all transactions regardless of bought or sold
  getAllTransactions (portfolioId: string): Observable<transaction[]> {
    let data = {'portfolioId': portfolioId};
    return this.http.get<transaction[]>(this.Url+'allTransactions', {params: data})
  }

  // get all transactions depending on transaction type
  getTransactions (transactionType: string, portfolioId: string): Observable<transaction[]> {
    let data = {'portfolioId': portfolioId};
    if(transactionType==="buy")
    {
      return this.http.get<transaction[]>(this.Url+'allTransactions/:true', {params: data})
    }  else if(transactionType==="sell") {
      return this.http.get<transaction[]>(this.Url+'allTransactions/:false', {params: data})
    } else {
      return this.http.get<transaction[]>(this.Url+'allTransactions', {params: data})
    }
  }

   // get all transactions of an Asset depending on transaction type
   getTransactionsByAsset (transactionType: string, assetSymbol: string, portfolioId: string): Observable<transaction[]> {
    let data = {'portfolioId': portfolioId};
    console.log(data);
    if(transactionType==="true")
    {
      return this.http.get<transaction[]>(this.Url+'allAssetTypeTransactions/true/' + assetSymbol, {params: data})
    }  else if(transactionType==="false") {
      return this.http.get<transaction[]>(this.Url+'allAssetTypeTransactions/false/' + assetSymbol, {params: data})
    }
    // Return all transactions belonging to the asset Symbol 
    else 
    { 
      return this.http.get<transaction[]>(this.Url+'allAssetTransactions/' + assetSymbol, {params: data})
    }
  }

  addTransaction (asset: transaction, portfolioID: number): Observable<transaction> {
    asset.portfolioId = portfolioID;
    return this.http.post<transaction>(this.Url+'Transaction', asset, httpOptions);
  }
}
