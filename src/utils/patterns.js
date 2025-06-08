export const patterns = {
  email: {
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    label: 'EMAIL'
  },
  phone: {
    regex: /(\+?1[-.\s]?)?\(?(\d{3})\)?[-.\s]?(\d{3})[-.\s]?(\d{4})\b/g,
    label: 'PHONE'
  },
  ssn: {
    regex: /\b\d{3}-?\d{2}-?\d{4}\b/g,
    label: 'SSN'
  },
  creditCard: {
    regex: /\b(?:\d{4}[-\s]?){3}\d{4}\b/g,
    label: 'CREDIT_CARD'
  },
  ipAddress: {
    regex: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g,
    label: 'IP_ADDRESS'
  },
  date: {
    regex: /\b(?:\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4}|\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})\b/g,
    label: 'DATE'
  },
  name: {
    regex: /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g,
    label: 'NAME'
  },
  address: {
    regex: /\b\d+\s+[A-Za-z\s]+(Street|St|Avenue|Ave|Road|Rd|Lane|Ln|Drive|Dr|Boulevard|Blvd|Court|Ct|Place|Pl)\b/gi,
    label: 'ADDRESS'
  }
};

export const sensitiveKeywords = [
  'password', 'secret', 'key', 'token', 'api', 'private', 'confidential',
  'internal', 'restricted', 'classified', 'personal', 'sensitive'
];