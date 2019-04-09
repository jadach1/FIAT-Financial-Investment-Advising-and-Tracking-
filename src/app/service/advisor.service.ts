import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import {advisor} from '../model/advisor';
import { Portfolio2 } from '../model/portfolio2';
import { testAsset } from '../model/testAsset';
import { PortfolioService } from '../service/portfolio.service';



// const endpoint = 'http://localhost:3000/api/v1/';
const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

@Injectable({
  providedIn: 'root'
})
export class AdvisorService {
  private Url = 'http://myvmlab.senecacollege.ca:6349/advisor';
  // private Url = 'http://localhost:8080/advisor';

  constructor(private http: HttpClient, private portfolioService: PortfolioService) { }

  getAdvisor(advisorId: number): Observable<advisor> {
    let data = {AdvisorId: String(advisorId)};
    const url = this.Url + '/get/' + advisorId;
    return this.http.get<advisor>(url, {params:data});
  }

  getAllAdvisor(username: string): Observable<advisor[]> {
    let data = {username: username};
    return this.http.get<advisor[]>(this.Url, {params:data});
  }
 
  addAdvisor (advisor: advisor): Observable<advisor> {
    return this.http.post<advisor>(this.Url+'/create', advisor, httpOptions);
  }
 
  deleteAdvisor (advisorID: Number): Observable<advisor> {
    const url = this.Url + '/' + advisorID;
    return this.http.delete<advisor>(url, httpOptions);
  }
 
  updateAdvisor (advisor: advisor): Observable<any> {
    return this.http.put(this.Url, advisor, httpOptions);
  }

  getRsi(symbol: string): Observable<any> {
    return this.http.get(this.Url + '/rsi/' + symbol)
  }

  getCci(symbol: string): Observable<any> {
    return this.http.get(this.Url + '/cci/' + symbol)
  }

  getStoch(symbol: string): Observable<any> {
    return this.http.get(this.Url + '/stoch/' + symbol)
  }

  getUltosc(symbol: string): Observable<any> {
    return this.http.get(this.Url + '/ultosc/' + symbol)
  }

  getAdx(symbol: string): Observable<any> {
    return this.http.get(this.Url + '/adx/' + symbol)
  }

}