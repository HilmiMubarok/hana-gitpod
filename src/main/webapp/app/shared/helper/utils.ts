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

export function parsePreviousAtrribute(cp: ICreditProposal) {
  const parsedAttribute = {};
  // check if previousReturn attribute is exist
  if (cp.attributes['previousReturn']) {
    // parse previousReturn attributes
    const previousReturn = JSON.parse(cp.attributes['previousReturn']);
    parsedAttribute['previousReturn'] = previousReturn;

    // check if binding attribute is exist
    if (parsedAttribute['previousReturn']['binding']) {
      parsedAttribute['previousReturn']['binding'] = JSON.parse(previousReturn['binding']);
    }

    // check if convenant attribute is exist
    if (parsedAttribute['previousReturn']['convenant']) {
      parsedAttribute['previousReturn']['convenant'] = JSON.parse(previousReturn['convenant']);
    }

    // check if insurance attribute is exist
    if (parsedAttribute['previousReturn']['insurance']) {
      parsedAttribute['previousReturn']['insurance'] = JSON.parse(previousReturn['insurance']);
    }

    // check if facilityDetail attribute is exist
    if (parsedAttribute['previousReturn']['facilityDetail']) {
      parsedAttribute['previousReturn']['facilityDetail'] = JSON.parse(previousReturn['facilityDetail']);
    }

    // check if creditProposalCollateralData attribute is exist
    if (parsedAttribute['previousReturn']['creditProposalCollateralData']) {
      parsedAttribute['previousReturn']['creditProposalCollateralData'] = JSON.parse(previousReturn['creditProposalCollateralData']);
    }

    if (parsedAttribute['previousReturn']['facilityTakeOver']) {
      parsedAttribute['previousReturn']['facilityTakeOver'] = JSON.parse(previousReturn['facilityTakeOver']);
    }
    if (parsedAttribute['previousReturn']['facilityTakeOverAfterBank']) {
      parsedAttribute['previousReturn']['facilityTakeOverAfterBank'] = JSON.parse(previousReturn['facilityTakeOverAfterBank']);
    }
  }

  // check if previousHistory attribute is exist
  if (cp.attributes['previousHistory']) {
    // parse previousHistory attributes
    const previousHistory = JSON.parse(cp.attributes['previousHistory']);
    parsedAttribute['previousHistory'] = previousHistory;

    // check if binding attribute is exist
    if (parsedAttribute['previousHistory']['binding']) {
      parsedAttribute['previousHistory']['binding'] = JSON.parse(previousHistory['binding']);
    }

    // check if convenant attribute is exist
    if (parsedAttribute['previousHistory']['convenant']) {
      parsedAttribute['previousHistory']['convenant'] = JSON.parse(previousHistory['convenant']);
    }

    // check if insurance attribute is exist
    if (parsedAttribute['previousHistory']['insurance']) {
      parsedAttribute['previousHistory']['insurance'] = JSON.parse(previousHistory['insurance']);
    }

    // check if facilityDetail attribute is exist
    if (parsedAttribute['previousHistory']['facilityDetail']) {
      parsedAttribute['previousHistory']['facilityDetail'] = JSON.parse(previousHistory['facilityDetail']);
    }

    // check if creditProposalCollateralData attribute is exist
    if (parsedAttribute['previousHistory']['facilityTakeOver']) {
      parsedAttribute['previousHistory']['facilityTakeOver'] = JSON.parse(previousHistory['facilityTakeOver']);
    }
    if (parsedAttribute['previousHistory']['facilityTakeOverAfterBank']) {
      parsedAttribute['previousHistory']['facilityTakeOverAfterBank'] = JSON.parse(previousHistory['facilityTakeOverAfterBank']);
    }
  }

  return parsedAttribute;
}
