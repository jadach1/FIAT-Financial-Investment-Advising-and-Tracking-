import { Component, OnInit } from '@angular/core';
import { SidebarService } from '../../service/sidebar.service'
import { UserService } from '../../service/user.service'
import { PortfolioService } from '../../service/portfolio.service'
import { Portfolio2 } from '../../model/portfolio2'
import { User } from '../../model/user'

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  public user: User;
  private portfolios: Portfolio2[] = new Array();
  private watchlists: Portfolio2[] = new Array();

  constructor(public sidebar: SidebarService, public userService: UserService, public portfolioService: PortfolioService) { 
    this.user = new User();
    this.userService.currentUser().subscribe(
      res => {
        this.user = res;
        this.buildPortfolios();
    });
  }

  ngOnInit() {
  }

  buildPortfolios(){
    this.portfolioService.getAllPortfolio(this.user.username).subscribe(
      res => {
        res.forEach(portfolio => {
          if (portfolio.portfolioType == true){
            this.portfolios.push(portfolio);
          }else{
            this.watchlists.push(portfolio);
          }
        });
      }
    );
  }

}
