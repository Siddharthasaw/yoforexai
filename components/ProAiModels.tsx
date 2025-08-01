import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Lock, ShieldCheck } from 'lucide-react';

const PRO_MODELS = [
	{
		title: 'GPT-4 Turbo',
		provider: 'OpenAI',
		description:
			'Most advanced language model with superior reasoning capabilities.',
		features: [
			'Enhanced pattern recognition',
			'Multi-timeframe analysis',
			'Risk management insights',
		],
		popular: true,
	},
	{
		title: 'GPT-4o',
		provider: 'OpenAI',
		description: 'Fast, multimodal model for trading, research, and automation.',
		features: [
			'Image & text analysis',
			'Real-time market scanning',
			'Automated trade signals',
		],
	},
	{
		title: 'Claude 3 Opus',
		provider: 'Anthropic',
		description: 'Highly capable model with exceptional analytical abilities.',
		features: [
			'Advanced sentiment analysis',
			'Market structure identification',
			'Trade optimization',
		],
	},
	{
		title: 'Gemini Ultra',
		provider: 'Google',
		description:
			"Google's most powerful AI model for complex trading scenarios.",
		features: [
			'Real-time adaptation',
			'Global market correlation',
			'Economic event impact analysis',
		],
	},
	{
		title: 'Gemini 1.5 Pro',
		provider: 'Google',
		description: 'Fast, reliable, and creative for trading and research.',
		features: [
			'News event detection',
			'Volatility prediction',
			'Multi-asset analysis',
		],
	},
	{
		title: 'Mixtral-8x22B',
		provider: 'Mistral AI',
		description: 'Efficient, open model for all users.',
		features: [
			'Speedy analysis',
			'Low latency signals',
			'Open-source flexibility',
		],
	},
	{
		title: 'Llama-3 70B',
		provider: 'Meta',
		description:
			"Meta's largest open-source LLM for research and business.",
		features: [
			'Custom strategy building',
			'Backtesting support',
			'Scalable for teams',
		],
	},
	{
		title: 'Grok-1.5',
		provider: 'xAI',
		description:
			"Elon Musk's Grok for real-time, witty, and powerful answers.",
		features: [
			'Real-time market humor',
			'Fast Q&A',
			'Social sentiment tracking',
		],
	},
];

export default function ProAiModels() {
	return (
		<div className="mt-12">
			<div className="text-center mb-8">
				<h2 className="text-2xl font-bold text-white mb-2">
					Upgrade to Pro AI Models
				</h2>
				<p className="text-slate-400 max-w-2xl mx-auto">
					Unlock advanced trading insights with our premium AI models. Get more
					accurate predictions,
					<br className="hidden sm:block" /> deeper market analysis, and exclusive
					trading strategies.
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
				{PRO_MODELS.map((model, index) => (
					<Card
						key={index}
						className={`bg-slate-800 border-slate-700 relative ${
							model.popular ? 'border-blue-500' : ''
						}`}
					>
						{model.popular && (
							<div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
								MOST POPULAR
							</div>
						)}
						<CardHeader>
							<CardTitle className="text-white flex items-center gap-2">
								<Lock className="w-4 h-4 text-yellow-400" />
								{model.title}
							</CardTitle>
							<div className="text-xs text-slate-400 mt-1">
								{model.provider}
							</div>
						</CardHeader>
						<CardContent>
							<p className="text-slate-400 mb-4">{model.description}</p>
							<ul className="space-y-2 mb-6">
								{model.features.map((feature, i) => (
									<li key={i} className="flex items-center text-slate-300">
										<CheckCircle className="w-4 h-4 text-green-500 mr-2" />
										{feature}
									</li>
								))}
							</ul>
							<Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
								Subscribe Now
							</Button>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}