import { Component, OnInit, Inject } from '@angular/core';
import { MenuAccessService } from '../menu-access.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, map } from 'rxjs';
import { IPosition } from '@syncfusion/ej2-angular-grids';
import { PositionTypeService } from 'app/entities/position-type/position-type.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MessageService } from 'primeng/api';
import { IMenuAccess, IPositionAccess, MenuAccess } from '../menu-access.model';

@Component({
  selector: 'jhi-menu-access-add',
  templateUrl: './menu-access-add.component.html',
})
export class MenuAccessAddComponent implements OnInit {
  public position = [];
  public positionAccess: IMenuAccess;
  public typeposisi: string;
  id;

  constructor(
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      positionAccessparam: IMenuAccess;
    },
    protected messageService: MessageService,

    private _dialog: MatDialogRef<MenuAccessAddComponent>,
    private menuAccessService: MenuAccessService,
    private activatedRoute: ActivatedRoute,
    private positionTypeService: PositionTypeService
  ) {
    this.positionAccess = this.data.positionAccessparam;
    this.activatedRoute.params.subscribe(res => (this.id = res['id']));
  }

  ngOnInit(): void {
    this.getPosition();
  }

  public positionId: string;
  public positionDescription: string;
  // public parentMenuItemId:string;

  public getPosition(): void {
    this.positionTypeService
      .query({
        page: 0,
        size: 9999,
      })
      .subscribe(res => {
        this.position = res.body;
        if (this.position.length > 0) {
          let posId: string;
          let posDesc: string;
          for (let i = 0; i < this.position.length; i++) {
            posId = this.position[i].id;
            posDesc = this.position[i].description;
          }

          this.positionId = posId;
          this.positionDescription = posDesc;
        }
      });
  }

  public save(): void {
    // create
    if (this.positionAccess) {
      const newPos = {
        id: null,
        menuItemDescription: this.positionAccess[0].description,
        menuItemIcon: this.positionAccess[0].icon,
        menuItemId: this.positionAccess[0].id,
        menuItemcode: this.positionAccess[0].code,
        parentMenuItemCode: null,
        parentMenuItemDescription: this.positionAccess[0].parentDescription,
        parentMenuItemIcon: 'file',
        parentMenuItemId: this.positionAccess[0].parentId,
        positionDescription: this.positionDescription,
        positionId: this.positionId,
      };

      this._dialog.close(newPos);
    }
  }

  public onSelect(event: any): void {
    this.positionId = event;
  }

  displayedColumns: string[] = ['no', 'position'];
  dataSource$: Observable<Array<any>>;
}
