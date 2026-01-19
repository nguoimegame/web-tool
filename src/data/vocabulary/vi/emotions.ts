export interface VocabularyItem {
  word: string; // English word
  phonetic: string; // IPA pronunciation
  meaning: string; // Vietnamese meaning
}

export const vocabularyData: VocabularyItem[] = [
  // Positive emotions
  { word: 'Amused', phonetic: '/əˈmjuːzd/', meaning: 'Vui vẻ' },
  { word: 'Delighted', phonetic: '/dɪˈlaɪtɪd/', meaning: 'Rất hạnh phúc' },
  { word: 'Ecstatic', phonetic: '/ɪkˈstætɪk/', meaning: 'Vô cùng hạnh phúc' },
  { word: 'Enthusiastic', phonetic: '/ɪnˌθjuːziˈæstɪk/', meaning: 'Nhiệt tình' },
  { word: 'Excited', phonetic: '/ɪkˈsaɪtɪd/', meaning: 'Phấn khích' },
  { word: 'Great', phonetic: '/greɪt/', meaning: 'Tuyệt vời' },
  { word: 'Happy', phonetic: '/ˈhæpi/', meaning: 'Hạnh phúc' },
  { word: 'Overwhelmed', phonetic: '/ˌəʊvəˈwɛlmd/', meaning: 'Choáng ngợp' },
  { word: 'Overjoyed', phonetic: '/ˌəʊvəˈʤɔɪd/', meaning: 'Cực kỳ vui' },
  { word: 'Positive', phonetic: '/ˈpɒzɪtɪv/', meaning: 'Lạc quan' },
  { word: 'Relaxed', phonetic: '/rɪˈlækst/', meaning: 'Thư giãn' },
  { word: 'Surprised', phonetic: '/səˈpraɪzd/', meaning: 'Ngạc nhiên' },
  { word: 'Terrific', phonetic: '/təˈrɪfɪk/', meaning: 'Tuyệt vời' },
  { word: 'Wonderful', phonetic: '/ˈwʌndəfʊl/', meaning: 'Tuyệt vời' },

  // Negative emotions
  { word: 'Angry', phonetic: '/ˈæŋgri/', meaning: 'Tức giận' },
  { word: 'Anxious', phonetic: '/ˈæŋkʃəs/', meaning: 'Lo lắng' },
  { word: 'Annoyed', phonetic: '/əˈnɔɪd/', meaning: 'Bực mình' },
  { word: 'Appalled', phonetic: '/əˈpɔːld/', meaning: 'Rất sốc' },
  { word: 'Ashamed', phonetic: '/əˈʃeɪmd/', meaning: 'Xấu hổ' },
  { word: 'Bewildered', phonetic: '/bɪˈwɪldəd/', meaning: 'Rất bối rối' },
  { word: 'Bored', phonetic: '/bɔːd/', meaning: 'Chán' },
  { word: 'Confused', phonetic: '/kənˈfjuːzd/', meaning: 'Lúng túng' },
  { word: 'Depressed', phonetic: '/dɪˈprɛst/', meaning: 'Rất buồn' },
  { word: 'Disappointed', phonetic: '/ˌdɪsəˈpɔɪntɪd/', meaning: 'Thất vọng' },
  { word: 'Embarrassed', phonetic: '/ɪmˈbærəst/', meaning: 'Ngại ngùng' },
  { word: 'Frightened', phonetic: '/ˈfraɪtnd/', meaning: 'Sợ hãi' },
  { word: 'Frustrated', phonetic: '/frʌsˈtreɪtɪd/', meaning: 'Tuyệt vọng' },
  { word: 'Furious', phonetic: '/ˈfjʊərɪəs/', meaning: 'Giận dữ' },
  { word: 'Horrified', phonetic: '/ˈhɒrɪfaɪd/', meaning: 'Kinh hoàng' },
  { word: 'Hurt', phonetic: '/hɜːt/', meaning: 'Tổn thương' },
  { word: 'Irritated', phonetic: '/ˈɪrɪteɪtɪd/', meaning: 'Khó chịu' },
  { word: 'Jealous', phonetic: '/ˈʤɛləs/', meaning: 'Ganh tị' },
  { word: 'Sad', phonetic: '/sæd/', meaning: 'Buồn' },
  { word: 'Scared', phonetic: '/skeəd/', meaning: 'Sợ hãi' },
  { word: 'Stressed', phonetic: '/strɛst/', meaning: 'Mệt mỏi' },
  { word: 'Terrible', phonetic: '/ˈtɛrəbl/', meaning: 'Kinh khủng' },
  { word: 'Terrified', phonetic: '/ˈtɛrɪfaɪd/', meaning: 'Rất sợ hãi' },
  { word: 'Tired', phonetic: '/ˈtaɪəd/', meaning: 'Mệt' },
  { word: 'Upset', phonetic: '/ʌpˈsɛt/', meaning: 'Buồn bực' },
  { word: 'Worried', phonetic: '/ˈwʌrid/', meaning: 'Lo lắng' },
];
