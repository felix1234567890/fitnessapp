import { User } from "./user.model";
import { AuthData } from "./auth-data.model";
import { Subject } from "rxjs";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AngularFireAuth } from "angularfire2/auth";
import { TrainingService } from "../training/training/training.service";
import { MatSnackBarModule, MatSnackBar } from "@angular/material";

@Injectable()
export class AuthService {
  private user: User;
  authChange = new Subject<boolean>();
  private isAuthenticated: boolean = false;

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private trainingService: TrainingService,
    private snackBar: MatSnackBar
  ) {}

  initAuthListener() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(["/training"]);
      } else {
        this.authChange.next(false);
        this.router.navigate(["/login"]);
        this.isAuthenticated = false;
        this.trainingService.cancelSuscriptions();
      }
    });
  }

  registerUser(authData: AuthData) {
    this.afAuth.auth
      .createUserWithEmailAndPassword(authData.email, authData.password)
      .then(result => console.log(result))
      .catch(error => this.snackBar.open(error.message, null, {
        duration: 3000
      }));
    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
  }
  login(authData: AuthData) {
    this.afAuth.auth
      .signInWithEmailAndPassword(authData.email, authData.password)
      .then(result => console.log(result))
      .catch(error => this.snackBar.open(error.message, null, {
        duration: 3000
      }));

    this.user = {
      email: authData.email,
      userId: Math.round(Math.random() * 10000).toString()
    };
  }
  logout() {
    this.user = null;
    this.router.navigate(["/login"]);
    this.authChange.next(false);
    this.isAuthenticated = false;
  }
  getUser() {
    return { ...this.user };
  }
  isAuth() {
    return this.isAuthenticated;
  }
  
}
