import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';

import lodash from 'lodash';
import { Router } from '@angular/router';
import { PositionService } from 'app/entities/position/position.service';

@Directive({
  selector: '[jhiMatrixDir]',
})
export class MatrixDirective implements OnInit, OnDestroy {
  private authorities!: string[];
  private status!: string;
  private readonly destroy$ = new Subject<void>();
  private positionTypeId: string;

  @Input()
  set jhiMatrixDir(value: string) {
    this.status = value;
  }

  @Input() jhiMatrixDirElementType: string;
  @Input() jhiMatrixDirMenu: string;
  @Input() jhiMatrixDirSubMenu: string;

  constructor(
    private accountService: AccountService,
    private router: Router,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private positionService: PositionService
  ) {}

  ngOnInit() {
    // this.elementRef.nativeElement.style.display = "none";
    this.viewContainerRef.clear();
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.authorities = res.authorities;
        this.getPositionTypeId();
      });
  }
  private opinionCheck() {
    if (!this.router.url.includes('opinion')) {
      if (this.jhiMatrixDirElementType === 'show-remarks') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else if (this.router.url.includes('opinion')) {
      if (this.jhiMatrixDirElementType === 'hide-remarks') {
        this.matrixLabelCP();
      }
    }
  }

  private readOnly() {
    if (this.jhiMatrixDirElementType === 'read-only') {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  private getPositionTypeId(): void {
    this.positionService.find(this.getLocStor('POS')).subscribe(res => {
      this.positionTypeId = res.body.positionTypeId;
      this.checkAccess();
    });
  }

  private getLocStor(cookieName: string) {
    let result = null;
    const cookies: string[] = document.cookie.split(';');

    cookies.forEach(o => {
      const cookie: string[] = o.split('=');
      const name: string = cookie[0].trim();
      if (name === cookieName) {
        result = cookie[1];
      }
    });

    return result;
  }

  private checkAccess(): void {
    if (
      this.jhiMatrixDirMenu === 'credit-proposal' &&
      !this.router.url.includes('cp-status-approval') &&
      !this.router.url.includes('la-distribution') &&
      !this.router.url.includes('la-SME-CRC') &&
      !this.router.url.includes('la-approval')
    ) {
      this.checkOnCreditProposal();
    }

    if (this.router.url.includes('la-analyst')) {
      if (this.positionTypeId === 'CRA' || this.positionTypeId === 'CRC') {
        if (this.status === 'ASSIGNMENT') {
          this.defaultCpMatrixFull();
        } else {
          this.opinionCheck();
          this.readOnly();
        }
      }
    }

    if (this.router.url.includes('cp-status-approval')) {
      if (
        this.positionTypeId === 'BM' ||
        this.positionTypeId === 'SME_HEAD' ||
        this.positionTypeId === 'SDH' ||
        this.positionTypeId === 'DH' ||
        this.positionTypeId === 'DEPT_HEAD'
      ) {
        if (
          this.status === 'CP_APPROVAL_SME_HEAD' ||
          this.status === 'CP_APPROVAL_BM' ||
          this.status === 'CP_APPROVAL_SDH' ||
          this.status === 'CP_APPROVAL_DH' ||
          this.status === 'CP_APPROVAL_DEPTHEAD'
        ) {
          this.defaultCpMatrixFull();
        } else if (
          this.status !== 'CP_APPROVAL_SME_HEAD' &&
          this.status !== 'CP_APPROVAL_BM' &&
          this.status !== 'CP_APPROVAL_SDH' &&
          this.status !== 'CP_APPROVAL_DH' &&
          this.status !== 'CP_APPROVAL_DEPTHEAD'
        ) {
          this.readOnly();
        }
      } else if (
        this.positionTypeId !== 'BM' &&
        this.positionTypeId !== 'SME_HEAD' &&
        this.positionTypeId !== 'SDH' &&
        this.positionTypeId !== 'DH' &&
        this.positionTypeId !== 'DEPT_HEAD'
      ) {
        this.readOnly();
      }
    }

    if (this.router.url.includes('la-distribution')) {
      if (this.positionTypeId === 'CRA') {
        if (this.status === 'CP_APPROVE_TO_LA' || this.status === 'CP_RETURN_TO_CR') {
          this.defaultCpMatrixFull();
        } else {
          this.readOnly();
        }
      } else if (this.positionTypeId === 'CRC') {
        if (this.status === 'CP_APPROVE_TO_LA' || this.status === 'CP_RETURN_TO_CR') {
          this.defaultCpMatrixFull();
        } else {
          this.readOnly();
        }
      } else {
        this.opinionCheck();
        this.readOnly();
      }
    }

    if (this.router.url.includes('la-SME-CRC')) {
      if (this.positionTypeId === 'CRC') {
        this.defaultCpMatrixFull();
      } else {
        this.opinionCheck();
        this.readOnly();
      }
    }

    // perlu di tanyakan
    if (this.router.url.includes('la-approval-inquiry')) {
      if (this.positionTypeId === 'BUSINESS_DIR' || this.positionTypeId === 'CREDIT_DIR' || this.positionTypeId === 'FINANCE_DIR') {
        this.opinionCheck();
        this.readOnly();
      } else {
        this.defaultCpMatrixFull();
      }
    }

    if (this.router.url.includes('la-approval')) {
      if (
        this.positionTypeId === 'DH' ||
        this.positionTypeId === 'BUSINESS_DIR' ||
        this.positionTypeId === 'CREDIT_DIR' ||
        this.positionTypeId === 'CRC'
      ) {
        this.defaultCpMatrixFull();
      } else {
        this.opinionCheck();
        this.readOnly();
      }
    }

    if (this.router.url.includes('loan-committee-approval')) {
      if (this.positionTypeId === 'CRO') {
        this.defaultCpMatrixFull();
      } else {
        this.opinionCheck();
        this.readOnly();
      }
    }

    if (this.router.url.includes('dar-checker')) {
      if (this.positionTypeId === 'HCR1') {
        this.defaultCpMatrixFull();
      } else {
        this.opinionCheck();
        this.readOnly();
      }
    }

    if (this.jhiMatrixDirMenu === 'collateral-appraisal') {
      this.checkOnCollateralAppraisal();
    }

    if (this.jhiMatrixDirMenu === 'dar-final') {
      if (this.positionTypeId === 'CRO') {
        this.checkOnDarFinal();
      } else {
        this.opinionCheck();
        this.readOnly();
      }
    }

    if (this.jhiMatrixDirMenu === 'cp-and-memo') {
      this.checkOnCpAndMemo();
    }

    if (this.jhiMatrixDirMenu === '/collateral-appraisal') {
      this.checkOnCollateralAppraisalRouter();
    }
  }

  private checkOnDarFinal() {
    if (this.jhiMatrixDirElementType === 'input') {
      this.darFinalInput();
    } else {
      this.darFinalLabel();
    }
  }

  private checkOnCpAndMemo() {
    if (this.jhiMatrixDirElementType === 'input') {
      this.cpAndMemoInput();
    } else {
      this.cpAndMemoLabel();
    }
  }

  private darFinalInput() {
    if (this.status === 'CP_DAR_FINAL' || this.status === 'CP_LOAN_COMMITTEE' || this.status === 'OL_ASSIGNED') {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
  private darFinalLabel() {
    const arr = ['CP_DAR_FINAL', 'CP_LOAN_COMMITTEE', 'OL_ASSIGNED'];
    // if status not in array, then create embedded view
    if (!arr.includes(this.status)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  private cpAndMemoInput() {
    if (lodash.indexOf(this.authorities, 'ROLE_RM') >= 0 || lodash.indexOf(this.authorities, 'ROLE_DH') >= 0) {
      this.roleRMCpAndMemoMatrixInput();
    } else if (lodash.indexOf(this.authorities, 'ROLE_DEPT_HEAD') >= 0 || lodash.indexOf(this.authorities, 'ROLE_SME_HEAD') >= 0) {
      this.roleOtherMatrixInput();
    } else {
      // note saya gunakan else sementara supaya tidak terjadi masalah di karenakan role yang lain belum di diskusikan
      // sementara role yang di diskus masih di menu cp
      this.roleOtherMatrixInput();
    }
  }
  private cpAndMemoLabel() {
    if (lodash.indexOf(this.authorities, 'ROLE_RM') >= 0 || lodash.indexOf(this.authorities, 'ROLE_DH') >= 0) {
      this.roleRMCpAndMemoMatrixLabel();
    } else if (lodash.indexOf(this.authorities, 'ROLE_DEPT_HEAD') >= 0 || lodash.indexOf(this.authorities, 'ROLE_SME_HEAD') >= 0) {
      this.roleOtherMatrixLabel();
    } else {
      // note saya gunakan else sementara supaya tidak terjadi masalah di karenakan role yang lain belum di diskusikan
      // sementara role yang di diskus masih di menu cp
      this.roleOtherMatrixLabel();
    }
  }

  private checkOnCollateralAppraisalRouter() {
    if (this.jhiMatrixDirElementType === 'available') {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }
  private checkOnCollateralAppraisal() {
    if (this.jhiMatrixDirElementType === 'input') {
      this.collateralInput();
    } else {
      this.collateralLabel();
    }
  }

  private collateralInput() {
    if (this.status !== 'APPROVE') {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  private collateralLabel() {
    if (this.status === 'APPROVE') {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  private checkOnCreditProposal(): void {
    if (this.jhiMatrixDirElementType === 'input') {
      this.matrixInputCP();
    } else if (this.jhiMatrixDirElementType === '') {
      this.matrixLabelCP();
    }

    /* if(lodash.indexOf(this.authorities, 'ROLE_RM') >= 0){
	  if(this.matrixDirElementType === 'input'){
		this.roleRMMatrixInput();
	  }else{
		this.roleRMMatrixLabel();
	  }
	}else{
	  if(this.matrixDirElementType === 'input'){
		this.roleOtherMatrixInput();
	  }else{
		this.roleOtherMatrixLabel();
	  }
	} */
  }

  private defaultCpMatrixFull() {
    if (this.jhiMatrixDirElementType === 'input') {
      this.matrixInput();
    } else if (this.jhiMatrixDirElementType === '') {
      this.matrixLabel();
    }
  }

  private roleRMMatrixInput(): void {
    if (this.jhiMatrixDirSubMenu !== 'summary') {
      if (this.status === 'DRAFT' || this.status === 'CP_RETURN_TO_RM' || this.status === 'CP_RETURN_TO_CR') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

  private roleRMMatrixLabel(): void {
    if (this.jhiMatrixDirSubMenu === 'summary') {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      if (this.status !== 'DRAFT' && this.status !== 'CP_RETURN_TO_RM' && this.status !== 'CP_RETURN_TO_CR') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

  private roleRMCpAndMemoMatrixInput(): void {
    if (this.jhiMatrixDirSubMenu !== 'summary') {
      if (
        this.status === 'DRAFT' ||
        this.status === 'CP_RETURN_TO_RM' ||
        this.status === 'CP_RETURN_TO_CR' ||
        // Dar appeal
        this.status === 'OL_APPEAL'
      ) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

  private roleRMCpAndMemoMatrixLabel(): void {
    if (this.jhiMatrixDirSubMenu === 'summary') {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      if (
        this.status !== 'DRAFT' &&
        this.status !== 'CP_RETURN_TO_RM' &&
        this.status !== 'CP_RETURN_TO_CR' &&
        // Dar appeal
        this.status !== 'OL_APPEAL'
      ) {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

  private roleOtherMatrixInput(): void {
    if (this.jhiMatrixDirSubMenu === 'summary') {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    }
  }

  private roleOtherMatrixLabel(): void {
    if (this.jhiMatrixDirSubMenu !== 'summary') {
      if (this.status !== 'DRAFT' && this.status !== 'CP_RETURN_TO_RM' && this.status !== 'CP_RETURN_TO_CR') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

  private matrixInput(): void {
    if (this.positionTypeId === 'RM') {
      this.roleRMMatrixInput();
    } else {
      this.roleOtherMatrixInput();
    }
  }

  private matrixLabel(): void {
    if (this.positionTypeId === 'RM') {
      this.roleRMMatrixLabel();
    } else {
      this.roleOtherMatrixLabel();
    }
  }

  private matrixInputCP(): void {
    if (this.positionTypeId === 'RM' || this.positionTypeId === 'DH') {
      this.roleRMMatrixInput();
    } else if (this.positionTypeId === 'DEPT_HEAD' || this.positionTypeId === 'SME_HEAD') {
      this.roleOtherMatrixInput();
    } else {
      // note saya gunakan else sementara supaya tidak terjadi masalah di karenakan role yang lain belum di diskusikan
      // sementara role yang di diskus masih di menu cp
      this.roleOtherMatrixInput();
    }
  }

  private matrixLabelCP(): void {
    if (this.positionTypeId === 'RM' || this.positionTypeId === 'DH') {
      this.roleRMMatrixLabel();
    } else if (this.positionTypeId === 'DEPT_HEAD' || this.positionTypeId === 'SME_HEAD') {
      this.roleOtherMatrixLabel();
    } else {
      // note saya gunakan else sementara supaya tidak terjadi masalah di karenakan role yang lain belum di diskusikan
      // sementara role yang di diskus masih di menu cp
      this.roleOtherMatrixLabel();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
