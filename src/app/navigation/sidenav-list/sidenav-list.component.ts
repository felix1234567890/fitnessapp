import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import {Subscription, } from 'rxjs'

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent implements OnInit {
 @Output() closeSidenav = new EventEmitter<void>()

 isAuth:boolean;
 authSub: Subscription;
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authSub = this.authService.authChange.subscribe(authStatus =>{
      this.isAuth = authStatus;
    })
  }
  
  onClose(){
    this.closeSidenav.emit();
  }
  onLogout(){
    this.onClose()
    this.authService.logout();
  }

}
