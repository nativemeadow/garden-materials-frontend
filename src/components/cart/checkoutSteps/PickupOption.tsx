import React from 'react';
import useOrders from '../../../zustand/userOrders';
import classes from './customer-address.module.css';
import { pickup } from '../../../shared/interfaces/customerInfo';

export const PickupOption = (pickupOptions: pickup) => {
	const { pickupTime, pickupDate, setPickupDate, setPickupTime } =
		useOrders();

	const pickupTimeRange = () => {
		const timeRange = [];
		for (let i = 7; i <= 16; i++) {
			let time = i;
			if (i < 10) {
				time = +`0${i}`;
			}
			if (time > 12) {
				timeRange.push({
					display: `${time - 12}:00 PM`,
				});
				if (i < 16) {
					timeRange.push({
						display: `${time - 12}:30 PM`,
					});
				}
			} else {
				timeRange.push({
					display: `${time}:00 AM`,
				});
				timeRange.push({
					display: `${time}:30 AM`,
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
						value={pickupDate}
						min={minimumDate()}
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
							setPickupDate(event.target.value);
						}}
					/>
					<p className={'text-base font-bold'}>Pickup Time:</p>
					<input
						id='pickup_time'
						type='text'
						name='pickup_time'
						value={pickupTime}
						onChange={(
							event: React.ChangeEvent<HTMLInputElement>
						) => {
							setPickupTime(
								event.target.value.includes('AM')
									? event.target.value.replace(' AM', '')
									: event.target.value.replace(' PM', '')
							);
						}}
						list='pickup-time-range'
					/>
					<datalist id='pickup-time-range'>
						{pickupTimeRange().map((time, index) => {
							return <option key={index} value={time.display} />;
						})}
					</datalist>
					<p>
						Pickup date/time must be 1 hour later than the current
						time.
					</p>
				</div>
			</div>
		</div>
	);
};
