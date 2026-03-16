# CircuitBase

<div align="center">
  <img src="logo.svg" alt="CircuitBase Logo" width="200" />
  
  **A comprehensive electronics component database and management system**
  
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
</div>

## 🚀 Features

- **Component Database**: 90+ electronic components with detailed specifications
- **Datasheet Integration**: Direct links to manufacturer documentation
- **Purchase Links**: Multiple retailers (Robu, Amazon, AliExpress) for easy sourcing
- **Inventory Management**: Track your electronic components stock
- **Bill of Materials**: Create and manage project BOMs
- **Component Comparison**: Compare specifications side-by-side
- **Smart Search**: Filter by category, tier, interface, and specifications
- **Recently Viewed**: Quick access to recently explored components

## 📋 Component Categories

- **MCU**: Microcontrollers (ESP32, Arduino, STM32, etc.)
- **Display**: OLED, TFT, LCD displays
- **Sensor**: Temperature, humidity, motion, light sensors
- **RF**: Wireless modules (WiFi, Bluetooth, LoRa)
- **Power**: Power management, batteries, converters
- **I/O**: Relays, motor drivers, communication modules
- **Active**: Transistors, op-amps, timers
- **Passive**: Resistors, capacitors, inductors, LEDs
- **Proto**: Breadboards, jumper wires, adapters
- **Mechanical**: Motors, servos, mechanical components
- **Material**: Structural components, wires

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **State Management**: React Context API
- **Development**: ESLint, PostCSS

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/circuitbase.git
   cd circuitbase
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   # Add your API keys to .env.local if needed
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📚 Usage

### Component Database

Browse through the comprehensive database of electronic components:
- Use search and filters to find specific components
- View detailed specifications and datasheets
- Access purchase links from multiple retailers
- Check component compatibility and pairing suggestions

### Inventory Management

- Add components to your inventory
- Track quantities, locations, and conditions
- Monitor stock levels and set alerts

### Bill of Materials

- Create project-specific BOMs
- Calculate total project costs
- Generate shopping lists
- Track component requirements across projects

### Component Comparison

- Select up to 3 components for side-by-side comparison
- Compare specifications, pricing, and features
- Make informed component selection decisions

## 🏗️ Project Structure

```
circuitbase/
├── components/          # React components
│   ├── AppContext.tsx  # Global state management
│   ├── CommandPalette.tsx
│   ├── ComponentDetailModal.tsx
│   ├── DatabaseTab.tsx
│   ├── BomTab.tsx
│   ├── InventoryTab.tsx
│   ├── KitTab.tsx
│   └── MainApp.tsx
├── lib/                # Core libraries
│   ├── data.ts         # Component database
│   └── types.ts        # TypeScript definitions
├── hooks/              # Custom React hooks
├── app/                # Next.js app router
├── public/             # Static assets
└── styles/             # Global styles
```

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix linting issues
```

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for React and Next.js best practices
- **Prettier**: Consistent code formatting (recommended)
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for variables

### Adding New Components

1. Open `lib/data.ts`
2. Add component to the `COMPONENTS` array:
   ```typescript
   {
     id: 'unique-id',
     name: 'Component Name',
     cat: 'category',
     tier: 1,
     note: 'Description',
     price: 100,
     tags: ['tag1', 'tag2'],
     pairs: ['compatible-component-id'],
     datasheet: 'https://manufacturer.com/datasheet.pdf',
     verified: true,
     wtb: {
       robu: 'https://robu.in/product/...',
       amazon: 'https://amazon.com/...',
       ali: 'https://aliexpress.com/...'
     }
   }
   ```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests if applicable**
5. **Ensure code quality**
   ```bash
   npm run lint
   npm run build
   ```
6. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
7. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Contribution Guidelines

- **Components**: Add proper TypeScript types and documentation
- **Code Quality**: Follow existing code style and patterns
- **Testing**: Ensure new features don't break existing functionality
- **Documentation**: Update README and comments as needed
- **Datasheets**: Only add official manufacturer datasheet links
- **Purchase Links**: Verify links are active and relevant

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Component data sourced from various electronics manufacturers and distributors
- Icons provided by [Lucide](https://lucide.dev/)
- Built with [Next.js](https://nextjs.org/) and [React](https://reactjs.org/)

## 📞 Support

- **Issues**: Report bugs and request features via [GitHub Issues](https://github.com/yourusername/circuitbase/issues)
- **Discussions**: Ask questions and share ideas in [GitHub Discussions](https://github.com/yourusername/circuitbase/discussions)
- **Email**: contact@circuitbase.dev

---

<div align="center">
  <strong>⭐ Star this repository if it helped you!</strong>
</div>
