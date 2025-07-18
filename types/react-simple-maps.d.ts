declare module 'react-simple-maps' {
  interface Geography {
    rsmKey: string;
    id: string;
    properties: {
      ISO_A3: string;
      [key: string]: any;
    };
  }

  interface GeographiesProps {
    geography: string;
    children: (props: { geographies: Geography[] }) => React.ReactNode;
  }

  interface MarkerProps {
    coordinates: [number, number];
    children?: React.ReactNode;
    [key: string]: any;
  }

  export const ComposableMap: any;
  export const Geographies: React.FC<GeographiesProps>;
  export const Geography: any;
  export const Marker: React.FC<MarkerProps>;
  export function useMemoizedProjection(config: { scale: number }): (coordinates: [number, number]) => [number, number];
} 