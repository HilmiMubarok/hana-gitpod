import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PostalAddressUpdateComponent } from './postal-address-update.component';
import { IPostalAddress, PostalAddress } from './postal-address.model';
import { PostalAddressService } from './postal-address.service';
import { EMPTY, Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PostalAddressResolve implements Resolve<IPostalAddress> {
  constructor(private service: PostalAddressService, private router: Router) {}
  resolve(route: ActivatedRouteSnapshot): Observable<IPostalAddress> | Observable<never> {
    const newItem = new PostalAddress();
    return of(newItem);
  }
}

export const postalAddressRoute: Routes = [
  {
    path: '',
    component: PostalAddressUpdateComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      pageTitle: 'losgwApp.postalAddress.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
