"use client"

import React from "react"
import { Tabber, type TabberItem } from "../src/components/tabber"

// ============================================================================
// DEMO DATA
// ============================================================================

const basicItems: TabberItem[] = [
  {
    id: "feature-1",
    title: "Lightning Fast Performance",
    description: "Our hosting delivers blazing-fast load times with enterprise-grade SSD storage and global CDN integration.",
    image: "/api/placeholder/500/300?text=Fast+Performance",
    duration: 4000, // Custom duration for this tab
  },
  {
    id: "feature-2", 
    title: "99.9% Uptime Guarantee",
    description: "Rock-solid reliability with redundant infrastructure and 24/7 monitoring across multiple data centers.",
    image: "/api/placeholder/500/300?text=Uptime+Guarantee",
    duration: 6000, // Custom duration for this tab
  },
  {
    id: "feature-3",
    title: "Expert Support Team",
    description: "Get help when you need it from our certified hosting experts available around the clock.",
    image: "/api/placeholder/500/300?text=Expert+Support",
    // Uses defaultDuration (5000ms) when not specified
  },
]

const customContentItems: TabberItem[] = [
  {
    id: "custom-1",
    title: "Custom React Content",
    description: "This tab shows custom React components instead of images.",
    content: (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Custom Component</h2>
          <p className="text-lg">You can render any React content here!</p>
          <button className="mt-4 px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold">
            Try It Out
          </button>
        </div>
      </div>
    ),
  },
  {
    id: "custom-2",
    title: "Data-Driven Content",
    description: "Use the data property with renderContent function for dynamic content.",
    data: {
      metrics: [
        { label: "Users", value: "10K+" },
        { label: "Uptime", value: "99.9%" },
        { label: "Speed", value: "< 100ms" },
      ]
    },
  },
  {
    id: "custom-3",
    title: "Mixed Content Types",
    description: "Combine images, custom content, and data for maximum flexibility.",
    image: "/api/placeholder/400/250?text=Chart+Visualization",
    data: { type: "analytics" },
  },
]

// ============================================================================
// DEMO COMPONENTS
// ============================================================================

export function BasicTabberExample() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Basic Tabber Example</h2>
      
      <Tabber
        items={basicItems}
        autoPlay={true}
        defaultDuration={5000}
        onActiveChange={(index, item) => {
          console.log(`Switched to tab ${index}: ${item.title}`)
        }}
        onCycleComplete={() => {
          console.log("Completed full cycle!")
        }}
      />
    </div>
  )
}

export function CustomizedTabberExample() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Fully Customized Tabber</h2>
      
      <Tabber
        items={basicItems}
        layout="right-text"
        size="lg"
        autoPlay={true}
        defaultDuration={4000}
        
        // Container customization
        className="bg-white rounded-xl shadow-lg p-8 border"
        tabAlignment="start"
        tabSpacing="space-y-4"
        
        // Tab styling
        tabClassName="border-l-4 border-transparent hover:border-blue-200 transition-colors duration-200"
        tabActiveClassName="border-blue-500 bg-blue-50"
        tabInactiveClassName="opacity-70 hover:opacity-100"
        
        // Text styling
        titleClassName="text-lg font-bold"
        titleActiveClassName="text-blue-900"
        descriptionClassName="text-gray-600"
        descriptionActiveClassName="text-blue-700"
        
        // Progress bar customization
        progressClassName="bg-blue-100"
        progressBarClassName="bg-gradient-to-b from-blue-500 to-indigo-600"
        progressThickness="w-1"
        progressPosition="-left-2 top-0"
        
        // Content area
        contentClassName="bg-gradient-to-br from-gray-50 to-gray-100"
        imageClassName="rounded-lg overflow-hidden"
        imageAspectRatio="aspect-video"
        
        // Callbacks
        onActiveChange={(index, item) => {
          console.log(`Active: ${item.title}`)
        }}
      />
    </div>
  )
}

export function CustomContentTabberExample() {
  const renderCustomContent = (item: TabberItem, isActive: boolean, index: number) => {
    // Handle data-driven content
    if (item.data?.metrics) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 text-white p-8">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-6">Performance Metrics</h3>
            <div className="grid grid-cols-3 gap-6">
              {item.data.metrics.map((metric: any, i: number) => (
                <div key={i} className="text-center">
                  <div className="text-2xl font-bold">{metric.value}</div>
                  <div className="text-sm opacity-90">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }
    
    // Handle analytics visualization
    if (item.data?.type === "analytics") {
      return (
        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-900 text-white p-8">
          <div className="mb-4">
            <img 
              src={typeof item.image === 'string' ? item.image : '/api/placeholder/400/250?text=Chart'} 
              alt={item.title}
              className="rounded-lg opacity-80"
            />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-semibold">Analytics Dashboard</h3>
            <p className="text-sm opacity-75 mt-2">Real-time performance insights</p>
          </div>
        </div>
      )
    }
    
    // Fallback to item's own content
    return item.content
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Custom Content Rendering</h2>
      
      <Tabber
        items={customContentItems}
        autoPlay={true}
        defaultDuration={6000}
        renderContent={renderCustomContent}
        
        // Modern styling
        className="bg-gray-50 rounded-2xl p-6"
        progressGradient={["#10b981", "#06b6d4"]}
        activeTextColor="text-gray-900"
        inactiveTextColor="text-gray-500"
        
        contentClassName="bg-white shadow-lg"
        imageAspectRatio="aspect-[4/3]"
      />
    </div>
  )
}

export function ResponsiveTabberExample() {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Responsive Design</h2>
      
      <div className="space-y-8">
        {/* Desktop Layout */}
        <div className="hidden lg:block">
          <h3 className="text-lg font-semibold mb-4">Desktop View</h3>
          <Tabber
            items={basicItems}
            size="lg"
            layout="left-text"
            className="gap-12"
          />
        </div>
        
        {/* Mobile Layout */}
        <div className="lg:hidden">
          <h3 className="text-lg font-semibold mb-4">Mobile View</h3>
          <Tabber
            items={basicItems}
            size="sm"
            layout="left-text"
            className="flex-col gap-6"
            tabAlignment="center"
            contentClassName="min-h-[250px]"
          />
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// MAIN DEMO PAGE
// ============================================================================

export default function TabberDemo() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto space-y-16">
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            React Tabber Component
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A powerful, customizable tabber component for Next.js 15 & React 19.
            Features autoplay, custom content, full TypeScript support, and extensive styling options.
          </p>
        </header>
        
        <BasicTabberExample />
        <CustomizedTabberExample />
        <CustomContentTabberExample />
        <ResponsiveTabberExample />
      </div>
    </div>
  )
} 