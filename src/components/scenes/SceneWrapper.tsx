"use client";

import { ReactNode } from "react";
import { SceneId } from "@/types";
import { getSceneClassName } from "@/components/scenes/sceneStyles";

interface SceneWrapperProps {
  sceneId: SceneId;
  isActive: boolean;
  children: ReactNode;
  className?: string;
}

export function SceneWrapper({
  sceneId,
  isActive,
  children,
  className = "",
}: SceneWrapperProps) {
  return (
    <section
      id={`scene-${sceneId}`}
      className={`${getSceneClassName(isActive)} ${className}`}
      aria-hidden={!isActive}
      data-scene={sceneId}
    >
      {children}
    </section>
  );
}
