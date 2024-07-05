import { Component, Input } from '@angular/core';
import { ICreditProposal } from '../../credit-proposal.model';

@Component({
  selector: 'jhi-cp-memo-banding-standard-covenant',
  templateUrl: './cp-memo-banding-standard-covenant.component.html',
})
export class CPMemoBandingStandardCovenantComponent {
  @Input() creditProposal: ICreditProposal;
}
