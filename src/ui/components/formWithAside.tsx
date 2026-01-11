'use client';

import Image from "next/image";
import React from "react";

type FormWithAsideProps = {
  children: React.ReactNode;

  /** Image */
  imageSrc?: string;
  imageAlt?: string;
  imageWidth?: number;
  imageHeight?: number;

  /** Layout */
  className?: string;

  /** Hauteur globale (par défaut: plein écran) */
  height?: string;
};

export default function FormWithAside({
  children,
  imageSrc = "/ICONE_SFLIX.png",
  imageAlt = "Illustration",
  imageWidth = 240,
  imageHeight = 240,
  className,
  height = "h-screen",
}: FormWithAsideProps) {
  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-12 gap-6 ${height} overflow-hidden ${className ?? ""}`}
    >
      {/* 🖼 Image fixe */}
      <div className="lg:col-span-4 flex items-center justify-center">
        <div className="bg-base-200/40 border border-base-300 rounded-xl p-4 w-full h-full flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={imageWidth}
            height={imageHeight}
            className="object-contain"
            priority
          />
        </div>
      </div>

      {/* 🧾 Form scrollable */}
      <div className="lg:col-span-8 h-full overflow-y-auto pr-2 space-y-6">
        {children}
      </div>
    </div>
  );
}
