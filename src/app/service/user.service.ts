import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../model/user';
import { headersToString } from 'selenium-webdriver/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

interface myData {
  message: string,
  success: boolean
}

interface isLoggedIn {
  status: boolean
}

interface logoutStatus {
  success: boolean
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private usersUrl = 'http://localhost:8080/user';  // URL to node

  constructor( 
    private http: HttpClient
  ) { }
 
  getUser(username: string): Observable<User> {
    let data = {username: username};
    const url = this.usersUrl + '/' + username;
    return this.http.get<User>(url, {params:data});
  }
 
  addUser (user: User): Observable<User> {
    return this.http.post<User>(this.usersUrl+'/register', user, httpOptions);
  }
 
  deleteUser (user: User): Observable<User> {
    const username = user.username;
    const url = this.usersUrl+'/'+username;
    return this.http.delete<User>(url, httpOptions);
  }
 
  updateUser (user: User): Observable<any> {
    return this.http.put(this.usersUrl, user, httpOptions);
  }

  public currentUser() : Observable<User> {
    var username: string;
    username = <string>sessionStorage.getItem('currentUser');
    return this.getUser(username);
  }
}
