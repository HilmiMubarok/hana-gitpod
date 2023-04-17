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

          const personalCorporate = res.body.filter(obj => obj.customerType === this.partyCif.customerType);
          const nullData = res.body.filter(obj => obj.customerType.toLowerCase() === 'all')
          this.typeData = [...personalCorporate,...nullData];


          for (let i = 0; i < this.typeData.length; i++) {
            this.documentTypeService.documentTypeList(this.typeData[i].id).subscribe((re: any) => {
              this.typeData[i].level = re.body;

              const mergeArray: ILevel[] = this.typeData[i].level.map(item1 => {
                const file = this.file.find(item2 => item2.idFile === item1.id);
                return { ...item1, ...file };
              });

            
              for (let j = 0; j < mergeArray.length; j++) {
                if (mergeArray[j].parentId.includes('DEPO')) {
                  mergeArray[j].collateralTypeId = 'DEPOSIT'
                }else if (mergeArray[j].parentId.includes('RE')) {
                  mergeArray[j].collateralTypeId = 'REALESTATE'
                }else if (mergeArray[j].parentId.includes('MC')) {
                  mergeArray[j].collateralTypeId = 'MACHINE'
                }else if (mergeArray[j].parentId.includes('SHIP')) {
                  mergeArray[j].collateralTypeId = 'MACHINE'
                }else if (mergeArray[j].parentId.includes('VH')) {
                  mergeArray[j].collateralTypeId = 'VEHICLE'
                }else if (mergeArray[j].parentId.includes('GRNT')) {
                  mergeArray[j].collateralTypeId = 'CORPORATEPERSONALGUARANTEE'
                }else if(mergeArray[j].parentId.includes('OTHER')){
                  mergeArray[j].collateralTypeId = 'OTHER'
                }else if (mergeArray[j].parentId.includes('STOCK')) {
                  mergeArray[j].collateralTypeId = 'PERSONAL_PROPERTY'
                }else if (mergeArray[j].parentId.includes('PIUTG')) {
                  mergeArray[j].collateralTypeId = 'PERSONAL_PROPERTY'
                }
                
              }

      
              this.typeData[i].level = mergeArray;
              const result = this.typeData.filter(obj => obj.level.some(subObj => this.partyCif.collaterals.some(arrObj => arrObj.collateralTypeId === subObj.collateralTypeId)));
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
