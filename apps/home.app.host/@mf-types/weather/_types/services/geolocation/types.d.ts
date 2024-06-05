export interface ReverseGeocodeClientResponse {
    latitude: number;
    lookupSource: string;
    longitude: number;
    localityLanguageRequested: string;
    continent: string;
    continentCode: string;
    countryName: string;
    countryCode: string;
    principalSubdivision: string;
    principalSubdivisionCode: string;
    city: string;
    locality: string;
    postcode: string;
    plusCode: string;
    localityInfo: LocalityInfo;
}
interface LocalityInfo {
    administrative: Administrative[];
    informative: Informative[];
}
interface Informative {
    name: string;
    description?: string;
    isoName?: string;
    order: number;
    isoCode?: string;
    wikidataId?: string;
    geonameId?: number;
}
interface Administrative {
    name: string;
    description: string;
    isoName?: string;
    order: number;
    adminLevel: number;
    isoCode?: string;
    wikidataId: string;
    geonameId?: number;
}
export {};
