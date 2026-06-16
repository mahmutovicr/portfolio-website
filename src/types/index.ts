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