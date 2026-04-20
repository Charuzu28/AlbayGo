import { useCallback, useMemo, useState } from "react";
import Logo from "../components/Logo";
import SearchInput from "../components/SearchInput";
import ChatContainer from "../components/ChatContainer";
import TypingIndicator from "../components/TypingIndicator";
import MapView from "../components/MapView";
import type { ChatApiResponse, ChatMessage, RouteOption } from "../types/chat";
import type { NearestPlaceResult } from "../data/placeCoordinates";

const Home = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [nearestPlace, setNearestPlace] = useState<NearestPlaceResult | null>(null);
  const [showMapModal, setShowMapModal] = useState<boolean>(false);

  const hasMessages = messages.length > 0;

  const activeRoute: RouteOption | null = useMemo(() => {
    const latestRouteMessage = [...messages]
      .reverse()
      .find(
        (message) =>
          message.role === "assistant" &&
          message.messageType === "route-result" &&
          message.selectedRoute
      );

    return latestRouteMessage?.selectedRoute ?? null;
  }, [messages]);

  const latestAssistantMessage = useMemo(() => {
    return [...messages].reverse().find((message) => message.role === "assistant") ?? null;
  }, [messages]);

  const shouldSuggestNearestPlaceAsOrigin =
    latestAssistantMessage?.messageType === "missing-route-origin" &&
    !!nearestPlace &&
    !isTyping;

  const handleNearestPlaceDetected = useCallback(
    (place: NearestPlaceResult | null) => {
      setNearestPlace(place);
    },
    []
  );

  const handleSend = async (text: string): Promise<void> => {
    if (!text.trim() || isTyping) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      intent: null,
      messageType: "text",
      routeOptions: [],
      selectedRoute: null,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), 15000);

    try {
      const apiBaseUrl =
        (import.meta.env.VITE_API_URL as string | undefined)?.trim() ||
        "http://localhost:5000";
      const apiUrl = `${apiBaseUrl.replace(/\/$/, "")}/api/chat`;

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const data: ChatApiResponse = await response.json();

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.reply || "No reply received.",
        intent: data.intent || null,
        messageType: data.messageType || "text",
        routeOptions: data.routeOptions || [],
        selectedRoute: data.selectedRoute || null,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error && error.name === "AbortError"
          ? "Request timed out. Please try again."
          : "Something went wrong.";

      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: errorMessage,
        intent: null,
        messageType: "text",
        routeOptions: [],
        selectedRoute: null,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      window.clearTimeout(timeoutId);
      setIsTyping(false);
    }
  };

  const handleUseNearestPlaceAsOrigin = () => {
    if (!nearestPlace || isTyping) return;
    void handleSend(`from ${nearestPlace.name}`);
  };

  return (
    <main className="min-h-screen h-dvh flex flex-col bg-white">
      {/* Landing Page (No Messages) */}
      {!hasMessages && (
        <div className="flex-1 flex flex-col items-center justify-center px-4">
          <Logo />
          <p className="mt-3 text-center text-sm text-gray-600 font-poppins sm:text-lg">
            Your local guide for moving around Albay.
          </p>
          <p className="mt-6 text-xs text-gray-400">v1.0.0 • Beta</p>
        </div>
      )}

      {/* Header with Logo (When Chat Started) */}
      {hasMessages && (
        <header className="w-full border-b border-gray-100 px-4 py-3">
          <div className="flex justify-center">
            <div className="w-full max-w-2xl flex items-center justify-between">
              <Logo />
              <span className="inline-block px-3 py-1 text-xs font-medium bg-pink-200 text-pink-500 rounded-full text-center">
                Beta
              </span>
            </div>
          </div>
        </header>
      )}

      {/* Chat Area (with messages) */}
      {hasMessages && (
        <div className="flex-1 overflow-hidden flex flex-col">
          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto">
            <div className="flex justify-center">
              <div className="w-full max-w-2xl px-4 py-6 space-y-4">
                <ChatContainer messages={messages} />
                {isTyping && <TypingIndicator />}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer with Input - Centered ChatGPT style */}
      <footer className="w-full bg-white border-t border-gray-100">
        <div className="flex justify-center px-4 py-4">
          <div className="w-full max-w-2xl">
            <div className="flex items-end gap-3">
              {hasMessages && (
                <button
                  type="button"
                  onClick={() => setShowMapModal(true)}
                  className="p-2.5 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-all duration-200 shrink-0"
                  title="View map"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 003 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m0 13V7m0 0L9 4" />
                  </svg>
                </button>
              )}
              <div className="flex-1">
                <SearchInput onSend={handleSend} disabled={isTyping} />
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Map Modal */}
      {showMapModal && (
        <div
          className="fixed inset-0 bg-black/40 z-40 flex items-end sm:items-center justify-center"
          onClick={() => setShowMapModal(false)}
        >
          <div
            className="bg-white w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Route Map</h2>
              <button
                onClick={() => setShowMapModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <MapView
              selectedRoute={activeRoute}
              onNearestPlaceDetected={handleNearestPlaceDetected}
            />
          </div>
        </div>
      )}

      {/* Nearest Place Drawer (Messenger-style) */}
      {shouldSuggestNearestPlaceAsOrigin && nearestPlace && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center px-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="bg-white w-full max-w-2xl rounded-t-3xl md:rounded-3xl p-6 animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <h3 className="text-lg font-semibold text-gray-900">Nearest Location</h3>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              You appear to be closest to{" "}
              <span className="font-semibold text-gray-900">{nearestPlace.name}</span>
              <span className="text-xs text-gray-500 ml-1">({nearestPlace.distanceKm.toFixed(1)} km away)</span>
            </p>

            <button
              type="button"
              onClick={handleUseNearestPlaceAsOrigin}
              className="w-full py-3 bg-black text-white rounded-2xl font-medium hover:bg-gray-900 transition-all duration-200"
            >
              Use as my origin
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default Home;