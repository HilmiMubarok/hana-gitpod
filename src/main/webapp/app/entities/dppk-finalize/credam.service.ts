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
  public getRole(param = 'POSO='): string | null {
    const cookie = document.cookie.split(';').find(c => c.trim().startsWith(param));
    return cookie ? cookie.split('=')[1] : null;
  }

  public isCredamOnDPPKReview(): boolean {
    const role = this.getRole();
    const credamDppkReviewRoles = ['CREDIT_ADMIN_DEPT_HEAD', 'CREDIT_ADMIN_DIV_HEAD', 'CREDIT_ADMIN_TEAM_LEAD', 'CREDIT_ADMIN_UNIT_HEAD'];

    return credamDppkReviewRoles.includes(role);
  }

  public isCredamOnDppkFinalize(router: Router, listOfPic: listOfPicInterface[]): boolean {
    const path = router.url.split('/')[1];
    const role = this.getRole('POSOPARID=');

    if (path === 'review-dppk') {
      return this.isCredamOnDPPKReview();
    }

    if (!listOfPic || listOfPic.length === 0) {
      return false;
    }

    const listOfPicLength = listOfPic.length;

    const listOfPicCondition =
      listOfPicLength === 1 &&
      listOfPic[0].roleId === 'CREDIT_ADMIN' &&
      listOfPic[0].thruDate?.split('-')[0] === '9999' &&
      listOfPic[0].partyId === role;

    return path === 'finalize-dppk' && listOfPicCondition;
  }

  public isCredamOnIDD(): boolean {
    const role = this.getRole();
    return role === 'CREDIT_ADMIN';
  }
}
