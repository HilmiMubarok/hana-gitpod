import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

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

  public isCredamOnDppkFinalize(router: Router): boolean {
    const role = this.getRole();
    const path = router.url.split('/')[1];

    console.log('isCredamOnDppkFinalize', { role, path, res: role === 'CREDIT_ADMIN' && path === 'finalize-dppk' });

    return role === 'CREDIT_ADMIN' && path === 'finalize-dppk';
  }
}
