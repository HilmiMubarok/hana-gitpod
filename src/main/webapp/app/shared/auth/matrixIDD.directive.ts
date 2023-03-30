import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AccountService } from 'app/core/auth/account.service';

import lodash from 'lodash';

@Directive({
  selector: '[jhiMatrixDirIDD]',
})
export class MatrixDirective implements OnInit, OnDestroy {
  private authorities!: string[];
  private elementType!: string;
  private readonly destroy$ = new Subject<void>();

  @Input()
  set jhiMatrixDirIDD(value: string) {
	this.elementType = value;
  }

  constructor(private accountService: AccountService, private templateRef: TemplateRef<any>, private viewContainerRef: ViewContainerRef) {}

  ngOnInit() {
	this.viewContainerRef.clear();
	this.accountService
      .getAuthenticationState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
		this.authorities = res.authorities;
        this.checkAccess();
      });
  }

  private matrixInput(): void {
	if(lodash.indexOf(this.authorities, 'ROLE_RM') >= 0){
	  this.viewContainerRef.createEmbeddedView(this.templateRef);
	}
  }

  private matrixLabel(): void {
	if(lodash.indexOf(this.authorities, 'ROLE_RM') >= 0){
	  // do nothing
	}else{
	  this.viewContainerRef.createEmbeddedView(this.templateRef);
	}
  }

  private checkAccess(): void {
	if(this.elementType === 'input'){
	  this.matrixInput();
	}else{
	  this.matrixLabel();
	}
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}