export interface VocabularyItem {
  word: string; // English word
  phonetic: string; // IPA pronunciation
  meaning: string; // Vietnamese meaning
}

export const vocabularyData: VocabularyItem[] = [
  // Positive traits
  { word: 'Confident', phonetic: '/ˈkɒnfɪdənt/', meaning: 'Tự tin' },
  { word: 'Determined', phonetic: '/dɪˈtɜːmɪnd/', meaning: 'Quyết đoán' },
  { word: 'Ambitious', phonetic: '/æmˈbɪʃəs/', meaning: 'Tham vọng' },
  { word: 'Reliable', phonetic: '/rɪˈlaɪəbl/', meaning: 'Đáng tin cậy' },
  { word: 'Calm', phonetic: '/kɑːm/', meaning: 'Điềm tĩnh' },
  { word: 'Brainy', phonetic: '/ˈbreɪni/', meaning: 'Thông minh' },
  { word: 'Witty', phonetic: '/ˈwɪti/', meaning: 'Dí dỏm' },
  { word: 'Sensible', phonetic: '/ˈsɛnsəbl/', meaning: 'Nhạy cảm' },
  { word: 'Adventurous', phonetic: '/ədˈvɛnʧərəs/', meaning: 'Thích mạo hiểm' },
  { word: 'Modest', phonetic: '/ˈmɒdɪst/', meaning: 'Khiêm tốn' },
  { word: 'Honest', phonetic: '/ˈɒnɪst/', meaning: 'Chân thành' },
  { word: 'Polite', phonetic: '/pəˈlaɪt/', meaning: 'Lịch sự' },
  { word: 'Friendly', phonetic: '/ˈfrɛndli/', meaning: 'Thân thiện' },
  { word: 'Easy-going', phonetic: '/ˌiːzi ˈgəʊɪŋ/', meaning: 'Dễ tính' },
  { word: 'Outgoing', phonetic: '/ˌaʊtˈgəʊɪŋ/', meaning: 'Cởi mở' },
  { word: 'Sociable', phonetic: '/ˈsəʊʃəbl/', meaning: 'Hòa đồng' },
  { word: 'Carefree', phonetic: '/ˈkeəfriː/', meaning: 'Vô tư' },
  { word: 'Generous', phonetic: '/ˈʤɛnərəs/', meaning: 'Hào phóng' },
  { word: 'Thoughtful', phonetic: '/ˈθɔːtfʊl/', meaning: 'Chu đáo' },
  { word: 'Kind', phonetic: '/kaɪnd/', meaning: 'Tử tế' },

  // Negative traits
  { word: 'Shy', phonetic: '/ʃaɪ/', meaning: 'Nhút nhát' },
  { word: 'Talkative', phonetic: '/ˈtɔːkətɪv/', meaning: 'Nói nhiều' },
  { word: 'Arrogant', phonetic: '/ˈærəgənt/', meaning: 'Kiêu căng' },
  { word: 'Strict', phonetic: '/strɪkt/', meaning: 'Nghiêm khắc' },
  { word: 'Selfish', phonetic: '/ˈsɛlfɪʃ/', meaning: 'Ích kỷ' },
  { word: 'Introverted', phonetic: '/ˈɪntrəvɜːtɪd/', meaning: 'Hướng nội' },
  { word: 'Extroverted', phonetic: '/ˈɛkstrəvɜːtɪd/', meaning: 'Hướng ngoại' },
];
