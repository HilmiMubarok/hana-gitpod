import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Routes, Router } from '@angular/router';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICreditApplication, CreditApplication } from './credit-application.model';
import { CreditApplicationService } from './credit-application.service';

@Injectable({ providedIn: 'root' })
export class CreditApplicationResolve implements Resolve<ICreditApplication> {
  constructor(private service: CreditApplicationService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICreditApplication> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((creditApplication: HttpResponse<CreditApplication>) => {
          if (creditApplication.body) {
            return of(creditApplication.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICreditApplication>) => res.body),
        mergeMap(res => {
          if (res) {
            return of(res);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    const newItem = new CreditApplication();
    return of(newItem);
  }
}

export const creditApplicationRoute: Routes = [];
