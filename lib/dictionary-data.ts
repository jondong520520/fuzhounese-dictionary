export interface DictionaryEntry {
  id: string
  fuzhounese: string
  romanization: string
  chinese: string
  english: string
  category: string
  audioUrl?: string
  examples?: {
    fuzhounese: string
    romanization: string
    english: string
  }[]
}

export const categories = [
  { id: 'all', label: 'All Words', icon: '📚' },
  { id: 'greetings', label: 'Greetings', icon: '👋' },
  { id: 'food', label: 'Food & Drink', icon: '🍜' },
  { id: 'family', label: 'Family', icon: '👨‍👩‍👧' },
  { id: 'numbers', label: 'Numbers', icon: '🔢' },
  { id: 'daily', label: 'Daily Life', icon: '☀️' },
]

export const dictionaryEntries: DictionaryEntry[] = [
  {
    id: '1',
    fuzhounese: '汝好',
    romanization: 'nṳ̄ hō̤',
    chinese: '你好',
    english: 'Hello',
    category: 'greetings',
    examples: [
      {
        fuzhounese: '汝好，食罢未？',
        romanization: 'Nṳ̄ hō̤, siăh bà muôi?',
        english: 'Hello, have you eaten?'
      }
    ]
  },
  {
    id: '2',
    fuzhounese: '多謝',
    romanization: 'dŏ̤-ciâ',
    chinese: '謝謝',
    english: 'Thank you',
    category: 'greetings',
    examples: [
      {
        fuzhounese: '多謝汝幫助我',
        romanization: 'Dŏ̤-ciâ nṳ̄ bŏng-cô̤ nguāi',
        english: 'Thank you for helping me'
      }
    ]
  },
  {
    id: '3',
    fuzhounese: '再見',
    romanization: 'cái-gióng',
    chinese: '再見',
    english: 'Goodbye',
    category: 'greetings',
  },
  {
    id: '4',
    fuzhounese: '食飯',
    romanization: 'siăh buông',
    chinese: '吃飯',
    english: 'To eat rice / To have a meal',
    category: 'food',
    examples: [
      {
        fuzhounese: '阮去食飯',
        romanization: 'Nguāng kó̤ siăh buông',
        english: "Let's go eat"
      }
    ]
  },
  {
    id: '5',
    fuzhounese: '茶',
    romanization: 'dà',
    chinese: '茶',
    english: 'Tea',
    category: 'food',
  },
  {
    id: '6',
    fuzhounese: '魚丸',
    romanization: 'ngṳ̀-uòng',
    chinese: '魚丸',
    english: 'Fish ball',
    category: 'food',
  },
  {
    id: '7',
    fuzhounese: '肉燕',
    romanization: 'nṳ̆k-iéng',
    chinese: '肉燕',
    english: 'Meat swallow (Fuzhou dumpling)',
    category: 'food',
  },
  {
    id: '8',
    fuzhounese: '阿爸',
    romanization: 'ā-bà',
    chinese: '爸爸',
    english: 'Father',
    category: 'family',
  },
  {
    id: '9',
    fuzhounese: '阿母',
    romanization: 'ā-mū',
    chinese: '媽媽',
    english: 'Mother',
    category: 'family',
  },
  {
    id: '10',
    fuzhounese: '阿公',
    romanization: 'ā-gŭng',
    chinese: '爺爺',
    english: 'Grandfather (paternal)',
    category: 'family',
  },
  {
    id: '11',
    fuzhounese: '阿嬤',
    romanization: 'ā-mà',
    chinese: '奶奶',
    english: 'Grandmother (paternal)',
    category: 'family',
  },
  {
    id: '12',
    fuzhounese: '一',
    romanization: 'siŏh',
    chinese: '一',
    english: 'One',
    category: 'numbers',
  },
  {
    id: '13',
    fuzhounese: '二',
    romanization: 'nêng',
    chinese: '二',
    english: 'Two',
    category: 'numbers',
  },
  {
    id: '14',
    fuzhounese: '三',
    romanization: 'săng',
    chinese: '三',
    english: 'Three',
    category: 'numbers',
  },
  {
    id: '15',
    fuzhounese: '四',
    romanization: 'sé',
    chinese: '四',
    english: 'Four',
    category: 'numbers',
  },
  {
    id: '16',
    fuzhounese: '五',
    romanization: 'ngô̤',
    chinese: '五',
    english: 'Five',
    category: 'numbers',
  },
  {
    id: '17',
    fuzhounese: '好',
    romanization: 'hō̤',
    chinese: '好',
    english: 'Good',
    category: 'daily',
  },
  {
    id: '18',
    fuzhounese: '𣍐好',
    romanization: 'mò̤-hō̤',
    chinese: '不好',
    english: 'Not good / Bad',
    category: 'daily',
  },
  {
    id: '19',
    fuzhounese: '水',
    romanization: 'cūi',
    chinese: '水',
    english: 'Water',
    category: 'daily',
  },
  {
    id: '20',
    fuzhounese: '厝',
    romanization: 'chió',
    chinese: '家/房子',
    english: 'Home / House',
    category: 'daily',
    examples: [
      {
        fuzhounese: '我轉厝去',
        romanization: 'Nguāi duōng chió kó̤',
        english: "I'm going home"
      }
    ]
  },
]
