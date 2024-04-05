import { Component, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CreditAgreementService } from '../../credit-agreement.service';
import {
  DocumentEditorComponent,
  DocumentEditorContainerComponent,
  DocumentEditorKeyDownEventArgs,
} from '@syncfusion/ej2-angular-documenteditor';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject, takeUntil } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'jhi-clausal-pk-dialog-edit',
  templateUrl: './clausal-pk-dialog-edit.component.html',
  styleUrls: ['../../credit-agreement.css'],
})
export class ClausalPkDialogComponentEditComponent {
  @ViewChild('document_editor_container')
  public container: DocumentEditorContainerComponent;
  @ViewChild('document_editor')
  public documentEditor: DocumentEditorComponent;

  public category: string;
  public code: string;
  public description: string;
  private ngUnsubscribe = new Subject();

  public addendumListActive: any[] = [];
  public agreementsClausalTemplate: any;
  public countChildFormAgreements: any = [''];
  public valueChildAgreeements: any[] = [];
  public agreementsClausalChildList: any[] = [];
  public valueParentClausalAgreements: any;

  public clausalAgreement: any[];

  constructor(
    public dialogRef: MatDialogRef<ClausalPkDialogComponentEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private http: HttpClient,
    private storageService: StorageService,
    public creditAgreementService: CreditAgreementService
  ) {
    this.category = this.data.dataClausal.category;
    console.log('df', this.data.dataClausal);
    this.description = this.data.dataClausal.notes;
    this.code = this.data.dataClausal.agreementClausalParameterCode;
    this.checkMaster();
  }

  onCreate(): void {
    // this.container.serviceUrl = 'http://45.32.114.128:8190/services/los/api/wordeditor/';
    this.container.serviceUrl = '/services/los/api/wordeditor/';
  }

  public onKeyDown(args: DocumentEditorKeyDownEventArgs): void {
    const keyCode: string = args.event.key;
    const isCtrlKey: boolean = args.event.ctrlKey || args.event.metaKey ? true : keyCode === '17' ? true : false;
    // 67 is the character code for 'C'
    console.log('keycode', keyCode);
    console.log('isCtrlKey', isCtrlKey);
    if (isCtrlKey && keyCode === '86') {
      // To prevent copy operation set isHandled to true
      args.isHandled = true;
      console.log('ini paste');
    }
  }

  onDocumentChange(): void {
    (this.container as DocumentEditorContainerComponent).restrictEditing = true;
  }

  public optionChildAgrementAddedum(index: number): any[] {
    const selectedOptions = this.addendumListActive.slice(0, index);
    return this.addendumListActive.filter(option => !selectedOptions.includes(option));
  }

  public triggeredSave(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const paramsId = this.data.dataClausal.agreementId;

      const key = 'aggrement';
      const docEditor = this.container?.documentEditor as DocumentEditorComponent;

      docEditor
        .saveAsBlob('Docx')
        .then((exportedDocument: Blob) => {
          const fileType = 'docs';
          const fileName = `credit-agreement-clausal-${this.data.dataClausal.agreementClausalParameterCode}.docs`;
          const metaData = {
            objectName: `${key}/${paramsId}/${this.data.dataClausal.id}/${fileType}/${fileName}`,
          };
          const formData = new FormData();
          formData.append('file', new File([exportedDocument], fileName));
          this.storageService.getBucketName().subscribe(
            res => {
              this.storageService.uploadMeta(res.body['bucket'], formData, metaData).subscribe(
                d => {
                  this.saveSfdt(res)
                    .then(() => {
                      resolve();
                    })
                    .catch(error => {
                      console.error('Error:', error);
                    });
                },
                error => {
                  reject(error);
                }
              );
            },
            error => {
              reject(error);
            }
          );
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  public saveSfdt(res: any): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const paramsId = this.data.dataClausal.agreementId;
      const key = 'aggrement';
      const docEditor = this.container?.documentEditor as DocumentEditorComponent;

      docEditor.saveAsBlob('Sfdt').then((exportedDocument2: Blob) => {
        const fileType2 = 'sfdt';
        const fileName2 = `credit-agreement-clausal-${this.data.dataClausal.agreementClausalParameterCode}.sfdt`;
        const metaData2 = {
          objectName: `${key}/${paramsId}/${this.data.dataClausal.id}/${fileType2}/${fileName2}`,
        };

        const formData2 = new FormData();
        formData2.append('file', new File([exportedDocument2], fileName2));

        this.storageService.uploadMeta(res.body['bucket'], formData2, metaData2).subscribe(
          res3 => {
            resolve();
          },
          error => {
            reject(error);
          }
        );
      });
    });
  }

  public getContainer(dataPk: any): void {
    const path = {
      key:
        dataPk.length > 0
          ? `aggrement/${this.data.dataClausal.agreementId}/${this.data.dataClausal.id}/sfdt/`
          : `template/credit-agreement/clausal/${this.data.dataClausal.agreementClausalParameterCode}/sfdt/`,
    };
    const pathHistory = {
      key: `aggrement/${this.data.dataClausal.agreementId}/document/draft/${this.data.dataClausal.id}/sfdt/`,
    };

    const obj = this.data.view === null ? path : pathHistory;
    this.storageService.getBucketName().subscribe(res1 => {
      this.storageService
        .getObjects(res1.body['bucket'], obj)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((response: any) => {
          const nameFile: any =
            this.data.view === null
              ? `credit-agreement-clausal-${this.data.dataClausal.agreementClausalParameterCode}.sfdt`
              : response.body[0].name;

          if (response.body.length > 0) {
            this.storageService
              .fileBlob(response.body[response.body.length - 1]['url'])
              .pipe(takeUntil(this.ngUnsubscribe))
              .subscribe(res => {
                const fileGet = new File([res.body], nameFile);
                const fileReader: FileReader = new FileReader();
                fileReader.onload = (e: any) => {
                  const docEditor = this.container?.documentEditor as DocumentEditorComponent;
                  const contents: string = e.target.result;
                  docEditor.open(contents);
                };
                fileReader.readAsText(fileGet);
              });
          }
        });
    });
  }

  public checkMaster() {
    this.storageService.getBucketName().subscribe(res1 => {
      this.http
        .get(
          this.storageService.resourceUrl +
            `/${res1.body['bucket']}/object?key=aggrement/${this.data.dataClausal.agreementId}/${this.data.dataClausal.id}/sfdt/`
        )
        .subscribe((res: any) => {
          this.getContainer(res);
        });
    });
    this.creditAgreementService
      .getAddendumActive('ADDENDUM', {
        page: 0,
        size: 9999,
      })
      .subscribe((res: any) => {
        const data: any[] = res.body;
        this.agreementsClausalChildList = data.filter((re: any) => re.parameterCategoryId === 'ADDENDUM');
      });

    this.creditAgreementService.agreementClausalTemplate(this.data.creditProposal.agreements[0]?.id).subscribe((res: any) => {
      this.agreementsClausalTemplate = res.body;
    });

    if (this.data.dataClausal.agreementClausalParameterDescription === 'Pasal Addendum 1' || this.data.dataClausal.parentId === 603) {
      this.getDataByIdAddendum(30939);
    } else if (
      this.data.dataClausal.agreementClausalParameterDescription !== 'Pasal Addendum 1' &&
      this.data.dataClausal.agreementClausalParameterDescription !== 'Pasal Addendum 2' &&
      this.data.dataClausal.agreementClausalParameterDescription !== 'Pasal Addendum 3'
    ) {
      this.getDataByIdAddendum(30939);
    }
  }

  public getDataByIdAddendum(id: number) {
    this.creditAgreementService.agreementsAddendumApplication(this.data.creditProposal.id).subscribe((res: any) => {
      if (res.body.length > 0) {
        this.valueParentClausalAgreements = this.agreementsClausalChildList.filter((r: any) => r.id === id)[0];
        this.creditAgreementService.agreementsClausalByPartyId(this.data.creditProposal.agreements[0]?.toPartyId).subscribe((res1: any) => {
          this.addendumListActive = res1.body;
          const clausal = this.agreementsClausalChildList.filter((r: any) => r.id === id);
          const child: any[] = res.body.filter((l: any) => l.clausal.agreementClausalParameterCode === clausal[0].code);
          const filteredArray1 = this.addendumListActive.filter(item1 => {
            const foundInChildren = child.some(item2 =>
              item2.clausalChild.some(c => c.agreementClausalParameterCode === item1.agreementClausalParameterCode)
            );
            return foundInChildren;
          });

          const mergedObject = {};

          filteredArray1.forEach(obj => {
            const { agreementClausalParameterCode } = obj;
            if (!mergedObject[agreementClausalParameterCode]) {
              mergedObject[agreementClausalParameterCode] = { ...obj };
            } else {
              Object.assign(mergedObject[agreementClausalParameterCode], obj);
            }
          });

          this.countChildFormAgreements = [''];
          const resultArray: any = Object.values(mergedObject);

          for (let i = 0; i < resultArray.length - 1; i++) {
            this.countChildFormAgreements.push('');
          }
          this.valueChildAgreeements = resultArray;
        });
      }
    });
  }

  public close() {
    this.dialogRef.close(null);
  }

  public save() {
    if (this.category === 'ADDENDUM') {
      this.triggeredSave().then(() => {
        this.dialogRef.close();
      });
    } else {
      this.triggeredSave()
        .then(() => {
          this.data.dataClausal = {
            ...this.data.dataClausal,
            category: this.category,
            notes: this.description,
          };
          this.creditAgreementService.updateClausalAgreement(this.data.dataClausal).subscribe(() => {
            this.dialogRef.close();
          });
        })
        .catch(error => {
          console.error('Error:', error);
        });
    }
  }
}
