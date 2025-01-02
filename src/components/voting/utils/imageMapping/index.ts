import { digitalMapping } from './digitalMapping';
import { djMapping } from './djMapping';
import { barsMapping } from './barsMapping';
import { NomineeImageMapping } from '../imageTypes';

export const nomineeImageMapping: NomineeImageMapping = {
  ...digitalMapping,
  ...djMapping,
  ...barsMapping
};