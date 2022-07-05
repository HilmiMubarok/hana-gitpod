import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IOrganizationManagement, OrganizationManagement } from '../organization-management.model';
import { OrganizationManagementService } from '../service/organization-management.service';

@Injectable({ providedIn: 'root' })
export class OrganizationManagementRoutingResolveService implements Resolve<IOrganizationManagement> {
  constructor(protected service: OrganizationManagementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IOrganizationManagement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((organizationManagement: HttpResponse<OrganizationManagement>) => {
          if (organizationManagement.body) {
            return of(organizationManagement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new OrganizationManagement());
  }
}
