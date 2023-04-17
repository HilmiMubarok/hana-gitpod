import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import { IDocumentChecklistDebtorData, DocumentChecklistDebtorData } from './debtor-data-document-checklist';
import { DebtorDataDocumentChecklistDialogComponent } from './debtor-data-document-checklis-dialog.component';
import { IDebtorData } from '../debtor-data.model';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import lodash from 'lodash';
import { IDocumentType, ILevel } from 'app/entities/document-type/document-type.model';
@Component({
  selector: 'jhi-deptor-data-document-checklist',
  templateUrl: './document-checklis-deptor-data.component.html',
})
export class DeptorDataDocumentChecklistComponent implements OnInit {
  public files: any[];
  public bucket: string;
  public searchCifInput: string;
  private _partyCif: IDebtorData;
  private dataKey: any;
  public folders = [];
  public typeData: IDocumentType[];
  public type2: IDocumentType[];
  public file = [];
  public dataArray: IDocumentType[]
  constructor(private storageService: StorageService, public dialog: MatDialog, private documentTypeService: DocumentTypeService) {}
  @Input()
  get partyCif() {
    return this._partyCif;
  }

  set partyCif(item: IDebtorData) {
    this._partyCif = item;
  }
  
  ngOnInit(): void {
    this.getBucket().then(() => {
      this.getFiles(this.partyCif.customerNumber).then(() => {
        this.documentTypeService.documentTypeList('DOC_IDD').subscribe((res: any) => {

          
          this.typeData = res.body
          for (let i = 0; i < this.typeData.length; i++) {
            if (this.typeData[i].id.includes('DEPO')) {
              this.typeData[i].collateralTypeId = 'DEPOSIT'
            }else if (this.typeData[i].id.includes('RE')) {
              this.typeData[i].collateralTypeId = 'REALESTATE'
            }else if (this.typeData[i].id.includes('MC')) {
              this.typeData[i].collateralTypeId = 'MACHINE'
            }else if (this.typeData[i].id.includes('SHIP')) {
              this.typeData[i].collateralTypeId = 'MACHINE'
            }else if (this.typeData[i].id.includes('VH')) {
              this.typeData[i].collateralTypeId = 'VEHICLE'
            }else if (this.typeData[i].id.includes('GRNT')) {
              this.typeData[i].collateralTypeId = 'CORPORATEPERSONALGUARANTEE'
            }else if(this.typeData[i].id.includes('OTHER')){
              this.typeData[i].collateralTypeId = 'OTHER'
            }else if (this.typeData[i].id.includes('STOCK')) {
              this.typeData[i].collateralTypeId = 'PERSONAL_PROPERTY'
            }else if (this.typeData[i].id.includes('PIUTG')) {
              this.typeData[i].collateralTypeId = 'PERSONAL_PROPERTY'
            }
            
          }
          const result: IDocumentType[] = this.typeData.filter(obj1 => this.partyCif.collaterals.map(obj2 => obj2.collateralTypeId).includes(obj1.collateralTypeId));


          for (let i = 0; i < result.length; i++) {
            this.documentTypeService.documentTypeList(result[i].id).subscribe((re: any) => {
              result[i].level = re.body;

              const mergeArray: ILevel[] = result[i].level.map(item1 => {
                const file = this.file.find(item2 => item2.idFile === item1.id);
                return { ...item1, ...file };
              });

            
              const personalCorporate = mergeArray.filter(obj => obj.customerType === this.partyCif.customerType);
              const nullData = mergeArray.filter(obj => obj.customerType === 'ALL')

      
              result[i].level = [...personalCorporate,...nullData];
              
              this.dataArray = result
              
            })
          
          }
          
          
     
        });
      });
    });
  }

  private getBucket(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storageService.getBucketName().subscribe(res => {
        this.bucket = res.body['bucket'];
        resolve();
      });
    });
  }

  private getFiles(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const predicate: Object = {
        key: `/idd/${id}/document/`,
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe((res: any) => {
        for (let index = 0; index < res.body.length; index++) {
          this.file = [
            ...this.file,
            {
              idFile: res.body[index].tags.id,
              url: res.body[index].url,
              name: res.body[index].key,
              remarks: res.body[index].tags.remarks,
              status: res.body[index].tags.status,
              dueDate: res.body[index].tags.dueDate,
            },
          ];
        }
        resolve();
      });
    });
  }

  public convertDan(value: string): any {
    if (value !== null && value !== undefined) {
      return value.replace('codeSpecialDan', '&');
    } else {
      return '';
    }
  }

  public openDialog(element: IDocumentType = null, view: string, item: string): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['partyId'] = this.partyCif.customerNumber;
    predicate.data['bucket'] = this.bucket;
    predicate.data['files'] = element;
    predicate.data['typeData'] = this.typeData;
    predicate.data['view'] = view;
    predicate.data['item'] = item;

    const dialogRef = this.dialog.open(DebtorDataDocumentChecklistDialogComponent, predicate);
    dialogRef.afterClosed().subscribe((r: any) => {
    
    });
  }
}
