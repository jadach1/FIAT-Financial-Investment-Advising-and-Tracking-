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
 
  deleteAdvisor (advisor: advisor): Observable<advisor> {
    const username = advisor.username;
    const url = this.Url+'/'+advisor;
    return this.http.delete<advisor>(url, httpOptions);
  }
 
  updateAdvisor (advisor: advisor): Observable<any> {
    return this.http.put(this.Url, advisor, httpOptions);
  }


}
