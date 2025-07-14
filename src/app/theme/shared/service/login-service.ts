import { Injectable } from '@angular/core';



@Injectable({
  providedIn: 'root',
})
export class LoginService {

  isAuthenticated: boolean = false;
  constructor() {

  }

  IsLogedIn() {
    return this.isAuthenticated;
  }

  setLogedIn() {
    this.isAuthenticated = true;
    return this.isAuthenticated;
  }

  resetlogin() {
    this.isAuthenticated = false;
  }
}