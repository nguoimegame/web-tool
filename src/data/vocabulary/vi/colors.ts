export interface VocabularyItem {
  word: string; // English word
  phonetic: string; // IPA pronunciation
  meaning: string; // Vietnamese meaning
}

export const vocabularyData: VocabularyItem[] = [
  // Basic colors
  { word: 'Red', phonetic: '/rɛd/', meaning: 'Đỏ' },
  { word: 'Blue', phonetic: '/bluː/', meaning: 'Xanh dương' },
  { word: 'Yellow', phonetic: '/ˈjɛləʊ/', meaning: 'Vàng' },
  { word: 'Green', phonetic: '/griːn/', meaning: 'Xanh lá cây' },
  { word: 'Orange', phonetic: '/ˈɒrɪnʤ/', meaning: 'Cam' },
  { word: 'Purple', phonetic: '/ˈpɜːpl/', meaning: 'Tím' },
  { word: 'Pink', phonetic: '/pɪŋk/', meaning: 'Hồng' },
  { word: 'Brown', phonetic: '/braʊn/', meaning: 'Nâu' },
  { word: 'Black', phonetic: '/blæk/', meaning: 'Đen' },
  { word: 'White', phonetic: '/waɪt/', meaning: 'Trắng' },
  { word: 'Gray', phonetic: '/greɪ/', meaning: 'Xám' },
  { word: 'Violet', phonetic: '/ˈvaɪəlɪt/', meaning: 'Tím violet' },

  // Shades
  { word: 'Cherry', phonetic: '/ˈʧɛri/', meaning: 'Đỏ anh đào' },
  { word: 'Bright red', phonetic: '/braɪt rɛd/', meaning: 'Đỏ sáng' },
  { word: 'Wine', phonetic: '/waɪn/', meaning: 'Đỏ rượu vang' },
  { word: 'Rosy', phonetic: '/ˈrəʊzi/', meaning: 'Đỏ hồng' },
  { word: 'Pale yellow', phonetic: '/peɪl ˈjɛləʊ/', meaning: 'Vàng nhạt' },
  { word: 'Grape', phonetic: '/greɪp/', meaning: 'Tím thẫm' },
  { word: 'Turquoise', phonetic: '/ˈtɜːkwɔɪz/', meaning: 'Lam' },
  { word: 'Light blue', phonetic: '/laɪt bluː/', meaning: 'Xanh nhạt' },
  { word: 'Navy', phonetic: '/ˈneɪvi/', meaning: 'Xanh navy' },
  { word: 'Dark blue', phonetic: '/dɑːk bluː/', meaning: 'Xanh đậm' },
  { word: 'Light green', phonetic: '/laɪt griːn/', meaning: 'Xanh lá nhạt' },
  { word: 'Dark green', phonetic: '/dɑːk griːn/', meaning: 'Xanh lá đậm' },
  { word: 'Beige', phonetic: '/beɪʒ/', meaning: 'Be' },
  { word: 'Cream', phonetic: '/kriːm/', meaning: 'Kem' },
  { word: 'Gold', phonetic: '/gəʊld/', meaning: 'Vàng kim' },
  { word: 'Silver', phonetic: '/ˈsɪlvə/', meaning: 'Bạc' },
  { word: 'Maroon', phonetic: '/məˈruːn/', meaning: 'Nâu đỏ' },
  { word: 'Coral', phonetic: '/ˈkɒrəl/', meaning: 'San hô' },
  { word: 'Ivory', phonetic: '/ˈaɪvəri/', meaning: 'Ngà' },
  { word: 'Khaki', phonetic: '/ˈkɑːki/', meaning: 'Ka ki' },
];
