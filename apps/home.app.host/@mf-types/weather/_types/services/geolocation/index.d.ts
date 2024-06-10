export declare const getCurrentPosition: () => Promise<GeolocationPosition>;
export declare const onPositionChange: (callback: (position: GeolocationPosition) => void) => () => void;
export type PositionInfo = {
    city?: string;
    countryName?: string;
    countryCode?: string;
    locality: string;
};
export declare const getPositionInfo: ({ latitude, longitude, }: {
    latitude: number;
    longitude: number;
}) => Promise<PositionInfo>;
