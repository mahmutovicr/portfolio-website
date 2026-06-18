export interface Project {
  title: string
  description: string
  tags: string[]
  url: string
  screenshot: string
  objectPosition?: string
}

export interface ContactFormData {
  name: string
  email: string
  organization: string
  services: string
  message: string
}

export interface LegalSection {
  heading: string
  body: string
}

export interface LegalDocument {
  title: string
  sections: LegalSection[]
}