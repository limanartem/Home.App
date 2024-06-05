type ForecastData = {
    time: Date;
    temperature: string;
    description: string;
    icon: string;
};
export interface Forecast {
    latitude: number;
    longitude: number;
    current: ForecastData;
    hourly: ForecastData[];
}
export declare const getForecast: ({ latitude, longitude, }: {
    latitude: number;
    longitude: number;
}) => Promise<Forecast>;
export {};
