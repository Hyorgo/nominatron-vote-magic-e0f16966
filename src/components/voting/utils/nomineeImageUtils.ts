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
  "ted": "/lovable-uploads/9d47d1ed-ebc9-4819-b481-5e9870d7a8dc.png",
  "TED": "/lovable-uploads/9d47d1ed-ebc9-4819-b481-5e9870d7a8dc.png",
  "Ted": "/lovable-uploads/9d47d1ed-ebc9-4819-b481-5e9870d7a8dc.png",
  "loic tilt": "/lovable-uploads/5c4eab83-df2e-4602-8c2b-65ecd465097a.png",
  "LOIC TILT": "/lovable-uploads/5c4eab83-df2e-4602-8c2b-65ecd465097a.png",
  "Loic Tilt": "/lovable-uploads/5c4eab83-df2e-4602-8c2b-65ecd465097a.png",
  "flufy la maison": "/lovable-uploads/eefb7ecf-041e-4344-bc21-4d27314e214d.png",
  "micka l'horloge": "/lovable-uploads/9b7fc8ac-e5ac-4116-920b-16ae4daf2ee4.png",
  "tom": "/lovable-uploads/eaa1a287-addb-487e-9591-c0f2419a2ef7.png",
  "TOM": "/lovable-uploads/eaa1a287-addb-487e-9591-c0f2419a2ef7.png",
  "Tom": "/lovable-uploads/eaa1a287-addb-487e-9591-c0f2419a2ef7.png",
  "tom ted": "/lovable-uploads/eaa1a287-addb-487e-9591-c0f2419a2ef7.png",
  "TOM TED": "/lovable-uploads/eaa1a287-addb-487e-9591-c0f2419a2ef7.png",
  "Tom Ted": "/lovable-uploads/eaa1a287-addb-487e-9591-c0f2419a2ef7.png",
  "jess": "/lovable-uploads/bb8c27bb-133a-4031-a4c6-a89ef43e67e5.png",
  "JESS": "/lovable-uploads/bb8c27bb-133a-4031-a4c6-a89ef43e67e5.png",
  "Jess": "/lovable-uploads/bb8c27bb-133a-4031-a4c6-a89ef43e67e5.png",
  "jess my": "/lovable-uploads/bb8c27bb-133a-4031-a4c6-a89ef43e67e5.png",
  "JESS MY": "/lovable-uploads/bb8c27bb-133a-4031-a4c6-a89ef43e67e5.png",
  "Jess My": "/lovable-uploads/bb8c27bb-133a-4031-a4c6-a89ef43e67e5.png",
  "ily": "/lovable-uploads/fbdc21e6-1514-48bb-ba8c-a91a17f2acd8.png",
  "ILY": "/lovable-uploads/fbdc21e6-1514-48bb-ba8c-a91a17f2acd8.png",
  "Ily": "/lovable-uploads/fbdc21e6-1514-48bb-ba8c-a91a17f2acd8.png",
  "dj ily": "/lovable-uploads/fbdc21e6-1514-48bb-ba8c-a91a17f2acd8.png",
  "DJ ILY": "/lovable-uploads/fbdc21e6-1514-48bb-ba8c-a91a17f2acd8.png",
  "Dj Ily": "/lovable-uploads/fbdc21e6-1514-48bb-ba8c-a91a17f2acd8.png",
  "DJ Ily": "/lovable-uploads/fbdc21e6-1514-48bb-ba8c-a91a17f2acd8.png",
  "val dc": "/lovable-uploads/7c2ddab3-6314-48a1-9985-12537cac9b58.png",
  "VAL DC": "/lovable-uploads/7c2ddab3-6314-48a1-9985-12537cac9b58.png",
  "Val Dc": "/lovable-uploads/7c2ddab3-6314-48a1-9985-12537cac9b58.png",
  "dj val dc": "/lovable-uploads/7c2ddab3-6314-48a1-9985-12537cac9b58.png",
  "DJ VAL DC": "/lovable-uploads/7c2ddab3-6314-48a1-9985-12537cac9b58.png",
  "Dj Val Dc": "/lovable-uploads/7c2ddab3-6314-48a1-9985-12537cac9b58.png",
  "DJ Val DC": "/lovable-uploads/7c2ddab3-6314-48a1-9985-12537cac9b58.png",
  "tom gio": "/lovable-uploads/24bb2cd9-0d17-468f-9f16-92fc80b78bef.png",
  "TOM GIO": "/lovable-uploads/24bb2cd9-0d17-468f-9f16-92fc80b78bef.png",
  "Tom Gio": "/lovable-uploads/24bb2cd9-0d17-468f-9f16-92fc80b78bef.png",
  "Tom gio": "/lovable-uploads/24bb2cd9-0d17-468f-9f16-92fc80b78bef.png",
  "trinix": "/lovable-uploads/d3536f37-22f6-416a-841d-fe8efd71e959.png",
  "TRINIX": "/lovable-uploads/d3536f37-22f6-416a-841d-fe8efd71e959.png",
  "Trinix": "/lovable-uploads/d3536f37-22f6-416a-841d-fe8efd71e959.png",
  "dj bekii": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "DJ BEKII": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "Dj Bekii": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "DJ Bekii": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "bekii": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "BEKII": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png",
  "Bekii": "/lovable-uploads/34221328-587d-4a81-9ee3-bf9f9e60f2fa.png"
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
  return ["bacchus", "bambi", "18&10 apero club", "bambolo", "l'ile", "ile", "les assembleurs", "assembleurs", "petit bleu", "le petit bleu", "plouf", "bistrot des celestins", "bdc", "tilt", "loft club", "avenue 45", "l'avenue 45", "drungly", "club la maison", "le club", "le club by la maison", "club by la maison"].includes(normalizedName);
};