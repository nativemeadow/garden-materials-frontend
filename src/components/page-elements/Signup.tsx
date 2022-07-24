import React, { Fragment, useRef } from 'react';
import classes from './Signup.module.css';

const Connect: React.FC = () => {
	const emailRef = useRef<HTMLInputElement>(null);
	const generalCBRef = useRef<HTMLInputElement>(null);
	const compostTeaCBRef = useRef<HTMLInputElement>(null);

	const signUpHandler = (event: React.FormEvent) => {
		event.preventDefault();

		const emailAddress = emailRef.current?.value;

		console.log('email address:', emailAddress);
	};

	const checkGeneralHandler = (event: React.FormEvent) => {
		const compostTeaCB = generalCBRef.current?.value;
	};

	const checkGeneralTeaHandler = (event: React.FormEvent) => {
		const compostTeaCB = compostTeaCBRef.current?.value;
	};

	const emailInput = classes['email'] + ' ' + classes['email__wrap'];
	const emailInputDisplay =
		classes['email__input'] + ' ' + classes['email__input--view'];
	const generalInput =
		classes['newsletter__checkbox'] + ' ' + classes['newsletter__general'];

	return (
		<Fragment>
			<section className={classes['signup__section']}>
				<div className={classes['signup__flex']}>
					<h2 className={classes['newsletter__title']}>
						Sign Up for our Newsletter
					</h2>
					{/* <div className={classes['signup__wrapper']}>
						<form
							onSubmit={signUpHandler}
							aria-label='sign up for our newsletter'
							className={classes['newsletter__form']}>
							<div className={classes['checkboxes']}>
								<ul className={classes['checkboxes__list']}>
									<li className={generalInput}>
										<input
											type='checkbox'
											checked
											value='4'
											id='general-check-box'
											ref={generalCBRef}
											onChange={checkGeneralHandler}
										/>
										<label
											htmlFor='general-check-box'
											className={
												classes['checkboxes__label']
											}>
											General
										</label>
										<div className={classes['tooltip']}>
											<img
												className={
													classes['info__icon']
												}
												src='images/assets/icon-info.png'
												alt=''
											/>
											<span
												className={
													classes['info__label']
												}>
												Get seasonal tips on how best to
												take care of your garden and
												landscape, along with updates on
												our classes, products,
												resources, and more.
											</span>
										</div>
									</li>
									<li
										className={
											classes['newsletter__checkbox']
										}>
										<input
											type='checkbox'
											checked
											value='4'
											id='compost-tea-check-box'
											ref={compostTeaCBRef}
											onChange={checkGeneralTeaHandler}
										/>
										<label
											htmlFor='compost-tea-check-box'
											className={
												classes['checkboxes__label']
											}>
											Compost Tea
										</label>
										<div className={classes['tooltip']}>
											<img
												className={
													classes['info__icon']
												}
												src='images/assets/icon-info.png'
												alt=''
											/>
											<span
												className={
													classes['info__label']
												}>
												Get updates on when we freshly
												brew our Actively Aerated
												Compost Tea (AACT) and itâ€™s
												availability for purchase.
											</span>
										</div>
									</li>
								</ul>

								<div className={emailInput}>
									<input
										className={emailInputDisplay}
										name='email'
										type='email'
										placeholder='Your Email Address'
										required
										ref={emailRef}
									/>
								</div>
								<div className={classes['button']}>
									<button
										className={classes['button__join']}
										type='submit'>
										Join
									</button>
								</div>
							</div>
						</form> 
					</div>*/}
				</div>
			</section>
		</Fragment>
	);
};

export default Connect;
