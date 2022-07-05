import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPartyPostalAddress, PartyPostalAddress } from '../party-postal-address.model';
import { PartyPostalAddressService } from '../service/party-postal-address.service';

@Injectable({ providedIn: 'root' })
export class PartyPostalAddressRoutingResolveService implements Resolve<IPartyPostalAddress> {
  constructor(protected service: PartyPostalAddressService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPartyPostalAddress> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((partyPostalAddress: HttpResponse<PartyPostalAddress>) => {
          if (partyPostalAddress.body) {
            return of(partyPostalAddress.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new PartyPostalAddress());
  }
}
