# 🛡️ Data Deidentifier

A modern, privacy-first web application that automatically detects and redacts sensitive information (PII/PHI) from text using advanced AI algorithms. All processing happens locally in your browser - no data ever leaves your device.

![Data Deidentifier Demo](https://via.placeholder.com/800x400/3B82F6/FFFFFF?text=Data+Deidentifier+Demo)

## ✨ Features

### 🎯 Advanced AI Detection
- **Named Entity Recognition (NER)** - Context-aware name detection
- **Contextual Analysis** - Understands phrases like "my email is..." or "call me at..."
- **Semantic Pattern Matching** - Identifies potential PII using linguistic features
- **Financial Validation** - Credit card numbers validated using Luhn algorithm
- **Medical Information** - Detects patient IDs, diagnoses, and medical records

### 🎨 Modern Visual Interface
- **Colored Icon Bubbles** - Each data type has a unique color and icon
- **Inline Replacement** - Sensitive data replaced with labeled bubbles (👤 Name, 📧 Email, etc.)
- **Hover Tooltips** - Shows original data and AI confidence percentage
- **Real-time Preview** - See detection types in the header as you process text

### 🔒 Privacy & Security
- **100% Client-Side Processing** - No data sent to external servers
- **No Data Storage** - Information only persists in your browser session
- **Open Source** - Full transparency of data handling
- **Offline Capable** - Works without internet connection after initial load

## 🚀 Detection Capabilities

| Type | Icon | Examples | Validation |
|------|------|----------|------------|
| **Names** | 👤 | John Smith, Dr. Johnson | Context + Linguistic patterns |
| **Emails** | 📧 | user@domain.com | RFC compliant validation |
| **Phones** | 📞 | (555) 123-4567 | Multiple format support |
| **Credit Cards** | 💳 | 4532-0151-1283-0366 | Luhn algorithm validation |
| **SSN** | 🔢 | 123-45-6789 | Format validation |
| **Addresses** | 📍 | 123 Main St | Street pattern recognition |
| **Organizations** | 🏢 | Acme Corp, Inc. | Corporate suffix detection |
| **Medical Info** | 🩺 | Patient ID: MED-789 | Healthcare terminology |
| **Financial** | 💰 | Account: 9876543210 | Banking context analysis |

## 🛠️ Technology Stack

- **Frontend**: React 18, Create React App
- **Styling**: Tailwind CSS 3
- **Icons**: Lucide React
- **Build**: Webpack (via CRA)
- **Deployment**: Static hosting ready

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm

### Local Development

```bash
# Clone the repository
git clone https://github.com/yourusername/data-deidentifier.git
cd data-deidentifier

# Install dependencies
npm install

# Start development server
npm start
```

The app will open at `http://localhost:3000`

### Production Build

```bash
# Create optimized production build
npm run build

# Serve locally to test
npx serve -s build
```

## 🎯 Usage

1. **Paste Text**: Enter text containing sensitive information into the input area
2. **Configure AI**: Toggle enhanced AI detection on/off (enabled by default)
3. **Process**: Click "Process" to analyze and redact sensitive data
4. **Review**: Examine the output with color-coded bubbles replacing sensitive data
5. **Copy**: Copy the sanitized text for safe sharing
6. **Inspect**: Hover over bubbles to see original data and confidence scores

### Example Transformation

**Input:**
```
Hi, my name is Sarah Johnson and I work at Microsoft Corporation. 
You can reach me at sarah.johnson@email.com or call me at (555) 123-4567.
My employee ID is EMP-12345 and my credit card is 4532015112830366.
```

**Output:**
```
Hi, my name is 👤 Name and I work at 🏢 Organization. 
You can reach me at 📧 Email or call me at 📞 Phone.
My employee ID is 🔢 ID Number and my credit card is 💳 Credit Card.
```

## 🧠 AI Detection Details

### Confidence Scoring
- **75% threshold** - Balanced detection (standard setting)
- **Pattern-based** - 90-95% confidence (regex, validation algorithms)
- **Context-aware** - 80-90% confidence (phrase analysis)
- **Semantic** - 60-85% confidence (linguistic features)

### Detection Methods
1. **Regex Patterns** - Email, phone, SSN, credit card formats
2. **Contextual Analysis** - "My name is...", "Contact me at..."
3. **Named Entity Recognition** - Proper nouns, titles, signatures
4. **Validation Algorithms** - Luhn for credit cards, format checks
5. **Semantic Analysis** - Word relationships and characteristics

## 🎨 Customization

### Adding New Detection Types
```javascript
// In getDetectionTypeInfo function
'NEW_TYPE': { 
  icon: IconComponent, 
  bgColor: 'bg-color-100', 
  textColor: 'text-color-800', 
  iconColor: 'text-color-600',
  label: 'Display Name'
}
```

### Styling
- Tailwind CSS classes in components
- Color schemes defined in `getDetectionTypeInfo`
- Responsive design with mobile-first approach

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Roadmap

- [ ] **Batch Processing** - Handle multiple documents
- [ ] **Custom Rules** - User-defined detection patterns
- [ ] **Export Formats** - JSON, XML, CSV output options
- [ ] **API Integration** - Optional cloud services for enhanced detection
- [ ] **Audit Logs** - Track what was redacted
- [ ] **Templates** - Pre-configured settings for different industries
- [ ] **Browser Extension** - Redact data on any webpage

## 🔧 Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Lucide React** - Beautiful icon library
- **Tailwind CSS** - Utility-first CSS framework
- **React Team** - Amazing framework and ecosystem
- **Open Source Community** - For inspiration and best practices

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/data-deidentifier/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/data-deidentifier/discussions)
- **Security**: Please report security vulnerabilities privately

---

<div align="center">

**🛡️ Protecting Privacy, One Document at a Time**

Made with ❤️ for data privacy and security

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3+-blue.svg)](https://tailwindcss.com/)

</div>
