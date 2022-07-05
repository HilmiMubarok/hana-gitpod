import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEmployment, Employment } from '../employment.model';
import { EmploymentService } from '../service/employment.service';

@Injectable({ providedIn: 'root' })
export class EmploymentRoutingResolveService implements Resolve<IEmployment> {
  constructor(protected service: EmploymentService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEmployment> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((employment: HttpResponse<Employment>) => {
          if (employment.body) {
            return of(employment.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Employment());
  }
}
