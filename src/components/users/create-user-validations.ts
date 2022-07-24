// import { useHttpFetch } from '../../shared/hooks/useHttpFetch';

// const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
// const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export const passwordConfirm = (password: string, confirm: string) => {
	return password === confirm;
};

export const validations = {
	validations: {
		username: {
			required: {
				value: true,
				message: 'Username is required.',
			},
			pattern: {
				value: '^[A-z][A-z0-9-_]{6,23}$',
				message:
					"You're not allowed to use special characters or numbers in your username.",
			},
		},
		password: {
			required: {
				value: true,
				message: 'Password is required.',
			},
			pattern: {
				value: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$',
				message:
					'Your password needs to be between 8 and 24 characters long, contain at least one lowercase letter, one uppercase letter, one number and one special character (!@#$%).',
			},
		},
		passwordConfirmation: {
			required: {
				value: true,
				message: 'Password confirmation is required.',
			},
			// custom: {
			// 	isValid: passwordConfirm,
			// 	message: 'The passwords do not match.',
			// },
		},
		firstName: {
			required: {
				value: true,
				message: 'First name is required',
			},
			pattern: {
				value: '^[A-Za-z]*$',
				message:
					"You're not allowed to use special characters or numbers in your name.",
			},
		},
		lastName: {
			required: {
				value: true,
				message: 'Last name is required',
			},
			pattern: {
				value: '^[A-Za-z]*$',
				message:
					"You're not allowed to use special characters or numbers in your name.",
			},
		},
		email: {
			required: {
				value: true,
				message: 'Email is required',
			},
			pattern: {
				value: '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+.[A-Za-z]{2,4}$',
				message: 'Please enter a valid email address.',
			},
		},
	},
	onSubmit: () => {
		console.log('onSubmit');
		return true;
	},
};
