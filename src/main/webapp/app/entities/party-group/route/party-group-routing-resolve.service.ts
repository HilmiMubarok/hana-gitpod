import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPartyGroup, PartyGroup } from '../party-group.model';
import { PartyGroupService } from '../service/party-group.service';

@Injectable({ providedIn: 'root' })
export class PartyGroupRoutingResolveService implements Resolve<IPartyGroup> {
  constructor(protected service: PartyGroupService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyGroup> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyGroup: HttpResponse<PartyGroup>) => {
          if (partyGroup.body) {
            return of(partyGroup.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PartyGroup());
  }
}
