import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPartyCif } from '../party-cif/party-cif.model';
import { LoginService } from 'app/login/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'jhi-credit-proposal-new-dialog',
  templateUrl: './credit-proposal-new-dialog.component.html',
})
export class CreditProposalNewDialogComponent {
  public partyCif: IPartyCif;
  public internalIdLocStor: string;
  public positionIdLocStor: string;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      partyCif: IPartyCif;
    },
    private _dialog: MatDialogRef<CreditProposalNewDialogComponent>,
    private loginService: LoginService,
    protected router: Router
  ) {
    this.partyCif = this.data.partyCif;
  }

  public submit(): void {
    this.internalIdLocStor = this.getLocStor('INT');
    this.positionIdLocStor = this.getLocStor('POS');

    if (!this.internalIdLocStor || !this.positionIdLocStor) {
      this.logout();
    } else {
      if (!this.internalIdLocStor) {
        this.logout();
      } else {
        this._dialog.close(this.partyCif);
      }
    }
  }

  private logout(): void {
    this.loginService.logout();
    this.router.navigate(['']);
  }

  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }
}
