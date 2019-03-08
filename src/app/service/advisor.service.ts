import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { promise } from 'protractor';



const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json'
  })
};

interface bullshit {
  username: string;
  password: string;
  }



@Injectable({
  providedIn: 'root'
}) 

export class AdvisorService {

  constructor(private http: HttpClient) { }



  test(): void {
      let url = 'https://www.alphavantage.co/query?function=RSI&symbol=MSFT&interval=weekly&time_period=10&series_type=open&apikey=demo'
       let uerl = 'http://myvmlab.senecacollege.ca:6349/user/admin'
     let jj: bullshit

     let pull =        this.http.get(url)
                      .subscribe(
                          data => console.log(data)
                         )
               
    let pfdull =        this.http.get<bullshit>(uerl)
    .subscribe(
        data => {console.log(data.username + " " + data.password), jj = data}, 
        err => alert("error"),
        () => alert("done " + jj.username)
      )
    //   // let x = () => {
    //   //   console.log("Car")
    //   //   console.log(pull.car["0"])
    //   // }
    //   //x();
    //   console.log(pull)
    //   console.log("that was pull")
    
      //console.log(pull)
       //return this.http.get<any>(url)
    }
  
}
