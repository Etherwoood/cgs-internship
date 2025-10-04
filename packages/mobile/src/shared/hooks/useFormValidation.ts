import { useState, useCallback } from 'react';
import { ZodSchema, ZodError } from 'zod';

interface ValidationErrors {
	[field: string]: string;
}

export const useFormValidation = <T>(schema: ZodSchema<T>) => {
	const [errors, setErrors] = useState<ValidationErrors>({});
	const [isValid, setIsValid] = useState(false);

	const validateForm = useCallback(
		(data: T): boolean => {
			try {
				schema.parse(data);
				setErrors({});
				setIsValid(true);
				return true;
			} catch (error) {
				if (error instanceof ZodError) {
					const newErrors: ValidationErrors = {};
					error.issues.forEach((err: unknown) => {
						const fieldName = (err as { path: string[] })
							.path[0] as string;
						if (fieldName) {
							newErrors[fieldName] = (
								err as { message: string }
							).message;
						}
					});
					setErrors(newErrors);
					setIsValid(false);
				}
				return false;
			}
		},
		[schema],
	);

	const clearErrors = useCallback(() => {
		setErrors({});
		setIsValid(false);
	}, []);

	const getFieldError = useCallback(
		(fieldName: keyof T): string | undefined => {
			return errors[fieldName as string];
		},
		[errors],
	);

	const hasErrors = Object.keys(errors).length > 0;

	return {
		errors,
		isValid,
		validateForm,
		clearErrors,
		getFieldError,
		hasErrors,
	};
};
