import { Injectable } from '@angular/core';
import { Location } from '@angular/common';

import { AuthServerProvider } from 'app/core/auth/auth-session.service';
import { Logout } from './logout.model';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(private location: Location, private authServerProvider: AuthServerProvider) {}

  login(): void {
    // If you have configured multiple OIDC providers, then, you can update this URL to /login.
    // It will show a Spring Security generated login page with links to configured OIDC providers.
    location.href = `${location.origin}${this.location.prepareExternalUrl('oauth2/authorization/oidc')}`;
  }

  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

  private deleteCookie(cname: string, cvalue: any): void {
    const d = new Date();
    d.setTime(d.getTime() + -1 * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + d.toUTCString();
    document.cookie = cname + '=' + cvalue + ';' + expires + ';';
  }

  logout(): void {
    this.authServerProvider.logout().subscribe((logout: Logout) => {
      this.deleteCookie('XSRF-TOKEN', this.getLocStor('XSRF-TOKEN'));
      window.location.href = logout.logoutUrl;
    });
  }
}
