'use client';
import React, { useRef, useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import ProAiModels from '@/components/ProAiModels';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload, Camera, History, Calculator, TrendingUp, CheckCircle, ExternalLink, AlertCircle, DollarSign, Target, Zap, BarChart3, Brain, Shield, ArrowDown, ArrowUp, Activity, Info } from 'lucide-react';

declare global {
  interface Window {
    TradingView?: any;
  }
}

const chartRequirements = [
  { id: 1, title: 'Timeframe', description: 'Use H4, D1, or W1 for AI Trading Analysis analysis', completed: true },
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
    icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
    title: 'Market Structure',
    description: 'Identify key support/resistance levels and market structure for potential trade setups.',
  },
  {
    icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
    title: 'Trend Analysis',
    description: 'Determine the current trend direction using multiple timeframe analysis.',
  },
  {
    icon: <TrendingUp className="w-4 h-4 text-blue-400" />,
    title: 'Entry & Exit Points',
    description: 'Define precise entry triggers, stop loss and take profit levels for optimal risk/reward.',
  },
];

// Updated TIMEFRAMES to match API granularity values
const TIMEFRAMES = [
  { value: 'M1', label: 'M1' },
  { value: 'M5', label: 'M5' },
  { value: 'M15', label: 'M15' },
  { value: 'M30', label: 'M30' },
  { value: 'H1', label: 'H1' },
  { value: 'H4', label: 'H4' },
  { value: 'D', label: 'D1' },
  { value: 'W', label: 'W1' },
  { value: 'M', label: 'MN' },
];

type Timeframe = 'H1' | 'H4' | 'D1' | 'W1';

// Updated AnalysisResult interface to handle different strategy schemas
interface AnalysisResult {
  signal: 'BUY' | 'SELL' | 'STRADDLE BUY' | 'NEUTRAL';
  confidence: number | string;
  entry?: number;
  stop_loss?: number;
  take_profit?: number;
  risk_reward_ratio: string;
  timeframe: string;
  technical_analysis: Record<string, any>;
  recommendation: string;
  // Options specific fields
  call_entry?: number;
  put_entry?: number;
  breakeven_upper?: number;
  breakeven_lower?: number;
  strategy?: string;
  aiModel?: string;
}

// Updated PAIR_CATEGORIES to include TradingView symbol format
const PAIR_CATEGORIES = [
  {
    label: "Forex",
    pairs: [
      { symbol: "EUR_USD", name: "EUR/USD", tvSymbol: "FX:EURUSD" },
      { symbol: "GBP_USD", name: "GBP/USD", tvSymbol: "FX:GBPUSD" },
      { symbol: "USD_JPY", name: "USD/JPY", tvSymbol: "FX:USDJPY" },
      { symbol: "USD_CHF", name: "USD/CHF", tvSymbol: "FX:USDCHF" },
      { symbol: "USD_CAD", name: "USD/CAD", tvSymbol: "FX:USDCAD" },
      { symbol: "AUD_USD", name: "AUD/USD", tvSymbol: "FX:AUDUSD" },
      { symbol: "NZD_USD", name: "NZD/USD", tvSymbol: "FX:NZDUSD" },
      { symbol: "EUR_GBP", name: "EUR/GBP", tvSymbol: "FX:EURGBP" },
      { symbol: "EUR_JPY", name: "EUR/JPY", tvSymbol: "FX:EURJPY" },
      { symbol: "GBP_JPY", name: "GBP/JPY", tvSymbol: "FX:GBPJPY" },
      { symbol: "AUD_JPY", name: "AUD/JPY", tvSymbol: "FX:AUDJPY" },
      { symbol: "EUR_AUD", name: "EUR/AUD", tvSymbol: "FX:EURAUD" },
      { symbol: "CHF_JPY", name: "CHF/JPY", tvSymbol: "FX:CHFJPY" },
      { symbol: "USD_TRY", name: "USD/TRY", tvSymbol: "FX:USDTRY" },
      { symbol: "USD_INR", name: "USD/INR", tvSymbol: "FX:USDINR" },
      { symbol: "USD_ZAR", name: "USD/ZAR", tvSymbol: "FX:USDZAR" },
      { symbol: "EUR_TRY", name: "EUR/TRY", tvSymbol: "FX:EURTRY" },
      { symbol: "USD_SGD", name: "USD/SGD", tvSymbol: "FX:USDSGD" },
      { symbol: "USD_MXN", name: "USD/MXN", tvSymbol: "FX:USDMXN" },
    ],
  },
  {
    label: "Crypto",
    pairs: [
      { symbol: "BTC_USDT", name: "BTC/USDT", tvSymbol: "BINANCE:BTCUSDT" },
      { symbol: "BTC_USD", name: "BTC/USD", tvSymbol: "BINANCE:BTCUSD" },
      { symbol: "BTC_ETH", name: "BTC/ETH", tvSymbol: "BINANCE:BTCETH" },
      { symbol: "BTC_BNB", name: "BTC/BNB", tvSymbol: "BINANCE:BTCBNB" },
      { symbol: "BTC_XRP", name: "BTC/XRP", tvSymbol: "BINANCE:BTCXRP" },
      { symbol: "ETH_USDT", name: "ETH/USDT", tvSymbol: "BINANCE:ETHUSDT" },
      { symbol: "ETH_USD", name: "ETH/USD", tvSymbol: "BINANCE:ETHUSD" },
      { symbol: "ETH_BTC", name: "ETH/BTC", tvSymbol: "BINANCE:ETHBTC" },
      { symbol: "SOL_USD", name: "SOL/USD", tvSymbol: "BINANCE:SOLUSD" },
      { symbol: "ADA_USD", name: "ADA/USD", tvSymbol: "BINANCE:ADAUSD" },
      { symbol: "DOGE_USD", name: "DOGE/USD", tvSymbol: "BINANCE:DOGEUSD" },
      { symbol: "XRP_USD", name: "XRP/USD", tvSymbol: "BINANCE:XRPUSD" },
      { symbol: "LTC_USD", name: "LTC/USD", tvSymbol: "BINANCE:LTCUSD" },
      { symbol: "SHIB_USD", name: "SHIB/USD", tvSymbol: "BINANCE:SHIBUSD" },
    ],
  },
  {
    label: "Commodities",
    pairs: [
      { symbol: "XAU_USD", name: "XAU/USD", tvSymbol: "TVC:GOLD" },
      { symbol: "XAG_USD", name: "XAG/USD", tvSymbol: "TVC:SILVER" },
      { symbol: "XPT_USD", name: "XPT/USD", tvSymbol: "TVC:PLATINUM" },
      { symbol: "XPD_USD", name: "XPD/USD", tvSymbol: "TVC:PALLADIUM" },
      { symbol: "WTI_USD", name: "WTI/USD", tvSymbol: "TVC:USOIL" },
      { symbol: "BRENT_USD", name: "BRENT/USD", tvSymbol: "TVC:UKOIL" },
      { symbol: "NGAS_USD", name: "NGAS/USD", tvSymbol: "TVC:NGAS" },
    ],
  },
  {
    label: "Indices",
    pairs: [
      { symbol: "US30", name: "US30", tvSymbol: "OANDA:US30USD" },
      { symbol: "US100", name: "US100", tvSymbol: "OANDA:NAS100USD" },
      { symbol: "US500", name: "US500", tvSymbol: "OANDA:SPX500USD" },
      { symbol: "DE40", name: "DE40", tvSymbol: "OANDA:DE40EUR" },
      { symbol: "UK100", name: "UK100", tvSymbol: "OANDA:UK100GBP" },
      { symbol: "JP225", name: "JP225", tvSymbol: "OANDA:JP225USD" },
      { symbol: "FR40", name: "FR40", tvSymbol: "OANDA:FR40EUR" },
    ],
  },
  {
    label: "Stocks",
    pairs: [
      { symbol: "AAPL", name: "AAPL", tvSymbol: "NASDAQ:AAPL" },
      { symbol: "TSLA", name: "TSLA", tvSymbol: "NASDAQ:TSLA" },
      { symbol: "META", name: "META", tvSymbol: "NASDAQ:META" },
      { symbol: "AMZN", name: "AMZN", tvSymbol: "NASDAQ:AMZN" },
      { symbol: "MSFT", name: "MSFT", tvSymbol: "NASDAQ:MSFT" },
      { symbol: "GOOG", name: "GOOG", tvSymbol: "NASDAQ:GOOG" },
    ],
  },
];

const AI_MODELS = [
  { label: "OpenAI", value: "openai", basic: "GPT-3.5 Turbo" },
  { label: "Google Gemini", value: "gemini", basic: "Gemini 1.0 Pro" },
  { label: "Anthropic Claude", value: "claude", basic: "Claude 3 Haiku" },
  { label: "Meta Llama", value: "llama", basic: "Llama-2 7B" },
  { label: "Mistral AI", value: "mistral", basic: "Mistral-7B" },
  { label: "xAI Grok", value: "grok", basic: "Grok-1" },
];

const TRADING_STRATEGIES = [
  "breakout",
  "ict",
  "advanced_smc",
  "smc",
  "fibonacci",
  "trend_following",
  "momentum",
  "volatility_breakout",
  "carry_trade",
  "options_straddle"
];

const STRATEGY_LABELS = {
  "breakout": "Breakout Strategy",
  "ict": "ICT (Inner Circle Trader) Concept",
  "advanced_smc": "Advanced SMC (Smart Money Concept) Strategy",
  "smc": "SMC (Smart Money Concept) Strategy",
  "fibonacci": "Fibonacci Retracement Strategy",
  "trend_following": "Trend Following Strategy",
  "momentum": "Momentum Trading Strategy",
  "volatility_breakout": "Volatility Breakout Strategy",
  "carry_trade": "Carry Trade Strategy",
  "options_straddle": "Options Straddle Strategy"
};

// Strategy-specific technical analysis field labels
const TECHNICAL_ANALYSIS_LABELS = {
  "breakout": {
    "Support_Level": "Support Level",
    "Resistance_Level": "Resistance Level",
    "Volume_Confirmation": "Volume Confirmation",
    "Breakout_Direction": "Breakout Direction"
  },
  "ict": {
    "Order_Block": "Order Block",
    "Fair_Value_Gap": "Fair Value Gap",
    "Liquidity_Grab": "Liquidity Grab",
    "Market_Structure": "Market Structure"
  },
  "advanced_smc": {
    "Breaker_Block": "Breaker Block",
    "Mitigation_Block": "Mitigation Block",
    "Imbalance": "Imbalance",
    "Multi_Timeframe_Alignment": "Multi-Timeframe Alignment"
  },
  "smc": {
    "CHOCH": "CHOCH",
    "BOS": "BOS",
    "Liquidity_Sweep": "Liquidity Sweep",
    "Institutional_Manipulation": "Institutional Manipulation"
  },
  "fibonacci": {
    "Fib_38.2": "Fib 38.2%",
    "Fib_61.8": "Fib 61.8%",
    "Confluence_With_RSI": "Confluence With RSI",
    "Retracement_Level": "Retracement Level"
  },
  "trend_following": {
    "MA_Crossover": "MA Crossover",
    "Trendline": "Trendline",
    "Trailing_Stop": "Trailing Stop",
    "Trend_Strength": "Trend Strength"
  },
  "momentum": {
    "ROC": "ROC",
    "ADX": "ADX",
    "Volume_Confirmation": "Volume Confirmation",
    "Momentum_Direction": "Momentum Direction"
  },
  "volatility_breakout": {
    "ATR": "ATR",
    "Channel_Upper": "Channel Upper",
    "Channel_Lower": "Channel Lower",
    "Volatility_Expansion": "Volatility Expansion"
  },
  "carry_trade": {
    "Interest_Differential": "Interest Differential",
    "Swap_Rate": "Swap Rate",
    "Carry_Yield": "Carry Yield",
    "Hedging_Needed": "Hedging Needed"
  },
  "options_straddle": {
    "Implied_Volatility": "Implied Volatility",
    "Theta_Decay": "Theta Decay",
    "Event_Trigger": "Event Trigger",
    "Volatility_Forecast": "Volatility Forecast"
  }
};

export default function AiChartAnalysis() {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);
  const [showCalculator, setShowCalculator] = useState(false);
  const [selectedPair, setSelectedPair] = useState(PAIR_CATEGORIES[0].pairs[0]);
  const [selectedTimeframe, setSelectedTimeframe] = useState('M5'); // Default to M5
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedAIModel, setSelectedAIModel] = useState<string>(AI_MODELS[0].value); // Set default AI model
  const [showTimeframeError, setShowTimeframeError] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<string>("breakout");
  const [showStrategyError, setShowStrategyError] = useState(false);
  const [openStrategyDropdown, setOpenStrategyDropdown] = useState(false);
  const [openAIDropdown, setOpenAIDropdown] = useState(false);
  const [tradingViewLoaded, setTradingViewLoaded] = useState(false);
  
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const proAiRef = useRef<HTMLDivElement>(null);
  const widgetRef = useRef<any>(null);
  
  // Calculator state
  const [calculatorData, setCalculatorData] = useState({
    accountBalance: 10000,
    riskPercentage: 2,
    currencyPair: 'EUR_USD',
    entryPrice: 1.0892,
    stopLoss: 1.0850,
    takeProfit: 1.0950,
    tradeType: 'BUY'
  });

  // Load TradingView script once
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.TradingView) {
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/tv.js';
      script.async = true;
      script.onload = () => {
        setTradingViewLoaded(true);
      };
      document.head.appendChild(script);
    } else if (window.TradingView) {
      setTradingViewLoaded(true);
    }
  }, []);

  // Initialize or update TradingView widget
  useEffect(() => {
    if (!tradingViewLoaded || !selectedPair || !selectedTimeframe) return;
    
    // Destroy existing widget if it exists
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
        widgetRef.current = null;
      } catch (e) {
        console.error('Error removing widget:', e);
      }
    }

    // Clear container
    if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = '';
    }

    // Create new widget
    // @ts-ignore
    widgetRef.current = new window.TradingView.widget({
      autosize: true,
      symbol: selectedPair.tvSymbol,
      interval: selectedTimeframe,
      container_id: 'tv_chart_container',
      theme: 'dark',
      style: '1',
      locale: 'en',
      toolbar_bg: '#1e293b',
      enable_publishing: false,
      allow_symbol_change: false,
      hide_top_toolbar: false,
      hide_legend: false,
      save_image: false,
      studies: ['MASimple@tv-basicstudies', 'RSI@tv-basicstudies', 'MACD@tv-basicstudies'],
    });

    // Cleanup
    return () => {
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
          widgetRef.current = null;
        } catch (e) {
          console.error('Error removing widget on cleanup:', e);
        }
      }
    };
  }, [tradingViewLoaded, selectedPair, selectedTimeframe]);

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
      takeProfitPips: takeProfitPips.toFixed(0)
    };
  };

  const handleAnalyze = async (
    timeframe: Timeframe,
    file: File | null
  ): Promise<void> => {
    if (!file) return;
    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);
    setSelectedTimeframe(timeframe);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await fetch(
        `https://backend.axiontrust.com/swing/chart/?timeframe=${timeframe}`,
        { method: 'POST', body: formData }
      );
      if (!response.ok) {
        throw new Error(await response.text() || 'API request failed');
      }
      const data = await response.json();
      console.log(data)
      if (data?.error) {
        console.log(data)
        setServerError(data.error as string);
      } else {
        setServerError(null);
        setAnalysisResult(data);
      }
    } catch (err: unknown) {
      console.log(err)
      const message = err instanceof Error ? err.message : String(err);
      setError(`Failed to analyze chart. ${message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Timeframe change handler
  const handleTimeframeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedTimeframe(value);
    setShowTimeframeError(false);
    // Chart reload handled by useEffect below
  };

  // Handle direct timeframe button click
  const handleTimeframeButtonClick = (timeframe: string) => {
    setSelectedTimeframe(timeframe);
    setShowTimeframeError(false);
    // Chart reload handled by useEffect below
  };

  // Execute handler with validation - Updated to use new API
  const handleExecute = async () => {
    if (!selectedTimeframe) {
      setShowTimeframeError(true);
      return;
    }
    if (!selectedStrategy) {
      setShowStrategyError(true);
      return;
    }
    
    setLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      // Use the new API endpoint - note: we're not sending AI model to backend
      const response = await fetch(
        `https://backend.axiontrust.com/analysis/strategy?strategy=${selectedStrategy}&pair=${selectedPair.symbol}&granularity=${selectedTimeframe}&count=100`,
        {
          method: 'POST',
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        }
      );
      
      if (!response.ok) {
        throw new Error('API request failed');
      }
      
      const data = await response.json();
      
      if (data.error) {
        setServerError(data.error);
      } else {
        // Add strategy and AI model information to the result
        const resultWithStrategy = {
          ...data.analysis,
          strategy: selectedStrategy,
          aiModel: selectedAIModel
        };
        setAnalysisResult(resultWithStrategy);
      }
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculationResults = calculatePositionSize();

  // Render technical analysis fields based on strategy
  const renderTechnicalAnalysis = () => {
    if (!analysisResult || !analysisResult.technical_analysis) return null;

    const labels = TECHNICAL_ANALYSIS_LABELS[selectedStrategy as keyof typeof TECHNICAL_ANALYSIS_LABELS] || {};

    return (
      <div className="space-y-4">
        {Object.entries(analysisResult.technical_analysis).map(([key, value]) => (
          <div key={key} className="flex justify-between items-center pb-2 border-b border-slate-700">
            <span className="text-slate-400">{labels[key as keyof typeof labels] || key}:</span>
            <span className={`font-bold ${
              typeof value === 'string' && 
              (value.toLowerCase().includes('bullish') || 
               value.toLowerCase().includes('upward') || 
               value.toLowerCase().includes('yes') || 
               value.toLowerCase().includes('detected'))
                ? 'text-green-400' 
                : typeof value === 'string' && 
                  (value.toLowerCase().includes('bearish') || 
                   value.toLowerCase().includes('downward') || 
                   value.toLowerCase().includes('no') || 
                   value.toLowerCase().includes('not detected'))
                  ? 'text-red-400'
                  : 'text-white'
            }`}>
              {value}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Render trade levels based on strategy type
  const renderTradeLevels = () => {
    if (!analysisResult) return null;
    
    if (selectedStrategy === 'options_straddle') {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-700">
            <span className="text-slate-400">Call Entry:</span>
            <span className="text-white font-bold text-lg">{analysisResult.call_entry}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-700">
            <span className="text-slate-400">Put Entry:</span>
            <span className="text-white font-bold text-lg">{analysisResult.put_entry}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-700">
            <span className="text-slate-400">Breakeven Upper:</span>
            <span className="text-green-400 font-bold text-lg">{analysisResult.breakeven_upper}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Breakeven Lower:</span>
            <span className="text-red-400 font-bold text-lg">{analysisResult.breakeven_lower}</span>
          </div>
        </div>
      );
    } else {
      return (
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-700">
            <span className="text-slate-400">Entry Price:</span>
            <span className="text-white font-bold text-lg">{analysisResult.entry}</span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-700">
            <span className="text-slate-400">Stop Loss:</span>
            <span className="text-red-400 font-bold text-lg">{analysisResult.stop_loss}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-slate-400">Take Profit:</span>
            <span className="text-green-400 font-bold text-lg">{analysisResult.take_profit}</span>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
                AI Trading Analysis
              </h1>
            </div>
            <p className="text-slate-400 ml-11">Live TradingView Chart | Select Pair & Timeframe</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200">
              <History className="h-4 w-4 mr-2" />
              History
            </Button>
            <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white transition-all duration-200">
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
                          <SelectItem value="EUR_USD">EUR/USD</SelectItem>
                          <SelectItem value="GBP_USD">GBP/USD</SelectItem>
                          <SelectItem value="USD_JPY">USD/JPY</SelectItem>
                          <SelectItem value="AUD_USD">AUD/USD</SelectItem>
                          <SelectItem value="USD_CAD">USD/CAD</SelectItem>
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
                    <Button className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800">
                      Save Trade Setup
                    </Button>
                    <Button variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700" onClick={() => setShowCalculator(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 transition-all duration-200">
              <TrendingUp className="h-4 w-4 mr-2" />
              New Trade
            </Button>
          </div>
        </div>
      </div>

      {/* Category Buttons with Dropdown */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-slate-300 mb-3">Select Trading Category</h2>
        <div className="flex flex-wrap gap-3">
          {PAIR_CATEGORIES.map((cat) => (
            <div key={cat.label} className="relative">
              <button
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  openCategory === cat.label 
                    ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-lg' 
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'
                }`}
                onClick={() => setOpenCategory(openCategory === cat.label ? null : cat.label)}
              >
                {cat.label}
              </button>
              {openCategory === cat.label && (
                <div className="absolute left-0 z-10 bg-slate-800 border border-slate-700 rounded-lg mt-2 min-w-[180px] shadow-xl">
                  {cat.pairs.map((pair) => (
                    <div
                      key={pair.symbol}
                      className={`px-4 py-2 cursor-pointer transition-colors duration-200 ${
                        selectedPair.symbol === pair.symbol 
                          ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white' 
                          : 'text-slate-300 hover:bg-slate-700'
                      }`}
                      onClick={() => {
                        setSelectedPair(pair);
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
      </div>

      {/* TradingView Chart */}
      <div className="mb-8 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-700/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-slate-300">Live Chart</span>
          </div>
          <div className="text-slate-400 text-sm">
            {selectedPair.name} | {TIMEFRAMES.find(tf => tf.value === selectedTimeframe)?.label}
          </div>
        </div>
        
        {/* Timeframe buttons above the chart */}
        <div className="p-3 border-b border-slate-700/50 bg-slate-800/50 flex flex-wrap gap-2">
          {TIMEFRAMES.map((timeframe) => (
            <button
              key={timeframe.value}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                selectedTimeframe === timeframe.value
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-700 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
              onClick={() => handleTimeframeButtonClick(timeframe.value)}
            >
              {timeframe.label}
            </button>
          ))}
        </div>
        
        <div id="tv_chart_container" style={{ height: 500 }} ref={chartContainerRef}></div>
      </div>

      {/* Controls Section */}
      <div className="mb-8 bg-slate-800/50 backdrop-blur rounded-xl border border-slate-700/50 p-6 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Brain className="h-5 w-5 text-blue-400" />
          AI Analysis Configuration
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Timeframe Selection */}
          <div>
            <label className="text-slate-300 font-medium block mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-400" />
              Timeframe
            </label>
            <select
              className="w-full p-3 rounded-lg bg-slate-700/70 border border-slate-600 text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              value={selectedTimeframe}
              onChange={handleTimeframeChange}
            >
              <option value="">Select Timeframe</option>
              {TIMEFRAMES.map(tf => (
                <option key={tf.value} value={tf.value}>{tf.label}</option>
              ))}
            </select>
            {showTimeframeError && (
              <div className="mt-2 text-red-400 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Please select a timeframe
              </div>
            )}
          </div>

          {/* Trading Strategy Selection */}
          <div>
            <label className="text-slate-300 font-medium block mb-2 flex items-center gap-2">
              <Target className="h-4 w-4 text-green-400" />
              Trading Strategy
            </label>
            <div className="relative">
              <button
                className="w-full p-3 rounded-lg bg-slate-700/70 border border-slate-600 text-white flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                onClick={() => setOpenStrategyDropdown(!openStrategyDropdown)}
                type="button"
              >
                <span>{STRATEGY_LABELS[selectedStrategy as keyof typeof STRATEGY_LABELS] || "Select Strategy"}</span>
                <span>&#9662;</span>
              </button>
              {openStrategyDropdown && (
                <div className="absolute left-0 z-10 bg-slate-800 border border-slate-700 rounded-lg mt-2 w-full shadow-xl max-h-60 overflow-y-auto">
                  {TRADING_STRATEGIES.map(strategy => (
                    <div
                      key={strategy}
                      className={`px-4 py-3 cursor-pointer transition-colors duration-200 ${
                        selectedStrategy === strategy ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white" : "text-slate-300 hover:bg-slate-700"
                      }`}
                      onClick={() => {
                        setSelectedStrategy(strategy);
                        setOpenStrategyDropdown(false);
                        setShowStrategyError(false);
                      }}
                    >
                      {STRATEGY_LABELS[strategy as keyof typeof STRATEGY_LABELS]}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {showStrategyError && (
              <div className="mt-2 text-red-400 text-sm flex items-center gap-1">
                <AlertCircle className="h-4 w-4" />
                Please select a strategy
              </div>
            )}
          </div>

          {/* AI Model Selection */}
          <div>
            <label className="text-slate-300 font-medium block mb-2 flex items-center gap-2">
              <Brain className="h-4 w-4 text-purple-400" />
              AI Model
            </label>
            <div className="relative">
              <button
                className="w-full p-3 rounded-lg bg-slate-700/70 border border-slate-600 text-white flex items-center justify-between focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                onClick={() => setOpenAIDropdown(!openAIDropdown)}
                type="button"
              >
                <span>{AI_MODELS.find(m => m.value === selectedAIModel)?.label || "Select AI Model"}</span>
                <span>&#9662;</span>
              </button>
              {openAIDropdown && (
                <div className="absolute left-0 z-10 bg-slate-800 border border-slate-700 rounded-lg mt-2 w-full shadow-xl max-h-60 overflow-y-auto">
                  {AI_MODELS.map(model => (
                    <div
                      key={model.value}
                      className={`px-4 py-3 cursor-pointer transition-colors duration-200 flex flex-col ${
                        selectedAIModel === model.value ? "bg-gradient-to-r from-blue-600 to-indigo-700 text-white" : "text-slate-300 hover:bg-slate-700"
                      }`}
                      onClick={() => {
                        setSelectedAIModel(model.value);
                        setOpenAIDropdown(false);
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span>{model.label}</span>
                        <span className="ml-2 text-blue-400 text-xs font-bold bg-blue-900/50 px-2 py-0.5 rounded">Basic</span>
                      </div>
                      <span className="text-xs text-slate-400 pl-2 mt-1">{model.basic}</span>
                    </div>
                  ))}
                  <div className="px-4 py-2 text-xs text-red-400 font-bold border-t border-slate-700 text-center">
                    If you need premium AI models, subscribe!
                  </div>
                  <div className="flex justify-center pb-2">
                    <button
                      className="mt-1 px-3 py-1 text-xs rounded bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold shadow hover:scale-105 transition"
                      onClick={() => {
                        setOpenAIDropdown(false);
                        setTimeout(() => {
                          proAiRef.current?.scrollIntoView({ behavior: 'smooth' });
                        }, 100);
                      }}
                    >
                      View Pro AI Models
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Execute Button */}
          <div className="flex items-end">
            <button
              className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2"
              onClick={handleExecute}
              disabled={!selectedPair || !selectedTimeframe || !selectedStrategy || loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing...
                </>
              ) : (
                <>
                  Execute Analysis
                  <Shield className="h-5 w-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Result - Enhanced Display */}
      {analysisResult && (
        <div className="mb-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 shadow-xl ">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-400" />
              Analysis Result
            </h2>
            <div className="flex items-center gap-4">
              <span className={`px-4 py-2 rounded-full text-white font-bold text-lg flex items-center gap-2 ${
                analysisResult.signal === 'BUY' || analysisResult.signal === 'STRADDLE BUY' ? 'bg-green-600' : 
                analysisResult.signal === 'SELL' || analysisResult.signal === 'NEUTRAL' ? 'bg-red-600' : 'bg-blue-600'
              }`}>
                {analysisResult.signal === 'BUY' || analysisResult.signal === 'STRADDLE BUY' ? (
                  <ArrowUp className="h-5 w-5" />
                ) : (
                  <ArrowDown className="h-5 w-5" />
                )}
                {analysisResult.signal}
              </span>
              <span className="text-slate-300 font-medium">
                Confidence: <span className="text-white font-bold">{analysisResult.confidence}%</span>
              </span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
              <h3 className="text-slate-400 font-medium mb-4 flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-400" />
                Trade Levels
              </h3>
              {renderTradeLevels()}
            </div>
            
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
              <h3 className="text-slate-400 font-medium mb-4 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-purple-400" />
                Technical Analysis
              </h3>
              {renderTechnicalAnalysis()}
            </div>
            
            <div className="bg-slate-800/50 p-5 rounded-xl border border-slate-700">
              <h3 className="text-slate-400 font-medium mb-4 flex items-center gap-2">
                <Target className="h-4 w-4 text-yellow-400" />
                Trade Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                  <span className="text-slate-400">Risk/Reward Ratio</span>
                  <span className="text-white font-bold">{analysisResult.risk_reward_ratio}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                  <span className="text-slate-400">Timeframe</span>
                  <span className="text-white font-bold">{analysisResult.timeframe}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-slate-700">
                  <span className="text-slate-400">Strategy</span>
                  <span className="text-white font-bold">{STRATEGY_LABELS[analysisResult.strategy as keyof typeof STRATEGY_LABELS]}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">AI Model</span>
                  <span className="text-white font-bold">{AI_MODELS.find(m => m.value === analysisResult.aiModel)?.label || 'Unknown'}</span>
                </div>
              </div>
            </div>
          </div>
          
          {analysisResult.recommendation && (
            <div className="mt-6 p-5 bg-slate-800/50 rounded-xl border border-slate-700">
              <h3 className="text-slate-300 font-medium mb-3 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-400" />
                Recommendation
              </h3>
              <p className="text-slate-300 leading-relaxed">{analysisResult.recommendation}</p>
            </div>
          )}
        </div>
      )}
    
      {/* Pro AI Models Section */}
      <div ref={proAiRef} className="mt-16">
        <ProAiModels />
      </div>
    </div>
  );
}