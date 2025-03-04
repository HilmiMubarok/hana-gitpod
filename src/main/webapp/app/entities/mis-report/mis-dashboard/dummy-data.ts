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

export const dashboardDummyData: DashboardData[] = [
    {
        "newFacility": 6,
        "existingFacility": 1,
        "additionalTopupFacility": 2,
        "renewalFacility": 1,
        "restructureFacility": 1,
        "decreaseFacility": 1,
        "othersFacility": 2,
        "additionalOthersFacility": 1,
        "renewalAdditionalFacility": 4,
        "renewalDecreaseFacility": 1,
        "renewalOthersFacility": 2,
        "decreaseOthersFacility": 1,
        "date": "2025-01-28",
        "information": [
            {
                "description": "New",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Existing",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Restructure",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Additional / Top Up",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Decrease",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Others",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Additional",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Decrease",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Others",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Renewal",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Decrease + Others",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Additional + Others",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "New",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Existing",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Restructure",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Additional / Top Up",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Decrease",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Others",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Additional",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Decrease",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Others",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Renewal",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Decrease + Others",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Additional + Others",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "New",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Existing",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Restructure",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Additional / Top Up",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Decrease",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Others",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Additional",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Decrease",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Others",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Renewal",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Decrease + Others",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Additional + Others",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            }
        ],
        "showcase": [
            {
                "description": "Month 3",
                "fromDate": "2025-01-01T00:00:00+07:00",
                "thruDate": "2025-01-31T23:59:59+07:00"
            },
            {
                "description": "Month 2",
                "fromDate": "2024-12-01T00:00:00+07:00",
                "thruDate": "2024-12-31T23:59:59+07:00"
            },
            {
                "description": "Month 1",
                "fromDate": "2024-11-01T00:00:00+07:00",
                "thruDate": "2024-11-30T23:59:59+07:00"
            }
        ]
    },
    {
        "newFacility": 3,
        "existingFacility": 3,
        "additionalTopupFacility": 2,
        "renewalFacility": 1,
        "restructureFacility": 1,
        "decreaseFacility": 2,
        "othersFacility": 1,
        "additionalOthersFacility": 1,
        "renewalAdditionalFacility": 3,
        "renewalDecreaseFacility": 2,
        "renewalOthersFacility": 1,
        "decreaseOthersFacility": 1,
        "date": "2025-01-28",
        "information": [
            {
                "description": "New",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Existing",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Restructure",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Additional / Top Up",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Decrease",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Others",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Additional",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Decrease",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Others",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Renewal",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Decrease + Others",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Additional + Others",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "New",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Existing",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Restructure",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Additional / Top Up",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Decrease",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Others",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Additional",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Decrease",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Others",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Renewal",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Decrease + Others",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Additional + Others",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "New",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Existing",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Restructure",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Additional / Top Up",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Decrease",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Others",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Additional",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Decrease",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Others",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Renewal",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Decrease + Others",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Additional + Others",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            }
        ],
        "showcase": [
            {
                "description": "Month 3",
                "fromDate": "2025-01-01T00:00:00+07:00",
                "thruDate": "2025-01-31T23:59:59+07:00"
            },
            {
                "description": "Month 2",
                "fromDate": "2024-12-01T00:00:00+07:00",
                "thruDate": "2024-12-31T23:59:59+07:00"
            },
            {
                "description": "Month 1",
                "fromDate": "2024-11-01T00:00:00+07:00",
                "thruDate": "2024-11-30T23:59:59+07:00"
            }
        ]
    },
    {
        "newFacility": 2,
        "existingFacility": 3,
        "additionalTopupFacility": 1,
        "renewalFacility": 2,
        "restructureFacility": 1,
        "decreaseFacility": 1,
        "othersFacility": 1,
        "additionalOthersFacility": 2,
        "renewalAdditionalFacility": 1,
        "renewalDecreaseFacility": 1,
        "renewalOthersFacility": 2,
        "decreaseOthersFacility": 1,
        "date": "2025-01-28",
        "information": [
            {
                "description": "New",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Existing",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Restructure",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Additional / Top Up",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Decrease",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Others",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Additional",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Decrease",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Others",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Renewal",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Decrease + Others",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "Additional + Others",
                "fromDate": "2025-01-01T23:59:59+07:00",
                "thruDate": "2025-01-28T00:00:00+07:00"
            },
            {
                "description": "New",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Existing",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Restructure",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Additional / Top Up",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Decrease",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Others",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Additional",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Decrease",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Others",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Renewal",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Decrease + Others",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "Additional + Others",
                "fromDate": "2024-12-01T23:59:59+07:00",
                "thruDate": "2024-12-28T00:00:00+07:00"
            },
            {
                "description": "New",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Existing",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Restructure",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Additional / Top Up",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Decrease",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Others",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Additional",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Decrease",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Renewal + Others",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Renewal",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Decrease + Others",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            },
            {
                "description": "Additional + Others",
                "fromDate": "2024-11-01T23:59:59+07:00",
                "thruDate": "2024-11-28T00:00:00+07:00"
            }
        ],
        "showcase": [
            {
                "description": "Month 3",
                "fromDate": "2025-01-01T00:00:00+07:00",
                "thruDate": "2025-01-31T23:59:59+07:00"
            },
            {
                "description": "Month 2",
                "fromDate": "2024-12-01T00:00:00+07:00",
                "thruDate": "2024-12-31T23:59:59+07:00"
            },
            {
                "description": "Month 1",
                "fromDate": "2024-11-01T00:00:00+07:00",
                "thruDate": "2024-11-30T23:59:59+07:00"
            }
        ]
    }
]