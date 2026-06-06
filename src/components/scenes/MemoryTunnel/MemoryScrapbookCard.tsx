"use client";

import { RefObject } from "react";
import Image from "next/image";
import { FALLBACK_IMAGE_SRC } from "@/utils/assetManager";
import { TunnelMemory } from "@/types";
import { tunnelStyles } from "./styles";

interface MemoryScrapbookCardProps {
  memory: TunnelMemory;
  index: number;
  total: number;
  cardRef: RefObject<HTMLDivElement | null>;
  photoRef: RefObject<HTMLDivElement | null>;
  textRef: RefObject<HTMLParagraphElement | null>;
}

export function MemoryScrapbookCard({
  memory,
  index,
  total,
  cardRef,
  photoRef,
  textRef,
}: MemoryScrapbookCardProps) {
  return (
    <div ref={cardRef} className={tunnelStyles.scrapbook} style={{ opacity: 0 }}>
      <div className={tunnelStyles.tapeLeft} aria-hidden="true" />
      <div className={tunnelStyles.tapeRight} aria-hidden="true" />
      <span className={`${tunnelStyles.sparkle} left-6 top-4`} aria-hidden="true">
        ✨
      </span>
      <span className={`${tunnelStyles.sparkle} right-8 top-6`} aria-hidden="true">
        🌸
      </span>
      <span className={`${tunnelStyles.sparkle} bottom-12 left-10`} aria-hidden="true">
        💌
      </span>

      <p className={tunnelStyles.progress}>
        Memory {index + 1} of {total}
      </p>
      <p className={`${tunnelStyles.dateBadge} mx-auto flex w-fit`}>{memory.date}</p>

      <div className={tunnelStyles.polaroidWrap}>
        <div ref={photoRef} className={tunnelStyles.polaroid}>
          <div className={tunnelStyles.photoArea}>
            <Image
              key={memory.id}
              src={memory.src}
              alt={memory.alt}
              fill
              className="object-contain p-2"
              sizes="(max-width: 768px) 90vw, 520px"
              priority
              onError={(e) => {
                e.currentTarget.src = FALLBACK_IMAGE_SRC;
              }}
            />
          </div>
          <p className={tunnelStyles.polaroidCaption}>us ♥</p>
        </div>
      </div>

      <div className={tunnelStyles.storyBlock}>
        <p ref={textRef} className={tunnelStyles.storyText}>
          {memory.paragraph}
        </p>
      </div>
    </div>
  );
}
