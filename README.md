# Thoughtful Package Sorter

A React application for Thoughtful's robotic automation factory that sorts packages based on their dimensions and mass.

## Features

- **Interactive Package Sorting**: Enter package dimensions (width, height, length) and mass to get sorting classification
- **Real-time Results**: Instant feedback on whether packages are STANDARD, SPECIAL, or REJECTED
- **Package History**: Track all sorted packages with timestamps and results
- **Input Validation**: Comprehensive error handling for invalid inputs
- **Responsive Design**: Clean, modern UI that works on all screen sizes

## Sorting Rules

Packages are classified based on the following criteria:

### Package Types
- **Bulky**: Volume ≥ 1,000,000 cm³ OR any dimension ≥ 150 cm
- **Heavy**: Mass ≥ 20 kg

### Sorting Categories
- **STANDARD**: Neither bulky nor heavy
- **SPECIAL**: Either bulky OR heavy (but not both)
- **REJECTED**: Both bulky AND heavy

## Setup & Installation

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation
1. Clone or download this repository
2. Navigate to the project directory
3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

### Running the Application
To start the development server:
```bash
npm start
```

The application will open in your browser at `http://localhost:3000`.

### Running Tests
To run the comprehensive test suite:
```bash
npm test
```

The test suite includes:
- Unit tests for the sorting function
- Edge case validation
- Input validation tests
- Real-world scenario tests

### Building for Production
To create a production build:
```bash
npm run build
```

## Usage

1. **Enter Package Details**: Fill in the width, height, length (in cm) and mass (in kg)
2. **Sort Package**: Click the "Sort Package" button to get the classification
3. **View Result**: The result will display as STANDARD (green), SPECIAL (yellow), or REJECTED (red)
4. **Track History**: All sorted packages are saved in the history panel with timestamps
5. **Clear History**: Use the "Clear History" button to reset the package list

## Technical Details

- **Frontend**: React with TypeScript
- **Testing**: Jest with comprehensive test coverage
- **Styling**: CSS with responsive design
- **Build Tool**: React Scripts
- **Package Management**: npm with legacy peer dependencies for compatibility

## Project Structure

```
src/
├── App.tsx                 # Main React component with UI and state management
├── App.css                 # Styling for the application
├── packageSorter.ts        # Core sorting logic and types
├── packageSorter.test.ts   # Comprehensive test suite
└── index.tsx              # React application entry point
```

## Test Coverage

The test suite covers:
- All sorting scenarios (STANDARD, SPECIAL, REJECTED)
- Edge cases (exact threshold values)
- Input validation (negative numbers, zero values)
- Real-world package examples
- Decimal value handling

## Deployment

This application can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

Simply run `npm run build` and deploy the `build` folder contents.

---

Built for the Thoughtful Automation Challenge