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

/*
 used by the method checkIfValueExists
 keeps a count of how many values are in a field of a table
*/
interface valueCount {
  email: any,
  username: any
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

//  private usersUrl = 'http://myvmlab.senecacollege.ca:6349/user';  // URL to node
  private usersUrl = 'http://localhost:8080/user';

  constructor( 
    private http: HttpClient
  ) { }
 
  getUser(username: string): any {
    let data = {username: username};
    const url = this.usersUrl + '/' + username;
    return this.http.get(url, {params:data});
  }
 
  /* Takes 2 params, a field and string
     It will then pass a request to the back API in the form
     select count(*) from users where $field=$value
     Returns a count of how many values are in a field of a table*/
  checkIfValueExists(field: any, value: any) {
    const url = `${this.usersUrl}/${field}/${value}`;
    return this.http.get(url);
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
