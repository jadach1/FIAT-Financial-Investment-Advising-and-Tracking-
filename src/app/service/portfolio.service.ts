import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Portfolio2 } from '../model/portfolio2';
import { testAsset } from '../model/testAsset';
import { TransactionsService } from './transaction.service';

interface portfolioNames{
  id: any,
  name: any
}

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  //private Url = 'http://myvmlab.senecacollege.ca:6349/portfolio';
  private Url = 'http://localhost:8080/portfolio';
  constructor(private http: HttpClient, private transactionService: TransactionsService) { }

  getPortfolio(portfolioId: number): Observable<Portfolio2> {
    let data = {portfolioId: String(portfolioId)};
    const url = this.Url + '/get/' + portfolioId;
    return this.http.get<Portfolio2>(url, {params:data});
  }

  getAllPortfolio(username: string): Observable<Portfolio2[]> {
    let data = {
                username: username
              }

    return this.http.get<Portfolio2[]>(this.Url, {params:data});
  }
 
  addPortfolio (portfolio: Portfolio2): Observable<Portfolio2> {
    return this.http.post<Portfolio2>(this.Url+'/create', portfolio, httpOptions);
  }
 
  deletePortfolio (portfolioID: Number): Observable<Portfolio2> {
    const url = this.Url+'/'+portfolioID;
    return this.http.delete<Portfolio2>(url, httpOptions);
  }
 
  updatePortfolio (portfolio: Portfolio2): Observable<any> {
    return this.http.put(this.Url, portfolio, httpOptions);
  }

  // Get all portfolio names related to the user currently logged in
  getPortfolioNames (userName: string): Observable<portfolioNames[]> {
    return this.http.get<portfolioNames[]>(this.Url + '/getNames/' + userName);
  }
}
