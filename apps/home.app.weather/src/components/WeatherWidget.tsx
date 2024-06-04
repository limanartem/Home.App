type WeatherWidgetSize = 'small' | 'medium' | 'large';

export const WeatherWidget = ({ size = 'medium' }: { size?: WeatherWidgetSize }) => {
  return (
    <div>
      <h1>{size} Weather Widget</h1>
    </div>
  );
};

export default WeatherWidget;
