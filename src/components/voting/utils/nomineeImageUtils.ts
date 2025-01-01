import { cn } from "@/lib/utils";

type NomineeName = string;

interface NomineeImageMapping {
  [key: string]: string;
}

const nomineeImageMapping: NomineeImageMapping = {
  "my": "/lovable-uploads/d58b4350-a0b2-4d6a-a124-3d2724665647.png",
  "MY": "/lovable-uploads/d58b4350-a0b2-4d6a-a124-3d2724665647.png",
  "plan b": "/lovable-uploads/c9f7ee7f-7f01-4778-bf67-98c3af662375.png",
  "maze": "/lovable-uploads/04149b51-7312-46a4-82ce-d6b0828ffb18.png",
  "the maze": "/lovable-uploads/04149b51-7312-46a4-82ce-d6b0828ffb18.png",
  "THE MAZE": "/lovable-uploads/04149b51-7312-46a4-82ce-d6b0828ffb18.png",
  "The Maze": "/lovable-uploads/04149b51-7312-46a4-82ce-d6b0828ffb18.png",
  "f&k": "/lovable-uploads/4cca2c41-ad59-4eb8-8768-d8acd38f6a85.png",
  "l'ile": "/lovable-uploads/afedee27-5b29-40c9-97cb-987851fc27be.png",
  "ile": "/lovable-uploads/afedee27-5b29-40c9-97cb-987851fc27be.png",
  "bus paradise": "/lovable-uploads/e86ac02b-b1f9-4ba7-b2fe-6c0b71a57d1a.png",
  "kaia": "/lovable-uploads/822f2109-e39c-49bc-9d49-a0caff61ca93.png",
  "nel's club": "/lovable-uploads/25203221-e2c4-47ba-9bca-3268e1a91e12.png",
  "maison bleue": "/lovable-uploads/0cc1b90b-3287-43ee-b754-cce61a14aab8.png",
  "feria": "/lovable-uploads/3bf95b68-9bb0-45da-9a27-ecf3257f50a1.png",
  "mademoiselle simone": "/lovable-uploads/60548362-6418-4f6c-a954-712bc12f6149.png",
  "you": "/lovable-uploads/c757b973-bfbb-478a-bf32-8e7f8363eb76.png",
  "cigale": "/lovable-uploads/f4406e88-333b-4e95-b162-0fd7f2089d9a.png",
  "au bon secours": "/lovable-uploads/8a3e3f29-5841-400e-8127-47159cf04eca.png",
  "casa jaguar": "/lovable-uploads/2bfb7476-b837-47c0-a820-109983e47ae8.png",
  "poisson chat": "/lovable-uploads/83b8592f-a31c-4432-a949-5cecf2f8fe29.png",
  "lockers": "/lovable-uploads/c6245aa1-5be4-4779-b999-54dd43ac850f.png",
  "javoo": "/lovable-uploads/b629982b-e48e-44c0-a518-034ee1c2f5e9.png",
  "bar by la maison": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "bambi": "/lovable-uploads/0570d5b2-d774-4316-a6c5-9ff288a86131.png",
  "bacchus": "/lovable-uploads/48dbdd27-9dc5-4a65-b1d3-a0ff1830a915.png",
  "18&10 apero club": "/lovable-uploads/1cba0d7a-ab4e-49d3-a7e2-8dabeecb3154.png",
  "glam club": "/lovable-uploads/91f3dc0f-6788-4088-b142-dbd53765c5b6.png",
  "klub": "/lovable-uploads/6f0ac234-85f6-4e73-a80e-b30f116ce8f6.png",
  "club 400": "/lovable-uploads/f1975a5f-f249-44e4-a1fc-c1b9812249e1.png",
  "justin": "/lovable-uploads/5477519f-5319-4d96-8c9a-04e5f7a98608.png",
  "biniou": "/lovable-uploads/2619c487-2026-42b6-8a14-c2d4c6585080.png",
  "faute aux ours": "/lovable-uploads/710bdecc-ac55-4766-b1b6-a7951dbc331e.png",
  "espit chupitos": "/lovable-uploads/6882e33f-5fbb-4766-b1b6-a7951dbc331e.png",
  "quai 19": "/lovable-uploads/8bc34934-e72d-4f40-b7ea-c5c9c4d1fbf0.png",
  "el sombrero": "/lovable-uploads/2abbb4c6-6d35-47d3-b1a1-b073181b3fe9.png",
  "excuse": "/lovable-uploads/5202b2b2-3423-4440-997d-271c9b1fdcfb.png",
  "trinix": "/lovable-uploads/d3536f37-22f6-416a-841d-fe8efd71e959.png",
  "TRINIX": "/lovable-uploads/d3536f37-22f6-416a-841d-fe8efd71e959.png",
  "Trinix": "/lovable-uploads/d3536f37-22f6-416a-841d-fe8efd71e959.png",
  "dj bekii": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "DJ BEKII": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "Dj Bekii": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "DJ Bekii": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "bekii": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "BEKII": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "Bekii": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "quai 22": "/lovable-uploads/7899a30a-b1ae-42f4-b7cd-5a7ed1e3912b.png",
  "QUAI 22": "/lovable-uploads/7899a30a-b1ae-42f4-b7cd-5a7ed1e3912b.png",
  "Quai 22": "/lovable-uploads/7899a30a-b1ae-42f4-b7cd-5a7ed1e3912b.png",
  "QUAI22": "/lovable-uploads/7899a30a-b1ae-42f4-b7cd-5a7ed1e3912b.png",
  "quai22": "/lovable-uploads/7899a30a-b1ae-42f4-b7cd-5a7ed1e3912b.png",
  "Quai22": "/lovable-uploads/7899a30a-b1ae-42f4-b7cd-5a7ed1e3912b.png",
  "rambler": "/lovable-uploads/f4fa3741-de0d-4036-b027-3efc17995ff6.png",
  "RAMBLER": "/lovable-uploads/f4fa3741-de0d-4036-b027-3efc17995ff6.png",
  "Rambler": "/lovable-uploads/f4fa3741-de0d-4036-b027-3efc17995ff6.png",
  "rambler cocktail club": "/lovable-uploads/f4fa3741-de0d-4036-b027-3efc17995ff6.png",
  "RAMBLER COCKTAIL CLUB": "/lovable-uploads/f4fa3741-de0d-4036-b027-3efc17995ff6.png",
  "Rambler Cocktail Club": "/lovable-uploads/f4fa3741-de0d-4036-b027-3efc17995ff6.png",
  "les assembleurs": "/lovable-uploads/6f21c914-775b-42ed-9737-8e8375c8ed4b.png",
  "LES ASSEMBLEURS": "/lovable-uploads/6f21c914-775b-42ed-9737-8e8375c8ed4b.png",
  "Les Assembleurs": "/lovable-uploads/6f21c914-775b-42ed-9737-8e8375c8ed4b.png",
  "assembleurs": "/lovable-uploads/6f21c914-775b-42ed-9737-8e8375c8ed4b.png",
  "le petit bleu": "/lovable-uploads/64f527a4-72a8-4d81-ac97-405a93d7d159.png",
  "LE PETIT BLEU": "/lovable-uploads/64f527a4-72a8-4d81-ac97-405a93d7d159.png",
  "Le Petit Bleu": "/lovable-uploads/64f527a4-72a8-4d81-ac97-405a93d7d159.png",
  "petit bleu": "/lovable-uploads/64f527a4-72a8-4d81-ac97-405a93d7d159.png",
  "le voxx": "/lovable-uploads/58e4d1a2-4dfb-4c0d-a74d-edf7b9133d2e.png",
  "LE VOXX": "/lovable-uploads/58e4d1a2-4dfb-4c0d-a74d-edf7b9133d2e.png",
  "Le Voxx": "/lovable-uploads/58e4d1a2-4dfb-4c0d-a74d-edf7b9133d2e.png",
  "voxx": "/lovable-uploads/58e4d1a2-4dfb-4c0d-a74d-edf7b9133d2e.png",
  "casa soho": "/lovable-uploads/b41ac4da-fdbd-4f16-9d17-f2694c647080.png",
  "CASA SOHO": "/lovable-uploads/b41ac4da-fdbd-4f16-9d17-f2694c647080.png",
  "Casa Soho": "/lovable-uploads/b41ac4da-fdbd-4f16-9d17-f2694c647080.png",
  "cactus bar": "/lovable-uploads/460b9f1b-4243-4eaa-a1bb-13d19c1cb988.png",
  "CACTUS BAR": "/lovable-uploads/460b9f1b-4243-4eaa-a1bb-13d19c1cb988.png",
  "Cactus Bar": "/lovable-uploads/460b9f1b-4243-4eaa-a1bb-13d19c1cb988.png",
  "cactus": "/lovable-uploads/460b9f1b-4243-4eaa-a1bb-13d19c1cb988.png",
  "voiles du grand large": "/lovable-uploads/f44edba2-f449-423f-911e-7f49b4ec1867.png",
  "VOILES DU GRAND LARGE": "/lovable-uploads/f44edba2-f449-423f-911e-7f49b4ec1867.png",
  "Voiles du Grand Large": "/lovable-uploads/f44edba2-f449-423f-911e-7f49b4ec1867.png",
  "bistrot brigitte": "/lovable-uploads/93ff9fb3-8967-49d7-a277-5c18863ea880.png",
  "BISTROT BRIGITTE": "/lovable-uploads/93ff9fb3-8967-49d7-a277-5c18863ea880.png",
  "Bistrot Brigitte": "/lovable-uploads/93ff9fb3-8967-49d7-a277-5c18863ea880.png",
  "red garden": "/lovable-uploads/95111bcc-f251-4692-8028-48dfb4d2dbff.png",
  "RED GARDEN": "/lovable-uploads/95111bcc-f251-4692-8028-48dfb4d2dbff.png",
  "Red Garden": "/lovable-uploads/95111bcc-f251-4692-8028-48dfb4d2dbff.png",
  "plouf": "/lovable-uploads/885cd64e-defa-4c83-9cda-bffa32aa6e8b.png",
  "PLOUF": "/lovable-uploads/885cd64e-defa-4c83-9cda-bffa32aa6e8b.png",
  "Plouf": "/lovable-uploads/885cd64e-defa-4c83-9cda-bffa32aa6e8b.png",
  "bistrot des celestins": "/lovable-uploads/24058066-c9a6-40ed-a1f6-6ba620ea36ab.png",
  "BISTROT DES CELESTINS": "/lovable-uploads/24058066-c9a6-40ed-a1f6-6ba620ea36ab.png",
  "Bistrot des Celestins": "/lovable-uploads/24058066-c9a6-40ed-a1f6-6ba620ea36ab.png",
  "bdc": "/lovable-uploads/24058066-c9a6-40ed-a1f6-6ba620ea36ab.png",
  "BDC": "/lovable-uploads/24058066-c9a6-40ed-a1f6-6ba620ea36ab.png",
  "tilt": "/lovable-uploads/006cd76c-1d4c-46d5-8ceb-90cb48f759e6.png",
  "TILT": "/lovable-uploads/006cd76c-1d4c-46d5-8ceb-90cb48f759e6.png",
  "Tilt": "/lovable-uploads/006cd76c-1d4c-46d5-8ceb-90cb48f759e6.png",
  "loft club": "/lovable-uploads/6f664826-df3a-424d-8c6d-ccad72240ba6.png",
  "LOFT CLUB": "/lovable-uploads/6f664826-df3a-424d-8c6d-ccad72240ba6.png",
  "Loft Club": "/lovable-uploads/6f664826-df3a-424d-8c6d-ccad72240ba6.png",
  "l'avenue 45": "/lovable-uploads/60449031-bfd2-405e-9afe-f5525cfbb9ec.png",
  "L'AVENUE 45": "/lovable-uploads/60449031-bfd2-405e-9afe-f5525cfbb9ec.png",
  "L'Avenue 45": "/lovable-uploads/60449031-bfd2-405e-9afe-f5525cfbb9ec.png",
  "avenue 45": "/lovable-uploads/60449031-bfd2-405e-9afe-f5525cfbb9ec.png",
  "AVENUE 45": "/lovable-uploads/60449031-bfd2-405e-9afe-f5525cfbb9ec.png",
  "Avenue 45": "/lovable-uploads/60449031-bfd2-405e-9afe-f5525cfbb9ec.png",
  "drungly": "/lovable-uploads/d232e803-234a-4525-bb52-6b57c6d414b4.png",
  "DRUNGLY": "/lovable-uploads/d232e803-234a-4525-bb52-6b57c6d414b4.png",
  "Drungly": "/lovable-uploads/d232e803-234a-4525-bb52-6b57c6d414b4.png",
  "club la maison": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "CLUB LA MAISON": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "Club La Maison": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "le club": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "LE CLUB": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "Le Club": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "le club by la maison": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "LE CLUB BY LA MAISON": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "Le Club by La Maison": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "club by la maison": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "CLUB BY LA MAISON": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "Club by La Maison": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png"
};

export const getNomineeImageUrl = (nomineeName: NomineeName, defaultImageUrl?: string): string => {
  // Log pour debug
  console.log('Recherche image pour:', nomineeName);
  console.log('Clés disponibles:', Object.keys(nomineeImageMapping));
  
  // Essayer avec le nom exact
  if (nomineeImageMapping[nomineeName]) {
    console.log('Trouvé avec le nom exact:', nomineeName);
    return nomineeImageMapping[nomineeName];
  }
  
  // Si pas trouvé, essayer avec le nom en minuscules
  const lowerCaseName = nomineeName.toLowerCase();
  if (nomineeImageMapping[lowerCaseName]) {
    console.log('Trouvé avec le nom en minuscules:', lowerCaseName);
    return nomineeImageMapping[lowerCaseName];
  }
  
  // Si toujours pas trouvé, retourner l'URL par défaut ou une chaîne vide
  console.log('Image non trouvée pour:', nomineeName);
  return defaultImageUrl || "";
};

export const shouldUseBlackBackground = (nomineeName: NomineeName): boolean => {
  const normalizedName = nomineeName.toLowerCase().replace(/^(le |la |l'|the )/, '');
  return ["bacchus", "bambi", "18&10 apero club", "bambolo", "l'ile", "ile", "les assembleurs", 
    "assembleurs", "petit bleu", "le petit bleu", "plouf", "bistrot des celestins", "bdc", 
    "tilt", "loft club", "avenue 45", "l'avenue 45", "drungly", "club la maison", "le club", 
    "le club by la maison", "club by la maison", "rambler", "rambler cocktail club", "quai 22"].includes(normalizedName);
};
