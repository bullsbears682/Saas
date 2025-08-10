# Automated Proposal Generator SaaS

A modern web application that enables freelancers, consultants, and small businesses to quickly create professional project proposals with polished PDF output.

![Proposal Generator](https://img.shields.io/badge/React-18.x-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3.x-blue)

## ✨ Features

### Core Features
- **Multi-step Form Interface**: Intuitive step-by-step form with progress tracking
- **Client Information Management**: Capture client details, company info, and contact information
- **Project Details**: Define project scope, timeline, deliverables, and pricing
- **Custom Branding**: Upload logo, set brand colors, and add your business information
- **Professional PDF Generation**: Generate polished PDF proposals with custom branding
- **Terms & Conditions**: Customizable terms with sensible defaults
- **Real-time Preview**: See proposal summary before generating PDF

### Technical Features
- **TypeScript Support**: Full type safety throughout the application
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Form Validation**: Comprehensive client-side validation with error messages
- **Modern UI**: Clean, professional interface using Tailwind CSS
- **File Upload**: Logo upload with preview functionality
- **Currency Support**: Multiple currency options (USD, EUR, GBP, CAD)

## 🚀 Quick Start

### Prerequisites
- Node.js 16.x or higher
- npm or yarn package manager

### Installation

1. **Clone and setup the project:**
   ```bash
   cd proposal-generator
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000` to see the application.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## 📋 How to Use

### Step 1: Client Information
- Enter client's name, company, email, phone, and address
- Required fields are marked with an asterisk (*)

### Step 2: Project Details
- Add project title and description
- Define detailed project scope
- Set timeline and select currency
- List specific deliverables
- Enter total project price

### Step 3: Branding & Your Information
- Upload your company logo (optional)
- Set your primary brand color
- Enter your business information (name, email, phone, address)

### Step 4: Terms & Conditions
- Review and customize terms and conditions
- Set proposal validity period
- Default terms cover payment, project terms, and intellectual property

### Step 5: Preview & Generate
- Review all entered information
- Generate and download professional PDF proposal
- PDF includes all sections with your custom branding

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── ClientInfoForm.tsx    # Client information form
│   ├── ProjectDetailsForm.tsx # Project details form
│   ├── BrandingForm.tsx      # Branding and business info form
│   ├── TermsForm.tsx         # Terms and conditions form
│   ├── LoadingSpinner.tsx    # Loading component
│   └── index.ts              # Component exports
├── types/               # TypeScript type definitions
│   └── index.ts         # Interface definitions
├── utils/               # Utility functions
│   └── pdfGenerator.ts  # PDF generation logic
├── App.tsx              # Main application component
├── App.css              # Custom styles
└── index.tsx            # Application entry point
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Form Management**: React Hook Form for efficient form handling
- **PDF Generation**: jsPDF for client-side PDF creation
- **Styling**: Tailwind CSS for modern, responsive design
- **Build Tool**: Create React App with TypeScript template

## 🎨 Customization

### Adding New Templates
To add new PDF templates, modify the `generateProposalPDF` function in `src/utils/pdfGenerator.ts`:

```typescript
// Add new template functions
const generateMinimalTemplate = (data: ProposalData) => {
  // Your template logic here
};

// Update the main function to support template selection
export const generateProposalPDF = (data: ProposalData, template: 'default' | 'minimal' = 'default') => {
  switch (template) {
    case 'minimal':
      return generateMinimalTemplate(data);
    default:
      return generateDefaultTemplate(data);
  }
};
```

### Customizing Styles
- Edit `tailwind.config.js` to modify the design system
- Update component styles in individual component files
- Add custom CSS in `src/App.css`

### Adding New Form Fields
1. Update the interfaces in `src/types/index.ts`
2. Add form fields to the appropriate component
3. Update the PDF generation logic to include new fields

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory for configuration:

```env
REACT_APP_VERSION=1.0.0
REACT_APP_COMPANY_NAME=Your Company Name
```

### Tailwind Configuration
The `tailwind.config.js` file includes custom colors and can be extended:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      }
    }
  },
}
```

## 🚀 Future Enhancements

### Planned Features
- [ ] **User Authentication**: Login/signup with email or OAuth
- [ ] **Proposal Storage**: Save and manage multiple proposals
- [ ] **Template Library**: Multiple professional templates to choose from
- [ ] **Electronic Signatures**: Integration with DocuSign or similar
- [ ] **Proposal Analytics**: Track proposal views and responses
- [ ] **Client Portal**: Allow clients to view and respond to proposals
- [ ] **Team Collaboration**: Share proposals with team members
- [ ] **API Integration**: Connect with CRM systems
- [ ] **Advanced Branding**: More customization options
- [ ] **Proposal Templates**: Pre-built templates for different industries

### Backend Integration
For production use, consider adding:
- Database for proposal storage (PostgreSQL, MongoDB)
- Authentication service (Firebase Auth, Auth0)
- File storage for logos and documents (AWS S3, Cloudinary)
- Email notifications and reminders
- Payment integration for proposal acceptance

## 📝 Development

### Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App (irreversible)

### Code Quality
- TypeScript for type safety
- ESLint for code linting
- Prettier for code formatting (recommended)

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-username/proposal-generator/issues) page
2. Create a new issue with detailed description
3. Include steps to reproduce the problem

## 🙏 Acknowledgments

- React team for the amazing framework
- jsPDF for client-side PDF generation
- Tailwind CSS for the utility-first CSS framework
- React Hook Form for efficient form management

---

**Built with ❤️ for freelancers and small businesses**
