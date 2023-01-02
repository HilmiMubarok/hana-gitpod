import { Component, OnInit } from '@angular/core';
import { IPositionReportingStructure, PositionReportingStructure } from './position-reporting-structure.model';
import { PositionReportingStructureService } from './position-reporting-structure.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PositionReportingStructureDialogComponent } from './position-reporting-structure-dialog.component';
import { RelationTypeService } from '../relation-type/relation-type.service';
import { IRelationType } from '../relation-type/relation-type.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'jhi-position-reporting-structure',
  templateUrl: './position-reporting-structure.component.html',
})
export class PositionReportingStructureComponent extends AbstractEntityMaterialComponent<IPositionReportingStructure> implements OnInit {
  private LOS_REL: string = 'LOS_REL';
  public relationTypes: IRelationType[];
  public displayColumns: string[] = [
    'no',
    'positionFrom',
    'positionFromEmployeeName',
    'positionTo',
    'positionToEmployeeName',
    'positionDelegationTo',
    'positionDelegationToEmployeeName',
    'dtfrom',
    'dtthru',
    'actions',
  ];
  public idRelationType: string;

  constructor(
    protected positionReportingStructureService: PositionReportingStructureService,
    protected snackbar: MatSnackBar,
    protected relationTypeService: RelationTypeService,
    public dialog: MatDialog
  ) {
    super(snackbar, positionReportingStructureService);
    this.itemsPerPage = 10;
    this.page = 0;
    this.predicate = 'id';
    this.entityKeyName = 'id';
    this.idRelationType = null;
    this.items = [];
    this.relationTypes = [];
  }

  ngOnInit(): void {
    this.loadRelationType();
  }

  public selectRelationType(value: string): void {
    this.items = [];
    this.page = 0;
    this.idRelationType = value;
    this.loadAll();
    this.paginator.firstPage();
  }

  private loadAll(): void {
    this.positionReportingStructureService
      .queryFilterBy({
        idRelationType: this.idRelationType,
        page: this.page,
        sort: this.sortData(),
        size: this.itemsPerPage,
      })
      .subscribe(res => this.initDataForMatTable(res, res.headers));
  }

  protected postLoadDataLazy(): void {
    this.loadAll();
  }

  private async loadRelationType(): Promise<void> {
    const predicate: object = {
      idParent: this.LOS_REL,
      page: 0,
      size: 9999,
    };
    this.relationTypes = (await firstValueFrom(this.relationTypeService.queryFilterBy(predicate))).body;
  }

  public openDialog(element: IPositionReportingStructure = null): void {
    let predicate: IPositionReportingStructure;
    predicate = new PositionReportingStructure();
    if (element) {
      predicate = element;
    }
    const dialog = this.dialog.open(PositionReportingStructureDialogComponent, {
      width: '100%',
      maxWidth: '95%',
      data: { positionReportingStructure: predicate },
    });
    dialog.afterClosed().subscribe((res: IPositionReportingStructure) => {
      if (res) {
        if (res.id) {
          // update
          this.positionReportingStructureService.update(res).subscribe(res2 => {
            this.loadAll();
          });
        } else {
          // create
          this.positionReportingStructureService.create(res).subscribe(res2 => {
            this.loadAll();
          });
        }
      }
    });
  }
}
