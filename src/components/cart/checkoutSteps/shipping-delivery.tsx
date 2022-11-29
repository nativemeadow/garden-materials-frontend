import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
	GoogleMap,
	useJsApiLoader,
	Marker,
	DirectionsRenderer,
} from '@react-google-maps/api';
import Geocode from 'react-geocode';
import useOrders from '../../../zustand/userOrders';
import configData from '../../../config.json';
import { round } from '../../../shared/util/math-utilities';

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

const containerStyle = {
	width: '900px',
	height: '500px',
};

type directionsType = {
	travelMode: google.maps.TravelMode;
	origin: string;
	destination: string;
};

const ShippingDelivery = () => {
	const { isLoaded } = useJsApiLoader({
		id: 'google-map-script',
		googleMapsApiKey: configData.GOOGLE_API_Key,
	});

	const center = useMemo<LatLngLiteral>(
		() => ({ lat: 37.5163718, lng: -122.2575847 }),
		[]
	);

	const options = useMemo<MapOptions>(
		() => ({
			mapId: 'e82b342b35986620',
			disableDefaultUI: true,
			clickableIcons: false,
		}),
		[]
	);
	Geocode.setApiKey(configData.GOOGLE_API_Key);

	const userOrders = useOrders((state) => state);
	const deliveryAddress = userOrders.deliveryAddress;
	// const [deliveryLocation, setDeliveryLocation] = useState<LatLngLiteral>();
	const [directions, setDirections] = useState<DirectionsResult>();
	const mapRef = useRef<GoogleMap>();

	const [map, setMap] = React.useState<google.maps.Map | null>(null);
	const [directionState] = useState<directionsType>({
		travelMode: google.maps.TravelMode.DRIVING,
		origin: configData.GOOGLE_MAP_ORIGIN,
		destination: `${deliveryAddress.address} ${deliveryAddress.city}, ${deliveryAddress.state_province} ${deliveryAddress.postal_code}`,
	});
	const [distance, setDistance] = useState<number>(0);
	const [duration, setDuration] = useState<number>(0);

	const onLoad = React.useCallback((map: any) => (mapRef.current = map), []);

	const onUnmount = React.useCallback(function callback(map: any) {
		setMap(null);
	}, []);

	useEffect(() => {
		const getDirections = async () => {
			return await Geocode.fromAddress(directionState.destination).then(
				(response) => {
					const service = new google.maps.DirectionsService();
					service.route(
						{
							origin: center,
							destination: directionState.destination,
							travelMode: directionState.travelMode,
						},
						(result, status) => {
							if (status === 'OK' && result) {
								setDirections(result);
								console.log('result: ', result);
								setDistance(
									result.routes[0].legs[0].distance!.value
								);
								setDuration(
									result.routes[0].legs[0].duration!.value
								);
								userOrders.setDeliveryDistance(
									round(distance / 1000) * 0.621371
								);
								userOrders.setDeliveryDuration(round(duration));
							}
						}
					);
					return response;
				},
				(error) => {
					console.error(error);
				}
			);
		};

		getDirections();
	}, [
		directionState.destination,
		directionState.travelMode,
		center,
		userOrders,
		distance,
		duration,
	]);

	return (
		<div>
			{isLoaded && (
				<>
					<GoogleMap
						mapContainerStyle={containerStyle}
						center={center}
						zoom={15}
						onLoad={onLoad}
						options={options}
						onUnmount={onUnmount}>
						<Marker onLoad={onLoad} position={center} />
						<DirectionsRenderer directions={directions} />
					</GoogleMap>
					<div>
						<h3>
							Distance: {round((distance / 1000) * 0.621371)}
							miles
						</h3>
						<h3>Duration: {round(duration / 60)} min</h3>
					</div>
				</>
			)}
		</div>
	);
};
export default ShippingDelivery;
