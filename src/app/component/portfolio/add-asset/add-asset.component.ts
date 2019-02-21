import { Component, OnInit } from '@angular/core';
import { NavbarService } from '../../../service/navbar.service';
import { SidebarService } from '../../../service/sidebar.service'
import { UserService } from '../../../service/user.service'
import { AuthenticationService } from '../../../service/authentication.service'

@Component({
  selector: 'app-add-asset',
  templateUrl: './add-asset.component.html',
  styleUrls: ['./add-asset.component.css']
})
export class AddAssetComponent implements OnInit {

  constructor(
    public nav: NavbarService, 
    public sidebar: SidebarService, 
    private authService: AuthenticationService, 
    private userService: UserService) { 
      this.nav.show();
      this.sidebar.show();
  }

  ngOnInit() {
  }

}
