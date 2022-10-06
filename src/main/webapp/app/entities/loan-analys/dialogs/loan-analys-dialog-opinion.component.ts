import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { INotes } from 'app/entities/notes/notes.model';

@Component({
  selector: 'jhi-loan-analys-dialog-opinion',
  templateUrl: './loan-analys-dialog-opinion.component.html',
  styleUrls: ['./loan-analys-dialog-opinion.css'],
})
export class LoanAnalysDialogOpinionComponent {
  public notes: INotes;


  public userId:string;
  public message:any;
creditProposalItem: any;

//   public test(){
//     for (let i = 0; i < this.creditProposalItem.notes[0]['userId'].length; i++) {

//       if (this.creditProposalItem.notes[i].userId === undefined ) {
//         console.log('Masukkkk Coy')
//       }else{
//         this.userId = this.creditProposalItem.notes[i].userId ;
//       //  this.message = this.creditProposalItem.notes[i].attributes['message'];
//         console.log("INI NOTESS",   this.userId);
//     }
//   }
// }

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataNotes: {
      notes: INotes;

    },
    _dialog: MatDialogRef<LoanAnalysDialogOpinionComponent>

  ) {
    this.notes = this.dataNotes.notes;
    // this.penampung = this.creditProposalItem.notes
    console.log("INI NOTESS", this.dataNotes.notes);
  }
}
