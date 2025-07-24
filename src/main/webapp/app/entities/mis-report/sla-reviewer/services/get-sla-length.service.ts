import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

interface IDatesSlaLength {
    dateOfAssignment: string[];
    dateReturnToBranch: string[];
    proposalBackToCRO: string[];
    proposalCheckByChecker: string[];
    dateReturnToReviewer: string[];
    loanCommDate: string[];
    generateDAR: string[];
    finalizedDAR: string[];
}

@Injectable({
    providedIn: 'root'
})
export class GetSlaLengthService {

    private datesSlaLengthSubject: BehaviorSubject<IDatesSlaLength> = new BehaviorSubject<IDatesSlaLength>(null);

    setDatesSlaLength(datesSlaLength: IDatesSlaLength) {
        this.datesSlaLengthSubject.next(datesSlaLength);
    }

    getDatesSlaLength(): IDatesSlaLength {
        return this.datesSlaLengthSubject.value;
    }

    /**
     * Assignment lengthnya pasti 1
     * Rumus:
     * Jika Assignment berjumlah 1 dan Return to Branch berjumlah 1
     * Date Return to Branch dikurangi Assignment
     *
     * Jika Assignment berjumlah 1 dan Return to Branch berjumlah lebih dari 1
     * Date Return to Branch pertama dikurangi Assignment
     */
    getReturnToBranch(): number {
        const dates = this.getDatesSlaLength();
        const assignment = dates.dateOfAssignment[0];
        const returnToBranch = dates.dateReturnToBranch[0];
        return this._findDiffDaysWithoutWeekend(returnToBranch, assignment);
    }

    /**
     * Return to branch, dan Proposal back to CRO, length nya pasti sama.
     *
     * Rumus:
     * Buang element pertama return to branch, dan buang element terakhir proposal back to CRO
     * sisa element masing masing di bandingkan
     * return to branch[1] - proposal back to CRO[1], return to branch[2] - proposal back to CRO[2], dst
     * hitung masing masing selisih hari, misal [1, 2]
     * return jumlah selisih hari -> 3
     *
     */
    getProposalBackToCRO(): number {
        const dates = this.getDatesSlaLength();
        const returnToBranch = dates.dateReturnToBranch.slice(1);
        const proposalBackToCRO = dates.proposalBackToCRO.slice(0, -1);

        let totalDays = 0;
        for (let i = 0; i < returnToBranch.length; i++) {
            totalDays += this._findDiffDaysWithoutWeekend(
                returnToBranch[i],
                proposalBackToCRO[i]
            );
        }

        return totalDays;
    }

    /**
     * Proposal check by checker lengthnya bisa beda sama proposal back to cro.
     *
     * Rumus:
     *
     * cek dulu proposal back to cro. jika kosong, maka
     * proposal check by checker[first] - assignment
     *
     * jika proposal back to cro ada satu, maka
     * proposal check by checker[first] - proposal back to cro[first]
     *
     * jika proposal back to cro ada lebih dari satu, maka
     * proposal check by checker[first] - proposal back to cro[last]
     *
     */
    getProposalCheckByChecker(): number {
        const dates = this.getDatesSlaLength();
        const assignment = dates.dateOfAssignment[0];
        const proposalBackToCRO = dates.proposalBackToCRO;
        const proposalCheckByChecker = dates.proposalCheckByChecker;

        if (proposalBackToCRO.length === 0) {
            return this._findDiffDaysWithoutWeekend(
                proposalCheckByChecker[0],
                assignment
            );
        }

        if (proposalBackToCRO.length === 1) {
            return this._findDiffDaysWithoutWeekend(
                proposalCheckByChecker[0],
                proposalBackToCRO[0]
            );
        }

        return this._findDiffDaysWithoutWeekend(
            proposalCheckByChecker[0],
            proposalBackToCRO[proposalBackToCRO.length - 1]
        );
    }

    /**
     * Jumah proposal checker by checker pasti lebih 1 item dari date return to reviewer, makanya harus di potong item pertama
     * Rumus:
     * hapus elemen pertama proposal checker by checker
     * hitung selisih dari masing-masing proposal checker by checker dan date return to reviewer
     */
    getDateReturnToReviewer(): number {
        const dates = this.getDatesSlaLength();
        const proposalCheckByChecker = dates.proposalCheckByChecker.slice(1);
        const dateReturnToReviewer = dates.dateReturnToReviewer;

        let totalDays = 0;
        for (let i = 0; i < proposalCheckByChecker.length; i++) {
            totalDays += this._findDiffDaysWithoutWeekend(
                proposalCheckByChecker[i],
                dateReturnToReviewer[i]
            );
        }

        return totalDays;
    }

    /**
     * Jumlah Checker pasti lebih banyak dari loancomm date
     * 
     * Rumus:
     * Kalau jumlah Checker 1, maka loan comm - checker
     * 
     */
    getLoanCommDate(): number {
        const dates = this.getDatesSlaLength();
        const proposalCheckByChecker = dates.proposalCheckByChecker[dates.proposalCheckByChecker.length - 1];
        const loanCommDate = dates.loanCommDate[0];

        return this._findDiffDaysWithoutWeekend(loanCommDate, proposalCheckByChecker);
    }

    /**
     * Rumus: Generate DAR (first) - Checker (last)
     */
    getGenerateDAR(): number {
        const dates = this.getDatesSlaLength();
        const generateDAR = dates.generateDAR[0];
        const checker = dates.proposalCheckByChecker[dates.proposalCheckByChecker.length - 1];

        return this._findDiffDaysWithoutWeekend(checker, generateDAR);
    }

    /**
     * 
     * Rumus: Finalized DAR (last) - Generate DAR (first)
     */
    getFinalizedDAR(): number {
        const dates = this.getDatesSlaLength();
        const finalizedDAR = dates.finalizedDAR[dates.finalizedDAR.length - 1];
        const generateDAR = dates.generateDAR[0];

        return this._findDiffDaysWithoutWeekend(finalizedDAR, generateDAR);
    }

    /**
     * 
     * Rumus SLA Length = Jumlah dari _getReturnToBranch sampai _getFinalizedDAR
     */
    getSLALength(): number {
        const returnToBranch = this.getReturnToBranch();
        const proposalBackToCRO = this.getProposalBackToCRO();
        const proposalCheckByChecker = this.getProposalCheckByChecker();
        const dateReturnToReviewer = this.getDateReturnToReviewer();
        const loanCommDate = this.getLoanCommDate();
        const generateDAR = this.getGenerateDAR();
        const finalizedDAR = this.getFinalizedDAR();

        return returnToBranch + proposalBackToCRO + proposalCheckByChecker + dateReturnToReviewer + loanCommDate + generateDAR + finalizedDAR;
    }

    private _findDiffDaysWithoutWeekend(
        startDate: string,
        endDate: string
    ): number {
        if (!startDate || !endDate) { return 0 };

        const start = new Date(startDate);
        const end = new Date(endDate);

        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);

        if (start > end) {
            const temp = new Date(start);
            start.setTime(end.getTime());
            end.setTime(temp.getTime());
        }

        let diffDays = 0;

        while (start < end) {
            const dayOfWeek = start.getDay();
            if (dayOfWeek !== 0 && dayOfWeek !== 6) {
                diffDays++;
            }
            start.setDate(start.getDate() + 1);
        }

        return diffDays;
    }
}