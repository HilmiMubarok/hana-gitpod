import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { tap } from 'rxjs/operators';

import { AuthServerProvider } from 'app/core/auth/auth-session.service';
import { AccountService } from 'app/core/auth/account.service';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private location: Location,
    private authServerProvider: AuthServerProvider,
    private accountService: AccountService,
    private stateStorageService: StateStorageService,
    private router: Router
  ) {}

  login(): void {
    // If you have configured multiple OIDC providers, then, you can update this URL to /login.
    // It will show a Spring Security generated login page with links to configured OIDC providers.
    location.href = `${location.origin}${this.location.prepareExternalUrl('oauth2/authorization/oidc')}`;
    // location.href = `${location.origin}${this.location.prepareExternalUrl('oauth2/authorization/oidc?ngsw-bypass=true')}`;
  }

  logout() {
    return this.authServerProvider
      .logout()
      .pipe(tap(logout => this.accountService.clearAuthenticationState()))
      .subscribe({
        next: logout => (window.location.href = logout.logoutUrl),
        error: () => void this.router.navigate(['']),
      });
  }
}
