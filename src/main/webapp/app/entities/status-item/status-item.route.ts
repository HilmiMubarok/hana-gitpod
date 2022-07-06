import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { IStatusItem, StatusItem } from './status-item.model';
import { StatusItemService } from './status-item.service';
import { StatusItemComponent } from './status-item.component';
import { StatusItemDetailComponent } from './status-item-detail.component';
import { StatusItemUpdateComponent } from './status-item-update.component';

@Injectable({ providedIn: 'root' })
export class StatusItemResolve implements Resolve<IStatusItem> {
  constructor(private service: StatusItemService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IStatusItem> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((statusItem: HttpResponse<StatusItem>) => {
          if (statusItem.body) {
            return of(statusItem.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<IStatusItem>) => res.body),
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
    const newItem = new StatusItem();
    return of(newItem);
  }
}

export const statusItemRoute: Routes = [
  {
    path: '',
    component: StatusItemComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.statusItem.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: StatusItemDetailComponent,
    resolve: {
      statusItem: StatusItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.statusItem.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: StatusItemUpdateComponent,
    resolve: {
      content: StatusItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.statusItem.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: StatusItemUpdateComponent,
    resolve: {
      content: StatusItemResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.statusItem.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
