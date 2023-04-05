import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from 'app/entities/storage/storage.service';
import { MessageService } from 'primeng/api';
import { IDocumentChecklistDebtorData,DocumentChecklistDebtorData  } from 'app/entities/debtor-data/document-checklis/debtor-data-document-checklist'; 
import { DocumentChecklistDialogTempComponent } from './document-checklist-dialog.component'; 
import { IDebtorData } from 'app/entities/debtor-data/debtor-data.model'; 
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import lodash from 'lodash';
import { IDocumentType } from 'app/entities/document-type/document-type.model';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
@Component({
  selector: 'jhi-document-checklist-temp',
  templateUrl: './credit-proposal-document-checklist.component.html',
})
export class DocumentChecklistTempComponent implements OnInit {
  public files: any[];
  public bucket: string;
  public searchCifInput: string;
  private _creditProposal: IDebtorData;
  private dataKey: any;
  public folders = [];
  public typeData: IDocumentType[];
  public type2: IDocumentType[];
  public file = [];
  public file1 = []
  public file2 = []
  constructor(private storageService: StorageService, public dialog: MatDialog, private documentTypeService: DocumentTypeService) {}
  @Input()
  get creditProposal() {
    return this._creditProposal;
  }

  set creditProposal(item: ICreditProposal) {
    this._creditProposal = item;
  }

  ngOnInit(): void {
    this.getBucket().then(() => {
      this.getFiles(String(this.creditProposal.id)).then(() => {
        this.documentTypeService.documentTypeList('DOC_IDD').subscribe((res: any) => {
          this.documentTypeService.documentTypeList('DOC_CP').subscribe((res1: any) => {
          const arrayGroub = [...res.body, ...res1.body];

          const personalCorporate = arrayGroub.filter(obj => obj.customerType === this.creditProposal.customerType);
          const nullData = arrayGroub.filter(obj => obj.customerType === null)
          this.typeData = [...personalCorporate, ...nullData]
          for (let i = 0; i < this.typeData.length; i++) {
              this.documentTypeService.documentTypeList(this.typeData[i].id).subscribe((re: any) => {
                this.typeData[i].level = re.body;
      
                const mergeArray = this.typeData[i].level.map(item1 => {
                  const file = this.file.find(item2 => item2.idFile === item1.id);
                  return { ...item1, ...file };
                });
      
                this.typeData[i].level = mergeArray;
              });
          }
        });
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




  public convertDan(value: string): any {
    if (value !== null && value !== undefined) {
      return value.replace('codeSpecialDan', '&');
    } else {
      return '';
    }
  }



  public openDialog(element: IDocumentType = null, view: string, item: string): void {
    const predicate = { width: '80vw', data: {} };
    predicate.data['cpId'] = this.creditProposal.id;
    predicate.data['partyId'] = this.creditProposal.customerNumber;
    predicate.data['bucket'] = this.bucket;
    predicate.data['files'] = element;
    predicate.data['typeData'] = this.typeData;
    predicate.data['view'] = view;
    predicate.data['item'] = item;

    const dialogRef = this.dialog.open(DocumentChecklistDialogTempComponent, predicate);
    dialogRef.afterClosed().subscribe((r: any) => {


     
    });
  }



    private getFiles(id: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const retrieveDataCpDuplicateIdd: Object = {
        key: `/cp/${id}/document/file-idd/`,
      };
      const dataCpOnly: Object = {
        key: `/cp/${id}/document/file-cp/`,
      };
      const retrieveIDDNotDuplicated: Object = {
        key: `/idd/${this.creditProposal.cif.partyId}/document/`,
      };
      this.storageService.getObjects(this.bucket, retrieveDataCpDuplicateIdd).subscribe((res: any) => {
        if (res.body.length > 0) {
            for (let index = 0; index < res.body.length; index++) {
            this.file1 = [
              ...this.file1,
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

          this.storageService.getObjects(this.bucket, dataCpOnly).subscribe((res1: any) => { 
            for (let index = 0; index < res1.body.length; index++) {
            this.file2 = [
              ...this.file2,
              {
                idFile: res1.body[index].tags.id,
                url: res1.body[index].url,
                name: res1.body[index].key,
                remarks: res1.body[index].tags.remarks,
                status: res1.body[index].tags.status,
                dueDate: res1.body[index].tags.dueDate,
              },
            ];
          }

          this.file = [...this.file1, ...this.file2]
          resolve();
          })
         
        }else{
          this.storageService.getObjects(this.bucket, dataCpOnly).subscribe((res1: any) => { 
            for (let index = 0; index < res1.body.length; index++) {
            this.file1 = [
              ...this.file1,
              {
                idFile: res1.body[index].tags.id,
                url: res1.body[index].url,
                name: res1.body[index].key,
                remarks: res1.body[index].tags.remarks,
                status: res1.body[index].tags.status,
                dueDate: res1.body[index].tags.dueDate,
              },
            ];
          }

          this.storageService.getObjects(this.bucket, retrieveIDDNotDuplicated).subscribe((res2: any) => { 
            for (let index = 0; index < res2.body.length; index++) {
            this.file2 = [
              ...this.file2,
              {
                idFile: res2.body[index].tags.id,
                url: res2.body[index].url,
                name: res2.body[index].key,
                remarks: res2.body[index].tags.remarks,
                status: res2.body[index].tags.status,
                dueDate: res2.body[index].tags.dueDate,
              },
            ];
            }
            this.file = [...this.file1, ...this.file2]
            resolve();
       
          })

          
        
          })
          
        }
        
       
      });
    });
  }
}
