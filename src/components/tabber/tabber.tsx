"use client"

import * as React from "react"
import Image from "next/image"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useTabber, type TabberItem, type UseTabberOptions } from "./use-tabber"

// ============================================================================
// TYPES & VARIANTS
// ============================================================================

interface TabberProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange">,
    VariantProps<typeof tabberVariants>,
    UseTabberOptions {
  layout?: "left-text" | "right-text"
  size?: "sm" | "md" | "lg"
  progressGradient?: readonly [string, string]
  activeTextColor?: string
  inactiveTextColor?: string
  
  // Tab container customization
  tabClassName?: string
  tabActiveClassName?: string
  tabInactiveClassName?: string
  tabSpacing?: string
  tabAlignment?: "start" | "center" | "end"
  
  // Text customization
  titleClassName?: string
  titleActiveClassName?: string
  descriptionClassName?: string
  descriptionActiveClassName?: string
  
  // Progress bar customization
  progressClassName?: string
  progressBarClassName?: string
  progressThickness?: string
  progressPosition?: string
  
  // Content area customization
  contentClassName?: string
  imageClassName?: string
  imageAspectRatio?: string
  
  // Custom content rendering
  renderContent?: (item: TabberItem, isActive: boolean, index: number) => React.ReactNode
}

const tabberVariants = cva(
  "relative flex w-full gap-8",
  {
    variants: {
      layout: {
        "left-text": "flex-row",
        "right-text": "flex-row-reverse",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      layout: "left-text",
      size: "md",
    },
  }
)

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const ProgressBar = React.memo<{
  progress: number
  gradient: readonly [string, string]
  className?: string
  barClassName?: string
  thickness?: string
  position?: string
}>(({ progress, gradient, className, barClassName, thickness = "w-2", position = "left-0 top-0" }) => (
  <div className={cn(
    "absolute h-full bg-gray-200 rounded-full overflow-hidden",
    thickness,
    position,
    className
  )}>
    <div
      className={cn("w-full rounded-full", barClassName)}
      style={{
        height: `${Math.max(0, Math.min(100, progress * 100))}%`,
        background: `linear-gradient(to bottom, ${gradient[0]}, ${gradient[1]})`,
        transform: 'translateZ(0)',
        willChange: 'height',
      }}
    />
  </div>
))

ProgressBar.displayName = "ProgressBar"

const TabberItem = React.memo<{
  item: TabberItem
  isActive: boolean
  index: number
  progress: number
  gradient: readonly [string, string]
  activeTextColor: string
  inactiveTextColor: string
  onClick: (index: number) => void
  
  // Customization props
  tabClassName?: string
  tabActiveClassName?: string
  tabInactiveClassName?: string
  titleClassName?: string
  titleActiveClassName?: string
  descriptionClassName?: string
  descriptionActiveClassName?: string
  progressClassName?: string
  progressBarClassName?: string
  progressThickness?: string
  progressPosition?: string
}>(({ 
  item, isActive, index, progress, gradient, activeTextColor, inactiveTextColor, onClick,
  tabClassName, tabActiveClassName, tabInactiveClassName,
  titleClassName, titleActiveClassName, descriptionClassName, descriptionActiveClassName,
  progressClassName, progressBarClassName, progressThickness, progressPosition
}) => (
  <div
    className={cn(
      "relative pl-6 py-3 cursor-pointer",
      isActive ? activeTextColor : inactiveTextColor,
      tabClassName,
      isActive ? tabActiveClassName : tabInactiveClassName
    )}
    style={{
      transition: 'none', // Remove all CSS transitions for performance
    }}
    onClick={() => onClick(index)}
  >
    {isActive && (
      <ProgressBar 
        progress={progress} 
        gradient={gradient}
        className={progressClassName}
        barClassName={progressBarClassName}
        thickness={progressThickness}
        position={progressPosition}
      />
    )}
    <div className="space-y-1">
      <h3 className={cn(
        "font-semibold text-base",
        isActive && "text-gray-900",
        titleClassName,
        item.titleClassName,
        isActive && titleActiveClassName
      )}>
        {item.title}
      </h3>
      <p className={cn(
        "leading-relaxed text-sm",
        isActive ? "text-gray-700" : "text-gray-500",
        descriptionClassName,
        item.descriptionClassName,
        isActive && descriptionActiveClassName
      )}>
        {item.description}
      </p>
    </div>
  </div>
))

TabberItem.displayName = "TabberItem"

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const Tabber = React.forwardRef<HTMLDivElement, TabberProps>(
  ({
    className,
    layout = "left-text",
    size = "md",
    items,
    autoPlay = true,
    defaultDuration = 5000,
    activeIndex,
    defaultActiveIndex = 0,
    onActiveChange,
    onCycleComplete,
    onProgressChange,
    progressGradient = ["#3b82f6", "#8b5cf6"],
    activeTextColor = "text-gray-900",
    inactiveTextColor = "text-gray-500",
    
    // Customization props
    tabClassName,
    tabActiveClassName,
    tabInactiveClassName,
    tabSpacing,
    tabAlignment = "center",
    titleClassName,
    titleActiveClassName,
    descriptionClassName,
    descriptionActiveClassName,
    progressClassName,
    progressBarClassName,
    progressThickness,
    progressPosition,
    contentClassName,
    imageClassName,
    imageAspectRatio,
    renderContent,
    ...props
  }, ref) => {
    const {
      currentIndex,
      currentItem,
      progress,
      goToIndex,
    } = useTabber({
      items,
      autoPlay,
      defaultDuration,
      activeIndex,
      defaultActiveIndex,
      onActiveChange,
      onCycleComplete,
      onProgressChange,
    })

    if (!items.length) {
      return null
    }

    // Determine content to render
    const renderCurrentContent = React.useCallback(() => {
      if (renderContent) {
        return renderContent(currentItem, true, currentIndex)
      }
      
      if (currentItem?.content) {
        return currentItem.content
      }
      
      if (currentItem?.image) {
        return (
          <div className={cn("w-full h-full flex items-center justify-center", imageClassName)}>
            {typeof currentItem.image === 'string' ? (
              <Image
                src={currentItem.image}
                alt={currentItem.title}
                width={500}
                height={300}
                className={cn(
                  "w-full h-full object-cover rounded-lg",
                  imageAspectRatio
                )}
                priority={currentIndex === 0}
              />
            ) : (
              currentItem.image
            )}
          </div>
        )
      }
      
      return null
    }, [renderContent, currentItem, currentIndex, imageClassName, imageAspectRatio])

    return (
      <div
        ref={ref}
        className={cn(tabberVariants({ layout, size }), className)}
        {...props}
      >
        {/* Text Column */}
        <div className={cn(
          "flex-1 flex flex-col",
          tabAlignment === "start" && "justify-start",
          tabAlignment === "center" && "justify-center", 
          tabAlignment === "end" && "justify-end",
          tabSpacing || "space-y-2"
        )}>
          {items.map((item, index) => (
            <TabberItem
              key={`${item.id}-${index}`}
              item={item}
              isActive={index === currentIndex}
              index={index}
              progress={index === currentIndex ? progress : 0}
              gradient={progressGradient}
              activeTextColor={activeTextColor}
              inactiveTextColor={inactiveTextColor}
              onClick={goToIndex}
              tabClassName={tabClassName}
              tabActiveClassName={tabActiveClassName}
              tabInactiveClassName={tabInactiveClassName}
              titleClassName={titleClassName}
              titleActiveClassName={titleActiveClassName}
              descriptionClassName={descriptionClassName}
              descriptionActiveClassName={descriptionActiveClassName}
              progressClassName={progressClassName}
              progressBarClassName={progressBarClassName}
              progressThickness={progressThickness}
              progressPosition={progressPosition}
            />
          ))}
        </div>

        {/* Content Column */}
        <div className={cn(
          "flex-1 relative overflow-hidden rounded-lg bg-gray-50",
          size === "sm" && "min-h-[200px]",
          size === "md" && "min-h-[300px]",
          size === "lg" && "min-h-[400px]",
          contentClassName
        )}>
          {renderCurrentContent()}
        </div>
      </div>
    )
  }
)

Tabber.displayName = "Tabber"

export { Tabber, type TabberProps, type TabberItem } 