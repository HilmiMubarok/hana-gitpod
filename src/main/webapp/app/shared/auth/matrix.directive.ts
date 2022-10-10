import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';

import lodash from 'lodash';

@Directive({
  selector: '[jhiMatrixDir]',
})
export class MatrixDirective implements OnInit, OnDestroy {
  private authorities!: string[];
  private status!: string
  private readonly destroy$ = new Subject<void>();

  @Input()
  set jhiMatrixDir(value: string) {
	this.status = value;
  }

  @Input() jhiMatrixDirElementType: string;
  @Input() jhiMatrixDirMenu: string;
  @Input() jhiMatrixDirSubMenu: string;

  constructor(private accountService: AccountService, private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
    // this.elementRef.nativeElement.style.display = "none";
	this.viewContainerRef.clear();
	this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
		this.authorities = res.authorities;
        this.checkAccess();
      });
  }

  private checkAccess(): void {
	if(this.jhiMatrixDirMenu === 'credit-proposal'){
	  this.checkOnCreditProposal();
	}
  }

  private checkOnCreditProposal(): void {
	if(this.jhiMatrixDirElementType === 'input'){
	  this.matrixInput();
	}else{
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

  private roleRMMatrixInput(): void{
	if(this.jhiMatrixDirSubMenu !== 'summary'){
	  if(this.status === 'DRAFT' || this.status === 'CP_RETURN_TO_RM'){
		this.viewContainerRef.createEmbeddedView(this.templateRef);
	  }
	}
  }

  private roleRMMatrixLabel(): void {
	if(this.jhiMatrixDirSubMenu === 'summary'){
	  this.viewContainerRef.createEmbeddedView(this.templateRef);
	}else{
	  if(this.status !== 'DRAFT' && this.status !== 'CP_RETURN_TO_RM'){
		this.viewContainerRef.createEmbeddedView(this.templateRef);
	  }
	}
  }

  private roleOtherMatrixInput(): void {
	if(this.jhiMatrixDirSubMenu === 'summary'){
	  this.viewContainerRef.createEmbeddedView(this.templateRef);
	}
  }

  private roleOtherMatrixLabel(): void {
	if(this.jhiMatrixDirSubMenu !== 'summary'){
	  if(this.status !== 'DRAFT' && this.status !== 'CP_RETURN_TO_RM'){
		this.viewContainerRef.createEmbeddedView(this.templateRef);
	  }
	}
  }
  
  private matrixInput(): void {
	if(lodash.indexOf(this.authorities, 'ROLE_RM') >= 0){
	  this.roleRMMatrixInput();
	}else{
	  this.roleOtherMatrixInput();
	}
  }

  private matrixLabel(): void {
	if(lodash.indexOf(this.authorities, 'ROLE_RM') >= 0){
	  this.roleRMMatrixLabel()
	}else{
	  this.roleOtherMatrixLabel();
	}
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}