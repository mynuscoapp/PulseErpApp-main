import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Add this
import { Observable } from 'rxjs'; // Add this
import { BitrixLogin } from 'src/app/demo/models/BitrixLogin'; // Adjust the import path as necessary
import { BitrixVerifyEmail } from 'src/app/demo/models/BitrixVerifyEmail'; // Adjust the import path as necessary
import { BitrixResetPassword } from 'src/app/demo/models/BitrixResetPassword';
import { BitrixForgotPassword } from 'src/app/demo/models/BitrixForgotPassword'; // Adjust the import path as necessary
import { environment } from 'src/environments/environment'; // Adjust the import path as necessary
import { BitrixVerifyResetCode } from 'src/app/demo/models/BitrixVerifyResetCode';




@Injectable({
  providedIn: 'root',
})
  
export class LoginService {

  isAuthenticated: boolean = false;
  constructor(private http: HttpClient) { }

  bitrixLogin: BitrixLogin[];
  bitrixVerifyEmail: BitrixVerifyEmail[];
  bitrixResetPassword: BitrixResetPassword[];
  bitrixForgotPassword: BitrixForgotPassword[];
  bitrixVerifyResetCode: BitrixVerifyResetCode[];

  private bitrixLoginUrl = `${environment.bitrixStockUrl}/login`;
  private bitrixVerifyEmailUrl = `${environment.bitrixStockUrl}/verify-email`;
  private bitrixResetPasswordUrl = `${environment.bitrixStockUrl}/reset-password`;
  private bitrixForgotPasswordUrl = `${environment.bitrixStockUrl}/forgot-password`;
  private bitrixVerifyResetCodeUrl = `${environment.bitrixStockUrl}/verify-reset-code`;
  


  

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
  login(email: string, password: string): Observable<any> {
    // Change the URL to your backend login endpoint
    return this.http.post<any>(this.bitrixLoginUrl, { email, password });
  }

  verifyEmail(email: string): Observable<{ exists: boolean }> {
    return this.http.post<{ exists: boolean }>(this.bitrixVerifyEmailUrl, { email });
  }
  

  // updatePassword(email: string,newPassword: string): Observable<{ success: boolean; message: string }> {
  //   return this.http.post<{ success: boolean; message: string }>(this.bitrixUpdatePasswordUrl, {
  //     email,
  //     newPassword,
  //   });
  // }

  forgotPassword(email: string) {
  return this.http.post(this.bitrixForgotPasswordUrl, { email });
}

verifyResetCode(email: string, resetCode: string) {
  return this.http.post(this.bitrixVerifyResetCodeUrl, { email, resetCode });
}

resetPassword(email: string, resetCode: string, newPassword: string) {
  return this.http.post(this.bitrixResetPasswordUrl, { email, resetCode, newPassword });
}


}