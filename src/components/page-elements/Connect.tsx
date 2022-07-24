import React from 'react';
import { Link } from 'react-router-dom';
import classes from './Connect.module.css';

const productTitle =
	classes['component-title'] + ' ' + classes['products__title'];
const connectTitle =
	classes['component-title'] + ' ' + classes['connect-section__title'];
const addressTitle =
	classes['address-hours__title'] + ' ' + classes['component-title'];
const affiliatesTitle =
	classes['affiliates--section__title'] + ' ' + classes['component-title'];
const partnersTitle =
	classes['partners--section__title'] + ' ' + classes['component-title'];

const Connect: React.FC = () => {
	return (
		<section className={classes.connections}>
			<div className={classes['connections__grid']}>
				<div className={classes['connect-section']}>
					<h3 className={connectTitle}>Connect with us</h3>
					<ul className={classes['connect__items']}>
						<li className={classes['connect__item']}>
							<a
								href='https://www.facebook.com/LyngsoGardenMaterials/ '
								className={classes['connect__item-social']}
								aria-label='Lyngso Garden Facebook link'
								title='Lyngso Garden Facebook'>
								<span
									className={'fa fa-facebook'}
									aria-hidden='true'></span>
							</a>
						</li>
						<li className={classes['connect__item']}>
							<a
								href='https://plus.google.com/+LyngsoGardenMaterialsIncRedwoodCity'
								className={classes['connect__item-social']}
								aria-label='Lyngso Garden Google Plus link'
								title='Lyngso Garden Google Plus'>
								<span
									className={'fa fa-google-plus'}
									aria-hidden='true'></span>
							</a>
						</li>
						<li className={classes['connect__item']}>
							<a
								href='http://www.houzz.com/pro/lyngso/lyngso-garden-materials-inc'
								className={classes['connect__item-social']}
								aria-label='Lyngso Garden Houzz link'
								title='Lyngso Garden Houzz'>
								<span
									className={'fa fa-houzz'}
									aria-hidden='true'></span>
							</a>
						</li>
						<li className={classes['connect__item']}>
							<a
								href='https://www.instagram.com/lyngsogardenmaterials/'
								className={classes['connect__item-social']}
								aria-label='Lyngso Garden Instagram link'
								title='Lyngso Garden Instagram'>
								<span
									className={'fa fa-instagram'}
									aria-hidden='true'></span>
							</a>
						</li>
						<li className={classes['connect__item']}>
							<a
								href='https://www.linkedin.com/company/lyngso-garden-materials-inc- '
								className={classes['connect__item-social']}
								aria-label='Lyngso Garden Linkedin link'
								title='Lyngso Garden Linkedin'>
								<span
									className={'fa fa-linkedin'}
									aria-hidden='true'></span>
							</a>
						</li>
						<li className={classes['connect__item']}>
							<a
								href='http://www.yelp.com/biz/lyngso-garden-materials-san-carlos '
								className={classes['connect__item-social']}
								aria-label='Lyngso Garden Yelp link'
								title='Lyngso Garden Yelp'>
								<span
									className={'fa fa-yelp'}
									aria-hidden='true'></span>
							</a>
						</li>
					</ul>
					<h3 className={productTitle}>Products</h3>
					<ul className={classes['product__items']}>
						<li className={classes['product__item']}>
							<Link
								className={classes['product-item__link']}
								to='/category/1'>
								Sand, Gravel &amp; Decorative Aggregates
							</Link>
						</li>
						<li className={classes['product__item']}>
							<Link
								className={classes['product-item__link']}
								to='/category/3'>
								Composts, Mulches, Soils &amp; Amendments
							</Link>
						</li>
						<li className={classes['product__item']}>
							<Link
								className={classes['product-item__link']}
								to='/category/4'>
								Biologicals, Fertilizers &amp; Bagged Soils
							</Link>
						</li>
						<li className={classes['product__item']}>
							<Link
								className={classes['product-item__link']}
								to='/category/2'>
								Natural Stone
							</Link>
						</li>
						<li className={classes['product__item']}>
							<Link
								className={classes['product-item__link']}
								to='/category/5'>
								Pottery &amp; Garden Ornaments
							</Link>
						</li>
						<li className={classes['product__item']}>
							<Link
								className={classes['product-item__link']}
								to='/category/6'>
								Water Features
							</Link>
						</li>
						<li className={classes['product__item']}>
							<Link
								className={classes['product-item__link']}
								to='/category/7'>
								Building Materials &amp; Tools
							</Link>
						</li>
						<li className={classes['product__item']}>
							<Link
								className={classes['product-item__link']}
								to='/category/8'>
								Precast Concrete Products
							</Link>
						</li>
					</ul>
					<h3 className={addressTitle}>Address</h3>
					<div className={classes['address--hours']}>
						<address className={classes['address__detail']}>
							256 Bolder Road
							<br />
							Half Moon Bay, CA 94203
						</address>
						<p>
							P 650&nbsp;.&nbsp;364&nbsp;.&nbsp;9999
							<br />F 650.&nbsp;361&nbsp;.&nbsp;9999
						</p>
						<h3 className={classes['component-title']}>Hours:</h3>
						<p>
							Mon to Fri 7am to 4pm <br />
							Sat 8am to 4pm <br />
							Sun Closed
						</p>
						<h3 className={classes['component-title']}>
							First time at Terrace?
						</h3>
						<a className={classes['product-item__link']} href='#'>
							View Our Business Map
						</a>
					</div>
				</div>
				<div className={classes['affiliates--section']}>
					<h3 className={affiliatesTitle}>Affiliates</h3>
					<div className={classes['affiliate-one']}>
						<a href='https://www.asla.org/'>
							<img
								className={classes['affiliates--section__img']}
								src='images/affiliates/american-landscape-architects.png'
								alt=''
							/>
						</a>
					</div>
					<div className={classes['affiliate-two']}>
						<a href='https://www.apld.org/'>
							<img
								className={classes['affiliates--section__img']}
								src='images/affiliates/professional-landscape-designers.png'
								alt=''
							/>
						</a>
					</div>
					<div className={classes['affiliate-three']}>
						<a href='http://www.clca.org/'>
							<img
								className={classes['affiliates--section__img']}
								src='images/affiliates/california-landscape-contractors.png'
								alt=''
							/>
						</a>
					</div>
					<div className={classes['affiliate-four']}>
						<a href='https://www.naturalstoneinstitute.org/'>
							<img
								className={classes['affiliates--section__img']}
								src='images/affiliates/nsi.jpeg'
								alt=''
							/>
						</a>
					</div>
					<div className={classes['affiliate-five']}>
						<a href='https://www.facebook.com/pages/category/Environmental-Conservation-Organization/Bay-Area-Gardeners-Association-104511274290934/'>
							<img
								className={classes['affiliates--section__img']}
								src='images/affiliates/baga.png'
								alt=''
							/>
						</a>
					</div>
					<div className={classes['affiliate-six']}>
						<a href='http://smsf-mastergardeners.ucanr.edu/'>
							<img
								className={classes['affiliates--section__img']}
								src='images/affiliates/master-gardener.png'
								alt=''
							/>
						</a>
					</div>
					<h3 className={partnersTitle}>
						Our Sustainability Partners
					</h3>
					<div className={classes['partners--section']}>
						<a href='http://www.omri.org/'>
							<img
								className={classes['affiliates--section__img']}
								src='images/partners/seal-omri.png'
								alt=''
							/>
						</a>
						<a href='https://www.cdfa.ca.gov/'>
							<img
								className={classes['affiliates--section__img']}
								src='images/partners/seal-cdfa.png'
								alt=''
							/>
						</a>
						<img
							className={classes['affiliates--section__img']}
							src='images/partners/logo-recycle.png'
							alt=''
						/>
						<a href='http://www.usgbc.org/'>
							<img
								className={classes['affiliates--section__img']}
								src='images/partners/seal-usgbc.png'
								alt=''
							/>
						</a>
						<a href='https://greenbusinessca.org/'>
							<img
								className={classes['affiliates--section__img']}
								src='images/partners/green-business-logo.png'
								alt=''
							/>
						</a>
						<a href='http://www.peninsulacleanenergy.com/'>
							<img
								className={classes['affiliates--section__img']}
								src='images/partners/seal-peninsula-clean-energy.png'
								alt=''
							/>
						</a>
					</div>
				</div>
			</div>
		</section>
	);
};

export default Connect;
