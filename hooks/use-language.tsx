'use client'

import { createContext, useContext, ReactNode, useState, useEffect } from 'react'

export type Language = 'en' | 'es' | 'fr' | 'ar' | 'hi'

interface LanguageOption {
  code: Language;
  name: string;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: () => 'ltr' | 'rtl';
  availableLanguages: LanguageOption[];
}

const translations = {
  en: {
    'common.home': 'Home',
    'common.products': 'Products',
    'common.cart': 'Cart',
    'common.account': 'Account',
    "shop": "Shop",
    "skills": "Skills",
    "stories": "Stories",
    "about": "About",
    "contact_us": "Contact Us",
    "search_products": "Search products...",
    "login": "Log In",
    "register": "Register",
    "logout": "Log Out",
    "name": "Name",
    "email": "Email",
    "message": "Message",
    "your_name": "Your name",
    "your_email": "Your email address",
    "your_message": "Your message",
    "send_message": "Send Message",
    "sending": "Sending..."
  },
  es: {
    'common.home': 'Inicio',
    'common.products': 'Productos',
    'common.cart': 'Carrito',
    'common.account': 'Cuenta',
    "shop": "Tienda",
    "skills": "Habilidades",
    "stories": "Historias",
    "about": "Acerca de",
    "contact_us": "Contáctenos",
    "search_products": "Buscar productos...",
    "login": "Iniciar Sesión",
    "register": "Registrarse",
    "logout": "Cerrar Sesión",
    "name": "Nombre",
    "email": "Correo",
    "message": "Mensaje",
    "your_name": "Tu nombre",
    "your_email": "Tu correo electrónico",
    "your_message": "Tu mensaje",
    "send_message": "Enviar Mensaje",
    "sending": "Enviando..."
  },
  fr: {
    'common.home': 'Accueil',
    'common.products': 'Produits',
    'common.cart': 'Panier',
    'common.account': 'Compte',
    "shop": "Boutique",
    "skills": "Compétences",
    "stories": "Histoires",
    "about": "À Propos",
    "contact_us": "Contactez-nous",
    "search_products": "Rechercher des produits...",
    "login": "Se Connecter",
    "register": "S'inscrire",
    "logout": "Se Déconnecter",
    "name": "Nom",
    "email": "Email",
    "message": "Message",
    "your_name": "Votre nom",
    "your_email": "Votre adresse email",
    "your_message": "Votre message",
    "send_message": "Envoyer Message",
    "sending": "Envoi en cours..."
  },
  ar: {
    'common.home': 'الرئيسية',
    'common.products': 'المنتجات',
    'common.cart': 'السلة',
    'common.account': 'الحساب',
    "shop": "المتجر",
    "skills": "المهارات",
    "stories": "القصص",
    "about": "عن المتجر",
    "contact_us": "اتصل بنا",
    "search_products": "البحث عن المنتجات...",
    "login": "تسجيل الدخول",
    "register": "التسجيل",
    "logout": "تسجيل الخروج",
    "name": "الاسم",
    "email": "البريد الإلكتروني",
    "message": "الرسالة",
    "your_name": "اسمك",
    "your_email": "بريدك الإلكتروني",
    "your_message": "رسالتك",
    "send_message": "إرسال الرسالة",
    "sending": "جاري الإرسال..."
  },
  hi: {
    'common.home': 'होम',
    'common.products': 'उत्पाद',
    'common.cart': 'कार्ट',
    'common.account': 'खाता',
    "shop": "दुकान",
    "skills": "कौशल",
    "stories": "कहानियाँ",
    "about": "हमारे बारे में",
    "contact_us": "संपर्क करें",
    "search_products": "उत्पाद खोजें...",
    "login": "लॉग इन",
    "register": "पंजीकरण",
    "logout": "लॉग आउट",
    "name": "नाम",
    "email": "ईमेल",
    "message": "संदेश",
    "your_name": "आपका नाम",
    "your_email": "आपका ईमेल",
    "your_message": "आपका संदेश",
    "send_message": "संदेश भेजें",
    "sending": "भेज रहा है..."
  }
}

const availableLanguages: LanguageOption[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Español' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'hi', name: 'हिन्दी' }
];

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en')

  useEffect(() => {
    const savedLang = localStorage.getItem('language') as Language
    if (savedLang) {
      setLanguage(savedLang)
    }
  }, [])

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang)
    localStorage.setItem('language', lang)
  }

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['en']] || key
  }

  const dir = () => {
    return language === 'ar' ? 'rtl' : 'ltr'
  }

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage: handleSetLanguage, 
      t, 
      dir,
      availableLanguages 
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}