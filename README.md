# 🎯 3D Vector Playground

Welcome to the **3D Vector Playground**, an interactive educational tool built to help students and curious minds visualize and understand vector operations in 3D space.

## 📌 Objective

The goal of this project is to create a **visual and interactive simulator** for vector mathematics, making abstract math and physics concepts more tangible and intuitive.

This project is especially useful for:
- High school and university students studying linear algebra or physics.
- Teachers looking for an engaging way to demonstrate vector operations.
- Anyone curious about how vectors behave in 3D space.

## 🚀 Features

- Input and visualize multiple 3D vectors.
- Show vector addition, subtraction, dot product (scalar), and cross product (vector).
- Display angles between vectors and projections.
- Tag vectors with names like "force", "velocity", etc.
- Animate vector movement and visualize changes over time. (Planned)
- Save and share simulations. (Planned)

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: GenKit (for AI features)

- **Key Dependencies:**
    - `@radix-ui/react-accordion`: Accordion component.
    - `@radix-ui/react-alert-dialog`: Alert dialog component.
    - `@radix-ui/react-avatar`: Avatar component.
    - `@radix-ui/react-checkbox`: Checkbox component.
    - `@radix-ui/react-dialog`: Dialog component.
    - `@radix-ui/react-dropdown-menu`: Dropdown menu component.
    - `@radix-ui/react-label`: Label component.
    - `@radix-ui/react-menubar`: Menubar component.
    - `@radix-ui/react-popover`: Popover component.
    - `@radix-ui/react-progress`: Progress bar component.
    - `@radix-ui/react-radio-group`: Radio group component.
    - `@radix-ui/react-scroll-area`: Scroll area component.
    - `@radix-ui/react-select`: Select component.
    - `@radix-ui/react-separator`: Separator component.
    - `@radix-ui/react-slider`: Slider component.
    - `@radix-ui/react-slot`: Utility for flexible components.
    - `@radix-ui/react-switch`: Switch component.
    - `@radix-ui/react-tabs`: Tabs component.
    - `@radix-ui/react-toast`: Toast notification system.
    - `@radix-ui/react-tooltip`: Tooltip component.
    - `class-variance-authority`: Utility for managing CSS classes.
    - `clsx`: Utility for constructing `className` strings.
    - `lucide-react`: React icons.
    - `next`: Next.js framework.
    - `react`: React library.
    - `react-dom`: React DOM for web rendering.
    - `tailwind-merge`: Utility to merge Tailwind CSS classes.
    - `tailwindcss-animate`: Plugin for Tailwind CSS animations.

## 📂 Project Structure

- **`.idx`**: Configuration files for the development environment (e.g., `dev.nix`).
- **`.vscode`**: Visual Studio Code specific settings (`settings.json`).
- **`docs`**: Project documentation, including the `blueprint.md`.
- **`public`**: Static assets.
- **`src`**: Source code directory.
    - **`app`**: Next.js application routing and root layout (`layout.tsx`, `page.tsx`).
    - **`ai`**: AI-related code using GenKit (`dev.ts`, `genkit.ts`, `flows/generate-vector-challenge.ts`).
    - **`components`**: Reusable React components.
        - **`ui`**: UI components often based on Radix UI and styled with Tailwind CSS (e.g., `button.tsx`, `dialog.tsx`, `input.tsx`, etc.).
        - **`vector-config-panel.tsx`**: Component for configuring vector properties.
        - **`vector-display-panel.tsx`**: Component for displaying vector information.
        - **`vector-input-group.tsx`**: Component for inputting vector data.
    - **`hooks`**: Custom React hooks (`use-mobile.tsx`, `use-toast.ts`).
    - **`lib`**: Utility functions (`utils.ts`, `vector-math.ts`).
    - **`types`**: TypeScript type definitions (`vector.ts`).
- **`components.json`**: Configuration for Shadcn UI components.
- **`next.config.ts`**: Next.js configuration.
- **`package.json`**: Project dependencies and scripts.
- **`postcss.config.mjs`**: PostCSS configuration, often for Tailwind CSS.
- **`tailwind.config.ts`**: Tailwind CSS configuration.
- **`tsconfig.json`**: TypeScript configuration.

## 🏃‍♀️ Getting Started

1. **Clone the repository:**
