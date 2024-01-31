import FormError from '../FormError';
import CardWrapper from './CardWrapper';
function ErrorCard({ error }: { error: string }) {
	const errorMessages: { [key: string]: string }[] = [
		{
			AuthorizedCallbackError:
				'Seu acesso ao sistema foi negado, contate o administrador',
		},
		{
			CallbackRouteError:
				'Erro ao autenticar com seu provedor, contate o administrador',
		},
		{
			AdapterError:
				'Ocorreu um erro cŕitico ao realizar sua autenticação, contate o administrador',
		},
		{
			OAuthCallbackError:
				'Erro ao autenticar com seu provedor, contate o administrador',
		},
	];
	return (
		<div>
			<CardWrapper
				headerLabel="Algo deu errado"
				backButtonLabel="Voltar ao Login"
				backButtonHref="/auth/login"
			>
				<div className="w-full flex justify-center items-center">
					<FormError
						error={
							(errorMessages.find((message) => message[error])?.[
								error
							] as string) ||
							'Erro desconhecido, contate o administrador'
						}
						iconSize="h-10 w-10"
						flexDirection="flex-col text-center gap-4"
					/>
				</div>
			</CardWrapper>
		</div>
	);
}

export default ErrorCard;
