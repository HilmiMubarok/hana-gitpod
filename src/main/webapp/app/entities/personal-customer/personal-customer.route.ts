import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IPersonalCustomer, PersonalCustomer } from './personal-customer.model';
import { PersonalCustomerService } from './personal-customer.service';
import { PersonalCustomerComponent } from './personal-customer.component';
import { PersonalCustomerDetailComponent } from './personal-customer-detail.component';
import { PersonalCustomerUpdateComponent } from './personal-customer-update.component';

@Injectable({ providedIn: 'root' })
export class PersonalCustomerResolve implements Resolve<IPersonalCustomer> {
  constructor(private service: PersonalCustomerService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPersonalCustomer> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((personalCustomer: HttpResponse<PersonalCustomer>) => {
          if (personalCustomer.body) {
            return of(personalCustomer.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPersonalCustomer>) => res.body),
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
    const newItem = new PersonalCustomer();
    const partyTypeId = route.queryParams['partyTypeId'] ? route.queryParams['partyTypeId'] : null;
    if (partyTypeId) {
      newItem.partyTypeId = partyTypeId;
    }
    const religionTypeId = route.queryParams['religionTypeId'] ? route.queryParams['religionTypeId'] : null;
    if (religionTypeId) {
      newItem.religionTypeId = religionTypeId;
    }
    const workTypeId = route.queryParams['workTypeId'] ? route.queryParams['workTypeId'] : null;
    if (workTypeId) {
      newItem.workTypeId = workTypeId;
    }
    return of(newItem);
  }
}

export const personalCustomerRoute: Routes = [
  {
    path: '',
    component: PersonalCustomerComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.personalCustomer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PersonalCustomerDetailComponent,
    resolve: {
      personalCustomer: PersonalCustomerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.personalCustomer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PersonalCustomerUpdateComponent,
    resolve: {
      content: PersonalCustomerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.personalCustomer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PersonalCustomerUpdateComponent,
    resolve: {
      content: PersonalCustomerResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.personalCustomer.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
