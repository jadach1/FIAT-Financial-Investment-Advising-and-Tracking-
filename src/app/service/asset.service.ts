import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { asset } from '../model/asset';
import { Observable} from 'rxjs';
import { TransactionsService } from '../service/transaction.service'
import { transaction } from '../model/transactions'
import { testAsset } from '../model/testAsset'
import { of } from 'rxjs'
import { UserService } from '../service/user.service'
import { User } from '../model/user'
import { analyzeAndValidateNgModules } from '@angular/compiler';



const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AssetService {

  //private Url = 'http://myvmlab.senecacollege.ca:6349/portfolio/';  // URL to web api
  private Url = 'http://localhost:8080/portfolio/';
  private singleAsset: testAsset;
  private assetList: testAsset[];
  private transactionList: transaction[];
  private symbolList: string[];
  private username: string;


  constructor(private http:               HttpClient, 
              private transactionService: TransactionsService, 
              private userService:        UserService) {
    this.username = <string>sessionStorage.getItem('currentUser'); 
   }

  // Return a single asset from the database table assets
  getAsset(symbol: string): Observable<asset> {
    const url = `${this.Url + 'currentassets'}/${symbol}`;
    let existingAsset = new asset();
    //return this.http.get<asset>(this.Url+'currentassets'+'/'+symbol);
    return this.http.get<asset>(url);
  }

  // return all assets from the database table assets
  getAllAssets (): Observable<asset[]> {
    return this.http.get<asset[]>(this.Url+'currentassets')
  }

  // create an asset
  createAsset(asset: asset): Observable<asset> {
    return this.http.post<asset>(this.Url+'currentassets', asset, httpOptions);
  }

  // update an asset in database
  updateAsset (asset: asset): Observable<any> {
    return this.http.put(this.Url+'currentassets', asset, httpOptions);
  }

  getPrice(symbol: string): Observable<any> {
    return this.http.get('http://myvmlab.senecacollege.ca:6349/asset/' + symbol)
  }

  getConversion(): Observable<any> {
    return this.http.get('http://myvmlab.senecacollege.ca:6349/convert')
  }

  // Get all portfolio names related to the user currently logged in
  getAssetNames (id: string): Observable<any[]> {
    console.log("call")
    return this.http.get<any[]>(this.Url + 'getAssetNames/' + id);
  }
}

