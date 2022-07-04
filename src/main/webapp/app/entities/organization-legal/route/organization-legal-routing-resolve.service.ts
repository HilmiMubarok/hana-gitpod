import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrganizationLegal, OrganizationLegal } from '../organization-legal.model';
import { OrganizationLegalService } from '../service/organization-legal.service';

@Injectable({ providedIn: 'root' })
export class OrganizationLegalRoutingResolveService implements Resolve<IOrganizationLegal> {
  constructor(protected service: OrganizationLegalService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganizationLegal> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organizationLegal: HttpResponse<OrganizationLegal>) => {
          if (organizationLegal.body) {
            return of(organizationLegal.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrganizationLegal());
  }
}
