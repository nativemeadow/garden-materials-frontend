import React, { useEffect } from 'react';
import useOrders from '../../../zustand/userOrders';
import { replaceLast } from '../../../shared/util/string-utils';
import classes from './customer-address.module.css';

export const PickupOption = () => {
	const { pickupTime, pickupDate, setPickupDate, setPickupTime } =
		useOrders();
	const userOrders = useOrders((state) => state);

	useEffect(() => {
		console.log('pickupOptions', pickupTime, pickupDate);
	}, [pickupTime, pickupDate]);

	const pickupTimeRange = (time?: string) => {
		type timeDisplay = { display: string; value: string };
		const timeRange: Array<timeDisplay> = [];

		for (let i = 7; i <= 16; i++) {
			const time = i < 10 ? +`0${i}` : i;
			if (time > 12) {
				timeRange.push({
					display: `${time - 12}:00 PM`,
					value: `${time - 12}:00`,
				});
				if (i < 16) {
					timeRange.push({
						display: `${time - 12}:30 PM`,
						value: `${time - 12}:30`,
					});
				}
			} else {
				timeRange.push({
					display: `${time}:00 AM`,
					value: `${time}:00`,
				});
				timeRange.push({
					display: `${time}:30 AM`,
					value: `${time}:30`,
				});
			}
		}

		return timeRange;
	};

	const minimumDate = () => {
		const today = new Date();
		if (today.getHours() > 16) {
			today.setDate(today.getDate() + 1);
		}
		return today.toISOString().split('T')[0];
	};

	return (
		<div className='flex flex-col gap-2'>
			<div className={''}>
				<h3 className={'text-base font-bold'}>Store Hours</h3>
			</div>
			<div className={'flex flex-col gap-2'}>
				<div className={'flex flex-col gap-1'}>
					<p className={classes['pickup-option-body-subtitle']}>
						Mon-Fri: 7:00am - 3:00pm
					</p>
					<p>Sat-Sun: Closed</p>
				</div>
				<div className={'flex flex-col gap-2'}>
					<p className={'text-base font-bold'}>Pickup Date:</p>
					<input
						id='pickup_date'
						type='date'
						name='pickup_date'
						value={userOrders.pickupDate}
						min={minimumDate()}
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
							setPickupDate(event.target.value);
						}}
					/>
					<p className={'text-base font-bold'}>Pickup Time:</p>
					<select
						name='pickup_time'
						id='pickup_time'
						value={replaceLast(userOrders.pickupTime, ':00', '')}
						onChange={(
							event: React.ChangeEvent<HTMLSelectElement>
						) => {
							setPickupTime(event.target.value);
						}}>
						{pickupTimeRange(userOrders.pickupTime).map(
							(time, index) => {
								return (
									<option key={index} value={time.value}>
										{time.display}
									</option>
								);
							}
						)}
					</select>
					<p>
						Pickup date/time must be 1 hour later than the current
						time.
					</p>
				</div>
			</div>
		</div>
	);
};
