/* eslint-disable @typescript-eslint/no-inferrable-types */
import { ActivatedRoute } from '@angular/router';
import { AfterViewInit, AfterContentInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import {
    BeforeOpenEventArgs,
    BeforeSaveEventArgs,
    CellRenderEventArgs,
    DataSourceChangedEventArgs,
    getData,
    getDataRange,
    Spreadsheet,
    SpreadsheetComponent,
} from '@syncfusion/ej2-angular-spreadsheet';
import { StorageService } from 'app/entities/storage/storage.service';
import { Subject } from 'rxjs';
import { retry, takeUntil } from 'rxjs/operators';
import { PROPOSAL_TYPE } from 'app/shared/constants/base.constants';
import { ICreditProposal } from '../credit-proposal/credit-proposal.model';
import { IDebtorData } from './debtor-data.model';
import { MenuItemModel } from '@syncfusion/ej2-angular-navigations';
import lodash from 'lodash';
import { StrikethroughSettings } from '@syncfusion/ej2-angular-pdfviewer';
import moment from 'moment';
import { AccountService } from 'app/core/auth/account.service';

import { MessageService } from 'primeng/api';

@Component({
    selector: 'jhi-debtor-data-component',
    templateUrl: './debtor-data.component.html',
})
export class PartyCifDebtorComponent implements OnInit, OnDestroy, OnChanges {
    @Input() jhifilter: 'Total Exposure <= IDR 15 Bn' | 'Total Exposure Back to Back' | 'Total Exposure > IDR 15 Bn';
    private ngUnsubscribe = new Subject();
    @ViewChild('spreadsheet') public spreadsheetObj: SpreadsheetComponent;

    public creditProposal: ICreditProposal;
    private _partyId: IDebtorData;

    public subMenuItems = '';

    public source = [];
    public proposalType;
    public tempKey: string = '';
    public fileStore: File;

    public data: {
        documentChecklist: any;
        view: boolean;
        files: any;
        bucket: string;
        partyId: number;
    };

    private accountService: AccountService;
    private messageService: MessageService;

    public generate(): void {
        this.actRoute.params.pipe(takeUntil(this.ngUnsubscribe)).subscribe(params => {
            let keyValue = '';
            this.paramsId = params['id'];
            if (this.tempKey === 'Total Exposure > IDR 15 Bn') {
                keyValue = 'above';
            } else if (this.tempKey === 'Total Exposure Back to Back') {
                keyValue = 'back-to-back';
            } else if (this.tempKey === 'Total Exposure <= IDR 15 Bn') {
                keyValue = 'below';
            }
            const predicate: Object = {
                key: `/template/financial_analysis/${keyValue}`,
            };
            this.storageService.getObjects(this.bucket, predicate).subscribe((res: any) => {
                console.log('body', res.body);
                this.getFile(res.body[0].url);
            });
        });
    }

    public menuItems: MenuItemModel[] = [];
    public menuItemsAll: MenuItemModel[] = [
        { text: 'BASIC INFORMATION' },
        { text: 'BUSINES ACTIVITY' },
        { text: 'LOAN FACILITY DETAIL' },
        { text: 'EXPOSURE' },
        { text: 'RISK ACCEPTENCE CRITERIA' },
        { text: 'COLLATERAL INFO' },
        { text: 'MANAGEMENT INFORMATION' },
        { text: 'SLIK CHECKING' },
        { text: 'FINANCIAL STATEMENT' },
        { text: 'BANK ACCOUNT ANALYSIS' },
        { text: 'TRADE CHECKING' },
        { text: 'CREDIT RATING' },
        { text: 'REPAYMENT CAPABILITY' },
        { text: 'CONVENANT & TBO' },
        { text: 'DOCUMENT CHECKLIST' },
        { text: 'PROPOSE PRICING' },
        { text: 'GROUP & GUARANTOUR ANALYSIS' },
        { text: 'SUMMARY' },
        // { text: 'CUSTOMER PROFITABILITY & CROSS SELLING FACTOR' },
    ];

    private bucket = 'hana';
    private key: string = `/cif/${this.partyId}/financial-document`;
    private updateKey: string = '';
    private paramsId: string;
    private isIdHasData: boolean = true;
    private isMasterDataExist: boolean = false;

    private fileBeforeOpen: File = null;

    constructor(private storageService: StorageService, private actRoute: ActivatedRoute) {
        this.proposalType = PROPOSAL_TYPE;
    }

    public coba: any = [];
    ngOnInit(): void {
        const predicate: Object = {
            key: `/cif/${this.partyId.partyId}/financial_analysis/`,
        };
        this.storageService.getObjects(this.bucket, predicate).subscribe((res: any) => {
            console.log('res', res);
            // this.source.push(res.body[0].tags);
            // console.log('body', res.body);
            if (res.body.length > 0) {
                this.getFile(res.body[0].url);
            }
        });
    }

    @Input()
    get partyId() {
        return this._partyId;
    }

    set partyId(item: IDebtorData) {
        this._partyId = item;
    }

    ngOnChanges(changes: SimpleChanges): void {
        console.log('changes', changes);
        console.log('filter', this.jhifilter);

        if (changes?.jhifilter?.currentValue !== changes?.jhifilter?.previousValue) {
            // this.getUpdatekey();
            this.created();
            this.generate();
        }
    }

    beforeSave(args: BeforeSaveEventArgs): void {
        // args.fileName = 'template_repayment_capability';
        // args.saveType = 'Xlsx';
        // args.needBlobData = true;
        console.log(args);
        // if want to save data to minio when event save
        // this.storeFile();
    }

    beforeOpen(args: BeforeOpenEventArgs): void {
        console.log('ww', args);
        if (args && args.file) {
            const temp = args.file as File;
            if (temp.type !== '') {
                this.fileBeforeOpen = args.file as File;
                // if want to save data to minio when event open data

                const metaData = {
                    objectName: null,
                };

                metaData.objectName = `/cif/${this.partyId.partyId}/financial_analysis/template_repayment_capability.xlsx`;
                const formData = new FormData();
                formData.append('file', this.fileBeforeOpen);

                // this.accountService.identity().subscribe(resAccount => {
                //   metaData.createdBy = resAccount.login;

                this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe(res0 => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Save Success',
                    });
                });
            } else {
                console.warn('Spreadsheet Load from server');
            }
        }
    }

    storeFile(): void {
        const metaData = {
            objectName: this.isMasterDataExist
                ? `${this.key}/${this.paramsId}/${this.updateKey}/template_repayment_capability`
                : `${this.key}/${this.updateKey}/template_repayment_capability`,
        };
        const formData = new FormData();
        formData.append('file', this.fileBeforeOpen);

        this.storageService.uploadMeta('hana', formData, metaData).subscribe(res => {
            console.log(res);
        });
    }

    created(): void {
        console.log('cek', this.updateKey);
        if (this.paramsId) {
            this.storageService
                .getObjects(this.bucket, {
                    key: this.isIdHasData ? `${this.key}/${this.paramsId}/${this.updateKey}` : `${this.key}/${this.updateKey}/`,
                })
                .pipe(retry(2), takeUntil(this.ngUnsubscribe))
                .subscribe((res: any) => {
                    if (res.body.length === 1) {
                        this.getFile(res.body[0]?.url);
                        this.isIdHasData = true;
                    } else if (res.body.length > 1) {
                        this.isIdHasData = true;
                        const result: any = this.findByID(res.body, `${this.paramsId}`);
                        this.getFile(result.url);
                    } else {
                        if (this.isIdHasData === false && res.body.length === 0) {
                            console.warn('Master data empty, please insert master data');
                            this.isMasterDataExist = false;
                            this.spreadsheetObj.open({});
                            this.spreadsheetObj.clear({});
                            return;
                        } else {
                            this.isIdHasData = false;
                            this.created();
                            this.isMasterDataExist = true;
                        }
                    }
                });
        }
    }
    getFile(urlFile: string): void {
        this.storageService
            .fileBlob(urlFile)
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(res => {
                console.log('cek1');
                const file = new File([res.body], 'template_repayment_capability.xlsx');

                const metaData = {
                    objectName: null,
                };

                metaData.objectName = `/cif/${this.partyId.partyId}/financial_analysis/${file.name}`;
                const formData = new FormData();
                formData.append('file', file);

                // this.accountService.identity().subscribe(resAccount => {
                //   metaData.createdBy = resAccount.login;

                this.storageService.uploadMeta(this.bucket, formData, metaData).subscribe(res0 => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Save Success',
                    });
                });
                this.spreadsheetObj.open({ file });
                this.spreadsheetObj.clear({
                    type: 'Clear All',
                    range: 'A1:A2',
                });

                this.spreadsheetObj.clear({});
            });
    }

    dataSourceChange(evt: DataSourceChangedEventArgs): void {
        console.log(evt);
        console.log('dataaa', evt?.data);
    }

    beforeCellRender(args: CellRenderEventArgs): void {
        console.log(args);
        // if (this.spreadsheetObj.sheets.length > 1) {
        //   const data = this.spreadsheetObj.sheets.map((item: any) =>
        //     item.properties.name === 'Dashboard'
        //       ? { ...item, properties: { ...item.properties, state: 'Visible' } }
        //       : { ...item, properties: { ...item.properties, state: 'Hidden' } }
        //   );
        //   this.spreadsheetObj.sheets = data;
        // }
    }

    ngOnDestroy(): void {
        this.ngUnsubscribe.next(true);
        this.ngUnsubscribe.complete();
    }

    findByID(arr: any[], id: string): object {
        console.log('ini arr');
        const result = arr.map(a => a.key.split('/').some(w => w === id)).indexOf(true) === -1 ? false : true;
        let obj: object;
        if (result === false) {
            obj = arr.find(o => o.key === 'credit_proposal/repayment_capability/template_repayment_capability');
        }
        return obj;
    }

    // generate() {

    // }

    onclick() { }
}
