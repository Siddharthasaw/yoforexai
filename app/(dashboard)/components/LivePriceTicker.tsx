import React, { useEffect } from "react";

const symbols = [
  { proName: "FX:EURUSD", title: "EUR/USD" },
  { proName: "FX:GBPUSD", title: "GBP/USD" },
  { proName: "FX:USDJPY", title: "USD/JPY" },
  { proName: "FX:AUDUSD", title: "AUD/USD" },
  { proName: "FX:USDCAD", title: "USD/CAD" },
  { proName: "OANDA:XAUUSD", title: "Gold" },
  { proName: "CRYPTO:BTCUSD", title: "Bitcoin" },
  { proName: "CRYPTO:ETHUSD", title: "Ethereum" },
];

const LivePriceTicker = () => {
  useEffect(() => {
    const container = document.getElementById("tradingview-widget");
    if (!container) return;
    container.innerHTML = ""; // Clean up old widget if any

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.innerHTML = JSON.stringify({
      symbols,
      colorTheme: "dark",
      isTransparent: false,
      displayMode: "adaptive",
      locale: "en",
    });

    container.appendChild(script);
  }, []);

  return (
    <div className="w-full mb-6">
      <div
        id="tradingview-widget"
        className="rounded-lg shadow bg-slate-800 p-2"
        style={{ minHeight: 50 }}
      >
        {/* Widget will be loaded here */}
      </div>
    </div>
  );
};

export default LivePriceTicker;