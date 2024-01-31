import LoginBtn from '@/components/auth/LoginBtn';
import { Button } from '@/components/ui/button';
import { LockKeyhole } from 'lucide-react';

export default function Home() {
	return (
		<main className="flex h-full flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-400 to bg-purple-800">
			<div className="space-y-8 text-center">
				<div className="flex justify-center items-center gap-4">
					<LockKeyhole className="w-24 h-24 text-white" />
					<h1 className=" text-6xl font-semibold text-white  drop-shadow-md">
						AuthKit
					</h1>
				</div>
				<p className="text-white text-lg">
					Ponto inicial do serviço de autenticação
				</p>
				<div className="">
					<LoginBtn>
						<Button variant="secondary" size="lg">
							Login
						</Button>
					</LoginBtn>
				</div>
			</div>
		</main>
	);
}
