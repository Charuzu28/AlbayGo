export interface PlaceRegistryItem {
  key: string;
  name: string;
  aliases: string[];
  coords: [number, number];
  verified: boolean;
  category: "transport" | "tourist" | "food" | "stay";
  description?: string;
}

export const PLACE_REGISTRY: PlaceRegistryItem[] = [
  {
    key: "sm-legazpi",
    name: "SM Legazpi",
    aliases: ["sm legazpi", "sm city legazpi"],
    coords: [13.1437, 123.7444],
    verified: false,
    category: "food",
    description: "Major mall and common landmark in Legazpi."
  },
{
    key: "airport",
    name: "Bicol International Airport",
    aliases: ["airport", "daraga airport", "bicol airport", "bicol international airport"],
    coords: [13.1122, 123.6772],
    verified: false,
    category: "transport",
    description: "Main airport serving Albay."
},
{
    key: "daraga",
    name: "Daraga",
    aliases: ["daraga"],
    coords: [13.149028, 123.716806],
    verified: false,
    category: "transport",
    description: "Town center and common origin point."
},
{
    key: "legazpi-boulevard",
    name: "Legazpi Boulevard",
    aliases: ["legazpi boulevard", "boulevard"],
    coords: [13.142083, 123.760861],
    verified: false,
    category: "tourist",
    description: "Popular waterfront area in Legazpi."
}
];