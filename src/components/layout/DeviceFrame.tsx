import type { ReactNode } from "react";

/**
 * iPhone 17 inspired device frame — always renders the full mockup
 * (titanium bezel, Dynamic Island, side buttons, home indicator) so the
 * app is shown "as on an iPhone" at every viewport. The frame scales to
 * fit the available space.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] w-full items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-emerald-100 p-2 sm:p-6 md:p-8">
      <div
        className="relative"
        style={{
          width: "min(402px, calc(100vw - 24px))",
          aspectRatio: "402 / 874",
          maxHeight: "calc(100dvh - 24px)",
        }}
      >
        {/* Titanium bezel */}
        <div className="absolute inset-0 rounded-[60px] bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-800 p-[5px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5),0_0_0_2px_rgba(255,255,255,0.06)_inset]">
          {/* Inner bezel */}
          <div className="h-full w-full rounded-[56px] bg-black p-[8px]">
            {/* Screen */}
            <div className="relative h-full w-full overflow-hidden rounded-[48px] bg-white">
              <div className="h-full w-full overflow-y-auto">{children}</div>

              {/* Dynamic Island */}
              <div
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-2.5 h-[30px] w-[112px] -translate-x-1/2 rounded-full bg-black"
              />

              {/* Home indicator */}
              <div
                aria-hidden
                className="pointer-events-none absolute bottom-2 left-1/2 h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black/60"
              />
            </div>
          </div>
        </div>

        {/* Side buttons */}
        <div
          aria-hidden
          className="absolute -left-[3px] top-[14%] h-[4%] w-[4px] rounded-l bg-neutral-700"
        />
        <div
          aria-hidden
          className="absolute -left-[3px] top-[20%] h-[7%] w-[4px] rounded-l bg-neutral-700"
        />
        <div
          aria-hidden
          className="absolute -left-[3px] top-[29%] h-[7%] w-[4px] rounded-l bg-neutral-700"
        />
        <div
          aria-hidden
          className="absolute -right-[3px] top-[21%] h-[12%] w-[4px] rounded-r bg-neutral-700"
        />
      </div>
    </div>
  );
}
