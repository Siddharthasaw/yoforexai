'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Camera, History, Calculator, TrendingUp, CheckCircle, ExternalLink, AlertCircle, DollarSign, Target } from 'lucide-react';
import { ChangeEvent } from 'react';

const PAIR_CATEGORIES = [
	{
		label: 'Forex',
		pairs: [
			{ symbol: 'FX_IDC:EURUSD', name: 'EUR/USD' },
			{ symbol: 'FX_IDC:GBPUSD', name: 'GBP/USD' },
			{ symbol: 'FX_IDC:USDJPY', name: 'USD/JPY' },
			{ symbol: 'FX_IDC:USDCHF', name: 'USD/CHF' },
			{ symbol: 'FX_IDC:USDCAD', name: 'USD/CAD' },
			{ symbol: 'FX_IDC:AUDUSD', name: 'AUD/USD' },
			{ symbol: 'FX_IDC:NZDUSD', name: 'NZD/USD' },
			{ symbol: 'FX_IDC:EURGBP', name: 'EUR/GBP' },
			{ symbol: 'FX_IDC:EURJPY', name: 'EUR/JPY' },
			{ symbol: 'FX_IDC:GBPJPY', name: 'GBP/JPY' },
			{ symbol: 'FX_IDC:AUDJPY', name: 'AUD/JPY' },
			{ symbol: 'FX_IDC:EURAUD', name: 'EUR/AUD' },
			{ symbol: 'FX_IDC:CHFJPY', name: 'CHF/JPY' },
			{ symbol: 'FX_IDC:USDTRY', name: 'USD/TRY' },
			{ symbol: 'FX_IDC:USDINR', name: 'USD/INR' },
			{ symbol: 'FX_IDC:USDZAR', name: 'USD/ZAR' },
			{ symbol: 'FX_IDC:EURTRY', name: 'EUR/TRY' },
			{ symbol: 'FX_IDC:USDSGD', name: 'USD/SGD' },
			{ symbol: 'FX_IDC:USDMXN', name: 'USD/MXN' },
		],
	},
	{
		label: 'Crypto',
		pairs: [
			{ symbol: 'BINANCE:BTCUSDT', name: 'BTC/USDT' },
			{ symbol: 'BINANCE:BTCUSD', name: 'BTC/USD' },
			{ symbol: 'BINANCE:BTCETH', name: 'BTC/ETH' },
			{ symbol: 'BINANCE:BTCBNB', name: 'BTC/BNB' },
			{ symbol: 'BINANCE:BTCXRP', name: 'BTC/XRP' },
			{ symbol: 'BINANCE:ETHUSDT', name: 'ETH/USDT' },
			{ symbol: 'BINANCE:ETHUSD', name: 'ETH/USD' },
			{ symbol: 'BINANCE:ETHBTC', name: 'ETH/BTC' },
			{ symbol: 'BINANCE:SOLUSDT', name: 'SOL/USDT' },
			{ symbol: 'BINANCE:ADAUSDT', name: 'ADA/USDT' },
			{ symbol: 'BINANCE:DOGEUSDT', name: 'DOGE/USDT' },
			{ symbol: 'BINANCE:XRPUSDT', name: 'XRP/USDT' },
			{ symbol: 'BINANCE:LTCUSDT', name: 'LTC/USDT' },
			{ symbol: 'BINANCE:SHIBUSDT', name: 'SHIB/USDT' },
			{ symbol: 'BINANCE:MATICUSDT', name: 'MATIC/USDT' },
			{ symbol: 'BINANCE:BNBUSDT', name: 'BNB/USDT' },
			{ symbol: 'BINANCE:TRXUSDT', name: 'TRX/USDT' },
			{ symbol: 'BINANCE:DOTUSDT', name: 'DOT/USDT' },
			{ symbol: 'BINANCE:AVAXUSDT', name: 'AVAX/USDT' },
			{ symbol: 'BINANCE:LINKUSDT', name: 'LINK/USDT' },
		],
	},
	{
		label: 'Commodities',
		pairs: [
			{ symbol: 'TVC:GOLD', name: 'XAU/USD' },
			{ symbol: 'TVC:SILVER', name: 'XAG/USD' },
			{ symbol: 'TVC:PLATINUM', name: 'XPT/USD' },
			{ symbol: 'TVC:PALLADIUM', name: 'XPD/USD' },
			{ symbol: 'TVC:USOIL', name: 'WTI/USD' },
			{ symbol: 'TVC:UKOIL', name: 'BRENT/USD' },
			{ symbol: 'TVC:NGAS', name: 'NGAS/USD' },
		],
	},
	{
		label: 'Indices',
		pairs: [
			{ symbol: 'OANDA:US30USD', name: 'US30' },
			{ symbol: 'OANDA:NAS100USD', name: 'US100' },
			{ symbol: 'OANDA:SPX500USD', name: 'US500' },
			{ symbol: 'OANDA:DE40EUR', name: 'DE40' },
			{ symbol: 'OANDA:UK100GBP', name: 'UK100' },
			{ symbol: 'OANDA:JP225USD', name: 'JP225' },
			{ symbol: 'OANDA:FR40EUR', name: 'FR40' },
		],
	},
	{
		label: 'Stocks',
		pairs: [
			{ symbol: 'NASDAQ:AAPL', name: 'AAPL' },
			{ symbol: 'NASDAQ:TSLA', name: 'TSLA' },
			{ symbol: 'NASDAQ:META', name: 'META' },
			{ symbol: 'NASDAQ:AMZN', name: 'AMZN' },
			{ symbol: 'NASDAQ:MSFT', name: 'MSFT' },
			{ symbol: 'NASDAQ:GOOG', name: 'GOOG' },
		],
	},
];

const TIMEFRAMES = [
	{ value: '1', label: 'M1' },
	{ value: '5', label: 'M5' },
	{ value: '15', label: 'M15' },
	{ value: '30', label: 'M30' },
	{ value: '60', label: 'H1' },
];

const chartRequirements = [
	{ id: 1, title: 'Timeframe', description: 'Use H4, D1, or W1 for Scalp trading analysis', completed: true },
	{ id: 2, title: 'Indicators', description: 'Include key indicators (MA, RSI, MACD) if used', completed: true },
	{ id: 3, title: 'Price History', description: 'Show at least 50-100 candles for context', completed: true },
	{ id: 4, title: 'Clear View', description: 'Ensure chart is clearly visible with good contrast', completed: true },
];

const recentUploads = [
	{ pair: 'EUR/USD D1', time: 'Today, 10:32 AM', status: 'analyzed' },
	{ pair: 'GBP/JPY H4', time: 'Yesterday, 3:15 PM', status: 'analyzed' },
	{ pair: 'USD/CAD W1', time: 'Jun 10, 2023', status: 'analyzed' },
];

const analysisGuides = [
	{
		icon: TrendingUp,
		title: 'Market Structure',
		description: 'Identify key support/resistance levels and market structure for potential trade setups.',
	},
	{
		icon: TrendingUp,
		title: 'Trend Analysis',
		description: 'Determine the current trend direction using multiple timeframe analysis.',
	},
	{
		icon: TrendingUp,
		title: 'Entry & Exit Points',
		description: 'Define precise entry triggers, stop loss and take profit levels for optimal risk/reward.',
	},
];

type Timeframe = 'M1' | 'M5' | 'M15' | 'M30' | 'H1';

interface AnalysisResult {
	signal: 'BUY' | 'SELL';
	confidence: number | string;
	timeframe?: Timeframe;
	entry: number;
	stop_loss: number;
	take_profit: number;
	risk_reward_ratio: number | string;
	dynamic_stop_loss?: number;
	dynamic_take_profit?: number;
	technical_analysis?: {
		RSI?: number | string;
		MACD?: number | string;
		Moving_Average?: number | string;
		ICT_Order_Block?: string;
		ICT_Fair_Value_Gap?: string;
		ICT_Breaker_Block?: string;
		ICT_Trendline?: string;
	};
	recommendation?: string;
}

export default function ScalpTrading() {
	const [dragActive, setDragActive] = useState(false);
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [analysisResults, setAnalysisResults] = useState<AnalysisResult | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [serverError, setServerError] = useState<string | null>(null);
	const [showCalculator, setShowCalculator] = useState(false);
	const [selectedPair, setSelectedPair] = useState(PAIR_CATEGORIES[0].pairs[0].symbol);
	const [selectedTimeframe, setSelectedTimeframe] = useState('');
	const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
	const [loading, setLoading] = useState(false);
	const [openCategory, setOpenCategory] = useState<string | null>(null);

	// Calculator state
	const [calculatorData, setCalculatorData] = useState({
		accountBalance: 10000,
		riskPercentage: 2,
		currencyPair: 'EUR/USD',
		entryPrice: 1.0892,
		stopLoss: 1.0850,
		takeProfit: 1.0950,
		tradeType: 'BUY',
	});

	const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === 'dragenter' || e.type === 'dragover') {
			setDragActive(true);
		} else if (e.type === 'dragleave') {
			setDragActive(false);
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);

		const files = e.dataTransfer.files;
		if (files && files[0]) {
			handleFileSelection(files[0]);
		}
	};

	const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files[0]) {
			handleFileSelection(files[0]);
		}
	};

	const handleFileSelection = (file: File) => {
		// Validate file type
		const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		if (!validTypes.includes(file.type)) {
			setError('Please upload a valid image file (JPG, PNG, or GIF)');
			return;
		}

		// Validate file size (max 5MB)
		if (file.size > 5 * 1024 * 1024) {
			setError('File size must be less than 5MB');
			return;
		}

		setSelectedFile(file);
		setError(null);
	};

	const calculatePositionSize = () => {
		const riskAmount = (calculatorData.accountBalance * calculatorData.riskPercentage) / 100;
		const pipValue = 10;
		const stopLossPips = Math.abs(calculatorData.entryPrice - calculatorData.stopLoss) * 10000;
		const positionSize = riskAmount / (stopLossPips * pipValue);

		const takeProfitPips = Math.abs(calculatorData.takeProfit - calculatorData.entryPrice) * 10000;
		const riskReward = takeProfitPips / stopLossPips;
		const potentialProfit = riskAmount * riskReward;

		return {
			positionSize: positionSize.toFixed(2),
			riskAmount: riskAmount.toFixed(2),
			riskReward: riskReward.toFixed(2),
			potentialProfit: potentialProfit.toFixed(2),
			stopLossPips: stopLossPips.toFixed(0),
			takeProfitPips: takeProfitPips.toFixed(0),
		};
	};

	const handleAnalyze = async (timeframe: Timeframe, file: File | null): Promise<void> => {
		if (!file) return;

		setIsAnalyzing(true);
		setError(null);
		setAnalysisResults(null);
		setSelectedTimeframe(timeframe);

		try {
			const formData = new FormData();
			formData.append('file', file);

			const response = await fetch(
				`https://backend.axiontrust.com/scalp/chart/?timeframe=${timeframe}`,
				{ method: 'POST', body: formData }
			);

			if (!response.ok) {
				// Grab plain-text error so the user sees
				// the actual message returned by your API.
				throw new Error(await response.text() || 'API request failed');
			}

			const data = await response.json();

			if (data?.error) {
				setServerError(data.error as string); // ensure .error is a string
			} else {
				setServerError(null);
				setAnalysisResults(data); // <- give this a proper type later
			}
		} catch (err: unknown) {
			// All caught errors are `unknown` now:
			const message = err instanceof Error ? err.message : String(err);
			setError(`Failed to analyze chart. ${message}`);
		} finally {
			setIsAnalyzing(false);
		}
	};

	const handleExecute = async () => {
		setLoading(true);
		setError(null);
		setAnalysisResult(null);
		try {
			const res = await fetch(
				`/api/scalp-analyze?pair=${selectedPair}&timeframe=${selectedTimeframe}`
			);
			if (!res.ok) throw new Error('API error');
			const data = await res.json();
			setAnalysisResult(data);
		} catch (err) {
			setError('Analysis failed. Try again.');
		} finally {
			setLoading(false);
		}
	};

	const calculationResults = calculatePositionSize();

	useEffect(() => {
		const script = document.createElement('script');
		script.src = 'https://s3.tradingview.com/tv.js';
		script.async = true;
		script.onload = () => {
			// @ts-ignore
			if (window.TradingView) {
				// @ts-ignore
				new window.TradingView.widget({
					autosize: true,
					symbol: selectedPair,
					interval: selectedTimeframe,
					container_id: 'tv_chart_container',
					theme: 'dark',
					style: '1',
					locale: 'en',
				});
			}
		};
		document.getElementById('tv_chart_container')?.appendChild(script);
		return () => {
			const chartDiv = document.getElementById('tv_chart_container');
			if (chartDiv) chartDiv.innerHTML = '';
		};
	}, [selectedPair, selectedTimeframe]);

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="flex flex-col gap-[2rem] lg:gap-0 lg:flex-row items-center lg:justify-between">
				<div className="w-full lg:w-auto flex flex-col flex-start">
					<h1 className="text-3xl font-bold text-white">Scalp Trading</h1>
					<p className="text-slate-400">M1, M5, M15, M30, H1 Timeframes</p>
				</div>
				<div className="w-full flex-wrap lg:w-auto flex flex-start gap-3">
					<Button variant="outline" className="border-slate-600 text-slate-300">
						<History className="h-4 w-4 mr-2" />
						History
					</Button>
					<Dialog open={showCalculator} onOpenChange={setShowCalculator}>
						<DialogTrigger asChild>
							<Button variant="outline" className="border-slate-600 text-slate-300">
								<Calculator className="h-4 w-4 mr-2" />
								Calculator
							</Button>
						</DialogTrigger>
						<DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
							<DialogHeader>
								<DialogTitle className="text-white">Pre-Trade Calculator</DialogTitle>
							</DialogHeader>
							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-slate-300">Account Balance ($)</Label>
										<Input
											type="number"
											value={calculatorData.accountBalance}
											onChange={(e) => setCalculatorData({ ...calculatorData, accountBalance: parseFloat(e.target.value) })}
											className="bg-slate-700 border-slate-600 text-white"
										/>
									</div>
									<div>
										<Label className="text-slate-300">Risk Percentage (%)</Label>
										<Input
											type="number"
											step="0.1"
											value={calculatorData.riskPercentage}
											onChange={(e) => setCalculatorData({ ...calculatorData, riskPercentage: parseFloat(e.target.value) })}
											className="bg-slate-700 border-slate-600 text-white"
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<Label className="text-slate-300">Currency Pair</Label>
										<Select value={calculatorData.currencyPair} onValueChange={(value) => setCalculatorData({ ...calculatorData, currencyPair: value })}>
											<SelectTrigger className="bg-slate-700 border-slate-600 text-white">
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="bg-slate-800 border-slate-700">
												<SelectItem value="EUR/USD">EUR/USD</SelectItem>
												<SelectItem value="GBP/USD">GBP/USD</SelectItem>
												<SelectItem value="USD/JPY">USD/JPY</SelectItem>
												<SelectItem value="AUD/USD">AUD/USD</SelectItem>
												<SelectItem value="USD/CAD">USD/CAD</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div>
										<Label className="text-slate-300">Trade Type</Label>
										<Select value={calculatorData.tradeType} onValueChange={(value) => setCalculatorData({ ...calculatorData, tradeType: value })}>
											<SelectTrigger className="bg-slate-700 border-slate-600 text-white">
												<SelectValue />
											</SelectTrigger>
											<SelectContent className="bg-slate-800 border-slate-700">
												<SelectItem value="BUY">BUY</SelectItem>
												<SelectItem value="SELL">SELL</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>

								<div className="grid grid-cols-3 gap-4">
									<div>
										<Label className="text-slate-300">Entry Price</Label>
										<Input
											type="number"
											step="0.0001"
											value={calculatorData.entryPrice}
											onChange={(e) => setCalculatorData({ ...calculatorData, entryPrice: parseFloat(e.target.value) })}
											className="bg-slate-700 border-slate-600 text-white"
										/>
									</div>
									<div>
										<Label className="text-slate-300">Stop Loss</Label>
										<Input
											type="number"
											step="0.0001"
											value={calculatorData.stopLoss}
											onChange={(e) => setCalculatorData({ ...calculatorData, stopLoss: parseFloat(e.target.value) })}
											className="bg-slate-700 border-slate-600 text-white"
										/>
									</div>
									<div>
										<Label className="text-slate-300">Take Profit</Label>
										<Input
											type="number"
											step="0.0001"
											value={calculatorData.takeProfit}
											onChange={(e) => setCalculatorData({ ...calculatorData, takeProfit: parseFloat(e.target.value) })}
											className="bg-slate-700 border-slate-600 text-white"
										/>
									</div>
								</div>

								<div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-700">
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-slate-400">Position Size:</span>
											<span className="text-white font-medium">{calculationResults.positionSize} lots</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-400">Risk Amount:</span>
											<span className="text-red-400 font-medium">${calculationResults.riskAmount}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-400">Stop Loss Pips:</span>
											<span className="text-white font-medium">{calculationResults.stopLossPips}</span>
										</div>
									</div>
									<div className="space-y-3">
										<div className="flex justify-between">
											<span className="text-slate-400">Risk/Reward:</span>
											<span className="text-white font-medium">1:{calculationResults.riskReward}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-400">Potential Profit:</span>
											<span className="text-green-400 font-medium">${calculationResults.potentialProfit}</span>
										</div>
										<div className="flex justify-between">
											<span className="text-slate-400">Take Profit Pips:</span>
											<span className="text-white font-medium">{calculationResults.takeProfitPips}</span>
										</div>
									</div>
								</div>

								<div className="flex space-x-3 pt-4">
									<Button className="flex-1 bg-blue-600 hover:bg-blue-700">
										Save Trade Setup
									</Button>
									<Button variant="outline" className="border-slate-600 text-slate-300" onClick={() => setShowCalculator(false)}>
										Close
									</Button>
								</div>
							</div>
						</DialogContent>
					</Dialog>
					<Button className="bg-blue-600 hover:bg-blue-700">
						<TrendingUp className="h-4 w-4 mr-2" />
						New Trade
					</Button>
				</div>
			</div>

			{/* Category Buttons with Dropdown */}
			<div className="flex flex-wrap gap-4 mb-6">
				{PAIR_CATEGORIES.map((cat) => (
					<div key={cat.label} className="relative">
						<button
							className="px-4 py-2 rounded bg-blue-900 text-white font-bold border border-blue-700"
							onClick={() => setOpenCategory(openCategory === cat.label ? null : cat.label)}
						>
							{cat.label}
						</button>
						{openCategory === cat.label && (
							<div className="absolute left-0 z-10 bg-slate-900 border border-slate-700 rounded mt-2 min-w-[180px] shadow-lg">
								{cat.pairs.map((pair) => (
									<div
										key={pair.symbol}
										className={`px-4 py-2 cursor-pointer hover:bg-blue-800 ${selectedPair === pair.symbol ? 'bg-blue-600 text-white' : 'text-slate-200'}`}
										onClick={() => {
											setSelectedPair(pair.symbol);
											setOpenCategory(null);
										}}
									>
										{pair.name}
									</div>
								))}
							</div>
						)}
					</div>
				))}
			</div>

			{/* Timeframe Selection & Execute */}
			<div className="flex items-center gap-4 mb-4">
				<label className="text-white font-semibold">Timeframe:</label>
				<select
					className="p-2 rounded bg-slate-800 text-white border border-slate-600 min-w-[120px]"
					value={selectedTimeframe}
					onChange={e => setSelectedTimeframe(e.target.value)}
				>
					<option value="">Select</option>
					{TIMEFRAMES.map(tf => (
						<option key={tf.value} value={tf.value}>{tf.label}</option>
					))}
				</select>
				<button
					className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
					onClick={handleExecute}
					disabled={!selectedTimeframe || loading}
				>
					{loading ? 'Loading...' : 'Execute'}
				</button>
			</div>

			{/* TradingView Chart */}
			<div id="tv_chart_container" style={{ height: 500 }}></div>

			{/* Analysis Result Box */}
			{analysisResult && (
				<div className="mt-6 bg-slate-800 border border-blue-700 rounded-lg p-6 shadow-lg max-w-xl mx-auto">
					<div className="flex items-center gap-4 mb-4">
						<span className={`px-3 py-1 rounded-full text-white font-bold ${analysisResult.signal === 'BUY' ? 'bg-green-600' : 'bg-red-600'}`}>
							{analysisResult.signal}
						</span>
						<span className="text-slate-300">Confidence: <b>{analysisResult.confidence}%</b></span>
					</div>
					<div className="grid grid-cols-2 gap-4 text-slate-200">
						<div>
							<div>Entry: <b>{analysisResult.entry}</b></div>
							<div>Stop Loss: <b>{analysisResult.stop_loss}</b></div>
							<div>Take Profit: <b>{analysisResult.take_profit}</b></div>
						</div>
						<div>
							<div>Risk/Reward: <b>{analysisResult.risk_reward_ratio}</b></div>
							<div>Timeframe: <b>{analysisResult.timeframe}</b></div>
						</div>
					</div>
					{analysisResult.recommendation && (
						<div className="mt-4 p-3 bg-slate-900 rounded text-blue-300">
							{analysisResult.recommendation}
						</div>
					)}
				</div>
			)}

			{error && (
				<div className="mt-4 text-red-400">{error}</div>
			)}
		</div>
	);
}