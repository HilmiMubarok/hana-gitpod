import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Routes, Router } from '@angular/router';

import { JhiResolvePagingParams } from 'app/shared/base/resolve-paging-params.service';
import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

import { Observable, of, EMPTY } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { ICommEvent, CommEvent } from './comm-event.model';
import { CommEventService } from './comm-event.service';
import { CommEventComponent } from './comm-event.component';
import { CommEventDetailComponent } from './comm-event-detail.component';
import { CommEventUpdateComponent } from './comm-event-update.component';

@Injectable({ providedIn: 'root' })
export class CommEventResolve implements Resolve<ICommEvent> {
  constructor(private service: CommEventService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICommEvent> | Observable<never> {
    const useTemplate = 'default';
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((commEvent: HttpResponse<CommEvent>) => {
          if (commEvent.body) {
            return of(commEvent.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    if (useTemplate) {
      return this.service.template(useTemplate).pipe(
        map((res: HttpResponse<ICommEvent>) => res.body),
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
    const newItem = new CommEvent();
    const commEventTypeId = route.queryParams['commEventTypeId'] ? route.queryParams['commEventTypeId'] : null;
    if (commEventTypeId) {
      newItem.commEventTypeId = commEventTypeId;
    }
    const purposeTypeId = route.queryParams['purposeTypeId'] ? route.queryParams['purposeTypeId'] : null;
    if (purposeTypeId) {
      newItem.purposeTypeId = purposeTypeId;
    }
    const statusItemId = route.queryParams['statusItemId'] ? route.queryParams['statusItemId'] : null;
    if (statusItemId) {
      newItem.statusItemId = statusItemId;
    }
    const partyId = route.queryParams['partyId'] ? route.queryParams['partyId'] : null;
    if (partyId) {
      newItem.partyId = partyId;
    }
    const contactMechId = route.queryParams['contactMechId'] ? route.queryParams['contactMechId'] : null;
    if (contactMechId) {
      newItem.contactMechId = contactMechId;
    }
    return of(newItem);
  }
}

export const commEventRoute: Routes = [
  {
    path: '',
    component: CommEventComponent,
    resolve: {
      pagingParams: JhiResolvePagingParams,
    },
    data: {
      authorities: ['ROLE_USER'],
      defaultSort: 'id,asc',
      pageTitle: 'losgwApp.commEvent.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CommEventDetailComponent,
    resolve: {
      commEvent: CommEventResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.commEvent.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CommEventUpdateComponent,
    resolve: {
      content: CommEventResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.commEvent.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CommEventUpdateComponent,
    resolve: {
      content: CommEventResolve,
    },
    data: {
      authorities: ['ROLE_USER'],
      pageTitle: 'losgwApp.commEvent.home.title',
    },
    canActivate: [UserRouteAccessService],
  },
];
