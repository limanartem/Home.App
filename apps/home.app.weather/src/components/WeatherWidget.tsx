enum WeatherWidgetSize {
  Small = 'small',
  Medium = 'medium',
  Large = 'large',
}

export const WeatherWidget = ({ size = WeatherWidgetSize.Medium }: { size?: WeatherWidgetSize }) => {
  return (
    <div>
      <h1>{size} Weather Widget</h1>
    </div>
  );
};

export default WeatherWidget;
