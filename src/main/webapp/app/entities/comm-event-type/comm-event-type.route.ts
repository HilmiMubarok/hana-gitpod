import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICommEventType, CommEventType } from './comm-event-type.model';
import { CommEventTypeService } from './comm-event-type.service';
import { CommEventTypeComponent } from './comm-event-type.component';
import { CommEventTypeDetailComponent } from './comm-event-type-detail.component';
import { CommEventTypeUpdateComponent } from './comm-event-type-update.component';

@Injectable({ providedIn: 'root' })
export class CommEventTypeResolve implements Resolve<ICommEventType> {
  constructor(private service: CommEventTypeService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICommEventType> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((commEventType: HttpResponse<CommEventType>) => {
          if (commEventType.body) {
            return of(commEventType.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICommEventType>) => res.body),
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
    const newItem = new CommEventType();
    const parentId = route.queryParams['parentId'] ? route.queryParams['parentId'] : null;
    if (parentId) {
      newItem.parentId = parentId;
    }
    const contactTypeId = route.queryParams['contactTypeId'] ? route.queryParams['contactTypeId'] : null;
    if (contactTypeId) {
      newItem.contactTypeId = contactTypeId;
    }
    return of(newItem);
  }
}

export const commEventTypeRoute: Routes = [
  {
    path: '',
    component: CommEventTypeComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.commEventType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommEventTypeDetailComponent,
    resolve: {
      commEventType: CommEventTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.commEventType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommEventTypeUpdateComponent,
    resolve: {
      content: CommEventTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.commEventType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommEventTypeUpdateComponent,
    resolve: {
      content: CommEventTypeResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.commEventType.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
