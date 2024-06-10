export type ForecastData = {
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
    day: {
        lowestTemperature: string;
        highestTemperature: string;
    };
}
/**
 * Retrieves the weather forecast for a given latitude and longitude.
 * @param {Object} options - The latitude and longitude options.
 * @param {number} options.latitude - The latitude coordinate.
 * @param {number} options.longitude - The longitude coordinate.
 * @returns {Promise<Forecast>} The weather forecast.
 */
export declare const getForecast: ({ latitude, longitude, }: {
    latitude: number;
    longitude: number;
}) => Promise<Forecast>;
