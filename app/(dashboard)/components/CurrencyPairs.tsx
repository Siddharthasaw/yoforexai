'use client';

import { useEffect } from "react";

const symbols = [
	{ symbol: "OANDA:EUR_USD", title: "EUR/USD" },
	{ symbol: "OANDA:GBP_USD", title: "GBP/USD" },
	{ symbol: "OANDA:USD_JPY", title: "USD/JPY" },
	{ symbol: "OANDA:AUD_USD", title: "AUD/USD" },
	{ symbol: "OANDA:USD_CAD", title: "USD/CAD" },
	{ symbol: "OANDA:XAU_USD", title: "Gold (XAU/USD)" },
	{ symbol: "BINANCE:BTCUSDT", title: "Bitcoin (BTC/USD)" },
	{ symbol: "BINANCE:ETHUSDT", title: "Ethereum (ETH/USD)" },
];

export default function CurrencyPairs() {
	useEffect(() => {
		symbols.forEach(({ symbol }) => {
			const containerId = `tv-mini-widget-${symbol.replace(/[:\/]/g, "-")}`;
			const container = document.getElementById(containerId);
			if (!container || container.childElementCount > 0) return;

			const script = document.createElement("script");
			script.src =
				"https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol.js";
			script.async = true;
			script.innerHTML = JSON.stringify({
				symbol,
				width: "100%",
				height: "100%",
				locale: "en",
				colorTheme: "dark",
				isTransparent: false,
				autosize: false,
				largeChartUrl: "",
			});
			container.appendChild(script);
		});

		// Clean up on unmount
		return () => {
			symbols.forEach(({ symbol }) => {
				const containerId = `tv-mini-widget-${symbol.replace(/[:\/]/g, "-")}`;
				const container = document.getElementById(containerId);
				if (container) container.innerHTML = "";
			});
		};
	}, []);

	return (
		<div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 p-4 bg-slate-900">
			{symbols.map(({ symbol, title }) => (
				<div
					key={symbol}
					className="rounded-lg bg-slate-800 h-28 flex flex-col justify-between p-2"
				>
					<div className="text-white text-xs font-medium mb-1">{title}</div>
					<div
						id={`tv-mini-widget-${symbol.replace(/[:\/]/g, "-")}`}
						className="tradingview-widget-container h-20"
					/>
				</div>
			))}
		</div>
	);
}
