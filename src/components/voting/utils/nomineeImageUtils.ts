import { NomineeImageMapping, NomineeName } from './imageTypes';
import { nomineeImageMapping } from './imageMapping';
import { blackBackgroundNominees } from './blackBackgroundNominees';

export const getNomineeImageUrl = (nomineeName: NomineeName, defaultImageUrl?: string): string => {
  console.log('Recherche image pour:', nomineeName);
  
  // Vérifier d'abord l'URL directe si fournie
  if (defaultImageUrl) {
    console.log('URL directe fournie:', defaultImageUrl);
    return defaultImageUrl;
  }
  
  if (nomineeImageMapping[nomineeName]) {
    console.log('Trouvé avec le nom exact:', nomineeName);
    return nomineeImageMapping[nomineeName];
  }
  
  const lowerCaseName = nomineeName.toLowerCase();
  if (nomineeImageMapping[lowerCaseName]) {
    console.log('Trouvé avec le nom en minuscules:', lowerCaseName);
    return nomineeImageMapping[lowerCaseName];
  }
  
  console.log('Image non trouvée pour:', nomineeName);
  return "";
};

export const shouldUseBlackBackground = (nomineeName: NomineeName): boolean => {
  const normalizedName = nomineeName.toLowerCase().replace(/^(le |la |l'|the )/, '');
  return blackBackgroundNominees.includes(normalizedName);
};