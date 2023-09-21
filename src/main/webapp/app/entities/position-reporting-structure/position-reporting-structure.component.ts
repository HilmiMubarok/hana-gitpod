import { Component, OnInit } from '@angular/core';
import {
  IPositionReportingStructure,
  IPositionReportingStructureDownload,
  PositionReportingStructure,
  PositionReportingStructureDownload,
} from './position-reporting-structure.model';
import { PositionReportingStructureService } from './position-reporting-structure.service';
import { AbstractEntityMaterialComponent } from 'app/shared/base/abstract-entity-material.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { PositionReportingStructureDialogComponent } from './position-reporting-structure-dialog.component';
import { RelationTypeService } from '../relation-type/relation-type.service';
import { IRelationType } from '../relation-type/relation-type.model';
import { firstValueFrom } from 'rxjs';
import FileSaver from 'file-saver';
import { PositionReportingStructureUploadComponent } from './position-reporting-structure-upload.component';

@Component({
  selector: 'jhi-position-reporting-structure',
  templateUrl: './position-reporting-structure.component.html',
  styleUrls: ['./position-reporting-structure.css'],
})
export class PositionReportingStructureComponent extends AbstractEntityMaterialComponent<IPositionReportingStructure> implements OnInit {
  private LOS_REL = 'LOS_REL';
  public relationTypes: IRelationType[];
  public displayColumns = [
    'no',
    'positionFrom',
    'positionFromEmployeeName',
    'positionTo',
    'positionToEmployeeName',
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
    const allRelationTypes = (await firstValueFrom(this.relationTypeService.queryFilterBy(predicate))).body;
    this.relationTypes = allRelationTypes.filter(relationType => {
      if (relationType.parentId === 'LOS_REL') {
        return false;
      } else {
        return true;
      }
    });
  }

  public upload(): void {
    const dialogRef: any = this.dialog.open(PositionReportingStructureUploadComponent, {
      width: '1024px',
    });
    dialogRef.afterClosed().subscribe(() => {
      this.loadAll();
    });
  }

  public getTemplate(): void {
    import('xlsx').then(xlsx => {
      const newData: IPositionReportingStructureDownload = new PositionReportingStructureDownload();

      const worksheet = xlsx.utils.json_to_sheet([newData]); // Sale Data
      const workbook = {
        Sheets: {
          data: worksheet,
        },
        SheetNames: ['data'],
      };
      const excelBuffer: any = xlsx.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
      });

      const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
      const EXCEL_EXTENSION = '.xlsx';
      const result: Blob = new Blob([excelBuffer], {
        type: EXCEL_TYPE,
      });
      FileSaver.saveAs(result, 'template_upload_position_reporting_structure' + EXCEL_EXTENSION);
    });
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
      data: {
        positionReportingStructure: predicate,
      },
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
  previousState(): void {
    window.history.back();
  }
}
