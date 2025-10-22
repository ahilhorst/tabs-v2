# Tabs Playground

A playground to showcase multiple components working together, starting with a macOS-style title bar with tabs.

## Features

- **TitleBar Component**: A macOS-style title bar with traffic lights, app name, and tabs
- **ProjectTab Component**: Individual tab components with different states (active, default, hover, loading)
- **Interactive Tabs**: Click to switch between tabs, close tabs, and add new tabs
- **Design System**: Complete design tokens and styling system based on the Figma design

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000`

## Components

### TitleBar
- Traffic lights for macOS styling
- App name display
- Tab navigation rail
- Add new tab button
- Overflow menu button

### ProjectTab
- Icon, label, and close button
- Active and default states
- Click and close handlers
- Responsive design

## Design Tokens

The project uses CSS custom properties for consistent theming:
- Colors (background, text, borders)
- Spacing (margins, padding)
- Typography (fonts, sizes, weights)
- Shadows and borders
- Border radius values

## Next Steps

This playground is ready for additional components:
- Navigation rail
- Header component
- Integration between all components
