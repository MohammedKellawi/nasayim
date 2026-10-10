// Relief programs. Add a new program by appending an object with the same fields;
// the build creates its Arabic and English pages automatically.
// images: keys from the `photos` catalog below (files live in public/images/<key>.webp and <key>-sm.webp).

export const programs = [
  {
    slug: 'food-support',
    icon: 'package',
    stat: 'families',
    title: { ar: 'برنامج إطعام الطعام', en: 'Food Support Program' },
    tagline: { ar: 'غذاء يحفظ الكرامة... وعطاء يصل إلى بيت يحتاجه.', en: 'Food that preserves dignity, delivered to the homes that need it.' },
    summary: {
      ar: 'طرود تموينية وكفالات غذائية مستمرة للأسر المتعففة من الفقراء والأرامل والأيتام.',
      en: 'Food parcels and year-round food sponsorships for families in need, widows and orphans.',
    },
    body: {
      ar: [
        'يعمل البرنامج على تقديم الطرود الإغاثية التموينية للأسر المحتاجة من الفقراء والأرامل والأيتام في المخيمات الفلسطينية في المملكة الأردنية الهاشمية، لتحقيق الحد الأدنى للمعيشة.',
        'ويسهم البرنامج في توفير الاحتياجات الغذائية الأساسية للأسر المتعففة من خلال كفالة غذائية دائمة طوال العام، إلى جانب برامج موسمية تهدف إلى تخفيف الأعباء المعيشية وتعزيز الأمن الغذائي للأسر المستفيدة.',
      ],
      en: [
        'The program delivers food relief parcels to families in need — low-income households, widows and orphans — in the Palestinian refugee camps of the Hashemite Kingdom of Jordan, helping them meet a basic standard of living.',
        'Through year-round food sponsorship alongside seasonal initiatives, the program covers essential food needs, eases the cost of living and strengthens food security for the families it serves.',
      ],
    },
    activities: {
      ar: ['كفالة غذائية دائمة طوال العام للأسر المحتاجة', 'الطرود الغذائية التموينية'],
      en: ['Year-round food sponsorship for families in need', 'Food relief parcels'],
    },
    images: ['food-1', 'food-2', 'food-5', 'food-4', 'food-3'],
  },
  {
    slug: 'shifaa-wa-amal',
    icon: 'heartPulse',
    stat: 'medical',
    title: { ar: 'شفاء وأمل', en: 'Shifaa wa Amal — Healing & Hope' },
    tagline: { ar: 'من الألم إلى الأمل.', en: 'From pain to hope.' },
    summary: {
      ar: 'عمليات اليوم الواحد والعلاج للأطفال والنساء الأشد حاجة.',
      en: 'Day surgeries and treatment for children and women most in need.',
    },
    body: {
      ar: [
        'يعمل البرنامج على إجراء عمليات اليوم الواحد للمرضى من الأطفال والنساء الأشد فقرًا في المخيمات الفلسطينية في المملكة الأردنية الهاشمية.',
        'ويسعى برنامج شفاء وأمل إلى مساندة المرضى المحتاجين الذين تشكل تكاليف العلاج عائقًا أمام حصولهم على الرعاية المناسبة، بحسب احتياجات الحالات المستفيدة.',
      ],
      en: [
        'The program funds day surgeries for children and women facing the greatest hardship in the Palestinian refugee camps of the Hashemite Kingdom of Jordan.',
        'Shifaa wa Amal stands with patients for whom the cost of treatment is a barrier to proper care, responding to the needs of each case.',
      ],
    },
    activities: {
      ar: ['عمليات اليوم الواحد للأطفال والنساء', 'مساندة الحالات العلاجية المحتاجة'],
      en: ['Day surgeries for children and women', 'Support for patients in need of treatment'],
    },
    images: ['health-1', 'health-2'],
  },
  {
    slug: 'safe-home',
    icon: 'house',
    stat: 'homes',
    title: { ar: 'المسكن الآمن', en: 'Safe Home' },
    tagline: { ar: 'منزل آمن... بداية لحياة أكثر استقرارًا.', en: 'A safe home is the start of a more stable life.' },
    summary: {
      ar: 'ترميم المنازل القديمة والمتهالكة للأسر المحتاجة والأرامل والأيتام.',
      en: 'Renovating old and deteriorating homes for families in need, widows and orphans.',
    },
    body: {
      ar: [
        'يهدف البرنامج إلى تقديم وتسهيل السكن الآمن للأسر الفقيرة والمحتاجة والأرامل والأيتام والمساكين في المخيمات الفلسطينية في المملكة الأردنية الهاشمية من خلال ترميم المنازل القديمة والمتهالكة.',
        'ويسعى البرنامج إلى تحسين الظروف السكنية ومعالجة الاحتياجات الأساسية للسكن، بما يسهم في توفير بيئة أكثر أمانًا وكرامة واستقرارًا للأسرة.',
      ],
      en: [
        'The program provides and facilitates safe housing for low-income families, widows, orphans and others in need in the Palestinian refugee camps of the Hashemite Kingdom of Jordan by renovating old and deteriorating homes.',
        'By improving living conditions and addressing essential housing needs, it helps give families a safer, more dignified and more stable place to live.',
      ],
    },
    activities: {
      ar: ['ترميم المنازل القديمة والمتهالكة', 'معالجة الاحتياجات السكنية الضرورية'],
      en: ['Renovating old and deteriorating homes', 'Addressing essential housing needs'],
    },
    images: ['home-1', 'home-2', 'home-3', 'home-4', 'home-5'],
  },
  {
    slug: 'relieving-distress',
    icon: 'handshake',
    stat: null,
    title: { ar: 'تفريج الكربات وزرع البسمات', en: 'Relieving Hardship, Restoring Smiles' },
    tagline: { ar: 'حين تضيق السبل... نفتح معًا نافذة للأمل.', en: 'When every door seems closed, together we open a window of hope.' },
    summary: {
      ar: 'الوقوف إلى جانب الأسر التي تواجه أزمات مالية أو معيشية طارئة.',
      en: 'Standing with families facing sudden financial or living crises.',
    },
    body: {
      ar: [
        'يعمل البرنامج على مساعدة الأشد فقرًا وحاجة في المخيمات الفلسطينية في المملكة الأردنية الهاشمية في مختلف الجوانب.',
        'وهو برنامج إنساني يهدف إلى الوقوف إلى جانب الأسر والأفراد الذين يواجهون أزمات مالية أو معيشية طارئة، والمساهمة في تخفيف الأعباء التي تهدد استقرار حياتهم.',
      ],
      en: [
        'The program assists those facing the greatest poverty and need in the Palestinian refugee camps of the Hashemite Kingdom of Jordan across many areas of life.',
        'It is a humanitarian program that stands with families and individuals facing sudden financial or living crises, helping to lift burdens that threaten their stability.',
      ],
    },
    activities: {
      ar: [
        'مساعدة الأسر غير القادرة على دفع إيجارات المنازل',
        'مساعدة الغارمين غير القادرين على سداد ديونهم',
        'كفالة طلبة العلم غير القادرين على دفع نفقات الدراسة',
        'دفع فواتير الكهرباء والماء المتراكمة على الأسر المحتاجة',
        'المساهمة في المبادرات الإنسانية التي ترسم الابتسامة على وجوه المحتاجين',
        'مشروع عون: توفير الكراسي المتحركة الخاصة بذوي الإعاقة',
      ],
      en: [
        'Helping families who cannot afford their rent',
        'Helping people in debt who are unable to repay',
        'Sponsoring students who cannot cover the cost of their studies',
        'Paying overdue electricity and water bills for families in need',
        'Contributing to humanitarian initiatives that bring smiles to those in need',
        'Aoun Project: providing wheelchairs for people with disabilities',
      ],
    },
    images: ['relief-1', 'relief-3', 'relief-4', 'relief-2', 'relief-5', 'relief-6'],
  },
  {
    slug: 'orphan-care',
    icon: 'heartHand',
    stat: 'orphans',
    title: { ar: 'كفالة الأيتام', en: 'Orphan Sponsorship' },
    tagline: { ar: 'نرعى حاضرهم... لنصنع معهم مستقبلًا أفضل.', en: 'Caring for their present, building a better future with them.' },
    summary: {
      ar: 'رعاية الأيتام ماديًا ومعنويًا وتنمويًا ودعم مسيرتهم التعليمية.',
      en: 'Material, emotional and developmental care for orphans, and support for their education.',
    },
    body: {
      ar: [
        'يعمل البرنامج على رعاية الأيتام ماديًا ومعنويًا وتنمويًا من خلال الكفالات والبرامج الداعمة التي تسهم في توفير حياة أكثر استقرارًا لهم ودعم مسيرتهم التعليمية والاجتماعية.',
        'نحرص في البرنامج على صون خصوصية الأطفال وكرامتهم في كل مراحل الرعاية.',
      ],
      en: [
        'The program cares for orphans materially, emotionally and developmentally through sponsorships and supporting programs that bring more stability to their lives and support their education and social growth.',
        'We protect the privacy and dignity of every child at every stage of care.',
      ],
    },
    activities: {
      ar: ['الكفالة المالية', 'الدعم الغذائي', 'الدعم التعليمي', 'العيديات', 'كسوة الشتاء', 'الحقيبة المدرسية والقرطاسية'],
      en: ['Financial sponsorship', 'Food support', 'Educational support', 'Eid gifts', 'Winter clothing', 'School bags and stationery'],
    },
    images: [],
  },
];

// Development projects. Each entry gets its own page under /development/<slug>/.
export const developmentProjects = [
  {
    slug: 'tool-kits',
    title: { ar: 'مشروع حقيبة معدات', en: 'Tool Kits Project' },
    tagline: { ar: 'أدوات العمل اليوم... مصدر رزق كريم غدًا.', en: 'Today’s tools, tomorrow’s dignified livelihood.' },
    summary: {
      ar: 'تزويد أصحاب المهن بحقائب معدات تعينهم على العمل وكسب الرزق.',
      en: 'Equipping tradespeople with tool kits that help them work and earn a living.',
    },
    body: {
      ar: [
        'ضمن برنامج تفريج الكربات، يقدّم مشروع حقيبة معدات أدوات العمل لأصحاب المهن، لينتقل الدعم من سدّ الحاجة الآنية إلى فتح باب للعمل والكسب الكريم.',
        'فالحقيبة المناسبة في يد صاحب الحرفة تعني قدرة أكبر على الاعتماد على الذات وإعالة الأسرة.',
      ],
      en: [
        'Part of the Relieving Hardship program, the Tool Kits Project provides tradespeople with the equipment of their craft, so that support goes beyond meeting an immediate need and opens the way to dignified work.',
        'The right set of tools in a craftsperson’s hands means greater self-reliance and the ability to provide for a family.',
      ],
    },
    activities: {
      ar: ['حقائب عُدد يدوية', 'معدات الكهرباء', 'أدوات صحية', 'معدات الخياطة'],
      en: ['Hand-tool kits', 'Electrical equipment', 'Plumbing tools', 'Sewing equipment'],
    },
    images: ['tools-1'],
  },
];

// Association properties and facilities. Only add entries backed by clear evidence;
// never include deeds, parcel numbers, prices or other legal/financial details.
export const facilities = [
  {
    slug: 'headquarters',
    icon: 'building',
    title: { ar: 'مقر الجمعية – حسبان', en: 'Association Office – Hisban' },
    category: { ar: 'المقر والعنوان الرسمي', en: 'Office & official address' },
    summary: {
      ar: 'العنوان الرسمي للجمعية ونقطة التواصل مع المحسنين والمتطوعين والمستفيدين.',
      en: 'The association’s official address and point of contact for supporters, volunteers and beneficiaries.',
    },
  },
];

// Photo catalog: key → category (program/project slug) and bilingual alt text.
// Image sizes come from src/data/image-sizes.json (regenerate when adding photos).
export const photos = {
  'food-1': ['food-support', 'شاب يحمل طردًا غذائيًا ضمن برنامج إطعام الطعام', 'A young man carries a food parcel from the Food Support Program'],
  'food-2': ['food-support', 'تسلّم مواد غذائية ضمن برنامج إطعام الطعام', 'Receiving food supplies through the Food Support Program'],
  'food-3': ['food-support', 'فريق الجمعية خلال توزيع الطرود الغذائية', 'The association team during a food parcel distribution'],
  'food-4': ['food-support', 'فريق الجمعية يستقبل المستفيدين في يوم التوزيع', 'The association team welcoming families on distribution day'],
  'food-5': ['food-support', 'طرود غذائية جاهزة للتوزيع', 'Food parcels ready for distribution'],
  'health-1': ['shifaa-wa-amal', 'طفل يبتسم بعد تلقي العلاج ضمن برنامج شفاء وأمل', 'A smiling child after treatment through Shifaa wa Amal'],
  'health-2': ['shifaa-wa-amal', 'زيارة طفل في المستشفى ضمن برنامج شفاء وأمل', 'Visiting a young patient in hospital through Shifaa wa Amal'],
  'home-1': ['safe-home', 'منزل متهالك قبل الترميم ضمن برنامج المسكن الآمن', 'A deteriorated home before renovation under the Safe Home program'],
  'home-2': ['safe-home', 'زيارة منزل ضمن برنامج المسكن الآمن', 'A home visit under the Safe Home program'],
  'home-3': ['safe-home', 'زيارة ميدانية لمنزل إحدى الأسر', 'A field visit to a family’s home'],
  'home-4': ['safe-home', 'جولة ميدانية لفريق الجمعية بين المنازل', 'The association team on a field visit'],
  'home-5': ['safe-home', 'زيارة أسرة في منزلها ضمن برنامج المسكن الآمن', 'Visiting a family at home under the Safe Home program'],
  'relief-1': ['relieving-distress', 'كرسي متحرك مقدَّم ضمن مشروع عون', 'A wheelchair provided through the Aoun Project'],
  'relief-2': ['relieving-distress', 'مستفيدة من مشروع عون للكراسي المتحركة', 'A beneficiary of the Aoun wheelchair project'],
  'relief-3': ['relieving-distress', 'متطوع يقدّم الهدايا للأطفال', 'A volunteer handing gifts to children'],
  'relief-4': ['relieving-distress', 'أطفال مع البطانيات الشتوية المقدَّمة', 'Children with the winter blankets provided'],
  'relief-5': ['relieving-distress', 'تقديم المساعدة لإحدى المستفيدات', 'Handing assistance to a beneficiary'],
  'relief-6': ['relieving-distress', 'طفل يتسلّم هدية من الجمعية', 'A child receives a gift from the association'],
  'tools-1': ['tool-kits', 'حقائب المعدات المقدَّمة ضمن مشروع حقيبة معدات', 'Tool kits provided through the Tool Kits Project'],
};

// Gallery = every photo in the catalog.
export const gallery = Object.keys(photos);
