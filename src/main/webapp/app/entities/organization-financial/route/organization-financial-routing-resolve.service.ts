import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrganizationFinancial, OrganizationFinancial } from '../organization-financial.model';
import { OrganizationFinancialService } from '../service/organization-financial.service';

@Injectable({ providedIn: 'root' })
export class OrganizationFinancialRoutingResolveService implements Resolve<IOrganizationFinancial> {
  constructor(protected service: OrganizationFinancialService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganizationFinancial> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organizationFinancial: HttpResponse<OrganizationFinancial>) => {
          if (organizationFinancial.body) {
            return of(organizationFinancial.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrganizationFinancial());
  }
}
