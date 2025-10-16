import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { ApplicationConfigService } from '../config/application-config.service';
import { Logout } from 'app/login/logout.model';

@Injectable({ providedIn: 'root' })
export class AuthServerProvider {
  constructor(private http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  logout(): Observable<Logout> {
    const logoutUrl = this.applicationConfigService.getEndpointFor('api/logout');
    return this.http.post<Logout>(logoutUrl, {});
  }
}
