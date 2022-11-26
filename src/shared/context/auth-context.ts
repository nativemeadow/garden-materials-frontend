import { createContext } from 'react';

export interface AuthContextIf {
	isLoggedIn: boolean;
	userId: string | null;
	username: string | null;
	email: string | null;
	firstName: string | null;
	lastName: string | null;
	phone: string | null;
	token: boolean | null;
	login: (
		uid: string | null,
		username: string | null,
		email: string | null,
		firstName: string | null,
		lastName: string | null,
		phone: string | null,
		token: boolean,
		expirationData?: Date | null
	) => void;
	logout: () => void;
	updateUserSession: (
		email: string | null,
		firstName: string | null,
		lastName: string | null,
		phone: string | null
	) => void;
}

export const AuthContext = createContext<AuthContextIf>({
	isLoggedIn: false,
	userId: null,
	username: null,
	email: null,
	firstName: null,
	lastName: null,
	phone: null,
	token: false,
	login: () => {},
	logout: () => {},
	updateUserSession: () => {},
});
