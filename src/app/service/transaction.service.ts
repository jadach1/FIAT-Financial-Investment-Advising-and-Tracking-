import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { transaction } from '../model/transactions';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TransactionsService {
  private Url = 'http://localhost:8080/portfolio/';  // URL to web api

  constructor(private http: HttpClient) { }
 
  // get all transactions regardless of bought or sold
  getAllTransactions (): Observable<transaction[]> {
return this.http.get<transaction[]>(this.Url+'allTransactions')
  }

  // get all transactions depending on transaction type
  getTransactions (transactionType: string): Observable<transaction[]> {
    if(transactionType==="buy")
    {
      return this.http.get<transaction[]>(this.Url+'allTransactions/:true')
    }  else if(transactionType==="sell") {
      return this.http.get<transaction[]>(this.Url+'allTransactions/:false')
    } else {
      return this.http.get<transaction[]>(this.Url+'allTransactions')
    }
  }

   // get all transactions of an Asset depending on transaction type
   getTransactionsByAsset (transactionType: string, assetSymbol: string): Observable<transaction[]> {
    if(transactionType==="true")
    {
      return this.http.get<transaction[]>(this.Url+'allAssetTypeTransactions/true/' + assetSymbol)
    }  else if(transactionType==="false") {
      return this.http.get<transaction[]>(this.Url+'allAssetTypeTransactions/false/' + assetSymbol)
    }
    // Return all transactions belonging to the asset Symbol 
    else 
    { 
      return this.http.get<transaction[]>(this.Url+'allAssetTransactions/' + assetSymbol)
    }
  }

  addTransaction (asset: transaction): Observable<transaction> {
    return this.http.post<transaction>(this.Url+'Transaction', asset, httpOptions);
  }
}
