export interface DashboardData {
    newFacility: number;
    existingFacility: number;
    additionalTopupFacility: number;
    renewalFacility: number;
    restructureFacility: number;
    decreaseFacility: number;
    othersFacility: number;
    additionalOthersFacility: number;
    renewalAdditionalFacility: number;
    renewalDecreaseFacility: number;
    renewalOthersFacility: number;
    decreaseOthersFacility: number;
    date: string;
    information: InformationItem[];
    showcase: ShowcaseItem[];
}

export interface DashboardUserData {
    nameUser: string;
    total: number;
    date: string;
    information: InformationItem[];
    showcase: ShowcaseItem[];
}

interface InformationItem {
    description: string;
    fromDate: string;
    thruDate: string;
}

interface ShowcaseItem {
    description: string;
    fromDate: string;
    thruDate: string;
}