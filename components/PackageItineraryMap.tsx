"use client";

import { StoreDocument } from "@/lib/types/schema";
import { Navigation, Footprints, MapPin } from "lucide-react";

export interface PackageItineraryMapProps {
  stores: {
    store: StoreDocument;
    slotRole: "anchor" | "rider";
    orderIndex: number;
    travelTimeFromPrev?: string;
  }[];
}

export default function PackageItineraryMap({ stores }: PackageItineraryMapProps) {
  return (
    <div className="rounded-2xl bg-slate-900 p-6 text-white space-y-6 shadow-xl border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2">
          <Navigation className="h-5 w-5 text-indigo-400" />
          <h3 className="font-bold text-lg text-white">마이리얼트립 스타일 코스 맵</h3>
        </div>
        <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/30">
          동선 최적화 완료
        </span>
      </div>

      <div className="relative rounded-xl bg-slate-950 p-6 border border-slate-800 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          {stores.map((item, idx) => (
            <div key={item.store.storeId} className="flex-1 w-full">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-full font-extrabold text-white shadow-lg transition-transform hover:scale-110 ${
                      item.slotRole === "anchor"
                        ? "bg-gradient-to-r from-indigo-500 to-purple-600 ring-4 ring-indigo-500/30"
                        : "bg-gradient-to-r from-amber-500 to-orange-600 ring-4 ring-amber-500/30"
                    }`}
                  >
                    <span>#{item.orderIndex}</span>
                  </div>
                  <span
                    className={`absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                      item.slotRole === "anchor"
                        ? "bg-indigo-600 text-white"
                        : "bg-amber-600 text-white"
                    }`}
                  >
                    {item.slotRole === "anchor" ? "앵커 스토어" : "라이더 스토어"}
                  </span>
                </div>

                <div className="pt-2">
                  <h4 className="font-bold text-sm text-slate-100">{item.store.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{item.store.category}</p>
                </div>
              </div>

              {idx < stores.length - 1 && (
                <div className="my-4 md:my-0 md:absolute md:top-1/2 md:translate-y-[-50%] flex md:flex-col items-center justify-center text-xs text-indigo-300 font-semibold space-x-1 md:space-x-0 space-y-1">
                  <div className="hidden md:block w-16 h-0.5 bg-gradient-to-r from-indigo-500 to-amber-500 my-2" />
                  <div className="flex items-center space-x-1 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700">
                    <Footprints className="h-3 w-3 text-amber-400" />
                    <span>{stores[idx + 1].travelTimeFromPrev || "도보 5분 (320m)"}</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-2">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          추천 이용 순서 & 시간 동선
        </h4>
        <div className="space-y-2">
          {stores.map((item) => (
            <div
              key={item.store.storeId}
              className="flex items-center justify-between rounded-xl bg-slate-800/60 p-3 text-xs border border-slate-700/50"
            >
              <div className="flex items-center space-x-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-700 font-bold text-slate-300">
                  {item.orderIndex}
                </span>
                <div>
                  <span className="font-bold text-slate-200">{item.store.name}</span>
                  <span className="text-slate-400 ml-2">({item.store.idle_slots})</span>
                </div>
              </div>
              <div className="flex items-center space-x-1 text-slate-400">
                <MapPin className="h-3.5 w-3.5 text-slate-500" />
                <span>{item.store.region}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
