type NomineeName = string;

interface NomineeImageMapping {
  [key: string]: string;
}

const nomineeImageMapping: NomineeImageMapping = {
  "my": "/lovable-uploads/d58b4350-a0b2-4d6a-a124-3d2724665647.png",
  "plan b": "/lovable-uploads/c9f7ee7f-7f01-4778-bf67-98c3af662375.png",
  "the maze": "/lovable-uploads/58e4d1a2-4dfb-4c0d-a74d-edf7b9133d2e.png",
  "f&k": "/lovable-uploads/4cca2c41-ad59-4eb8-8768-d8acd38f6a85.png",
  "l'ile": "/lovable-uploads/e2bb2732-4867-4199-9d7c-93f850f4e8b2.png",
  "bus paradise": "/lovable-uploads/e86ac02b-b1f9-4ba7-b2fe-6c0b71a57d1a.png",
  "kaia": "/lovable-uploads/822f2109-e39c-49bc-9d49-a0caff61ca93.png",
  "nel's club": "/lovable-uploads/25203221-e2c4-47ba-9bca-3268e1a91e12.png",
  "la maison bleue": "/lovable-uploads/b7e6bd80-2442-4cd2-ab7c-d9844d394308.png",
  "la feria": "/lovable-uploads/6f664826-df3a-424d-8c6d-ccad72240ba6.png",
  "mademoiselle simone": "/lovable-uploads/60548362-6418-4f6c-a954-712bc12f6149.png",
  "you": "/lovable-uploads/c757b973-bfbb-478a-bf32-8e7f8363eb76.png",
  "la cigale": "/lovable-uploads/f44edba2-f449-423f-911e-7f49b4ec1867.png",
  "au bon secours": "/lovable-uploads/8a3e3f29-5841-400e-8127-47159cf04eca.png",
  "casa jaguar": "/lovable-uploads/2bfb7476-b837-47c0-a820-109983e47ae8.png",
  "poisson chat": "/lovable-uploads/83b8592f-a31c-4432-a949-5cecf2f8fe29.png",
  "lockers": "/lovable-uploads/c6245aa1-5be4-4779-b999-54dd43ac850f.png",
  "javoo": "/lovable-uploads/b629982b-e48e-44c0-a28e-407b800addab.png",
  "le bar by la maison": "/lovable-uploads/70a42996-e268-4b83-a96b-ac2873ef9805.png",
  "bambi": "/lovable-uploads/0570d5b2-d774-4316-a6c5-9ff288a86131.png",
};

export const getNomineeImageUrl = (nomineeName: NomineeName, defaultImageUrl?: string): string => {
  const normalizedName = nomineeName.toLowerCase();
  return nomineeImageMapping[normalizedName] || defaultImageUrl || "";
};

export const shouldUseBlackBackground = (nomineeName: NomineeName): boolean => {
  return !!nomineeImageMapping[nomineeName.toLowerCase()];
};