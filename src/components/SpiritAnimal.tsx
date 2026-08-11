"use client";

import Image from "next/image";
import { useWizard, isAtTerminal } from "@/store/wizardStore";

export default function SpiritAnimal() {
  const path = useWizard((s) => s.path);
  const done = isAtTerminal({ path });

  return (
    <div className="relative flex flex-col items-center select-none" aria-label={done ? "Journey complete" : "Ontological Compass"}>
      <div className="relative">
        {/* Static icon from local file - journey toward growth */}
        <Image
          src="/journey-icon.jpg"
          alt={done ? "Journey complete" : "Ontological Compass DAG"}
          width={72}
          height={72}
          className="rounded-xl object-cover border border-slate-700/50"
          style={{ filter: "drop-shadow(0 0 12px rgba(251,191,36,0.3))" }}
          priority
        />
      </div>

      {/* Label */}
      <p className="mt-2 text-xs font-medium text-slate-400 text-center max-w-[120px]">
        {done ? "Journey Complete" : "Ontological Compass"}
      </p>
    </div>
  );
}
