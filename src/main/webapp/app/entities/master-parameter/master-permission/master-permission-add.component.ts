import { Component, OnInit } from '@angular/core';
import { PositionTypeService } from 'app/entities/position-type/position-type.service';
import { MasterPermissionService } from './master-permission.service';
import { IMenuItem } from './menu-parameter/menu-parameter.model';
import { MenuParameterService } from './menu-parameter/menu-parameter.service';
import { IPositionTypePermission } from './master-permission.model';
import { CashCreditProposalService } from 'app/entities/credit-proposal/cash-credit-proposal.service';
import { AppMenuPermission, IAppMenuPermission, IMenuStatusItem } from './master-permission.model';
import { MICROSERVICENAME } from 'app/shared/constants/config.constants';
import { PositionTypePermissionService } from './menu-parameter/app-position-menu-type.service';
import { ApplicationConfigService } from 'app/core/config/application-config.service';

import { HttpClient, HttpResponse } from '@angular/common/http';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'app/layouts/miscellaneous/confirm-dialog.component';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { IPositionType } from 'app/entities/position-type/position-type.model';

@Component({
  selector: 'jhi-master-permission-add',
  templateUrl: './master-permission-add.component.html',
  styleUrls: ['./master-permission.style.css'],
})
export class MasterPermissionAddComponent implements OnInit {
  public newListMenuItem: IAppMenuPermission;
  public listMenuItem: IMenuItem[];
  public listPositionType: IPositionTypePermission[];
  public listStatus: IMenuStatusItem[];
  public itemPositionType: IPositionType;

  public disableStatusField = true;
  public disablePositionField = true;
  public statusMessage: string;
  public positionMessage: string;

  public positionId: string;

  constructor(
    protected menuParameterService: MenuParameterService,
    protected positionTypePermissionService: PositionTypePermissionService,
    protected positionTypeService: PositionTypeService,
    protected masterPermissionService: MasterPermissionService,
    protected cashCreditProposalService: CashCreditProposalService,
    protected applicationConfigService: ApplicationConfigService,
    protected dialog: MatDialog,
    protected messageService: MessageService,
    protected router: Router,

    protected http?: HttpClient
  ) {}
  ngOnInit(): void {
    this.newListMenuItem = new AppMenuPermission();
    this.getListMenuItem();
  }

  private getListMenuItem(): void {
    let data: IMenuItem[];
    this.menuParameterService
      .getListMenuItem({
        size: 9999,
        sort: ['id', 'asc'],
      })
      .subscribe(res => {
        data = res.body;

        this.listMenuItem = data.filter(o => o.parentId !== null);
      });
  }

  public onSelectMenu(param: string): void {
    const appMenuId = param;
    this.getStatusList(appMenuId);

    this.disableStatusField = !appMenuId ? true : false;
  }

  public onSelectStatus(param: IMenuStatusItem): void {
    const menuItem = param;
    this.getPositionList(menuItem.menuItemId);

    this.disablePositionField = !menuItem ? true : false;
  }

  public onSelectPosition(positionId: string): void {
    if (positionId) {
      this.positionTypeService.findById(positionId).subscribe(res => {
        this.newListMenuItem.positionType = res.body;
      });
    }
  }

  private getStatusList(appMenu: string): void {
    if (appMenu) {
      this.cashCreditProposalService
        .queryListOfViewStatusFilterBy({
          page: 0,
          size: 9999,
          sort: ['id', 'asc'],
          appMenuId: appMenu,
        })
        .subscribe((res: any) => {
          this.listStatus = res.body;
          this.statusMessage = this.listStatus.length === 0 ? 'Status not available' : '- Please Select -';
        });
    }
  }

  private getPositionList(id: string): void {
    if (id) {
      this.positionTypePermissionService
        .queryFilterBy({
          menuItemId: id,
          size: 9999,
          sort: ['id', 'asc'],
        })
        .subscribe(res => {
          this.listPositionType = res.body;
          this.positionMessage = this.listPositionType.length === 0 ? 'Position not available' : '- Please Select -';
        });
    }
  }

  public saveData(): void {
    this.masterPermissionService.create(this.newListMenuItem).subscribe(res => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: 'Save Success',
      });

      if (res.body) {
        this.router.navigate(['/menu-permission']);
      }
    });
  }

  // cancel confrimation dialog
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
        window.history.back();
      }
    });
  }
}
