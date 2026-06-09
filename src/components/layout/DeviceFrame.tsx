import type { ReactNode } from "react";

/**
 * iPhone 17 inspired device frame.
 * - On small screens (actual phones): renders a subtle in-screen chrome:
 *   rounded screen corners, a Dynamic Island pill at the top, and a home
 *   indicator bar at the bottom — pure decoration, no layout cost.
 * - On larger screens: renders a true iPhone 17 mockup (titanium bezel,
 *   side buttons, Dynamic Island) with the app scrollable inside it.
 */
export function DeviceFrame({ children }: { children: ReactNode }) {
  return (
    <>
      {/* MOBILE: in-screen chrome overlay */}
      <div className="md:hidden">
        {/* Rounded screen mask + content */}
        <div className="relative min-h-[100dvh] overflow-hidden rounded-[44px] ring-1 ring-black/10">
          {children}
        </div>

        {/* Dynamic Island */}
        <div
          aria-hidden
          className="pointer-events-none fixed left-1/2 top-2 z-[100] h-[30px] w-[110px] -translate-x-1/2 rounded-full bg-black shadow-[0_2px_8px_rgba(0,0,0,0.4)]"
        />

        {/* Home indicator */}
        <div
          aria-hidden
          className="pointer-events-none fixed bottom-1.5 left-1/2 z-[100] h-[5px] w-[134px] -translate-x-1/2 rounded-full bg-black/70"
        />
      </div>

      {/* DESKTOP/TABLET: full iPhone 17 mockup */}
      <div className="hidden min-h-screen md:flex md:items-center md:justify-center md:bg-gradient-to-br md:from-emerald-50 md:via-white md:to-emerald-100 md:p-8">
        <div className="relative" style={{ width: 402, height: 874 }}>
          {/* Titanium bezel */}
          <div className="absolute inset-0 rounded-[60px] bg-gradient-to-b from-neutral-700 via-neutral-900 to-neutral-800 p-[5px] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5),0_0_0_2px_rgba(255,255,255,0.06)_inset]">
            {/* Inner bezel */}
            <div className="h-full w-full rounded-[56px] bg-black p-[10px]">
              {/* Screen */}
              <div className="relative h-full w-full overflow-hidden rounded-[46px] bg-white">
                <div className="h-full w-full overflow-y-auto">{children}</div>

                {/* Dynamic Island */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute left-1/2 top-2.5 h-[34px] w-[120px] -translate-x-1/2 rounded-full bg-black"
                />

                {/* Home indicator */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute bottom-2 left-1/2 h-[5px] w-[138px] -translate-x-1/2 rounded-full bg-black/60"
                />
              </div>
            </div>
          </div>

          {/* Side buttons */}
          <div aria-hidden className="absolute -left-[3px] top-[110px] h-[34px] w-[4px] rounded-l bg-neutral-700" />
          <div aria-hidden className="absolute -left-[3px] top-[170px] h-[60px] w-[4px] rounded-l bg-neutral-700" />
          <div aria-hidden className="absolute -left-[3px] top-[245px] h-[60px] w-[4px] rounded-l bg-neutral-700" />
          <div aria-hidden className="absolute -right-[3px] top-[180px] h-[100px] w-[4px] rounded-r bg-neutral-700" />
        </div>
      </div>
    </>
  );
}
