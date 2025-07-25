import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

type NewsItem = {
  headline: string;
  summary: string;
  url: string;
  time: string;
  source: string;
  sentiment: string;
};

const PAGE_SIZE = 4;
const PAGINATION_WINDOW = 3;

export default function TradingTips() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [windowStart, setWindowStart] = useState(1);

  useEffect(() => {
    setLoading(true);
    fetch(`https://backend.axiontrust.com/news/news/?page=${page}&limit=${PAGE_SIZE}`)
      .then((res) => res.json())
      .then((data) => {
        // If API returns { results: [...] }
        if (Array.isArray(data)) setNews(data);
        else if (Array.isArray(data.results)) setNews(data.results);
        else setNews([]);
      })
      .finally(() => setLoading(false));
  }, [page]);

  // Pagination window logic
  const handleNextWindow = () => setWindowStart(windowStart + PAGINATION_WINDOW);
  const handlePrevWindow = () => setWindowStart(Math.max(1, windowStart - PAGINATION_WINDOW));
  const handlePageClick = (p: number) => setPage(p);

  return (
    <Card className="bg-slate-800/50 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Trading Tips</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? (
          <div className="text-slate-400">Loading...</div>
        ) : (
          news.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="p-3 rounded-lg bg-blue-900/30 border border-blue-800 hover:bg-blue-800 transition">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-medium text-white mb-1 text-base">
                    {item.headline}
                  </h4>
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      item.sentiment === "positive"
                        ? "bg-green-700 text-green-100"
                        : item.sentiment === "negative"
                        ? "bg-red-700 text-red-100"
                        : "bg-yellow-700 text-yellow-100"
                    }`}
                  >
                    {item.sentiment}
                  </span>
                </div>
                <div
                  className="text-sm text-slate-300 mb-2"
                  dangerouslySetInnerHTML={{
                    __html:
                      item.summary
                        .split(" ")
                        .slice(0, 25)
                        .join(" ") +
                      (item.summary.split(" ").length > 25 ? " ..." : ""),
                  }}
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>{item.source}</span>
                  <span>{new Date(item.time).toLocaleString()}</span>
                </div>
              </div>
            </a>
          ))
        )}

        {/* Pagination */}
        <div className="flex gap-2 pt-2">
          <button
            className="px-2 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs disabled:opacity-50"
            onClick={handlePrevWindow}
            disabled={windowStart === 1}
          >
            Prev
          </button>
          {[...Array(PAGINATION_WINDOW)].map((_, idx) => {
            const pageNum = windowStart + idx;
            return (
              <button
                key={pageNum}
                className={`px-2 py-1 rounded text-xs ${
                  page === pageNum
                    ? "bg-blue-600 text-white"
                    : "bg-slate-700 text-white"
                }`}
                onClick={() => handlePageClick(pageNum)}
              >
                {pageNum}
              </button>
            );
          })}
          <button
            className="px-2 py-1 rounded bg-blue-700 hover:bg-blue-800 text-white text-xs"
            onClick={handleNextWindow}
          >
            Next
          </button>
        </div>
      </CardContent>
    </Card>
  );
}