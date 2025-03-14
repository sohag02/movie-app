"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Eye } from "lucide-react";
import { createPortal } from "react-dom";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getImage } from "@/lib/tmdb";
import { Type } from "@/lib/interfaces";

interface GallerySectionProps {
  videos: {
    results: Array<{
      key: string;
      type: Type;
    }>;
  };
  images: {
    backdrops: Array<{
      file_path: string;
    }>;
  };
}

const GallerySection: React.FC<GallerySectionProps> = ({ videos, images }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const trailer = videos.results.find((result) => result.type === Type.Trailer)?.key;
  const displayImages = images.backdrops.slice(1, 6);

  return (
    <div className="px-4 pb-12">
      <p className="mb-6 text-xl font-bold text-white">Gallery</p>
      <div className="md:grid md:grid-cols-3 md:gap-3">
        {/* For mobile: horizontally scrollable list */}
        <ScrollArea className="whitespace-nowrap md:hidden">
          <div className="flex space-x-4 py-2">
            {/* Featured Trailer as first item */}
            {videos.results[0] && (
              <div className="relative aspect-[16/9] w-[80vw] min-w-[280px] flex-shrink-0 overflow-hidden rounded-lg shadow-xl">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailer}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            )}

            {/* Images in horizontal scroll */}
            {displayImages.map((backdrop, index) => (
              <div
                key={index}
                className="relative aspect-[16/9] w-[80vw] min-w-[280px] flex-shrink-0 transform overflow-hidden rounded-lg shadow-lg"
                onClick={() => setSelectedImage(backdrop.file_path)}
              >
                <Image
                  src={
                    getImage(backdrop.file_path, "original") ??
                    "/background.jpg"
                  }
                  alt={`Backdrop image ${index + 1}`}
                  width={400}
                  height={225}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 hover:opacity-100">
                  <div className="flex items-center gap-1">
                    <Eye className="h-4 w-4 text-white" />
                    <span className="text-xs text-white">View</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>

        {/* For desktop: grid layout */}
        <div className="hidden md:col-span-2 md:row-span-2 md:block">
          {videos.results[0] && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-lg shadow-xl">
              <iframe
                width="100%"
                height="100%"
                src={`https://www.youtube.com/embed/${videos.results.find((result) => result.type === Type.Trailer)?.key}`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        {/* Grid of smaller images on the right */}
        {images.backdrops.slice(1, 6).map((backdrop, index) => (
          <div
            key={index}
            className="relative hidden aspect-[16/9] transform overflow-hidden rounded-lg shadow-lg transition-all duration-300 hover:-translate-y-1 hover:cursor-pointer hover:shadow-xl md:block"
            onClick={() => setSelectedImage(backdrop.file_path)}
          >
            <Image
              src={
                getImage(backdrop.file_path, "original") ?? "/background.jpg"
              }
              alt={`Backdrop image ${index + 1}`}
              width={400}
              height={225}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/50 to-transparent p-3 opacity-0 transition-opacity duration-300 hover:opacity-100">
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-white" />
                <span className="text-xs text-white">View</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-h-[90vh] max-w-[90vw]">
              <button
                className="absolute -right-4 -top-4 rounded-full bg-white p-1 text-black"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage(null);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              <Image
                src={getImage(selectedImage, "original") ?? "/background.jpg"}
                alt="Enlarged view"
                width={1920}
                height={1080}
                className="max-h-[85vh] rounded-lg object-contain"
              />
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default GallerySection;
