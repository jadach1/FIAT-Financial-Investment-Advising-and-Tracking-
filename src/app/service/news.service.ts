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
import { promise } from 'protractor';

// This is the object which we will return to the component
interface newsObject{
  title:       any
  description: any
  url:         any 
  author:      any
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class NewsService {

 

  constructor(private http: HttpClient) { }

  /*
  Calls the news API service,
  returns a blob of json which needs to be parsed
  */
  public getNews(URL: string): Observable<newsObject> {
     return   this.http.get<newsObject>(URL)
  }
}
