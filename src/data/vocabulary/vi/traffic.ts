export interface VocabularyItem {
  word: string; // English word
  phonetic: string; // IPA pronunciation
  meaning: string; // Vietnamese meaning
}

export const vocabularyData: VocabularyItem[] = [
  // Public transport
  { word: 'Bus', phonetic: '/bʌs/', meaning: 'Xe buýt' },
  { word: 'Subway', phonetic: '/ˈsʌbweɪ/', meaning: 'Tàu điện ngầm' },
  { word: 'High-speed train', phonetic: '/haɪ spiːd treɪn/', meaning: 'Tàu cao tốc' },
  { word: 'Train', phonetic: '/treɪn/', meaning: 'Tàu hỏa' },
  { word: 'Coach', phonetic: '/kəʊʧ/', meaning: 'Xe khách' },
  { word: 'Taxi', phonetic: '/ˈtæksi/', meaning: 'Xe taxi' },

  // Road vehicles
  { word: 'Bicycle', phonetic: '/ˈbaɪsɪkl/', meaning: 'Xe đạp' },
  { word: 'Motorbike', phonetic: '/ˈməʊtəbaɪk/', meaning: 'Xe máy' },
  { word: 'Scooter', phonetic: '/ˈskuːtə/', meaning: 'Xe tay ga' },
  { word: 'Truck', phonetic: '/trʌk/', meaning: 'Xe tải' },
  { word: 'Car', phonetic: '/kɑː/', meaning: 'Ô tô' },
  { word: 'Van', phonetic: '/væn/', meaning: 'Xe tải nhỏ' },

  // Air transport
  { word: 'Airplane', phonetic: '/ˈeəpleɪn/', meaning: 'Máy bay' },
  { word: 'Helicopter', phonetic: '/ˈhɛlɪkɒptə/', meaning: 'Trực thăng' },
  { word: 'Jet', phonetic: '/ʤɛt/', meaning: 'Máy bay phản lực' },
  { word: 'Airport', phonetic: '/ˈeəpɔːt/', meaning: 'Sân bay' },
  { word: 'Pilot', phonetic: '/ˈpaɪlət/', meaning: 'Phi công' },
  { word: 'Takeoff', phonetic: '/ˈteɪkɒf/', meaning: 'Cất cánh' },
  { word: 'Landing', phonetic: '/ˈlændɪŋ/', meaning: 'Hạ cánh' },

  // Water transport
  { word: 'Boat', phonetic: '/bəʊt/', meaning: 'Thuyền' },
  { word: 'Cruise ship', phonetic: '/kruːz ʃɪp/', meaning: 'Tàu du lịch' },
  { word: 'Sailboat', phonetic: '/ˈseɪlbəʊt/', meaning: 'Thuyền buồm' },
  { word: 'Ship', phonetic: '/ʃɪp/', meaning: 'Tàu thủy' },
  { word: 'Ferry', phonetic: '/ˈfɛri/', meaning: 'Phà' },

  // Road terms
  { word: 'Highway', phonetic: '/ˈhaɪweɪ/', meaning: 'Đường cao tốc' },
  { word: 'Motorway', phonetic: '/ˈməʊtəweɪ/', meaning: 'Xa lộ' },
  { word: 'Road', phonetic: '/rəʊd/', meaning: 'Đường' },
  { word: 'Traffic', phonetic: '/ˈtræfɪk/', meaning: 'Giao thông' },
  { word: 'Traffic jam', phonetic: '/ˈtræfɪk ʤæm/', meaning: 'Tắc đường' },
  { word: 'Traffic light', phonetic: '/ˈtræfɪk laɪt/', meaning: 'Đèn giao thông' },
  { word: 'Pedestrian crossing', phonetic: '/pɪˈdɛstrɪən ˈkrɒsɪŋ/', meaning: 'Vạch qua đường' },
  { word: 'Roundabout', phonetic: '/ˈraʊndəbaʊt/', meaning: 'Bùng binh' },
  { word: 'Intersection', phonetic: '/ˌɪntəˈsɛkʃən/', meaning: 'Giao lộ' },
  { word: 'Sidewalk', phonetic: '/ˈsaɪdwɔːk/', meaning: 'Vỉa hè' },
  { word: 'Crosswalk', phonetic: '/ˈkrɒswɔːk/', meaning: 'Đường người đi bộ' },
];
