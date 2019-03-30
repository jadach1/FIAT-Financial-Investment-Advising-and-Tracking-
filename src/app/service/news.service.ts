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

  private url         = "https://newsapi.org/v2/everything?q="
  private searchSymbol
  private appendToURL = "&from="
  private date
  private key         = "&sortBy=publishedAt&apiKey=334280a9530a40ffaf133c91f01013e6"
  private news: newsObject //      newsObject

  constructor(private http: HttpClient) { }

  /*
    this function generates a date in the format
    yyyy-mm-dd
  */
  private  generateDate(): void {
    console.log("date")
    const date  = new Date()
    const day   = date.getDate()
    const month = date.getMonth()
    const year  = date.getFullYear()
    this.date   = year+"-"+month+"-"+day
  }

  private  setSymbol(symbol: string): void {
    console.log("symbol")
    this.searchSymbol = symbol
  }

  /*
  This function will create a url for us to fetch the news feed,
  we will generate today's date , and set the search symbol we are interested in,
  we will then return the finished url 
  */
  private async createURL(symbol: string){
      await this.generateDate()
      await this.setSymbol(symbol)
      console.log("create url")
      return this.url + this.searchSymbol + this.appendToURL + this.date + this.key
  }


  private async gg(){
    
    await this.createURL("xcon")
    
  //   return this.news = [{
  //     title:       "hi",
  // description: "description",
  // url:         "url",
  // author:      "author"
  //   }]
  }
  /*
  Calls the news API service,
  returns a blob of json which needs to be parsed
  */
  public getNews(symbol: string): Observable<newsObject> {
    let URL = 'https://newsapi.org/v2/everything?q=nvda&from=2019-03-27&sortBy=publishedAt&apiKey=334280a9530a40ffaf133c91f01013e6'
    // this.createURL(symbol)
    //     .then(
    //             res=>{URL = res, console.log("res is news " + res) },
    //             err=>console.log("bad url formation")
    //     )
     return   this.http.get<newsObject>(URL)
    //  .subscribe(
    //         res => { Object.keys(res['articles']
    //                   .forEach(function(element, index){
    //                       console.log("first index is  " + index)
    //                       console.log(Object.keys(element['title']))
    //                       this.news[index] = {
    //                         title: element['title']
    //                       }
    //                     })
    //                 )
    //               },
    //         err => console.log("error in get news"),
    //         () => {console.log("done with news "), console.log(this.news)}
    //     )
        // return this.news
  }
}
