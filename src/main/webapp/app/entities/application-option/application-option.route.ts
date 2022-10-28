import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { Observable, of, EMPTY } from 'rxjs';
import { ApplicationOption, IApplicationOption } from './application-option.model';
import { ApplicationOptionService } from './application-option.service';
import { ApplicationOptionComponent } from './application-option.component';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

@Injectable({ providedIn: 'root' })
export class ApplicationOptionResolve implements Resolve<IApplicationOption> {
  constructor(private service: ApplicationOptionService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IApplicationOption> | Observable<never> {
    return of(new ApplicationOption());
  }
}

export const applicationOptionRoute: Routes = [
  {
    path: '',
    component: ApplicationOptionComponent,
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'Application Option',
    },
    canActivate: [UserRouteAccessService],
  },
];
