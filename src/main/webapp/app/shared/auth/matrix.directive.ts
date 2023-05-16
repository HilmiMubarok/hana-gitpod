import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';

import lodash from 'lodash';
import { Router } from '@angular/router';

@Directive({
  selector: '[jhiMatrixDir]',
})
export class MatrixDirective implements OnInit, OnDestroy {
  private authorities!: string[];
  private status!: string;
  private readonly destroy$ = new Subject<void>();

  @Input()
  set jhiMatrixDir(value: string) {
    this.status = value;
  }

  @Input() jhiMatrixDirElementType: string;
  @Input() jhiMatrixDirMenu: string;
  @Input() jhiMatrixDirSubMenu: string;

  constructor(
    private accountService: AccountService,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private router: Router
  ) {}

  ngOnInit() {
    // this.elementRef.nativeElement.style.display = "none";
    this.viewContainerRef.clear();
    this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.authorities = res.authorities;
        this.checkAccess();
      });
  }

  private checkAccess(): void {
    if (
      this.jhiMatrixDirMenu === 'credit-proposal' &&
      !this.router.url.includes('cp-status-approval') &&
      !this.router.url.includes('la-distribution') &&
      !this.router.url.includes('la-analyst') &&
      !this.router.url.includes('la-SME-CRC')
    ) {
      this.checkOnCreditProposal();
    }

    if (this.router.url.includes('cp-status-approval')) {
      this.checkOnCPStatusApproval();
    }

    if (this.router.url.includes('la-analyst')) {
      this.checkOnLaAnalyst();
    }

    if (this.router.url.includes('la-SME-CRC')) {
      this.checkOnLaSMECRC();
    }

    if (this.router.url.includes('la-distribution')) {
      this.checkOnlaDistribution();
    }

    if (this.jhiMatrixDirMenu === 'collateral-appraisal') {
      this.checkOnCollateralAppraisal();
    }

    if (this.jhiMatrixDirMenu === 'dar-final') {
      this.checkOnDarFinal();
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
      this.matrixInput();
    } else {
      this.matrixLabel();
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

  private checkOnlaDistribution(): void {
    if (this.jhiMatrixDirElementType === 'input') {
      this.matrixInputLaDistribution();
    } else {
      this.matrixLabelLaDistribution();
    }
  }

  private checkOnLaSMECRC() {
    if (this.jhiMatrixDirElementType === 'input') {
      this.matrixInputLaSMECRC();
    } else {
      this.matrixLabelLaSMECRC();
    }
  }

  private checkOnLaAnalyst(): void {
    if (this.jhiMatrixDirElementType === 'input') {
      this.matrixInputLaAnalyst();
    } else {
      this.matrixLableLaAnalyst();
    }
  }

  private checkOnCPStatusApproval(): void {
    if (this.jhiMatrixDirElementType === 'input') {
      this.matrixInputCpApproval();
    } else {
      this.matrixLableCpApproval();
    }
  }

  private matrixInputLaAnalyst() {
    if (lodash.indexOf(this.authorities, 'ROLE_CRO') >= 0) {
      if (this.status === 'CP_ASSIGNMENT' || this.status === 'RETURN_TO_CR') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

  private matrixLableLaAnalyst() {
    if (lodash.indexOf(this.authorities, 'ROLE_CRO') >= 0) {
      if (this.status !== 'CP_ASSIGNMENT' && this.status !== 'RETURN_TO_CR') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

  private matrixInputLaSMECRC() {
    if (lodash.indexOf(this.authorities, 'ROLE_CRC') >= 0) {
      if (this.jhiMatrixDirSubMenu !== 'summary') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

  private matrixLabelLaSMECRC() {
    if (lodash.indexOf(this.authorities, 'ROLE_CRC') === -1) {
      if (this.jhiMatrixDirSubMenu !== 'summary') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

  private matrixInputLaDistribution() {
    if (lodash.indexOf(this.authorities, 'ROLE_CRA') >= 0) {
      if (this.jhiMatrixDirSubMenu !== 'summary') {
        if (this.status === 'APPROVE_TO_LA' || this.status === 'RETURN_TO_CR') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }
    } else if (lodash.indexOf(this.authorities, 'ROLE_CRC') >= 0) {
      if (this.jhiMatrixDirSubMenu !== 'summary') {
        if (this.status === 'APPROVE_TO_LA' || this.status === 'RETURN_TO_CR') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }
    } else if (
      lodash.indexOf(this.authorities, 'ROLE_RM') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_BM') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_SME_HEAD') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_SDH') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_DH') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_DEPT_HEAD') >= 0
    ) {
      if (this.jhiMatrixDirSubMenu !== 'summary') {
        if (this.status === 'CP_ASSIGNMENT' || this.status === 'RETURN_TO_CR') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }
    }
  }

  private matrixLabelLaDistribution() {
    if (lodash.indexOf(this.authorities, 'ROLE_CRA') >= 0) {
      if (this.jhiMatrixDirSubMenu !== 'summary') {
        if (this.status !== 'APPROVE_TO_LA' && this.status !== 'RETURN_TO_CR') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }
    } else if (lodash.indexOf(this.authorities, 'ROLE_CRC') >= 0) {
      if (this.jhiMatrixDirSubMenu !== 'summary') {
        if (this.status !== 'APPROVE_TO_LA' && this.status !== 'RETURN_TO_CR') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }
    } else if (
      lodash.indexOf(this.authorities, 'ROLE_RM') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_BM') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_SME_HEAD') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_SDH') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_DH') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_DEPT_HEAD') >= 0
    ) {
      if (this.jhiMatrixDirSubMenu !== 'summary') {
        if (this.status !== 'CP_ASSIGNMENT' && this.status !== 'RETURN_TO_CR') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }
    }
  }

  private matrixInputCpApproval() {
    if (
      lodash.indexOf(this.authorities, 'ROLE_BM') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_SME_HEAD') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_SDH') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_DH') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_DEPT_HEAD') >= 0
    ) {
      if (this.jhiMatrixDirSubMenu !== 'summary') {
        if (
          this.status === 'CP_APPROVAL_SME_HEAD' ||
          this.status === 'CP_APPROVAL_BM' ||
          this.status === 'CP_APPROVAL_SDH' ||
          this.status === 'CP_APPROVAL_DH' ||
          this.status === 'CP_APPROVAL_DEPTHEAD'
        ) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }
    } else {
      this.roleOtherMatrixInput();
    }
  }

  private matrixLableCpApproval() {
    if (
      lodash.indexOf(this.authorities, 'ROLE_BM') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_SME_HEAD') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_SDH') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_DH') >= 0 ||
      lodash.indexOf(this.authorities, 'ROLE_DEPT_HEAD') >= 0
    ) {
      if (this.jhiMatrixDirSubMenu !== 'summary') {
        if (
          this.status !== 'CP_APPROVAL_SME_HEAD' &&
          this.status !== 'CP_APPROVAL_BM' &&
          this.status !== 'CP_APPROVAL_SDH' &&
          this.status !== 'CP_APPROVAL_DH' &&
          this.status !== 'CP_APPROVAL_DEPTHEAD'
        ) {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }
    } else {
      this.roleOtherMatrixLabel();
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
    if (lodash.indexOf(this.authorities, 'ROLE_RM') >= 0 || lodash.indexOf(this.authorities, 'ROLE_DH') >= 0) {
      this.roleRMMatrixInput();
    } else if (lodash.indexOf(this.authorities, 'ROLE_DEPT_HEAD') >= 0 || lodash.indexOf(this.authorities, 'ROLE_SME_HEAD') >= 0) {
      this.roleOtherMatrixInput();
    } else {
      // note saya gunakan else sementara supaya tidak terjadi masalah di karenakan role yang lain belum di diskusikan
      // sementara role yang di diskus masih di menu cp
      this.roleOtherMatrixInput();
    }
  }

  private matrixLabel(): void {
    if (lodash.indexOf(this.authorities, 'ROLE_RM') >= 0 || lodash.indexOf(this.authorities, 'ROLE_DH') >= 0) {
      this.roleRMMatrixLabel();
    } else if (lodash.indexOf(this.authorities, 'ROLE_DEPT_HEAD') >= 0 || lodash.indexOf(this.authorities, 'ROLE_SME_HEAD') >= 0) {
      this.roleOtherMatrixLabel();
    } else {
      // note saya gunakan else sementara supaya tidak terjadi masalah di karenakan role yang lain belum di diskusikan
      // sementara role yang di diskus masih di menu cp
      this.roleOtherMatrixLabel();
    }
  }

  private matrixCpApprovalLable(): void {
    if (this.jhiMatrixDirSubMenu !== 'summary') {
      if (this.status !== 'CP_APPROVAL_BM') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
