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
  private Url = 'http://localhost:8080/portfolio/';  // URL to web api
  private user: User;

  constructor(private http: HttpClient, private userService: UserService) { 
    let username = <string>sessionStorage.getItem('currentUser');  
  }
 
  // get all transactions regardless of bought or sold
  getAllTransactions (username: string): Observable<transaction[]> {
    let data = {'username': username};
    return this.http.get<transaction[]>(this.Url+'allTransactions', {params: data})
  }

  // get all transactions depending on transaction type
  getTransactions (transactionType: string, username: string): Observable<transaction[]> {
    let data = {'username': username};
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
   getTransactionsByAsset (transactionType: string, assetSymbol: string, username: string): Observable<transaction[]> {
    let data = {'username': username};
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

  addTransaction (asset: transaction, username: string): Observable<transaction> {
    asset.username = username;
    console.log(asset.username)
    console.log(asset);
    return this.http.post<transaction>(this.Url+'Transaction', asset, httpOptions);
  }

  getTransactionSymbols(username: string): Observable<string[]>{
    let data = {username: username};
    return this.http.get<string[]>(this.Url+'transactionsBySymbol', {params: data})
  }
}
