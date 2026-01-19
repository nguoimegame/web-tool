export interface VocabularyItem {
  word: string;
  phonetic: string;
  meaning: string;
}

export const vocabularyData: VocabularyItem[] = [
  // Meat
  { word: 'Meat', phonetic: '/miːt/', meaning: 'Thịt' },
  { word: 'Pork', phonetic: '/pɔːk/', meaning: 'Thịt heo' },
  { word: 'Beef', phonetic: '/biːf/', meaning: 'Thịt bò' },
  { word: 'Chicken', phonetic: '/ˈʧɪkɪn/', meaning: 'Thịt gà' },
  { word: 'Lamb', phonetic: '/læm/', meaning: 'Thịt cừu' },
  { word: 'Bacon', phonetic: '/ˈbeɪkən/', meaning: 'Thịt xông khói' },
  { word: 'Ham', phonetic: '/hæm/', meaning: 'Giăm bông' },
  { word: 'Sausage', phonetic: '/ˈsɒsɪʤ/', meaning: 'Xúc xích' },

  // Seafood
  { word: 'Fish', phonetic: '/fɪʃ/', meaning: 'Cá' },
  { word: 'Shrimp', phonetic: '/ʃrɪmp/', meaning: 'Tôm' },
  { word: 'Crab', phonetic: '/kræb/', meaning: 'Cua' },
  { word: 'Lobster', phonetic: '/ˈlɒbstə/', meaning: 'Tôm hùm' },
  { word: 'Squid', phonetic: '/skwɪd/', meaning: 'Mực' },
  { word: 'Oyster', phonetic: '/ˈɔɪstə/', meaning: 'Hàu' },
  { word: 'Salmon', phonetic: '/ˈsæmən/', meaning: 'Cá hồi' },
  { word: 'Tuna', phonetic: '/ˈtjuːnə/', meaning: 'Cá ngừ' },

  // Dairy
  { word: 'Milk', phonetic: '/mɪlk/', meaning: 'Sữa' },
  { word: 'Cheese', phonetic: '/ʧiːz/', meaning: 'Phô mai' },
  { word: 'Butter', phonetic: '/ˈbʌtə/', meaning: 'Bơ' },
  { word: 'Cream', phonetic: '/kriːm/', meaning: 'Kem' },
  { word: 'Yogurt', phonetic: '/ˈjɒgət/', meaning: 'Sữa chua' },

  // Grains
  { word: 'Rice', phonetic: '/raɪs/', meaning: 'Gạo' },
  { word: 'Bread', phonetic: '/brɛd/', meaning: 'Bánh mì' },
  { word: 'Noodles', phonetic: '/ˈnuːdlz/', meaning: 'Mì' },
  { word: 'Pasta', phonetic: '/ˈpæstə/', meaning: 'Mì Ý' },
  { word: 'Cereal', phonetic: '/ˈsɪərɪəl/', meaning: 'Ngũ cốc' },

  // Other
  { word: 'Egg', phonetic: '/ɛg/', meaning: 'Trứng' },
  { word: 'Tofu', phonetic: '/ˈtəʊfuː/', meaning: 'Đậu phụ' },
  { word: 'Soup', phonetic: '/suːp/', meaning: 'Súp' },
  { word: 'Salad', phonetic: '/ˈsæləd/', meaning: 'Salad' },
  { word: 'Sandwich', phonetic: '/ˈsænwɪʤ/', meaning: 'Bánh sandwich' },
];
