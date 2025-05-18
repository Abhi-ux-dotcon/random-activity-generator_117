# CSS Rules to HTML Elements Mapping Guide

## 1. Base Structure & Reset
```css
/* Applies to all elements */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
```
**Affects**: Every HTML element
**Purpose**: Removes default margins/padding and ensures consistent box model

```css
html {
    font-size: 16px;
    line-height: 1.5;
}
```
**Affects**: `<html>` element
**Purpose**: Sets base font size and line height for the entire document

```css
body {
    font-family: var(--font-family);
    color: var(--color-text);
    background-color: var(--color-background);
    padding: var(--spacing-md);
}
```
**Affects**: `<body>` element
**Purpose**: Sets default text styles and background

## 2. Layout Components

### Container
```css
.container {
    width: 100%;
    max-width: var(--breakpoint-xl);
    margin: 0 auto;
    padding: var(--spacing-lg);
    background-color: var(--color-surface);
    border-radius: var(--border-radius-lg);
    box-shadow: 0 4px 6px var(--color-shadow);
}
```
**Affects**: `<main class="container">`
**Purpose**: Centers content, adds padding, and creates card-like appearance

### Header
```css
header {
    text-align: center;
    margin-bottom: var(--spacing-xl);
}
```
**Affects**: `<header>` element
**Purpose**: Centers the title and adds spacing

```css
h1 {
    font-size: var(--font-size-xxl);
    font-weight: 700;
    color: var(--color-text);
}
```
**Affects**: `<h1>Boredom Buster 🎲</h1>`
**Purpose**: Styles the main heading

## 3. Interactive Elements

### Category Buttons
```css
.categories {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--spacing-md);
    margin-bottom: var(--spacing-xl);
    padding: var(--spacing-md);
    border: 2px dashed var(--color-border);
    border-radius: var(--border-radius-md);
}
```
**Affects**: `<section class="categories">`
**Purpose**: Creates responsive grid layout for category buttons

```css
.category-btn {
    padding: var(--spacing-md);
    border: 2px solid var(--color-border);
    border-radius: var(--border-radius-md);
    background-color: var(--color-surface);
    color: var(--color-text);
    font-size: var(--font-size-sm);
    font-weight: 500;
    cursor: pointer;
    transition: all var(--transition-normal);
}
```
**Affects**: `<button class="category-btn">`
**Purpose**: Styles individual category buttons

### Generate Button
```css
.generate-btn {
    display: block;
    width: 100%;
    max-width: 300px;
    margin: 0 auto var(--spacing-xl);
    padding: var(--spacing-md) var(--spacing-xl);
    font-size: var(--font-size-lg);
    font-weight: 600;
    color: var(--color-text-on-primary);
    background-color: var(--color-primary);
    border: none;
    border-radius: var(--border-radius-md);
    cursor: pointer;
    transition: all var(--transition-normal);
}
```
**Affects**: `<button class="generate-btn">`
**Purpose**: Styles the main action button

## 4. Result Area

### Loading State
```css
.loading {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100px;
    opacity: 0;
    transition: opacity var(--transition-normal);
}
```
**Affects**: `<div class="loading">`
**Purpose**: Centers loading spinner and handles visibility

```css
.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid var(--color-border);
    border-top: 4px solid var(--color-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
}
```
**Affects**: `<div class="spinner">`
**Purpose**: Creates animated loading spinner

### Activity Result
```css
.result-area {
    min-height: 120px;
    padding: var(--spacing-xl);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-md);
    background-color: var(--color-surface);
    box-shadow: 0 2px 4px var(--color-shadow);
}
```
**Affects**: `<section class="result-area">`
**Purpose**: Styles the container for activity results

```css
.activity-card {
    background: var(--color-surface);
    border-radius: var(--border-radius-md);
    padding: var(--spacing-lg);
    margin-top: var(--spacing-md);
    box-shadow: 0 2px 4px var(--color-shadow);
    border-left: 4px solid var(--color-primary);
}
```
**Affects**: `<div class="activity-card">`
**Purpose**: Styles individual activity cards

## 5. Theme Switcher
```css
.theme-switch {
    position: fixed;
    top: var(--spacing-md);
    right: var(--spacing-md);
    z-index: var(--z-index-fixed);
    background: var(--color-surface);
    border: 2px solid var(--color-border);
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}
```
**Affects**: `<button class="theme-switch">`
**Purpose**: Styles the theme toggle button

## 6. Responsive Design

### Tablet (768px)
```css
@media (max-width: 767.98px) {
    .categories {
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: var(--spacing-sm);
    }
    
    .category-btn {
        padding: var(--spacing-sm);
        font-size: var(--font-size-sm);
    }
}
```
**Affects**: All elements at tablet size
**Purpose**: Adjusts layout for smaller screens

### Mobile (576px)
```css
@media (max-width: 575.98px) {
    .categories {
        grid-template-columns: 1fr;
    }
    
    .category-btn {
        width: 100%;
    }
}
```
**Affects**: All elements at mobile size
**Purpose**: Stacks elements vertically on small screens

## 7. Accessibility

### Screen Reader
```css
.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
}
```
**Affects**: `<span class="sr-only">`
**Purpose**: Hides content visually but keeps it accessible to screen readers

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
    * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
```
**Affects**: All elements when reduced motion is preferred
**Purpose**: Disables animations for users who prefer reduced motion

## 8. Theme System

### Dark Theme
```css
[data-theme="dark"] {
    --color-background: #121212;
    --color-surface: #1E1E1E;
    --color-text: #FFFFFF;
    /* ... other dark theme variables ... */
}
```
**Affects**: All elements when dark theme is active
**Purpose**: Changes color scheme for dark mode

### Color Templates
```css
[data-theme="ocean"] {
    --color-primary: #0288D1;
    --color-secondary: #009688;
    /* ... other ocean theme variables ... */
}
```
**Affects**: All elements when ocean theme is active
**Purpose**: Applies ocean color scheme 