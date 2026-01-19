export interface VocabularyItem {
  word: string; // English word
  phonetic: string; // IPA pronunciation
  meaning: string; // Vietnamese meaning
}

export const vocabularyData: VocabularyItem[] = [
  // General clothing
  { word: 'Casual clothes', phonetic: '/ˈkæʒjʊəl kləʊðz/', meaning: 'Quần áo thường ngày' },
  { word: 'Summer clothes', phonetic: '/ˈsʌmə kləʊðz/', meaning: 'Quần áo mùa hè' },
  { word: 'Winter clothes', phonetic: '/ˈwɪntə kləʊðz/', meaning: 'Quần áo mùa đông' },
  { word: 'Sport clothes', phonetic: '/spɔːt kləʊðz/', meaning: 'Quần áo thể thao' },
  { word: 'Uniform', phonetic: '/ˈjuːnɪfɔːm/', meaning: 'Đồng phục' },
  { word: 'Blazer', phonetic: '/ˈbleɪzə/', meaning: 'Áo khoác vest' },
  { word: 'Blouse', phonetic: '/blaʊz/', meaning: 'Áo sơ mi nữ' },
  { word: 'Bow tie', phonetic: '/ˌbəʊ ˈtaɪ/', meaning: 'Nơ thắt cổ' },
  { word: 'Cardigan', phonetic: '/ˈkɑːdɪgən/', meaning: 'Áo len cài trước' },
  { word: 'Coat', phonetic: '/kəʊt/', meaning: 'Áo khoác' },
  { word: 'Dress', phonetic: '/drɛs/', meaning: 'Váy liền' },
  { word: 'Jacket', phonetic: '/ˈʤækɪt/', meaning: 'Áo khoác ngắn' },
  { word: 'Jeans', phonetic: '/ʤiːnz/', meaning: 'Quần bò' },
  { word: 'Jumper', phonetic: '/ˈʤʌmpə/', meaning: 'Áo len' },
  { word: 'Miniskirt', phonetic: '/ˈmɪnɪskɜːt/', meaning: 'Váy ngắn' },
  { word: 'Overcoat', phonetic: '/ˈəʊvəkəʊt/', meaning: 'Áo măng tô' },
  { word: 'Pants', phonetic: '/pænts/', meaning: 'Quần Âu' },
  { word: 'Pullover', phonetic: '/ˈpʊləʊvə/', meaning: 'Áo len chui đầu' },
  { word: 'Pyjamas', phonetic: '/pəˈʤɑːməz/', meaning: 'Bộ đồ ngủ' },
  { word: 'Raincoat', phonetic: '/ˈreɪnkəʊt/', meaning: 'Áo mưa' },
  { word: 'Scarf', phonetic: '/skɑːf/', meaning: 'Khăn quàng' },
  { word: 'Shirt', phonetic: '/ʃɜːt/', meaning: 'Áo sơ mi' },
  { word: 'Shorts', phonetic: '/ʃɔːts/', meaning: 'Quần soóc' },
  { word: 'Skirt', phonetic: '/skɜːt/', meaning: 'Chân váy' },
  { word: 'Suit', phonetic: '/sjuːt/', meaning: 'Bộ com lê' },
  { word: 'Sweater', phonetic: '/ˈswɛtə/', meaning: 'Áo len' },
  { word: 'T-shirt', phonetic: '/ˈtiːʃɜːt/', meaning: 'Áo phông' },
  { word: 'Trousers', phonetic: '/ˈtraʊzəz/', meaning: 'Quần dài' },
  { word: 'Tie', phonetic: '/taɪ/', meaning: 'Cà vạt' },
  { word: 'Tuxedo', phonetic: '/tʌkˈsiːdəʊ/', meaning: 'Áo mốc-kinh' },

  // Shoes
  { word: 'Boots', phonetic: '/buːts/', meaning: 'Bốt' },
  { word: 'Sandals', phonetic: '/ˈsændlz/', meaning: 'Dép xăng đan' },
  { word: 'Slippers', phonetic: '/ˈslɪpəz/', meaning: 'Dép đi trong nhà' },
  { word: 'Sneakers', phonetic: '/ˈsniːkəz/', meaning: 'Giày thể thao' },
  { word: 'Stilettos', phonetic: '/stɪˈlɛtəʊz/', meaning: 'Giày gót nhọn' },
  { word: 'Loafer', phonetic: '/ˈləʊfə/', meaning: 'Giày lười' },

  // Hats
  { word: 'Baseball cap', phonetic: '/ˈbeɪsbɔːl kæp/', meaning: 'Nón lưỡi trai' },
  { word: 'Beret', phonetic: '/ˈbɛreɪ/', meaning: 'Mũ nồi' },
  { word: 'Hat', phonetic: '/hæt/', meaning: 'Mũ' },
  { word: 'Helmet', phonetic: '/ˈhɛlmɪt/', meaning: 'Mũ bảo hiểm' },

  // Accessories
  { word: 'Belt', phonetic: '/bɛlt/', meaning: 'Thắt lưng' },
  { word: 'Bracelet', phonetic: '/ˈbreɪslɪt/', meaning: 'Vòng tay' },
  { word: 'Earring', phonetic: '/ˈɪərɪŋ/', meaning: 'Khuyên tai' },
  { word: 'Glasses', phonetic: '/ˈglɑːsɪz/', meaning: 'Kính mắt' },
  { word: 'Gloves', phonetic: '/glʌvz/', meaning: 'Găng tay' },
  { word: 'Handbag', phonetic: '/ˈhændbæg/', meaning: 'Túi xách' },
  { word: 'Necklace', phonetic: '/ˈnɛklɪs/', meaning: 'Vòng cổ' },
  { word: 'Ring', phonetic: '/rɪŋ/', meaning: 'Nhẫn' },
  { word: 'Sunglasses', phonetic: '/ˈsʌnˌglɑːsɪz/', meaning: 'Kính râm' },
  { word: 'Wallet', phonetic: '/ˈwɒlɪt/', meaning: 'Ví' },
  { word: 'Watch', phonetic: '/wɒʧ/', meaning: 'Đồng hồ' },
  { word: 'Socks', phonetic: '/sɒks/', meaning: 'Tất' },

  // Underwear
  { word: 'Underwear', phonetic: '/ˈʌndəweə/', meaning: 'Đồ lót' },
  { word: 'Bra', phonetic: '/brɑː/', meaning: 'Áo lót' },
  { word: 'Panties', phonetic: '/ˈpæntiz/', meaning: 'Quần lót nữ' },
  { word: 'Briefs', phonetic: '/briːfs/', meaning: 'Quần lót nam' },
];
