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
  "javoo": "/lovable-uploads/b629982b-e48e-44c0-a28e-407b800addab.png",
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
  "addict": "/lovable-uploads/0307341d-08e8-4b10-afe9-59804d2bbc08.png",
  "bambolo": "/lovable-uploads/b41ac4da-fdbd-4f16-9d17-f2694c647080.png",
  "les assembleurs": "/lovable-uploads/691fd4d5-094e-4c9d-816e-5cbedf786a67.png",
  "assembleurs": "/lovable-uploads/691fd4d5-094e-4c9d-816e-5cbedf786a67.png",
  "petit bleu": "/lovable-uploads/269aef47-5baf-46be-b0b0-de6e93daaf04.png",
  "le petit bleu": "/lovable-uploads/269aef47-5baf-46be-b0b0-de6e93daaf04.png",
  "voxx": "/lovable-uploads/d232e803-234a-4525-bb52-6b57c6d414b4.png",
  "le voxx": "/lovable-uploads/d232e803-234a-4525-bb52-6b57c6d414b4.png",
  "casa soho": "/lovable-uploads/24058066-c9a6-40ed-a1f6-6ba620ea36ab.png",
  "cactu bar": "/lovable-uploads/41892430-8fc7-4881-aef5-11cb3075bf72.png",
  "cactus bar": "/lovable-uploads/41892430-8fc7-4881-aef5-11cb3075bf72.png",
  "voiles du grand large": "/lovable-uploads/90f85e0d-77bc-4f82-92ab-c571db50e3ca.png",
  "bistrot brigitte": "/lovable-uploads/93ff9fb3-8967-49d7-a277-5c18863ea880.png",
  "red garden": "/lovable-uploads/fcf81da7-edaf-48be-9466-4f8951634e10.png",
  "plouf": "/lovable-uploads/885cd64e-defa-4c83-9cda-bffa32aa6e8b.png",
  "bistrot des celestins": "/lovable-uploads/896d1dda-2de1-4715-9329-cff5fc98886a.png",
  "bdc": "/lovable-uploads/896d1dda-2de1-4715-9329-cff5fc98886a.png",
  "loft club": "/lovable-uploads/3d3940b2-b035-4645-88d7-9c0b7b605aa3.png",
  "avenue 45": "/lovable-uploads/95111bcc-f251-4692-8028-48dfb4d2dbff.png",
  "l'avenue 45": "/lovable-uploads/95111bcc-f251-4692-8028-48dfb4d2dbff.png",
  "drungly": "/lovable-uploads/e1df94b2-d88b-4f72-9c4e-d57872fbc1bf.png",
  "club la maison": "/lovable-uploads/1e76ce64-2375-44d0-a518-034ee1c2f5e9.png",
  "le club": "/lovable-uploads/1e76ce64-2375-44d0-a518-034ee1c2f5e9.png",
  "le club by la maison": "/lovable-uploads/1e76ce64-2375-44d0-a518-034ee1c2f5e9.png",
  "club by la maison": "/lovable-uploads/1e76ce64-2375-44d0-a518-034ee1c2f5e9.png",
  "matinale brigitte": "/lovable-uploads/6cef5d7d-a653-40a7-aca3-0073db1371c5.png",
  "la matinale brigitte": "/lovable-uploads/6cef5d7d-a653-40a7-aca3-0073db1371c5.png",
  "la matinale de folie": "/lovable-uploads/6cef5d7d-a653-40a7-aca3-0073db1371c5.png",
  "pool beach": "/lovable-uploads/15715c93-8b8c-48e4-8cda-60a57a0b9ccf.png",
  "pool beach club": "/lovable-uploads/15715c93-8b8c-48e4-8cda-60a57a0b9ccf.png",
  "pool beach club lyon": "/lovable-uploads/15715c93-8b8c-48e4-8cda-60a57a0b9ccf.png",
  "pool beach party": "/lovable-uploads/15715c93-8b8c-48e4-8cda-60a57a0b9ccf.png",
  "clubbing revival": "/lovable-uploads/6f21c914-775b-42ed-9737-8e8375c8ed4b.png",
  "open air": "/lovable-uploads/5f304ae1-555c-438e-9c56-2e75305bffda.png",
  "open air party": "/lovable-uploads/5f304ae1-555c-438e-9c56-2e75305bffda.png",
  "grand machon du lou": "/lovable-uploads/460b9f1b-4243-4eaa-a1bb-13d19c1cb988.png",
  "le grand machon du lou": "/lovable-uploads/460b9f1b-4243-4eaa-a1bb-13d19c1cb988.png",
  "loic tilt": "/lovable-uploads/5c4eab83-df2e-4602-8c2b-65ecd465097a.png",
  "flufy la maison": "/lovable-uploads/eefb7ecf-041e-4344-bc21-4d27314e214d.png",
  "micka l'horloge": "/lovable-uploads/9b7fc8ac-e5ac-4116-920b-16ae4daf2ee4.png",
  "tom": "/lovable-uploads/eaa1a287-addb-487e-9591-c0f2419a2ef7.png",
  "TOM": "/lovable-uploads/eaa1a287-addb-487e-9591-c0f2419a2ef7.png",
  "jess": "/lovable-uploads/bb8c27bb-133a-4031-a4c6-a89ef43e67e5.png",
  "JESS": "/lovable-uploads/bb8c27bb-133a-4031-a4c6-a89ef43e67e5.png"
};

export const getNomineeImageUrl = (nomineeName: NomineeName, defaultImageUrl?: string): string => {
  const normalizedName = nomineeName.toLowerCase().trim();
  console.log('Normalized name:', normalizedName);
  console.log('Available mappings:', Object.keys(nomineeImageMapping));
  return nomineeImageMapping[normalizedName] || defaultImageUrl || "";
};

export const shouldUseBlackBackground = (nomineeName: NomineeName): boolean => {
  const normalizedName = nomineeName.toLowerCase().replace(/^(le |la |l'|the )/, '');
  return ["bacchus", "bambi", "18&10 apero club", "bambolo", "l'ile", "ile", "les assembleurs", "assembleurs", "petit bleu", "le petit bleu", "plouf", "bistrot des celestins", "bdc", "tilt", "loft club", "avenue 45", "l'avenue 45", "drungly", "club la maison", "le club", "le club by la maison", "club by la maison"].includes(normalizedName);
};