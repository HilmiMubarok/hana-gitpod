import { ICreditProposal } from 'app/entities/credit-proposal/credit-proposal.model';

export function formatBytes(bytes: number, decimals?: number) {
  if (bytes === 0) {
    return '0 Bytes';
  }
  const k = 1024;
  const dm = decimals <= 0 ? 0 : decimals || 2;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export interface IParsePreviousAtrribute {
  previousReturn?: any;
  previousHistory?: any;
  darRevHistory?: any;
  previousOfferingLetter?: any;
}

export function parsePreviousAtrribute(cp: ICreditProposal): IParsePreviousAtrribute {
  const parsedAttribute = {};

  const attributes = ['previousReturn', 'previousHistory', 'darRevHistory', 'previousOfferingLetter'];
  const subAttributes = [
    'binding',
    'convenant',
    'insurance',
    'facilityDetail',
    'creditProposalCollateralData',
    'facilityTakeOver',
    'facilityTakeOverAfterBank',
    'groupChecklisCollateral',
    'collateralPrevious',
    'creditProposalCollateralData',
    'coverageTotal',
    'collateralSummary'
  ];

  for (const attribute of attributes) {
    if (cp.attributes[attribute]) {
      const parsedAttributeObj =
        typeof cp.attributes[attribute] === 'string' ? JSON.parse(cp.attributes[attribute]) : cp.attributes[attribute];
      parsedAttribute[attribute] = parsedAttributeObj;

      for (const subAttribute of subAttributes) {
        if (parsedAttributeObj[subAttribute]) {
          parsedAttributeObj[subAttribute] =
            typeof parsedAttributeObj[subAttribute] === 'string'
              ? JSON.parse(parsedAttributeObj[subAttribute])
              : parsedAttributeObj[subAttribute];
        }
      }
    }
  }

  return parsedAttribute;
}
