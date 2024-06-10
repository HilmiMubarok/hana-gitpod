import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { IApplicationDocument } from 'app/entities/application-document/application-document.model';
import { ApplicationDocumentService } from 'app/entities/application-document/application-document.service';
import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';
import { DocumentTypeService } from 'app/entities/document-type/document-type.service';
import { StorageService } from 'app/entities/storage/storage.service';
import lodash from 'lodash';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'jhi-history-tbo',
  templateUrl: './history-tbo.component.html',
  styleUrls: ['./history-tbo.style.scss'],
})
export class HistoryTBOComponent implements OnChanges {
  public applicationDocument: IApplicationDocument[];

  public _creditProposal: ICreditProposal;

  public files: Object[];
  public folders: any[];
  public change: any;
  private bucket: string;
  public documentTypes = [];
  public parentIdValue = [];

  @Input()
  get creditProposal(): ICreditProposal {
    return this._creditProposal;
  }

  set creditProposal(value: ICreditProposal) {
    this._creditProposal = value;
  }

  constructor(
    private storageService: StorageService,
    private dialog: MatDialog,
    private router: Router,
    protected activatedRoute: ActivatedRoute,
    private documentTypeService: DocumentTypeService,
    private messageService: MessageService,
    private applicationDocumentService: ApplicationDocumentService
  ) {
    this.files = [];
    this.folders = [];
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.change = changes;
    if (changes['creditProposal']) {
      this.changeDocumentType();
      this.loadAll();

      this.getBucket().then(res => {
        this.getFiles(this.creditProposal.id);
      });
    }
  }

  documentRootId = 'DOC_DPDL_LEGAL';

  public changeDocumentType(): void {
    const value = this.documentRootId;

    this.documentTypeService.listDocumentType(value).subscribe(res => {
      this.parentIdValue = res.body;
    });
  }

  private loadAll(): void {
    this.documentTypeService
      .query({
        lvl2: true,
        page: 0,
        size: 9999,
        sort: ['id', 'desc'],
      })
      .subscribe(res => {
        const data = res.body.filter(
          res1 =>
            res1.parentId === 'DOC_DPDL_LEGAL_AKAD' ||
            res1.parentId === 'DOC_DPDL_LEGAL_BIAYA' ||
            res1.parentId === 'DOC_DPDL_LEGAL_COVERNOTE' ||
            res1.parentId === 'DOC_DPDL_LEGAL_LAMPIRAN'
        );
        this.documentTypes = data;
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

  public getFiles(id: number): void {
    if (this.change.creditProposal !== undefined && this.change.creditProposal['currentValue'] !== undefined) {
      const predicate: Object = {
        key: `/document-tbo/document-legal/${id}/legal/`, // Mengganti ini sesuai dengan struktur key di minio Anda
      };
      this.storageService.getObjects(this.bucket, predicate).subscribe(res => {
        console.log('res body history:', res.body);
        this.getApplicationDocument(res.body);
      });
    }
  }

  public getApplicationDocument(minioData: any[]): void {
    // Mendapatkan daftar dokumen aplikasi
    const statuses = ['CANCEL'];
    const page = 0;
    const size = 9999;
    const sort = ['id,desc'];

    this.applicationDocumentService
      .getListApplicationDocument(this.creditProposal.id, { statusId: statuses, page, size, sort })
      .subscribe(res => {
        // Menginisialisasi array untuk menyimpan dokumen aplikasi dengan informasi tambahan
        const augmentedApplicationDocuments: IApplicationDocument[] = [];
        this.folders = res.body;
        console.log('folders history:', this.folders);
        console.log('minioData history:', minioData);

        // Iterasi melalui setiap dokumen aplikasi
        this.folders.forEach(appDoc => {
          // Mencari data Minio yang sesuai dengan dokumen aplikasi
          // const minioDocument = minioData.find(m => m.tags.id === appDoc.attributes.docId);
          const minioDocuments = minioData.filter(m => m.tags.id === appDoc.attributes.docId);
          console.log('minioDocuments history:', minioDocuments);

          // Jika ditemukan, tambahkan informasi tambahan ke dokumen aplikasi
          if (minioDocuments.length > 0) {
            const files = [];
            minioDocuments.forEach(minioDocument => {
              const filesTemp = {
                name: minioDocument.name,
                key: minioDocument.key,
                type: minioDocument.metaData.Value,
                url: minioDocument.url,
              };
              files.push(filesTemp);
            });
            const augmentedAppDoc: IApplicationDocument = {
              // Salin semua properti dari dokumen aplikasi
              ...appDoc,
              // Tambahkan properti tambahan
              files,
            };

            // Tambahkan dokumen aplikasi yang diperbarui ke array
            augmentedApplicationDocuments.push(augmentedAppDoc);
          }
        });

        // Gunakan dokumen aplikasi yang telah diperbarui
        this.applicationDocument = augmentedApplicationDocuments;

        // Debugging: Tampilkan dokumen aplikasi yang telah diperbarui
        console.log('Augmented application documents history:', this.applicationDocument);
      });
  }
}
