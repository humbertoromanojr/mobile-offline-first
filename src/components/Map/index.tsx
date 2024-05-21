import MapView, {
    PROVIDER_GOOGLE,
    MapViewProps,
    LatLng,
} from "react-native-maps";

type Props = MapViewProps & {
    coordinates: LatLng[];
};

export function mapView({ coordinates, ...rest }: Props) {
    const lastCoordinates = coordinates[coordinates.length - 1];

    return (
        <MapView
            provider={PROVIDER_GOOGLE}
            style={{ width: "100%", height: 200 }}
            region={{
                latitude: lastCoordinates.latitude,
                longitude: lastCoordinates.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
            }}
            {...rest}
        />
    );
}
