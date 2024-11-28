import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

interface listOfPicInterface {
  applicationId: number | null;
  attributes: any | null;
  fromDate: string | null;
  fromPartyId: any;
  fromPartyName: any;
  id: number | null;
  idDelegation: any;
  partyId: string | null;
  partyName: string | null;
  positionId: any;
  positionName: any;
  relationTypeDescription: string | null;
  relationTypeId: string | null;
  roleDescription: string | null;
  roleId: string | null;
  thruDate: string | null;
}

@Injectable({ providedIn: 'root' })
export class CredamService {
  public getRole(): string | null {
    return (
      document.cookie
        .split(';')
        .find(c => c.trim().startsWith(`POSO=`))
        ?.split('=')[1] || null
    );
  }

  public isCredamOnDppkFinalize(router: Router, listOfPic: listOfPicInterface[]): boolean {
    const path = router.url.split('/')[1];
    const listOfPicLength = listOfPic.length;

    const listOfPicCondition =
      listOfPicLength === 1 && listOfPic[0].roleId === 'CREDIT_ADMIN' && listOfPic[0].thruDate?.split('-')[0] === '9999';

    console.log('isCredamOnDppkFinalize', {
      path,
      listOfPicLength,
      listOfPicCondition,
      res: path === 'finalize-dppk' && listOfPicCondition,
    });

    return path === 'finalize-dppk' && listOfPicCondition;
  }

  public isCredamOnIDD(): boolean {
    const role = this.getRole();
    return role === 'CREDIT_ADMIN';
  }
}
