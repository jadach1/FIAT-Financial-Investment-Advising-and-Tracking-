import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Portfolio2 } from '../model/portfolio2';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {
  private Url = 'http://localhost:8080/portfolio';
  constructor(private http: HttpClient) { }

  getPortfolio(portfolioId: number): Observable<Portfolio2> {
    let data = {portfolioId: String(portfolioId)};
    const url = this.Url + '/' + portfolioId;
    return this.http.get<Portfolio2>(url, {params:data});
  }

  getAllPortfolio(username: string): Observable<Portfolio2[]> {
    let data = {username: username};
    return this.http.get<Portfolio2[]>(this.Url, {params:data});
  }
 
  addPortfolio (portfolio: Portfolio2): Observable<Portfolio2> {
    return this.http.post<Portfolio2>(this.Url+'/create', portfolio, httpOptions);
  }
 
  deletePortfolio (portfolio: Portfolio2): Observable<Portfolio2> {
    const username = portfolio.username;
    const url = this.Url+'/'+username;
    return this.http.delete<Portfolio2>(url, httpOptions);
  }
 
  updatePortfolio (portfolio: Portfolio2): Observable<any> {
    return this.http.put(this.Url, portfolio, httpOptions);
  }

}
