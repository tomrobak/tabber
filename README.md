# React Tabber Component

A powerful, production-ready tabber component built for **Next.js 15** and **React 19**. Features autoplay, custom content rendering, full TypeScript support, and extensive customization options.

[![NPM Version](https://img.shields.io/npm/v/@tomrobak/tabber.svg)](https://www.npmjs.com/package/@tomrobak/tabber)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![License: GPL-2.0](https://img.shields.io/badge/License-GPL%202.0-blue.svg)](https://opensource.org/licenses/GPL-2.0)

## ✨ Features

- 🚀 **React 19 Compliant** - Built with latest React patterns and hooks
- ⚡ **High Performance** - RAF-based animations, zero CSS transitions interference
- 🎨 **Fully Customizable** - Every aspect can be styled with Tailwind classes
- 📱 **Responsive Ready** - Works perfectly on all screen sizes
- 🔧 **TypeScript First** - Complete type safety and IntelliSense support
- 🎭 **Flexible Content** - Images, React components, or custom render functions
- ⏱️ **Individual Durations** - Per-tab timing control
- 🔄 **Autoplay Control** - Smart autoplay with manual override
- 🎯 **Zero Dependencies** - Only requires class-variance-authority, clsx, and tailwind-merge
- 📦 **Tree Shakeable** - Import only what you need

## 🚀 Installation

```bash
# Using npm
npm install @tomrobak/tabber

# Using yarn
yarn add @tomrobak/tabber

# Using pnpm
pnpm add @tomrobak/tabber
```

### Peer Dependencies

```bash
npm install react react-dom next class-variance-authority clsx tailwind-merge
```

## 📖 Quick Start

```tsx
import { Tabber } from "@tomrobak/tabber"

const items = [
  {
    id: "tab-1",
    title: "Lightning Fast",
    description: "Blazing-fast performance with optimized rendering",
    image: "/images/fast.jpg",
    duration: 4000
  },
  {
    id: "tab-2", 
    title: "Highly Reliable",
    description: "99.9% uptime with enterprise-grade infrastructure",
    image: "/images/reliable.jpg",
    duration: 6000
  }
]

export default function MyComponent() {
  return (
    <Tabber
      items={items}
      autoPlay={true}
      defaultDuration={5000}
      onActiveChange={(index, item) => {
        console.log(`Active tab: ${item.title}`)
      }}
    />
  )
}
```

## 🎨 Styling & Customization

### Basic Styling

```tsx
<Tabber
  items={items}
  className="bg-white rounded-xl shadow-lg p-8"
  size="lg"
  layout="right-text"
  
  // Tab styling
  tabClassName="border-l-4 border-transparent"
  tabActiveClassName="border-blue-500 bg-blue-50"
  tabInactiveClassName="opacity-70"
  
  // Progress bar
  progressGradient={["#3b82f6", "#8b5cf6"]}
  progressThickness="w-1"
  
  // Content area
  contentClassName="bg-gray-50"
  imageAspectRatio="aspect-video"
/>
```

### Advanced Customization

```tsx
<Tabber
  items={items}
  
  // Container & Layout
  className="max-w-6xl mx-auto"
  tabAlignment="start" // "start" | "center" | "end"
  tabSpacing="space-y-4"
  
  // Typography
  titleClassName="text-xl font-bold"
  titleActiveClassName="text-blue-900"
  descriptionClassName="text-gray-600 leading-relaxed"
  descriptionActiveClassName="text-blue-700"
  
  // Progress Bar
  progressClassName="bg-blue-100"
  progressBarClassName="bg-gradient-to-b from-blue-500 to-indigo-600"
  progressPosition="-left-2 top-0"
  
  // Colors
  activeTextColor="text-gray-900"
  inactiveTextColor="text-gray-500"
/>
```

## 🎭 Content Types

### 1. Image Content

```tsx
const items = [
  {
    id: "img-tab",
    title: "Image Example",
    description: "Shows an image in the content area",
    image: "/path/to/image.jpg" // or JSX element
  }
]
```

### 2. Custom React Content

```tsx
const items = [
  {
    id: "custom-tab",
    title: "Custom Content",
    description: "Renders custom React components",
    content: (
      <div className="p-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white">
        <h2 className="text-2xl font-bold">Custom Component</h2>
        <p>Any React content can go here!</p>
        <button className="mt-4 px-6 py-2 bg-white text-purple-600 rounded-lg">
          Click Me
        </button>
      </div>
    )
  }
]
```

### 3. Data-Driven with Render Function

```tsx
const items = [
  {
    id: "data-tab",
    title: "Analytics",
    description: "Data-driven content with custom rendering",
    data: {
      metrics: [
        { label: "Users", value: "10K+" },
        { label: "Uptime", value: "99.9%" }
      ]
    }
  }
]

const renderContent = (item, isActive, index) => {
  if (item.data?.metrics) {
    return (
      <div className="p-8 bg-gray-900 text-white">
        <h3 className="text-xl font-bold mb-6">Live Metrics</h3>
        <div className="grid grid-cols-2 gap-4">
          {item.data.metrics.map((metric, i) => (
            <div key={i} className="text-center">
              <div className="text-2xl font-bold">{metric.value}</div>
              <div className="text-sm opacity-75">{metric.label}</div>
            </div>
          ))}
        </div>
      </div>
    )
  }
  return item.content
}

<Tabber items={items} renderContent={renderContent} />
```

## ⚙️ API Reference

### TabberProps

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `items` | `TabberItem[]` | Required | Array of tab items |
| `autoPlay` | `boolean` | `true` | Enable/disable autoplay |
| `defaultDuration` | `number` | `5000` | Default duration in ms |
| `activeIndex` | `number` | `undefined` | Controlled active index |
| `defaultActiveIndex` | `number` | `0` | Initial active index |
| `layout` | `"left-text" \| "right-text"` | `"left-text"` | Text position |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Component size |
| `progressGradient` | `[string, string]` | `["#3b82f6", "#8b5cf6"]` | Progress bar gradient |
| `tabAlignment` | `"start" \| "center" \| "end"` | `"center"` | Vertical tab alignment |
| `onActiveChange` | `(index, item) => void` | `undefined` | Active tab change callback |
| `onCycleComplete` | `() => void` | `undefined` | Cycle completion callback |
| `onProgressChange` | `(progress) => void` | `undefined` | Progress update callback |

### Styling Props

| Category | Props | Description |
|----------|--------|-------------|
| **Container** | `tabClassName`, `tabActiveClassName`, `tabInactiveClassName`, `tabSpacing` | Tab container styling |
| **Typography** | `titleClassName`, `titleActiveClassName`, `descriptionClassName`, `descriptionActiveClassName` | Text styling |
| **Progress** | `progressClassName`, `progressBarClassName`, `progressThickness`, `progressPosition` | Progress bar styling |
| **Content** | `contentClassName`, `imageClassName`, `imageAspectRatio` | Content area styling |
| **Colors** | `activeTextColor`, `inactiveTextColor` | Text color classes |

### TabberItem

```tsx
interface TabberItem {
  id: string                    // Unique identifier
  title: string                 // Tab title
  description: string           // Tab description
  duration?: number            // Custom duration (ms)
  image?: string | ReactNode   // Image source or JSX
  content?: ReactNode          // Custom React content
  data?: any                   // Data for render functions
  titleClassName?: string      // Per-item title styling
  descriptionClassName?: string // Per-item description styling
}
```

## 🎯 Real-World Examples

### E-commerce Product Features

```tsx
const productFeatures = [
  {
    id: "security",
    title: "Advanced Security",
    description: "Bank-level encryption and fraud protection",
    image: "/features/security.svg",
    duration: 4000
  },
  {
    id: "analytics", 
    title: "Real-time Analytics",
    description: "Track performance with detailed insights",
    content: <AnalyticsDashboard />,
    duration: 6000
  }
]

<Tabber
  items={productFeatures}
  className="bg-white rounded-2xl shadow-xl p-8"
  size="lg"
  progressGradient={["#10b981", "#06b6d4"]}
  tabActiveClassName="bg-green-50 border-l-4 border-green-500"
  titleActiveClassName="text-green-900"
  descriptionActiveClassName="text-green-700"
/>
```

### SaaS Feature Showcase

```tsx
const saasFeatures = [
  {
    id: "collaboration",
    title: "Team Collaboration", 
    description: "Work together seamlessly with real-time sync",
    data: { 
      features: ["Real-time editing", "Comments", "Version history"],
      users: 1240
    }
  }
]

const renderSaasContent = (item) => {
  if (item.data?.features) {
    return (
      <div className="p-8 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
        <h3 className="text-2xl font-bold mb-6">{item.title}</h3>
        <ul className="space-y-2 mb-6">
          {item.data.features.map((feature, i) => (
            <li key={i} className="flex items-center">
              <CheckIcon className="w-5 h-5 mr-2" />
              {feature}
            </li>
          ))}
        </ul>
        <div className="text-lg font-semibold">
          {item.data.users}+ active users
        </div>
      </div>
    )
  }
}

<Tabber 
  items={saasFeatures}
  renderContent={renderSaasContent}
  layout="right-text"
  progressGradient={["#6366f1", "#8b5cf6"]}
/>
```

## 📱 Responsive Design

```tsx
<div className="w-full">
  {/* Desktop */}
  <div className="hidden lg:block">
    <Tabber 
      items={items}
      size="lg"
      layout="left-text"
      className="gap-12"
    />
  </div>
  
  {/* Mobile */}
  <div className="lg:hidden">
    <Tabber
      items={items}
      size="sm"
      layout="left-text"
      className="flex-col gap-6"
      tabAlignment="center"
      contentClassName="min-h-[250px]"
    />
  </div>
</div>
```

## 🌗 Dark Mode Support

```tsx
<Tabber
  items={items}
  className="dark:bg-gray-800"
  activeTextColor="text-gray-900 dark:text-gray-100"
  inactiveTextColor="text-gray-500 dark:text-gray-400"
  contentClassName="bg-gray-50 dark:bg-gray-900"
  progressGradient={["#3b82f6", "#8b5cf6"]}
  
  // Dark mode tab styling
  tabActiveClassName="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500"
  titleActiveClassName="text-blue-900 dark:text-blue-100"
  descriptionActiveClassName="text-blue-700 dark:text-blue-200"
/>
```

## 🔧 Advanced Usage

### Controlled Component

```tsx
const [activeIndex, setActiveIndex] = useState(0)
const [isAutoPlay, setIsAutoPlay] = useState(true)

<Tabber
  items={items}
  activeIndex={activeIndex}
  autoPlay={isAutoPlay}
  onActiveChange={(index) => setActiveIndex(index)}
  onCycleComplete={() => {
    // Handle cycle completion
    console.log("Cycle completed!")
  }}
/>

{/* Manual controls */}
<div className="mt-4 flex gap-2">
  <button onClick={() => setActiveIndex(0)}>Go to First</button>
  <button onClick={() => setIsAutoPlay(!isAutoPlay)}>
    {isAutoPlay ? 'Pause' : 'Play'}
  </button>
</div>
```

### Custom Hook Integration

```tsx
import { useTabber } from "@tomrobak/tabber"

function CustomTabber({ items }) {
  const { currentIndex, currentItem, progress, goToIndex } = useTabber({
    items,
    autoPlay: true,
    defaultDuration: 5000,
    onActiveChange: (index, item) => {
      // Custom logic
      analytics.track('tab_viewed', { 
        tab: item.title,
        index 
      })
    }
  })
  
  return (
    <div>
      {/* Custom UI using the hook */}
      <div>Current: {currentItem.title}</div>
      <div>Progress: {Math.round(progress * 100)}%</div>
      {items.map((_, index) => (
        <button 
          key={index}
          onClick={() => goToIndex(index)}
          className={index === currentIndex ? 'active' : ''}
        >
          Tab {index + 1}
        </button>
      ))}
    </div>
  )
}
```

## 🐛 Troubleshooting

### Common Issues

**1. Images not loading**
```tsx
// ✅ Correct - use proper Next.js image paths
image: "/images/feature.jpg"

// ❌ Incorrect - relative paths may not work
image: "./images/feature.jpg"
```

**2. TypeScript errors with custom content**
```tsx
// ✅ Correct - properly typed
const items: TabberItem[] = [{
  id: "test",
  title: "Test",
  description: "Test description",
  content: <div>Custom content</div>
}]

// ❌ Incorrect - missing required fields
const items = [{ content: <div>Test</div> }]
```

**3. Styling not applying**
```tsx
// ✅ Correct - include Tailwind content paths
// tailwind.config.js
module.exports = {
  content: [
    "./node_modules/@tomrobak/tabber/**/*.{js,ts,jsx,tsx}"
  ]
}
```

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the GPL-2.0 License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [class-variance-authority](https://github.com/joe-bell/cva)
- Inspired by shadcn/ui design patterns
- Optimized for Next.js 15 and React 19

---

**Made with ❤️ by [Tom Robak](https://github.com/tomrobak)** 