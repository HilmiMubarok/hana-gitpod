import lodash from 'lodash';

interface IConvenant {
  id: number;
  covenant: string;
  deviation: string;
  justification: string;
  status: 'Applied' | 'To be waived' | 'Waived';
}
export const replaceConvenantFromMaster = (master: IConvenant[], proposal: IConvenant[]) => {
  if (!proposal || proposal.length === 0) {
    return lodash.cloneDeep(master);
  }

  const proposalMap = new Map();
  proposal.forEach(item => {
    if (item.covenant) {
      proposalMap.set(item.covenant, item);
    }
  });

  const updatedProposal: IConvenant[] = [];

  console.log("Master: ", master)
  
  master.forEach(masterItem => {
    const existingProposal = proposalMap.get(masterItem.covenant);
    if (existingProposal) {
      const updatedItem = { ...existingProposal };
      updatedItem.covenant = masterItem.covenant;
      updatedItem.id = masterItem.id;
      updatedProposal.push(updatedItem);
    } else {
      updatedProposal.push({
        ...masterItem,
        status: masterItem.status || 'Applied',
        deviation: masterItem.deviation || '',
        justification: masterItem.justification || '',
      });
    }
  });
  console.log("Updated Proposal: ", updatedProposal)
  return updatedProposal.sort((a, b) => a.id - b.id);
};
