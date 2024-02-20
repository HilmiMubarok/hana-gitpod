import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';

import lodash from 'lodash';
import { ActivatedRoute, Router } from '@angular/router';
import { PositionService } from 'app/entities/position/position.service';
import { TemplateService } from 'app/layouts/template/template.service';

@Directive({
  selector: '[jhiMatrixDir]',
})
export class MatrixDirective implements OnInit, OnDestroy {
  private authorities!: string[];
  private status!: string;
  private readonly destroy$ = new Subject<void>();
  private positionTypeId: any;
  private argsPath = this.router.url.split('/')[1];

  @Input()
  set jhiMatrixDir(value: string) {
    this.status = value;
  }

  @Input() jhiMatrixDirElementType: string;
  @Input() jhiMatrixDirMenu: string;
  @Input() jhiMatrixDirSubMenu: string;

  public routeEdit = this.router.url.split('/')[1] + '/' + this.router.url.split('/')[2] + '/' + this.router.url.split('/')[3];

  constructor(
    private accountService: AccountService,
    private router: Router,
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private positionService: PositionService,
    private templateService: TemplateService,
    private route: ActivatedRoute
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

  private getPositionTypeId(): void {
    this.templateService.triggerChanggedPosIntObjectObservable.subscribe((newPos: any) => {
      this.positionTypeId = newPos.positionTypeId;
      this.checkAccess();
    });
  }

  private checkAccess(): void {
    if (this.jhiMatrixDirMenu !== 'cp-and-memo') {
      if (
        this.jhiMatrixDirMenu === 'credit-proposal' &&
        !this.router.url.includes('cp-status-approval') &&
        !this.router.url.includes('la-distribution') &&
        !this.router.url.includes('la-SME-CRC') &&
        !this.router.url.includes('la-approval') &&
        !this.router.url.includes('distribution') &&
        !this.router.url.includes('la-approval-inquiry') &&
        !this.router.url.includes('dar-checker') &&
        !this.router.url.includes('cc-checking') &&
        !this.router.url.includes('cc-review') &&
        !this.router.url.includes('dar-notif') &&
        !this.router.url.includes('loan-committee-approval') &&
        !this.router.url.includes('la-analyst') &&
        !this.router.url.includes('confirmation') &&
        !this.argsPath.match(/finalize-pk/g) &&
        !this.argsPath.match(/insurance-check/g) &&
        !this.argsPath.match(/insurance-review/g) &&
        !this.argsPath.match(/finalize/g) &&
        !this.argsPath.match(/finalize-dppk/g) &&
        !this.argsPath.match(/loan-ops-distribution/g) &&
        !this.router.url.includes('cc-inquiry') &&
        !this.router.url.includes('review-pk') &&
        !this.router.url.includes('dar-revision') &&
        !this.router.url.includes('finalize-dpdl') &&
        !this.router.url.includes('review-dpdl')
      ) {
        if (this.status === 'OL_APPEAL') {
          if (
            this.router.url.includes('loan-facility-detail') ||
            this.router.url.includes('convenant-tbo') ||
            this.router.url.includes('collateral-info')
          ) {
            if (this.jhiMatrixDirElementType === 'input') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        } else {
          if (
            this.positionTypeId === 'SME_HEAD' ||
            this.positionTypeId === 'DEPT_HEAD' ||
            this.positionTypeId === 'SDH' ||
            this.positionTypeId === 'DH' ||
            this.positionTypeId === 'BM'
          ) {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          } else {
            if (this.positionTypeId === 'RM') {
              if (this.status === 'RETURN_TO_RM_CRA' || this.status === 'CP_RETURN_TO_CR' || this.status === 'RETURN_TO_RM_LEGAL') {
                if (this.jhiMatrixDirElementType === 'input') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              } else {
                this.defaultCpMatrixFull();
              }
            } else {
              if (this.status === 'RETURN_TO_RM_CRA' || this.status === 'CP_RETURN_TO_CR') {
                this.defaultCpMatrixFull();
              } else {
                this.defaultCpMatrixFull();
              }
            }
          }
        }
      }
      if (this.router.url.includes('review-pk')) {
        // if(this.status !== 'DRAFT'){
        if (this.jhiMatrixDirElementType === '') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
          // }
        }
      }
      if (this.argsPath.match(/finalize-pk/g)) {
        if (this.router.url.includes('finalize-credit-agreement')) {
          if (
            this.status === 'PK_REVIEW_LEAD' ||
            this.status === 'PK_GENERATED' ||
            this.status === 'PK_DAR_REVISION' ||
            this.status === 'PK_RETURN_TO_RM'
          ) {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          } else {
            if (this.jhiMatrixDirElementType === 'input') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        } else {
          if (this.jhiMatrixDirElementType === '') {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
          }
        }
      }
      if (this.argsPath.match(/finalize-dppk/g)) {
        // if(this.status !== 'DRAFT'){
        if (this.jhiMatrixDirElementType === '') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }
      if (this.argsPath.match(/loan-ops-distribution/g)) {
        // if(this.status !== 'DRAFT'){
        if (this.jhiMatrixDirElementType === '') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }
      if (this.argsPath.match(/insurance-check/g)) {
        // if(this.status !== 'DRAFT'){
        if (this.jhiMatrixDirElementType === '') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }
      if (this.argsPath.match(/insurance-review/g)) {
        // if(this.status !== 'DRAFT'){
        if (this.jhiMatrixDirElementType === '') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }

      if (this.router.url.includes('finalize-dpdl')) {
        if (this.jhiMatrixDirElementType === '') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }

      if (this.router.url.includes('review-dpdl')) {
        if (this.jhiMatrixDirElementType === '') {
          this.viewContainerRef.createEmbeddedView(this.templateRef);
        }
      }

      if (this.router.url.includes('dar-revision')) {
        if (this.router.url.includes('loan-facility') || this.router.url.includes('collateral-info')) {
          if (this.router.url.includes('dar-revision-checker')) {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          } else {
            if (this.status !== 'PK_DAR_REVISION') {
              if (this.jhiMatrixDirElementType === '') {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
              }
            } else {
              if (this.jhiMatrixDirElementType === 'input') {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
              }
            }
          }
        } else {
          if (this.jhiMatrixDirElementType === '') {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
          }
        }
      }

      if (this.router.url.includes('la-analyst')) {
        if (this.positionTypeId === 'CRO') {
          if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
            if (this.status === 'ASSIGNMENT') {
              this.defaultCpMatrixFull();
            } else {
              if (this.jhiMatrixDirElementType === '') {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
              }
            }
          } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
            this.defaultCpMatrixFull();
          }
        } else {
          if (this.jhiMatrixDirElementType === '') {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
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
          if (this.router.url.includes('credit-proposal-approval') && this.router.url.split('?')[1] === undefined) {
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
              if (this.jhiMatrixDirElementType === '') {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
              }
            }
          } else if (this.router.url.includes('opinion')) {
            if (this.positionTypeId === 'SME_HEAD') {
              if (this.status === 'CP_APPROVAL_SME_HEAD') {
                if (this.jhiMatrixDirElementType === 'input') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              } else {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            }

            if (this.positionTypeId === 'BM') {
              if (this.status === 'CP_APPROVAL_BM') {
                if (this.jhiMatrixDirElementType === 'input') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              } else {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            }

            if (this.positionTypeId === 'DEPT_HEAD') {
              if (this.status === 'CP_APPROVAL_DEPTHEAD') {
                if (this.jhiMatrixDirElementType === 'input') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              } else {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            }

            if (this.positionTypeId === 'SDH') {
              if (this.status === 'CP_APPROVAL_SME_HEAD') {
                if (this.jhiMatrixDirElementType === 'input') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              } else {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            }

            if (this.positionTypeId === 'DH') {
              if (this.status === 'CP_APPROVAL_DH') {
                if (this.jhiMatrixDirElementType === 'input') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              } else {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            }
          } else {
            this.defaultCpMatrixFull();
          }
        } else if (
          this.positionTypeId !== 'BM' &&
          this.positionTypeId !== 'SME_HEAD' &&
          this.positionTypeId !== 'SDH' &&
          this.positionTypeId !== 'DH' &&
          this.positionTypeId !== 'DEPT_HEAD'
        ) {
          if (this.jhiMatrixDirElementType === '') {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
          }
        }
      }

      if (this.router.url.split('/')[1] === 'la-distribution') {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'CRA') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              if (this.status === 'CP_APPROVE_TO_LA' || this.status === 'CP_RETURN_TO_CR') {
                this.defaultCpMatrixFull();
              } else if (this.status !== 'CP_APPROVE_TO_LA' && this.status !== 'CP_RETURN_TO_CR') {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          }
          if (this.positionTypeId === 'CRC' || this.positionTypeId === 'HCR1' || this.positionTypeId === 'HCR2') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              if (this.status === 'CP_APPROVE_TO_LA' || this.status === 'CP_RETURN_TO_CR') {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              } else if (this.status !== 'CP_APPROVE_TO_LA' && this.status !== 'CP_RETURN_TO_CR') {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          }

          if (
            this.positionTypeId !== 'CRC' &&
            this.positionTypeId !== 'HCR1' &&
            this.positionTypeId !== 'HCR2' &&
            this.positionTypeId !== 'CRA'
          ) {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.router.url.includes('la-SME-CRC')) {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'CRC') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              this.defaultCpMatrixFull();
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      // perlu di tanyakan
      if (this.router.url.includes('la-approval-inquiry')) {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'BUSINESS_DIR' || this.positionTypeId === 'CREDIT_DIR' || this.positionTypeId === 'FINANCE_DIR') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              if (this.jhiMatrixDirElementType === '') {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
              }
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.router.url.split('/')[1] === 'la-approval') {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (
            this.positionTypeId === 'DH' ||
            this.positionTypeId === 'BUSINESS_DIR' ||
            this.positionTypeId === 'CREDIT_DIR' ||
            this.positionTypeId === 'CRC'
          ) {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              this.defaultCpMatrixFull();
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.router.url.includes('loan-committee-approval')) {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'CRO') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              this.defaultCpMatrixFull();
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              if (this.jhiMatrixDirElementType === '') {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
              }
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.router.url.includes('dar-checker')) {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'HCR1' || this.positionTypeId === 'HCR2') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              this.defaultCpMatrixFull();
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.router.url.includes('dar-notif')) {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'CRO') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              this.defaultCpMatrixFull();
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              if (this.jhiMatrixDirElementType === '') {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
              }
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.router.url.includes('cc-distribution')) {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'CC_ADMIN') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              this.defaultCpMatrixFull();
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.router.url.includes('cc-review')) {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'CC_DIR' || this.positionTypeId === 'CC_DH' || this.positionTypeId === 'CC_DEPT_HEAD') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              if (this.status === 'CP_CC_DEPT_HEAD' || this.status === 'CP_CC_DIV_HEAD' || this.status === 'CP_CC_DIRECTOR') {
                this.defaultCpMatrixFull();
              } else {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.router.url.includes('cc-inquiry')) {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'CC_ANALYST' || this.positionTypeId === 'CC_ADMIN') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              this.defaultCpMatrixFull();
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.router.url.includes('confirmation')) {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'RM') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              this.defaultCpMatrixFull();
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.router.url.split('/')[1] === 'distribution') {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'CREDIT_LEGAL_LEAD') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              if (this.status === 'OL_DISTRIBUTION') {
                this.defaultCpMatrixFull();
              } else {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.router.url.includes('cc-checking')) {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'CC_ANALYST') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              if (this.status === 'CP_CC_ANALYST') {
                this.defaultCpMatrixFull();
              } else {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.argsPath.endsWith('finalize')) {
        if (this.jhiMatrixDirMenu !== 'dar-final') {
          if (this.positionTypeId === 'LEGAL_OFFICER') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              if (this.status === 'OL_ASSIGNED') {
                this.defaultCpMatrixFull();
              } else {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.defaultCpMatrixFull();
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }

      if (this.jhiMatrixDirMenu === 'collateral-appraisal') {
        this.checkOnCollateralAppraisal();
      }

      if (this.jhiMatrixDirMenu === 'dar-final') {
        const isInCompareData = this.router.url.split('?subroute=')[1];

        if (isInCompareData === 'compare-data') {
          return;
          // if (this.jhiMatrixDirElementType === '') {
          //   this.viewContainerRef.createEmbeddedView(this.templateRef);
          // }
        } else {
          if (this.positionTypeId === 'CRO') {
            if (this.router.url.includes('credit-proposal-summary') || this.router.url.split('?')[1] === undefined) {
              if (this.status === 'CP_CC_ANALYST') {
                this.defaultCpMatrixFull();
              } else {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            } else if (!this.router.url.includes('credit-proposal-summary') && this.router.url.split('?')[1] !== undefined) {
              this.checkOnDarFinal();
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
        }
      }
    }

    if (this.jhiMatrixDirMenu === 'cp-and-memo') {
      const queryParam = new URLSearchParams(this.router.url.split('?')[1]);
      const subroutes = queryParam.get('subroute');
      if (
        this.positionTypeId === 'SME_HEAD' ||
        this.positionTypeId === 'DEPT_HEAD' ||
        this.positionTypeId === 'SDH' ||
        this.positionTypeId === 'DH' ||
        this.positionTypeId === 'BM' ||
        this.positionTypeId === 'CREDIT_LEGAL_LEAD' ||
        this.positionTypeId === 'LEGAL_OFFICER' ||
        this.positionTypeId === 'CRO' ||
        this.positionTypeId === 'CRC' ||
        this.positionTypeId === 'CRC2' ||
        this.positionTypeId === 'LEGALOFFICER_OUTREGION'
      ) {
        if (this.argsPath.match(/dar-revision/g)) {
          if (this.router.url.includes('dar-revision-checker')) {
            if (subroutes === 'loan-facility' || subroutes === 'collateral-info' || subroutes === 'dar-summary' || this.routeEdit) {
              if (this.jhiMatrixDirElementType === '') {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
              }
            }
          } else {
            if (subroutes === 'loan-facility' || subroutes === 'collateral-info') {
              if (this.status !== 'PK_DAR_REVISION') {
                if (this.jhiMatrixDirElementType === '') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              } else {
                if (this.jhiMatrixDirElementType === 'input') {
                  this.viewContainerRef.createEmbeddedView(this.templateRef);
                }
              }
            } else {
              if (this.jhiMatrixDirElementType === '') {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
              }
            }
          }

          // Condition For Loan Analyst
        } else if (this.argsPath.match(/dar-final/g) || this.argsPath.match(/loan-committee-approval/g)) {
          if (subroutes === 'loan-facility-detail') {
            if (this.jhiMatrixDirElementType === 'input') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          } else {
            if (this.jhiMatrixDirElementType === '') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          }
          // Condition For Credit Proposal
        } else if (this.argsPath.match(/credit-proposal/g)) {
          if (subroutes === 'loan-facility-detail') {
            if (this.status === 'DRAFT') {
              if (this.jhiMatrixDirElementType === 'input') {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
              }
            } else {
              if (this.jhiMatrixDirElementType === '') {
                this.viewContainerRef.createEmbeddedView(this.templateRef);
              }
            }
          }
        } else {
          if (this.jhiMatrixDirElementType === '') {
            this.viewContainerRef.createEmbeddedView(this.templateRef);
          }
        }
      } else {
        if (this.positionTypeId === 'RM') {
          if (this.status === 'RETURN_TO_RM_CRA' || this.status === 'CP_RETURN_TO_CR') {
            if (this.jhiMatrixDirElementType === 'input') {
              this.viewContainerRef.createEmbeddedView(this.templateRef);
            }
          } else {
            this.checkOnCpAndMemo();
          }
        } else {
          if (this.status === 'RETURN_TO_RM_CRA' || this.status === 'CP_RETURN_TO_CR') {
            this.checkOnCpAndMemo();
          } else {
            this.checkOnCpAndMemo();
          }
        }
      }
    }

    if (this.jhiMatrixDirMenu === '/collateral-appraisal') {
      this.checkOnCollateralAppraisalRouter();
    }

    // cp and memo
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
    if (this.positionTypeId === 'RM') {
      this.roleRMMatrixInput();
    } else {
      this.roleOtherMatrixInput();
    }
  }
  private cpAndMemoLabel() {
    if (this.positionTypeId === 'RM') {
      this.roleRMMatrixLabel();
    } else {
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
      if (this.status === 'DRAFT' || this.status === 'CP_RETURN_TO_RM' || this.status === 'OL_APPEAL') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

  private roleRMMatrixLabel(): void {
    if (this.jhiMatrixDirSubMenu === 'summary') {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      if (this.status !== 'DRAFT' && this.status !== 'CP_RETURN_TO_RM' && this.status !== 'OL_APPEAL') {
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
      if (this.status !== 'DRAFT' && this.status !== 'CP_RETURN_TO_RM' && this.status !== 'OL_APPEAL') {
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
      this.defaultCpMatrixFull();
    } else if (this.positionTypeId === 'DEPT_HEAD' || this.positionTypeId === 'SME_HEAD') {
      if (this.jhiMatrixDirElementType === 'input') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    } else {
      if (this.jhiMatrixDirElementType === '') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
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
      if (this.jhiMatrixDirElementType === '') {
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
