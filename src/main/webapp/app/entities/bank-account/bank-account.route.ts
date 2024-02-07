import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import lodash from 'lodash';
import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { IPartyCif, PartyCif } from '../party-cif/party-cif.model';
import { PartyCifService } from '../party-cif/party-cif.service';

import { BankAccountComponent } from './bank-account.component';
import { BankAccountDetailComponent } from './bank-account-detail.component';

import { DebtorCreditRatings } from '../debtor-data/credit-rating/credit-ratings.model';
import { DebtorDataSlikSummaryDebiturViewComponent } from '../debtor-data/slick-summary/debitur/debtor-data-slik-summary-debitur-view.component';
@Injectable({ providedIn: 'root' })
export class PartyCifResolve implements Resolve<IPartyCif> {
  constructor(private service: PartyCifService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyCif> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyCif: HttpResponse<IPartyCif>) => {
          if (!lodash.has(partyCif.body.debtorData.attributes, 'shere-holder')) {
            partyCif.body.attributes['shere-holder'] = [];
          } else {
            partyCif.body.attributes['shere-holder'] = JSON.parse(partyCif.body.attributes['shere-holder']);
          }

          if (!lodash.has(partyCif.body.debtorData.attributes, 'comparison')) {
            partyCif.body.attributes['comparison'] = [];
          } else {
            partyCif.body.attributes['comparison'] = JSON.parse(partyCif.body.attributes['comparison']);
          }
          if (!lodash.has(partyCif.body.debtorData.attributes, 'comparison')) {
            partyCif.body.attributes['industry'] = new DebtorCreditRatings();
          } else {
            partyCif.body.attributes['industry'] = JSON.parse(partyCif.body.attributes['industry']);
          }

          if (partyCif.body) {
            return of(partyCif.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IPartyCif>) => res.body),
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
    const newItem = new PartyCif();
    const customerId = route.queryParams['customerId'] ? route.queryParams['customerId'] : null;
    if (customerId) {
      newItem.customerId = customerId;
    }
    const branchId = route.queryParams['branchId'] ? route.queryParams['branchId'] : null;
    if (branchId) {
      newItem.branchId = branchId;
    }
    return of(newItem);
  }
}

export const partyCifRoute: Routes = [
  {
    path: '',
    component: BankAccountComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.partyCif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: BankAccountDetailComponent,
    resolve: {
      partyCif: PartyCifResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: BankAccountDetailComponent,
    resolve: {
      content: PartyCifResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: BankAccountDetailComponent,
    resolve: {
      content: PartyCifResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/detail',
    component: BankAccountDetailComponent,
    resolve: {
      content: PartyCifResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCif.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/:managementType/detailFiles',
    component: DebtorDataSlikSummaryDebiturViewComponent,
    resolve: {
      content: PartyCifResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.partyCif.home.title',
      managementType: ['_managementType'],
    },
    canActivate: [UserRouteAccessService],
  },
];
