import { ShieldAlert } from 'lucide-react';

interface FormMessageProps {
	message?: string;
}

function FormAlert({ message }: FormMessageProps) {
	if (!message) return null;
	return (
		<div className="bg-gray-300/20 p-3 rounded-md  flex items-center gap-x-2 text-sm text-primary">
			<ShieldAlert className="h-10 w-10" />
			<p>{message}</p>
		</div>
	);
}

export default FormAlert;
