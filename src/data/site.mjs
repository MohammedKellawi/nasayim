// Global association data: contact details, approved impact figures, form config.
// Edit values here; every page reads from this file.

export const site = {
  url: 'https://mohammedkellawi.github.io',
  base: '/nasayim/',
  name: { ar: 'جمعية نسائم الإخاء الخيرية', en: 'Nasaem Al-Ekhaa Charity Association' },
  shortName: { ar: 'نسائم الإخاء', en: 'Nasaem Al-Ekhaa' },
  founded: { ar: 'فبراير 2019', en: 'February 2019', iso: '2019-02' },
  license: '6039',
  phoneLocal: '0779114069',
  phoneIntl: '+962779114069',
  whatsapp: '962779114069',
  email: 'nasayim.aliikha2020@gmail.com',
  facebook: 'https://www.facebook.com/share/1EAFGP3XoL/',
  address: {
    ar: 'حسبان – مدارس الأخلاء التربوية – فرع حسبان – الأردن',
    en: 'Hisban – Al-Akhilla Educational Schools, Hisban Branch – Jordan',
  },
  // Free map search link (no API key, no invented coordinates).
  mapUrl: 'https://www.google.com/maps/search/?api=1&query=' +
    encodeURIComponent('مدارس الأخلاء التربوية حسبان الأردن'),
  whatsappMessage: {
    ar: 'السلام عليكم، أرغب بالاستفسار عن برامج ومشاريع جمعية نسائم الإخاء الخيرية.',
    en: 'Hello, I would like to learn more about the programs and projects of Nasaem Al-Ekhaa Charity Association.',
  },
  // Web3Forms access key (free, no card). Leave empty to use the email/WhatsApp fallback.
  // Get a key at https://web3forms.com using the association email, then paste it here.
  web3formsKey: '',
};

// The ONLY approved public impact figures. Do not add estimates.
export const stats = [
  { id: 'orphans', value: 500, program: 'orphan-care', ar: 'يتيم', en: 'Orphans supported' },
  { id: 'families', value: 530, program: 'food-support', ar: 'أسرة مستفيدة من برنامج إطعام الطعام', en: 'Families supported through the food program' },
  { id: 'medical', value: 150, program: 'shifaa-wa-amal', ar: 'عملية وحالة علاجية', en: 'Operations and medical cases supported' },
  { id: 'homes', value: 70, program: 'safe-home', ar: 'منزلًا تم ترميمه', en: 'Homes renovated' },
];

export const waLink = (lang) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMessage[lang])}`;
