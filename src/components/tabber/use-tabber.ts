"use client"

import { useState, useEffect, useCallback, useRef } from "react"

// ============================================================================
// TYPES
// ============================================================================

export interface TabberItem {
  readonly id: string
  readonly title: string
  readonly description: string
  readonly image?: string | React.ReactNode
  readonly duration?: number // Individual duration (ms) - uses defaultDuration if undefined
  
  // Flexible content options
  readonly content?: React.ReactNode
  readonly data?: any // For render functions
  
  // Per-item style overrides
  readonly titleClassName?: string
  readonly descriptionClassName?: string
}

export interface UseTabberOptions {
  items: readonly TabberItem[]
  autoPlay?: boolean
  defaultDuration?: number
  activeIndex?: number
  defaultActiveIndex?: number
  onActiveChange?: (index: number, item: TabberItem) => void
  onCycleComplete?: () => void
  onProgressChange?: (progress: number) => void
}

// ============================================================================
// PROGRESS ANIMATION CLASS - REACT 19 COMPLIANT
// ============================================================================

class ProgressAnimation {
  private duration: number = 0
  private startTime: number = 0
  private frameId: number | null = null
  private isRunning: boolean = false
  private progressCallback: (progress: number) => void = () => {}
  private completeCallback: () => void = () => {}

  // Update callbacks without recreating instance
  updateCallbacks(
    onProgress: (progress: number) => void,
    onComplete: () => void
  ): void {
    this.progressCallback = onProgress
    this.completeCallback = onComplete
  }

  start(duration: number): void {
    // Stop any existing animation
    this.stop()
    
    this.duration = duration
    this.isRunning = true
    
    if (this.duration === 0) {
      this.progressCallback(1)
      this.completeCallback()
      return
    }
    
    // Start fresh
    this.progressCallback(0)
    this.startTime = performance.now()
    this.frameId = requestAnimationFrame((time) => this.onFrame(time))
  }

  private onFrame(currentTime: number): void {
    if (!this.isRunning) return

    const elapsed = currentTime - this.startTime
    const progress = Math.min(elapsed / this.duration, 1)
    
    this.progressCallback(Math.max(0, Math.min(1, progress)))
    
    if (progress < 1) {
      this.frameId = requestAnimationFrame((time) => this.onFrame(time))
    } else {
      this.isRunning = false
      this.frameId = null
      this.completeCallback()
    }
  }

  stop(): void {
    this.isRunning = false
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId)
      this.frameId = null
    }
  }

  reset(): void {
    this.stop()
    this.progressCallback(0)
  }

  destroy(): void {
    this.stop()
    this.progressCallback = () => {}
    this.completeCallback = () => {}
  }
}

// ============================================================================
// MAIN HOOK - REACT 19 COMPLIANT
// ============================================================================

export function useTabber({
  items,
  autoPlay = true,
  defaultDuration = 5000,
  activeIndex,
  defaultActiveIndex = 0,
  onActiveChange,
  onCycleComplete,
  onProgressChange,
}: UseTabberOptions) {
  // Input validation
  if (!items || items.length === 0) {
    throw new Error("useTabber: items array cannot be empty")
  }

  if (defaultActiveIndex < 0 || defaultActiveIndex >= items.length) {
    throw new Error("useTabber: defaultActiveIndex must be within items array bounds")
  }

  if (activeIndex !== undefined && (activeIndex < 0 || activeIndex >= items.length)) {
    throw new Error("useTabber: activeIndex must be within items array bounds")
  }

  // State - minimal and pure
  const [internalIndex, setInternalIndex] = useState(defaultActiveIndex)
  const [progress, setProgress] = useState(0)
  const [isMounted, setIsMounted] = useState(false)
  
  // Determine current state - pure calculation
  const isControlled = activeIndex !== undefined
  const currentIndex = isControlled ? activeIndex : internalIndex
  const currentItem = items[currentIndex] || items[0]
  const currentDuration = currentItem?.duration ?? defaultDuration
  
  // Stable refs - never recreated
  const animationRef = useRef<ProgressAnimation | null>(null)
  const stateRef = useRef({
    currentIndex,
    items,
    isControlled,
    onActiveChange,
    onCycleComplete,
    onProgressChange
  })
  
  // Keep state ref updated - React 19 pattern
  stateRef.current = {
    currentIndex,
    items,
    isControlled,
    onActiveChange,
    onCycleComplete,
    onProgressChange
  }

  // SSR safety
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Create animation instance once - React 19 singleton pattern
  useEffect(() => {
    if (!animationRef.current) {
      animationRef.current = new ProgressAnimation()
    }
    
    // Cleanup on unmount only
    return () => {
      if (animationRef.current) {
        animationRef.current.destroy()
        animationRef.current = null
      }
    }
  }, []) // Empty dependencies - create once only

  // Pure progress update handler - no closures
  const updateProgress = useCallback((newProgress: number) => {
    setProgress(newProgress)
    const { onProgressChange } = stateRef.current
    onProgressChange?.(newProgress)
  }, [])

  // Pure completion handler - no closures  
  const handleComplete = useCallback(() => {
    const { currentIndex, items, isControlled, onActiveChange, onCycleComplete } = stateRef.current
    
    const nextIndex = (currentIndex + 1) % items.length
    const isLastItem = currentIndex === items.length - 1
    
    if (!isControlled) {
      setInternalIndex(nextIndex)
    }
    
    onActiveChange?.(nextIndex, items[nextIndex])
    
    if (isLastItem) {
      onCycleComplete?.()
    }
  }, [])

  // Animation control - only when necessary
  useEffect(() => {
    if (!isMounted || !animationRef.current) return

    // Update callbacks without recreating animation
    animationRef.current.updateCallbacks(updateProgress, handleComplete)

    // Control animation state
    if (autoPlay && currentDuration > 0) {
      animationRef.current.start(currentDuration)
    } else {
      animationRef.current.reset()
    }
  }, [isMounted, autoPlay, currentDuration, currentIndex, updateProgress, handleComplete])

  // Manual navigation
  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < items.length && index !== currentIndex) {
      if (!isControlled) {
        setInternalIndex(index)
      }
      onActiveChange?.(index, items[index])
    }
  }, [currentIndex, items, isControlled, onActiveChange])

  // Sync controlled state
  useEffect(() => {
    if (isControlled && activeIndex !== undefined && activeIndex !== internalIndex) {
      setInternalIndex(activeIndex)
    }
  }, [activeIndex, isControlled, internalIndex])

  return {
    currentIndex,
    currentItem,
    progress,
    goToIndex,
  } as const
} 