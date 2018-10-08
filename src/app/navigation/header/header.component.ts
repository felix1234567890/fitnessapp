import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { AuthService } from '../../auth/auth.service';
import { Subscription } from 'rxjs'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  isAuth:boolean;
  authSub: Subscription;
  @Output() sidenavToggle = new EventEmitter<void>();

  constructor(private authService:AuthService) { }

  ngOnInit() {
  this.authSub = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    })
  }
  onToggleSidenav(){
    this.sidenavToggle.emit()
  }
  onLogout(){
    this.authService.logout();
  }
  ngOnDestroy(){
    this.authSub.unsubscribe();
  }
}
