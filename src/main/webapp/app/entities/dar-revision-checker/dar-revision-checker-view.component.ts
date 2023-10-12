import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import {
  PROPOSAL_TYPE,
  SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN,
  SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN,
  SUBMENU_CREDITPROPOSAL_BACK_TO_BACK,
  SEGMENTS_TYPE,
  ID_GREATER_15_BN,
  ID_LOWER_EQUAL_15_BN,
  ID_BACK_TO_BACK,
  CP_APPROVAL_MENU,
  CP_APPROVAL_MENU_BTB,
  CP_APPROVAL_MENU_BELOW,
  DPDL_FINALIZE,
  BASIC_SUBMENU_CREDITPROPOSAL,
  DAR_REVISION_CHECKER,
} from 'app/shared/constants/base.constants';
import { ActivatedRoute, Router } from '@angular/router';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { Subject } from 'rxjs';

@Component({
  selector: 'jhi-dar-revision-checker-view',
  templateUrl: './dar-revision-checker-view.component.html',
  styleUrls: ['./dar-revision-checker.style.css'],
})
export class DarRevisionCheckerViewComponent implements OnInit {
  public isOpen = false;
  public subMenu: object[];
  public parentPath = this.router.url.split('/')[1];
  public creditProposal: ICreditProposal;
  public creditProposalStartState: ICreditProposal;

  public parentSubject: Subject<any> = new Subject();
  public clickedMenu: string;
  public headerTitle = 'select proposal type';
  public routeHelper: string;
  private id: number;

  constructor(public dialog: MatDialog, public router: Router, public activatedRoute: ActivatedRoute) {
    this.creditProposal = this.activatedRoute.snapshot.data['content'];
    this.creditProposalStartState = this.activatedRoute.snapshot.data['content'];
    this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    });

    this.setMainMenuCp();

    this.activatedRoute.queryParams.subscribe(params => {
      const subRoute = params['subroute'];
      if (subRoute) {
        this.clickedMenu = subRoute;
        this.showTextMenu();
      }
    });

    this.subMenu = this.creditProposal.attributes['previousOfferingLetter']
      ? [...DAR_REVISION_CHECKER, { id: 'memo-banding', text: 'Memo Banding' }]
      : DAR_REVISION_CHECKER;
  }

  ngOnInit() {
    this.showTextMenu();
  }

  public triggerToggle() {
    this.isOpen = !this.isOpen;
  }

  public previousState(): void {
    window.history.back();
  }

  public openCancelDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '25vw',
      data: {
        title: '',
        message: 'Are you sure to cancel this data?',
      },
      panelClass: 'custom-dialog-container-cancel',
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.previousState();
      }
    });
  }

  public onClickRed(): void {
    this.parentSubject.next('red-clicked');
  }

  public setSubmenu(event: Object): void {
    if (event) {
      if (event === ID_GREATER_15_BN) {
        if (this.parentPath === 'cp-status-approval') {
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              {
                id: 'credit-proposal-approval',
                text: 'Credit Proposal Summary',
              },
              ...SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN,
              {
                id: 'opinion',
                text: 'Opinion',
              },
              {
                id: 'memo-banding',
                text: 'Memo Banding',
              },
            ];
          } else {
            this.subMenu = [
              {
                id: 'credit-proposal-approval',
                text: 'Credit Proposal Summary',
              },
              ...SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN,
              {
                id: 'opinion',
                text: 'Opinion',
              },
            ];
          }
        } else {
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN,
              {
                id: 'memo-banding',
                text: 'Memo Banding',
              },
            ];
          } else {
            this.subMenu = SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN;
          }
        }
      } else if (event === ID_LOWER_EQUAL_15_BN) {
        if (this.parentPath === 'cp-status-approval') {
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              {
                id: 'credit-proposal-approval',
                text: 'Credit Proposal Summary',
              },
              ...SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN,
              {
                id: 'opinion',
                text: 'Opinion',
              },
              {
                id: 'memo-banding',
                text: 'Memo Banding',
              },
            ];
          } else {
            this.subMenu = [
              {
                id: 'credit-proposal-approval',
                text: 'Credit Proposal Summary',
              },
              ...SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN,
              {
                id: 'opinion',
                text: 'Opinion',
              },
            ];
          }
        } else {
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN,
              {
                id: 'memo-banding',
                text: 'Memo Banding',
              },
            ];
          } else {
            this.subMenu = SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN;
          }
        }
      } else if (event === ID_BACK_TO_BACK) {
        if (this.parentPath === 'cp-status-approval') {
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              {
                id: 'credit-proposal-approval',
                text: 'Credit Proposal Summary',
              },
              ...SUBMENU_CREDITPROPOSAL_BACK_TO_BACK,
              {
                id: 'opinion',
                text: 'Opinion',
              },
              {
                id: 'memo-banding',
                text: 'Memo Banding',
              },
            ];
          } else {
            this.subMenu = [
              {
                id: 'credit-proposal-approval',
                text: 'Credit Proposal Summary',
              },
              ...SUBMENU_CREDITPROPOSAL_BACK_TO_BACK,
              {
                id: 'opinion',
                text: 'Opinion',
              },
            ];
          }
        } else {
          if (this.creditProposal.attributes['previousOfferingLetter']) {
            this.subMenu = [
              ...SUBMENU_CREDITPROPOSAL_BACK_TO_BACK,
              {
                id: 'memo-banding',
                text: 'Memo Banding',
              },
            ];
          } else {
            this.subMenu = SUBMENU_CREDITPROPOSAL_BACK_TO_BACK;
          }
        }
      } else {
        if (this.creditProposal.attributes['previousOfferingLetter']) {
          this.subMenu = [
            ...PROPOSAL_TYPE,
            {
              id: 'memo-banding',
              text: 'Memo Banding',
            },
          ];
        } else {
          this.subMenu = PROPOSAL_TYPE;
        }
      }
    } else {
      if (this.creditProposal.attributes['previousOfferingLetter']) {
        this.subMenu = [
          ...PROPOSAL_TYPE,
          {
            id: 'memo-banding',
            text: 'Memo Banding',
          },
        ];
      } else {
        this.subMenu = PROPOSAL_TYPE;
      }
    }
    // this.clickedMenu = 'basic-information';
  }

  public setMainMenuCp() {
    if (this.parentPath === 'cp-status-approval') {
      this.clickedMenu = 'credit-proposal-approval';
    } else if (this.parentPath === 'credit-proposal-status') {
      this.clickedMenu = 'basic-information';
    }
  }

  public goToSubMenu(menu: string): void {
    this.clickedMenu = menu;
  }

  public showTextMenu(): void {
    const menuList = [];
    menuList.push(this.subMenu);
    for (let i = 0; i < menuList.length; i++) {
      for (let x = 0; x < menuList[i].length; x++) {
        if (this.clickedMenu === menuList[i][x].id) {
          this.headerTitle = menuList[i][x].text;
        } else {
          for (let y = 0; y < menuList[i][x].child?.length; y++) {
            if (this.clickedMenu === menuList[i][x].child[y].id) {
              this.headerTitle = menuList[i][x].child[y].text;
            }
          }
        }
      }
    }
  }

  public routeSubMenu(menu: object): void {
    if (menu['id'] === ID_GREATER_15_BN) {
      this.creditProposal.attributes.proposalType = ID_GREATER_15_BN;
      if (this.parentPath === 'credit-proposal-status') {
        if (this.creditProposal.attributes['previousOfferingLetter']) {
          this.subMenu = [...SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN, { id: 'memo-banding', text: 'Memo Banding' }];
        } else {
          this.subMenu = SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN;
        }
      } else {
        if (this.creditProposal.attributes['previousOfferingLetter']) {
          this.subMenu = [
            {
              id: 'credit-proposal-approval',
              text: 'Credit Proposal Summary',
            },
            ...SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN,
            {
              id: 'opinion',
              text: 'Opinion',
            },
            {
              id: 'memo-banding',
              text: 'Memo Banding',
            },
          ];
        } else {
          this.subMenu = [
            {
              id: 'credit-proposal-approval',
              text: 'Credit Proposal Summary',
            },
            ...SUBMENU_CREDITPROPOSAL_GREATER_FIFTEEN,
            {
              id: 'opinion',
              text: 'Opinion',
            },
          ];
        }
      }
    }
    if (menu['id'] === ID_LOWER_EQUAL_15_BN) {
      this.creditProposal.attributes.proposalType = ID_LOWER_EQUAL_15_BN;
      if (this.parentPath === 'credit-proposal-status') {
        if (this.creditProposal.attributes['previousOfferingLetter']) {
          this.subMenu = [...SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN, { id: 'memo-banding', text: 'Memo Banding' }];
        } else {
          this.subMenu = SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN;
        }
      } else {
        if (this.creditProposal.attributes['previousOfferingLetter']) {
          this.subMenu = [
            {
              id: 'credit-proposal-approval',
              text: 'Credit Proposal Summary',
            },
            ...SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN,
            {
              id: 'opinion',
              text: 'Opinion',
            },
            {
              id: 'memo-banding',
              text: 'Memo Banding',
            },
          ];
        } else {
          this.subMenu = [
            {
              id: 'credit-proposal-approval',
              text: 'Credit Proposal Summary',
            },
            ...SUBMENU_CREDITPROPOSAL_LOWER_EQUAL_FIFTEEN,
            {
              id: 'opinion',
              text: 'Opinion',
            },
          ];
        }
      }
    }
    if (menu['id'] === ID_BACK_TO_BACK) {
      this.creditProposal.attributes.proposalType = ID_BACK_TO_BACK;
      if (this.parentPath === 'credit-proposal-status') {
        if (this.creditProposal.attributes['previousOfferingLetter']) {
          this.subMenu = [...SUBMENU_CREDITPROPOSAL_BACK_TO_BACK, { id: 'memo-banding', text: 'Memo Banding' }];
        } else {
          this.subMenu = SUBMENU_CREDITPROPOSAL_BACK_TO_BACK;
        }
      } else {
        if (this.creditProposal.attributes['previousOfferingLetter']) {
          this.subMenu = [
            {
              id: 'credit-proposal-approval',
              text: 'Credit Proposal Summary',
            },
            ...SUBMENU_CREDITPROPOSAL_BACK_TO_BACK,
            {
              id: 'opinion',
              text: 'Opinion',
            },
            {
              id: 'memo-banding',
              text: 'Memo Banding',
            },
          ];
        } else {
          this.subMenu = [
            {
              id: 'credit-proposal-approval',
              text: 'Credit Proposal Summary',
            },
            ...SUBMENU_CREDITPROPOSAL_BACK_TO_BACK,
            {
              id: 'opinion',
              text: 'Opinion',
            },
          ];
        }
      }
    }
    this.routeHelper =
      this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2] + '/' + this.router.url.split('/')[3].substr(0, 4);

    this.router.navigate([this.routeHelper], {
      queryParams: {
        subroute: menu['id'],
      },
    });
  }
}
