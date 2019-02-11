import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TokenStorage {

  /**
   * Get access token
   * @returns {Observable<string>}
   */
  public getAccessToken(): Observable<string> {
    const token: string = <string>sessionStorage.getItem('accessToken');
    return of(token);
  }

  /**
   * Get refresh token
   * @returns {Observable<string>}
   */
  public getRefreshToken(): Observable<string> {
    const token: string = <string>sessionStorage.getItem('refreshToken');
    return of(token);
  }

  /**
   * Set access token
   * @returns {TokenStorage}
   */
  public setAccessToken(token: string): TokenStorage {
    sessionStorage.setItem('accessToken', token);

    return this;
  }

   /**
   * Set refresh token
   * @returns {TokenStorage}
   */
  public setRefreshToken(token: string): TokenStorage {
    sessionStorage.setItem('refreshToken', token);

    return this;
  }

   /**
   * Remove tokens
   */
  public clear() {
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  }
}
