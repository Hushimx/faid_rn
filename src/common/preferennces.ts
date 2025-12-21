const PREFERENCES = [
  {
    section: {
      name_ar: 'أسلوب الحياة',
      name_en: 'Lifestyle',
    },
    data: [
      {
        title: {
          name_ar: 'تكرار الخروج',
          name_en: 'Going out frequency',
        },
        options: [
          {
            name_ar: 'مرة إلى مرتين شهرياً',
            name_en: '1-2x/month',
            value: '1-2x_month',
          },
          {
            name_ar: 'أسبوعياً',
            name_en: 'Weekly',
            value: 'weekly',
          },
          {
            name_ar: 'من 2 إلى 3 مرات أسبوعياً',
            name_en: '2-3x/week',
            value: '2-3x_week',
          },
          {
            name_ar: 'يومياً',
            name_en: 'Daily',
            value: 'daily',
          },
        ],
      },
      {
        title: {
          name_ar: 'الإيقاع',
          name_en: 'Pace',
        },
        options: [
          {
            name_ar: 'هادئ',
            name_en: 'Relaxed',
            value: 'relaxed',
          },
          {
            name_ar: 'متوازن',
            name_en: 'Balanced',
            value: 'balanced',
          },
          {
            name_ar: 'مزدحم',
            name_en: 'Packed',
            value: 'packed',
          },
        ],
      },
      {
        title: {
          name_ar: 'مستوى السعر',
          name_en: 'Price level',
        },
        options: [
          {
            name_ar: 'قيمة',
            name_en: 'Value',
            value: 'value',
          },
          {
            name_ar: 'متوسط',
            name_en: 'Mid',
            value: 'mid',
          },
          {
            name_ar: 'فاخر',
            name_en: 'Premium',
            value: 'premium',
          },
        ],
      },
      {
        title: {
          name_ar: 'تركيز الجو (اختر حتى 3)',
          name_en: 'Vibe focus (pick up to 3)',
        },
        options: [
          {
            name_ar: 'طعام',
            name_en: 'Food',
            value: 'food',
          },
          {
            name_ar: 'ثقافة',
            name_en: 'Culture',
            value: 'culture',
          },
          {
            name_ar: 'طبيعة/في الهواء الطلق',
            name_en: 'Nature/Outdoors',
            value: 'nature_outdoors',
          },
          {
            name_ar: 'حياة ليلية',
            name_en: 'Nightlife',
            value: 'nightlife',
          },
          {
            name_ar: 'تسوق',
            name_en: 'Shopping',
            value: 'shopping',
          },
          {
            name_ar: 'صحة وعافية',
            name_en: 'Wellness',
            value: 'wellness',
          },
          {
            name_ar: 'رياضة',
            name_en: 'Sports',
            value: 'sports',
          },
          {
            name_ar: 'مناسب للعائلات',
            name_en: 'Family-friendly',
            value: 'family_friendly',
          },
        ],
        max_selections: 3,
      },
    ],
  },

  {
    section: {
      name_ar: 'الطعام والنظام الغذائي',
      name_en: 'Food & Dietary',
    },
    data: [
      {
        title: {
          name_ar: 'القواعد الغذائية',
          name_en: 'Dietary rules',
        },
        options: [
          {
            name_ar: 'حلال',
            name_en: 'Halal',
            value: 'halal',
          },
          {
            name_ar: 'نباتي',
            name_en: 'Vegetarian',
            value: 'vegetarian',
          },
          {
            name_ar: 'نباتي صارم',
            name_en: 'Vegan',
            value: 'vegan',
          },
          {
            name_ar: 'بدون لحم خنزير',
            name_en: 'No pork',
            value: 'no_pork',
          },
          {
            name_ar: 'بدون كحول',
            name_en: 'No alcohol',
            value: 'no_alcohol',
          },
          {
            name_ar: 'خالي من الغلوتين',
            name_en: 'Gluten-free',
            value: 'gluten_free',
          },
          {
            name_ar: 'خالي من الألبان',
            name_en: 'Dairy-free',
            value: 'dairy_free',
          },
          {
            name_ar: 'خالي من المكسرات',
            name_en: 'Nut-free',
            value: 'nut_free',
          },
        ],
      },
      {
        title: {
          name_ar: 'المطابخ التي تفضلها',
          name_en: 'Cuisines you like',
        },
        options: [
          {
            name_ar: 'عربي/شرق أوسطي',
            name_en: 'Arabic/Middle Eastern',
            value: 'arabic_middle_eastern',
          },
          {
            name_ar: 'هندي',
            name_en: 'Indian',
            value: 'indian',
          },
          {
            name_ar: 'ياباني',
            name_en: 'Japanese',
            value: 'japanese',
          },
          {
            name_ar: 'إيطالي',
            name_en: 'Italian',
            value: 'italian',
          },
          {
            name_ar: 'تركي',
            name_en: 'Turkish',
            value: 'turkish',
          },
          {
            name_ar: 'تايلاندي',
            name_en: 'Thai',
            value: 'thai',
          },
          {
            name_ar: 'مكسيكي',
            name_en: 'Mexican',
            value: 'mexican',
          },
          {
            name_ar: 'صيني',
            name_en: 'Chinese',
            value: 'chinese',
          },
          {
            name_ar: 'كوري',
            name_en: 'Korean',
            value: 'korean',
          },
          {
            name_ar: 'أمريكي/مشويات',
            name_en: 'American/Grill',
            value: 'american_grill',
          },
          {
            name_ar: 'مأكولات بحرية',
            name_en: 'Seafood',
            value: 'seafood',
          },
          {
            name_ar: 'متوسطي',
            name_en: 'Mediterranean',
            value: 'mediterranean',
          },
          {
            name_ar: 'أكل الشارع',
            name_en: 'Street food',
            value: 'street_food',
          },
        ],
      },
      {
        title: {
          name_ar: 'أسلوب تناول الطعام',
          name_en: 'Eating style',
        },
        options: [
          {
            name_ar: 'سريع ورخيص',
            name_en: 'Quick & cheap',
            value: 'quick_cheap',
          },
          {
            name_ar: 'جلوس عادي',
            name_en: 'Casual sit-down',
            value: 'casual_sit_down',
          },
          {
            name_ar: 'راقي',
            name_en: 'Upscale',
            value: 'upscale',
          },
        ],
      },
    ],
  },

  {
    section: {
      name_ar: 'الوصول والراحة',
      name_en: 'Accessibility & Comfort',
    },
    data: [
      {
        title: {
          name_ar: 'احتياجات التنقل',
          name_en: 'Mobility needs',
        },
        options: [
          {
            name_ar: 'وصول كرسي متحرك',
            name_en: 'Wheelchair access',
            value: 'wheelchair_access',
          },
          {
            name_ar: 'قليل من الدرج',
            name_en: 'Few stairs',
            value: 'few_stairs',
          },
          {
            name_ar: 'مسافات قصيرة',
            name_en: 'Short walks',
            value: 'short_walks',
          },
          {
            name_ar: 'مصعد مطلوب',
            name_en: 'Elevator needed',
            value: 'elevator_needed',
          },
        ],
      },
      {
        title: {
          name_ar: 'احتياجات الراحة',
          name_en: 'Comfort needs',
        },
        options: [
          {
            name_ar: 'أماكن هادئة',
            name_en: 'Quiet places',
            value: 'quiet_places',
          },
          {
            name_ar: 'ظل/تكييف مفضل',
            name_en: 'Shade/AC preferred',
            value: 'shade_ac_preferred',
          },
          {
            name_ar: 'مناطق لغير المدخنين',
            name_en: 'Non-smoking areas',
            value: 'non_smoking_areas',
          },
        ],
      },
      {
        title: {
          name_ar: 'مسافة المشي',
          name_en: 'Walking distance',
        },
        options: [
          {
            name_ar: 'قصير (أقل من 10 دقائق)',
            name_en: 'Short (<10 min)',
            value: 'short_walk',
          },
          {
            name_ar: 'متوسط (10-25 دقيقة)',
            name_en: 'Medium (10-25 min)',
            value: 'medium_walk',
          },
          {
            name_ar: 'طويل (أكثر من 25 دقيقة)',
            name_en: 'Long (25+ min)',
            value: 'long_walk',
          },
        ],
      },
      {
        title: {
          name_ar: 'مستوى الزحام',
          name_en: 'Crowd level',
        },
        options: [
          {
            name_ar: 'تجنب الزحام',
            name_en: 'Avoid crowds',
            value: 'avoid_crowds',
          },
          {
            name_ar: 'الزحام المعتدل مقبول',
            name_en: 'Some crowds OK',
            value: 'some_crowds_ok',
          },
          {
            name_ar: 'لا يمانع الزحام',
            name_en: "Don't mind crowds",
            value: 'dont_mind_crowds',
          },
        ],
      },
    ],
  },

  {
    section: {
      name_ar: 'الرفقاء',
      name_en: 'Companions',
    },
    data: [
      {
        title: {
          name_ar: 'مع من تخرج؟',
          name_en: 'Who do you go out with?',
        },
        options: [
          {
            name_ar: 'بمفردي',
            name_en: 'Solo',
            value: 'solo',
          },
          {
            name_ar: 'مع الشريك',
            name_en: 'Partner',
            value: 'partner',
          },
          {
            name_ar: 'مع الأصدقاء',
            name_en: 'Friends',
            value: 'friends',
          },
          {
            name_ar: 'مع الأطفال',
            name_en: 'Kids',
            value: 'kids',
          },
          {
            name_ar: 'مع الوالدين',
            name_en: 'Parents',
            value: 'parents',
          },
          {
            name_ar: 'مع الزملاء',
            name_en: 'Colleagues',
            value: 'colleagues',
          },
        ],
      },
    ],
  },
  {
    section: {
      name_ar: 'عادات السفر',
      name_en: 'Travel Habits',
    },
    data: [
      {
        title: {
          name_ar: 'أنماط الرحلات',
          name_en: 'Trip styles',
        },
        options: [
          {
            name_ar: 'عطلات نهاية الأسبوع',
            name_en: 'Weekend breaks',
            value: 'weekend_breaks',
          },
          {
            name_ar: 'زيارات المدن',
            name_en: 'City visits',
            value: 'city_visits',
          },
          {
            name_ar: 'رحلات طبيعية',
            name_en: 'Nature trips',
            value: 'nature_trips',
          },
          {
            name_ar: 'إقامات على الشاطئ',
            name_en: 'Beach stays',
            value: 'beach_stays',
          },
          {
            name_ar: 'رحلات برية',
            name_en: 'Road trips',
            value: 'road_trips',
          },
          {
            name_ar: 'إقامات طويلة/العمل من أي مكان',
            name_en: 'Long stays/Work anywhere',
            value: 'long_stays_work_anywhere',
          },
        ],
      },
      {
        title: {
          name_ar: 'تفضيلات النقل',
          name_en: 'Transport preference',
        },
        options: [
          {
            name_ar: 'أفضل وسائل النقل العامة',
            name_en: 'Prefer public transport',
            value: 'prefer_public_transport',
          },
          {
            name_ar: 'أفضل الركوب/التاكسي',
            name_en: 'Prefer ride-hail/taxi',
            value: 'prefer_ride_hail_taxi',
          },
          {
            name_ar: 'أفضل القيادة/الإيجار',
            name_en: 'Prefer driving/rental',
            value: 'prefer_driving_rental',
          },
        ],
      },
      {
        title: {
          name_ar: 'الطقس الذي تستمتع به',
          name_en: 'Weather you enjoy',
        },
        options: [
          {
            name_ar: 'دافئ',
            name_en: 'Warm',
            value: 'warm',
          },
          {
            name_ar: 'معتدل',
            name_en: 'Mild',
            value: 'mild',
          },
          {
            name_ar: 'بارد',
            name_en: 'Cold',
            value: 'cold',
          },
          {
            name_ar: 'ثلجي',
            name_en: 'Snow',
            value: 'snow',
          },
          {
            name_ar: 'استوائي',
            name_en: 'Tropical',
            value: 'tropical',
          },
          {
            name_ar: 'جاف',
            name_en: 'Dry',
            value: 'dry',
          },
        ],
      },
    ],
  },

  {
    section: {
      name_ar: 'الإقامة',
      name_en: 'Stays (accommodation)',
    },
    data: [
      {
        title: {
          name_ar: 'أنواع الإقامة',
          name_en: 'Stay types',
        },
        options: [
          {
            name_ar: 'فندق',
            name_en: 'Hotel',
            value: 'hotel',
          },
          {
            name_ar: 'شقة/ستوديو',
            name_en: 'Apartment/Flat',
            value: 'apartment_flat',
          },
          {
            name_ar: 'بيت ضيافة/هوستل',
            name_en: 'Guesthouse/Hostel',
            value: 'guesthouse_hostel',
          },
          {
            name_ar: 'منتجع',
            name_en: 'Resort',
            value: 'resort',
          },
        ],
      },
      {
        title: {
          name_ar: 'احتياجات الغرفة',
          name_en: 'Room needs',
        },
        options: [
          {
            name_ar: 'غرفة هادئة',
            name_en: 'Quiet room',
            value: 'quiet_room',
          },
          {
            name_ar: 'غرفة لغير المدخنين',
            name_en: 'Non-smoking room',
            value: 'non_smoking_room',
          },
          {
            name_ar: 'مطبخ/مطبخ صغير',
            name_en: 'Kitchen/Kitchenette',
            value: 'kitchen_kitchenette',
          },
          {
            name_ar: 'تكييف هواء',
            name_en: 'Air conditioning',
            value: 'air_conditioning',
          },
          {
            name_ar: 'واي فاي جيد',
            name_en: 'Good Wi-Fi',
            value: 'good_wifi',
          },
          {
            name_ar: 'إفطار مشمول',
            name_en: 'Breakfast included',
            value: 'breakfast_included',
          },
          {
            name_ar: 'تسجيل دخول متأخر مقبول',
            name_en: 'Late check-in OK',
            value: 'late_checkin_ok',
          },
        ],
      },
    ],
  },
  {
    section: {
      name_ar: 'الرحلات الجوية',
      name_en: 'Flights',
    },
    data: [
      {
        title: {
          name_ar: 'درجة المقصورة',
          name_en: 'Cabin class',
        },
        options: [
          {
            name_ar: 'اقتصادية',
            name_en: 'Economy',
            value: 'economy',
          },
          {
            name_ar: 'اقتصادية مميزة',
            name_en: 'Premium economy',
            value: 'premium_economy',
          },
          {
            name_ar: 'درجة رجال الأعمال',
            name_en: 'Business',
            value: 'business',
          },
        ],
      },
      {
        title: {
          name_ar: 'تفضيل المقعد',
          name_en: 'Seat preference',
        },
        options: [
          {
            name_ar: 'بجانب النافذة',
            name_en: 'Window',
            value: 'window',
          },
          {
            name_ar: 'بجانب الممر',
            name_en: 'Aisle',
            value: 'aisle',
          },
          {
            name_ar: 'لا تفضيل',
            name_en: 'No preference',
            value: 'no_preference',
          },
        ],
      },
      {
        title: {
          name_ar: 'التوقف الليلي',
          name_en: 'Overnight layovers',
        },
        options: [
          {
            name_ar: 'تجنب',
            name_en: 'Avoid',
            value: 'avoid',
          },
          {
            name_ar: 'مقبول',
            name_en: 'OK',
            value: 'ok',
          },
        ],
      },
    ],
  },
  {
    section: {
      name_ar: 'الاهتمامات',
      name_en: 'Interests',
    },
    data: [
      {
        title: {
          name_ar: 'ما الذي يثير اهتمامك؟ (اختر ما تشاء)',
          name_en: 'What interests you? (choose as many as you like)',
        },
        options: [
          {
            name_ar: 'متاحف',
            name_en: 'Museums',
            value: 'museums',
          },
          {
            name_ar: 'مواقع تاريخية',
            name_en: 'Historic sites',
            value: 'historic_sites',
          },
          {
            name_ar: 'أسواق محلية',
            name_en: 'Local markets',
            value: 'local_markets',
          },
          {
            name_ar: 'أكل الشارع',
            name_en: 'Street food',
            value: 'street_food',
          },
          {
            name_ar: 'مقاهي',
            name_en: 'Cafés',
            value: 'cafes',
          },
          {
            name_ar: 'تناول طعام فاخر',
            name_en: 'Fine dining',
            value: 'fine_dining',
          },
          {
            name_ar: 'تسلق الجبال/المشي',
            name_en: 'Hiking',
            value: 'hiking',
          },
          {
            name_ar: 'حدائق',
            name_en: 'Parks',
            value: 'parks',
          },
          {
            name_ar: 'شواطئ',
            name_en: 'Beaches',
            value: 'beaches',
          },
          {
            name_ar: 'أنشطة مائية',
            name_en: 'Water activities',
            value: 'water_activities',
          },
          {
            name_ar: 'تزلج/ثلج',
            name_en: 'Ski/Snow',
            value: 'ski_snow',
          },
          {
            name_ar: 'موسيقى حية',
            name_en: 'Live music',
            value: 'live_music',
          },
          {
            name_ar: 'مهرجانات',
            name_en: 'Festivals',
            value: 'festivals',
          },
          {
            name_ar: 'مباريات رياضية',
            name_en: 'Sports games',
            value: 'sports_games',
          },
          {
            name_ar: 'مدن ملاهي',
            name_en: 'Theme parks',
            value: 'theme_parks',
          },
          {
            name_ar: 'صحة ومنتجعات',
            name_en: 'Wellness/Spa',
            value: 'wellness_spa',
          },
        ],
      },
    ],
  },
];

export default PREFERENCES;
