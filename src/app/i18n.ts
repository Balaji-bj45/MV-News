import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

void i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: {
      translation: {
        brand: 'MV News',
        nav: {
          home: 'Home',
          videos: 'Videos',
          admin: 'Admin',
        },
        common: {
          latest: 'Latest updates',
          readMore: 'Read more',
          loading: 'Loading...',
          noData: 'Nothing to show yet.',
          page: 'Page',
          previous: 'Previous',
          next: 'Next',
          relatedNews: 'Related news',
          candidateSpotlight: 'Candidate spotlight',
          publishedOn: 'Published on',
          search: 'Search',
          logout: 'Logout',
          save: 'Save',
          update: 'Update',
          cancel: 'Cancel',
          delete: 'Delete',
          feature: 'Feature',
          unfeature: 'Unfeature',
          upload: 'Upload image',
        },
        categories: {
          all: 'All',
          india: 'India',
          tamilnadu: 'Tamil Nadu',
          candidate: 'Candidate',
          mvnews: 'MV News',
        },
        home: {
          heroLabel: 'Featured story',
          breaking: 'Breaking',
          topStories: 'Top stories',
          bannerCopy: 'Election coverage, candidate updates, and the stories shaping Tamil Nadu politics.',
        },
        article: {
          share: 'Share this article',
        },
        videos: {
          title: 'Video reports',
          subtitle: 'Watch speeches, explainers, and campaign moments.',
        },
        admin: {
          loginTitle: 'Admin login',
          dashboardTitle: 'Editorial dashboard',
          news: 'News',
          candidates: 'Candidates',
          video: 'Videos',
          mvnews: 'MV News',
          email: 'Email address',
          password: 'Password',
          signIn: 'Sign in',
          imageHint: 'Upload through the backend to Cloudinary and paste or auto-fill the URL.',
        },
        footer: {
          blurb: 'Fast political reporting with a Tamil Nadu focus.',
        },
      },
    },
    ta: {
      translation: {
        brand: 'எம்.வி நியூஸ்',
        nav: {
          home: 'முகப்பு',
          videos: 'வீடியோக்கள்',
          admin: 'நிர்வாகம்',
        },
        common: {
          latest: 'சமீபத்திய செய்திகள்',
          readMore: 'முழுதாக படிக்க',
          loading: 'ஏற்றப்படுகிறது...',
          noData: 'தற்போது தரவு இல்லை.',
          page: 'பக்கம்',
          previous: 'முந்தையது',
          next: 'அடுத்தது',
          relatedNews: 'தொடர்புடைய செய்திகள்',
          candidateSpotlight: 'வேட்பாளர் சிறப்புப் பதிவு',
          publishedOn: 'வெளியீட்டு தேதி',
          search: 'தேடல்',
          logout: 'வெளியேறு',
          save: 'சேமிக்க',
          update: 'புதுப்பிக்க',
          cancel: 'ரத்து செய்',
          delete: 'நீக்கு',
          feature: 'முக்கியமாக்கு',
          unfeature: 'முக்கியத்திலிருந்து நீக்கு',
          upload: 'படம் பதிவேற்று',
        },
        categories: {
          all: 'அனைத்தும்',
          india: 'இந்தியா',
          tamilnadu: 'தமிழ்நாடு',
          candidate: 'வேட்பாளர்',
          mvnews: 'எம்.வி நியூஸ்',
        },
        home: {
          heroLabel: 'முக்கிய செய்தி',
          breaking: 'உடனடி',
          topStories: 'முன்னணி செய்திகள்',
          bannerCopy: 'தேர்தல் அரசியல், வேட்பாளர் முன்னேற்றங்கள், தமிழ்நாட்டை வடிவமைக்கும் முக்கிய செய்திகள்.',
        },
        article: {
          share: 'இந்த செய்தியை பகிரவும்',
        },
        videos: {
          title: 'வீடியோ செய்திகள்',
          subtitle: 'பேச்சுகள், விளக்கங்கள், பிரச்சார தருணங்களை பாருங்கள்.',
        },
        admin: {
          loginTitle: 'நிர்வாக உள்நுழைவு',
          dashboardTitle: 'தொகுப்பாசிரியர் பலகை',
          news: 'செய்திகள்',
          candidates: 'வேட்பாளர்கள்',
          video: 'வீடியோக்கள்',
          mvnews: 'எம்.வி நியூஸ்',
          email: 'மின்னஞ்சல் முகவரி',
          password: 'கடவுச்சொல்',
          signIn: 'உள்நுழை',
          imageHint: 'பின்புறம் வழியாக Cloudinary-க்கு பதிவேற்றி URL-ஐ நிரப்பவும்.',
        },
        footer: {
          blurb: 'தமிழ்நாட்டை மையமாகக் கொண்ட விரைவான அரசியல் செய்தி தளம்.',
        },
      },
    },
  },
});

export default i18n;
