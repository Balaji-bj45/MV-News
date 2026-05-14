import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGetNewsQuery } from "../services/newsApi";

// Image Imports
import mvnewsin from "../assets/mvnewsin.jpeg";
import mvgifbot from "../assets/mvgif.gif";

export function Navbar() {
  const { i18n } = useTranslation();
  const [currentDate, setCurrentDate] = useState("");

  const { data: newsData } = useGetNewsQuery({ limit: 10, page: 1 });

  const fetchedItems =
    newsData?.items?.map((item) => ({
      title: item.title,
      slug: item.slug,
    })) || [];

  const tickerItems =
    fetchedItems.length > 0
      ? fetchedItems
      : [{ title: "Loading latest updates...", slug: "" }];

  const doubledTickerItems = [...tickerItems, ...tickerItems];

  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: "short",
      month: "short",
      day: "2-digit",
      year: "numeric",
    };
    setCurrentDate(new Date().toLocaleDateString("en-US", options));
  }, []);

  const handleToggle = async () => {
    await i18n.changeLanguage(i18n.language === "ta" ? "en" : "ta");
  };

  const navLinks = [
    { name: "Home", path: "/" },
    {
      name: i18n.language === "ta" ? "எம்.வி நியூஸ்" : "MV News",
      path: "/category/mvnews",
    },
    { name: "Tamil Nadu", path: "/category/tamilnadu" },
    { name: "India", path: "/category/india" },
    { name: "MV Candidates News Hub", path: "/candidates" },
    { name: "MV News Videos", path: "/videos" },
  ];

  return (
    <nav className="w-full bg-white font-sans border-b border-gray-200">
      {/* TOP ROW */}
      <div className="max-w-[1400px] mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Logo */}
        <div className="flex items-center min-w-0">
          <div className=" pl-2">
            <Link to="/" className="flex-shrink-0">
              <img
                src={mvnewsin}
                alt="MV News"
                className="h-18 sm:h-18 md:h-20 lg:h-34 w-auto object-contain"
              />
            </Link>
          </div>
        </div>

        {/* Right: Date + GIF */}
        <div className="ml-auto flex items-center gap-4 sm:gap-6">
          {/* Edition & Date */}
          <div className="flex flex-col items-end text-[10px] sm:text-[11px] md:text-[13px] text-gray-600">
            <div
              className="flex items-center gap-1 cursor-pointer hover:text-red-600 transition-colors whitespace-nowrap"
              onClick={handleToggle}
            >
              <span className="font-medium">
                {i18n.language === "ta" ? "Tamil Edition" : "English Edition"}
              </span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
              <span className="text-gray-300 mx-1">|</span>
              <span className="font-medium uppercase">{currentDate}</span>
            </div>
          </div>

          {/* GIF - Bigger Size */}
          <div className="shrink-0">
            <img
              src={mvgifbot}
              alt="MV News Bot"
              className="h-16 sm:h-20 md:h-24 lg:h-30 xl:h-35 w-auto object-contain"
            />
          </div>
        </div>
      </div>

      {/* MIDDLE ROW */}
      <div className="border-y border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 flex flex-wrap items-center justify-between">
          {/* Desktop Nav Links */}
          <ul className="flex flex-wrap items-center list-none m-0 p-0 overflow-x-auto no-scrollbar">
            {navLinks.map((link, index) => (
              <li key={link.path} className="flex items-center">
                <Link
                  to={link.path}
                  className="py-3 px-2 md:px-3 text-[11px] md:text-[13px] font-bold text-black hover:text-red-700 whitespace-nowrap"
                >
                  {link.name}
                </Link>
                {index < navLinks.length - 1 && (
                  <span className="text-gray-400 font-light text-xs">|</span>
                )}
              </li>
            ))}
          </ul>

          {/* Action Buttons Group */}
          <div className="flex items-center gap-2 py-2">
            <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 border border-gray-400 rounded text-[10px] font-bold hover:bg-white">
              DOWNLOAD MV APP 📱
            </button>

            <button className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 border border-gray-400 rounded text-[10px] font-bold hover:bg-white">
              <img
                src={mvgifbot}
                alt="bot"
                className="w-4 h-4 object-contain"
              />
              ASK MV NEWS BOT
            </button>

            <button className="bg-[#FFC107] text-black px-4 py-1.5 rounded text-[11px] font-bold hover:bg-yellow-500 uppercase shadow-sm">
              SUBSCRIBE
            </button>

            <Link
              to="/admin/login"
              className="bg-[#343A40] text-white px-4 py-1.5 rounded text-[11px] font-bold hover:bg-black uppercase shadow-sm"
            >
              My Account
            </Link>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW */}
      <div className="bg-white">
        <div className="max-w-[1400px] mx-auto px-4 py-2 flex justify-between items-center border-b border-gray-100">
          {/* Trending Section */}
          <div className="flex items-center flex-1 min-w-0 overflow-hidden relative">
            <div className="flex items-center gap-1.5 text-red-600 font-extrabold text-[11px] whitespace-nowrap shrink-0 z-10 bg-white pr-3 py-1">
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse" />
              BREAKING:
            </div>

            <div className="overflow-hidden flex-1 relative flex items-center">
              <style>{`
                @keyframes ticker {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .animate-ticker {
                  animation: ticker 40s linear infinite;
                }
                .animate-ticker:hover {
                  animation-play-state: paused;
                }
              `}</style>

              <div className="flex whitespace-nowrap animate-ticker items-center text-[11px] font-medium text-gray-700 w-max">
                {doubledTickerItems.map((item, index) => (
                  <span
                    key={`${item.slug || "loading"}-${index}`}
                    className="px-4 flex items-center"
                  >
                    <span className="opacity-70 text-[8px] mr-2 text-red-600">
                      •
                    </span>
                    {item.slug ? (
                      <Link
                        to={`/news/${item.slug}`}
                        className="hover:text-red-600 transition-colors"
                      >
                        {item.title}
                      </Link>
                    ) : (
                      <span>{item.title}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 ml-4">
            <span className="text-[11px] font-bold text-gray-500 hidden sm:block">
              Follow Us
            </span>
            <div className="flex items-center gap-3">
              {/* WhatsApp */}
              <a href="#" className="text-[#25D366]">
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.06 3.978l-1.127 4.117 4.218-1.106a7.894 7.894 0 0 0 3.786.965h.005c4.368 0 7.926-3.558 7.93-7.93a7.898 7.898 0 0 0-2.322-5.624zM7.994 14.52a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z" />
                </svg>
              </a>

              {/* Facebook */}
              <a href="#" className="text-[#1877F2]">
                <svg
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z" />
                </svg>
              </a>

              {/* X (Twitter) */}
              <a href="#" className="text-black">
                <svg
                  width="14"
                  height="14"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>

              {/* YouTube */}
              <a href="#" className="text-[#FF0000]">
                <svg
                  width="18"
                  height="18"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.051 1.999h.089c.822.003 4.987.033 6.11.335a2.01 2.01 0 0 1 1.415 1.42c.101.38.172.883.22 1.402l.01.104.022.26.008.104c.065.914.073 1.77.074 1.957v.075c-.001.194-.01 1.05-.081 1.987l-.008.104-.02.26-.01.104c-.048.52-.119 1.023-.22 1.402a2.007 2.007 0 0 1-1.415 1.42c-1.16.312-5.569.334-6.18.335h-.142c-.309 0-1.587-.006-2.927-.052l-.17-.006-.087-.004-.171-.007-.171-.007c-1.11-.049-2.367-.102-3.287-.348a2.007 2.007 0 0 1-1.415-1.419c-.111-.417-.185-.986-.235-1.558L.09 9.82l-.008-.104A31.4 31.4 0 0 1 0 7.68v-.123c.002-.215.01-.958.064-1.778l.007-.103.003-.052.008-.104.022-.26.01-.104c.048-.519.119-1.023.22-1.402a2.007 2.007 0 0 1 1.415-1.419c1.11-.3 5.278-.33 6.1-.333h.089zm-3.342 8.335 4.593-2.34-4.593-2.34v4.68z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}