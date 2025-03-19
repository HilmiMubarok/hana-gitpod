import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IPartyCif } from '../party-cif/party-cif.model';
import { LoginService } from 'app/login/login.service';
import { Router } from '@angular/router';
import { PartyCifService } from '../party-cif/party-cif.service';
import { MessageService } from 'primeng/api';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'jhi-credit-proposal-new-dialog',
  templateUrl: './credit-proposal-new-dialog.component.html',
})
export class CreditProposalNewDialogComponent {
  public partyCif: IPartyCif;
  public internalIdLocStor: string;
  public positionIdLocStor: string;
  private updatedPartyCif: any;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      partyCif: IPartyCif;
    },
    private _dialog: MatDialogRef<CreditProposalNewDialogComponent>,
    private loginService: LoginService,
    protected router: Router,
    protected partyCifService: PartyCifService,
    private messageService: MessageService
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
        this.fetchDataBeforeCreateFromHobies();
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

  public updateFromHobis(): void {

    const cifNumber = this.partyCif.customerNumber;
    if (cifNumber !== undefined) {
      this.partyCifService.syncUpdateHobis(cifNumber).subscribe({
        next: res => {
          if (res.body) {
            this.fetchDataBeforeCreateFromHobies();
          }
        },
        error: (res: HttpErrorResponse) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: res.error.title,
          });
        },
      });
    }
  }


  private fetchDataBeforeCreateFromHobies(): void {
    const promise = new Promise<void>((resolve, reject) => {
      const cifNumber = this.partyCif.customerNumber;
      if (cifNumber !== undefined) {
        this.partyCifService.syncCollateralHobis(cifNumber).subscribe(res => {
          if (!res) {
            reject();
          } else {
            this.updatedPartyCif = res.body;
            resolve(this.updatedPartyCif);
          }
        });
      }
    });
    promise
      .then(res => {
        // console.log(res);
        this._dialog.close(res);
      })
      .catch(error => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Unable to Sync to Hobies',
        });
      });
  }
}
