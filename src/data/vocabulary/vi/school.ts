export interface VocabularyItem {
  word: string;
  phonetic: string;
  meaning: string;
}

export const vocabularyData: VocabularyItem[] = [
  // Types of schools
  { word: 'School', phonetic: '/skuːl/', meaning: 'Trường học' },
  { word: 'Nursery school', phonetic: '/ˈnɜːsəri skuːl/', meaning: 'Trường mẫu giáo' },
  { word: 'Primary school', phonetic: '/ˈpraɪməri skuːl/', meaning: 'Trường tiểu học' },
  { word: 'Secondary school', phonetic: '/ˈsɛkəndəri skuːl/', meaning: 'Trường trung học' },
  { word: 'High school', phonetic: '/haɪ skuːl/', meaning: 'Trường trung học phổ thông' },
  { word: 'University', phonetic: '/ˌjuːnɪˈvɜːsɪti/', meaning: 'Trường đại học' },
  { word: 'College', phonetic: '/ˈkɒlɪʤ/', meaning: 'Trường cao đẳng' },

  // Subjects
  { word: 'Math', phonetic: '/mæθ/', meaning: 'Toán' },
  { word: 'Physics', phonetic: '/ˈfɪzɪks/', meaning: 'Vật lý' },
  { word: 'Chemistry', phonetic: '/ˈkɛmɪstri/', meaning: 'Hóa học' },
  { word: 'Biology', phonetic: '/baɪˈɒləʤi/', meaning: 'Sinh học' },
  { word: 'History', phonetic: '/ˈhɪstəri/', meaning: 'Lịch sử' },
  { word: 'Geography', phonetic: '/ʤɪˈɒgrəfi/', meaning: 'Địa lý' },
  { word: 'Literature', phonetic: '/ˈlɪtərəʧə/', meaning: 'Văn học' },
  { word: 'English', phonetic: '/ˈɪŋglɪʃ/', meaning: 'Tiếng Anh' },
  { word: 'Music', phonetic: '/ˈmjuːzɪk/', meaning: 'Âm nhạc' },
  { word: 'Art', phonetic: '/ɑːt/', meaning: 'Mỹ thuật' },
  { word: 'Physical education', phonetic: '/ˈfɪzɪkl ˌɛʤʊˈkeɪʃən/', meaning: 'Thể dục' },
  { word: 'Science', phonetic: '/ˈsaɪəns/', meaning: 'Khoa học' },
  { word: 'Economics', phonetic: '/ˌiːkəˈnɒmɪks/', meaning: 'Kinh tế học' },
  { word: 'Psychology', phonetic: '/saɪˈkɒləʤi/', meaning: 'Tâm lý học' },

  // People
  { word: 'Principal', phonetic: '/ˈprɪnsəpl/', meaning: 'Hiệu trưởng' },
  { word: 'Teacher', phonetic: '/ˈtiːʧə/', meaning: 'Giáo viên' },
  { word: 'Lecturer', phonetic: '/ˈlɛkʧərə/', meaning: 'Giảng viên' },
  { word: 'Student', phonetic: '/ˈstjuːdənt/', meaning: 'Sinh viên' },
  { word: 'Pupil', phonetic: '/ˈpjuːpl/', meaning: 'Học sinh' },
  { word: 'Classmate', phonetic: '/ˈklɑːsmeɪt/', meaning: 'Bạn cùng lớp' },

  // Places
  { word: 'Classroom', phonetic: '/ˈklɑːsruːm/', meaning: 'Phòng học' },
  { word: 'Library', phonetic: '/ˈlaɪbrəri/', meaning: 'Thư viện' },
  { word: 'Laboratory', phonetic: '/ləˈbɒrətri/', meaning: 'Phòng thí nghiệm' },
  { word: 'Gymnasium', phonetic: '/ʤɪmˈneɪzɪəm/', meaning: 'Phòng thể chất' },
  { word: 'Canteen', phonetic: '/kænˈtiːn/', meaning: 'Căng tin' },
  { word: 'Playground', phonetic: '/ˈpleɪgraʊnd/', meaning: 'Sân chơi' },
  { word: 'Auditorium', phonetic: '/ˌɔːdɪˈtɔːrɪəm/', meaning: 'Hội trường' },

  // School supplies
  { word: 'Pencil', phonetic: '/ˈpɛnsl/', meaning: 'Bút chì' },
  { word: 'Pen', phonetic: '/pɛn/', meaning: 'Bút bi' },
  { word: 'Eraser', phonetic: '/ɪˈreɪzə/', meaning: 'Tẩy' },
  { word: 'Ruler', phonetic: '/ˈruːlə/', meaning: 'Thước kẻ' },
  { word: 'Notebook', phonetic: '/ˈnəʊtbʊk/', meaning: 'Vở' },
  { word: 'Textbook', phonetic: '/ˈtɛkstbʊk/', meaning: 'Sách giáo khoa' },
  { word: 'Backpack', phonetic: '/ˈbækpæk/', meaning: 'Ba lô' },
  { word: 'Calculator', phonetic: '/ˈkælkjʊleɪtə/', meaning: 'Máy tính' },
  { word: 'Scissors', phonetic: '/ˈsɪzəz/', meaning: 'Kéo' },
  { word: 'Glue', phonetic: '/gluː/', meaning: 'Keo dán' },
  { word: 'Stapler', phonetic: '/ˈsteɪplə/', meaning: 'Dập ghim' },
  { word: 'Paper clip', phonetic: '/ˈpeɪpə klɪp/', meaning: 'Kẹp giấy' },
  { word: 'Highlighter', phonetic: '/ˈhaɪlaɪtə/', meaning: 'Bút đánh dấu' },
  { word: 'Chalk', phonetic: '/ʧɔːk/', meaning: 'Phấn' },
  { word: 'Blackboard', phonetic: '/ˈblækbɔːd/', meaning: 'Bảng đen' },
  { word: 'Whiteboard', phonetic: '/ˈwaɪtbɔːd/', meaning: 'Bảng trắng' },
  { word: 'Projector', phonetic: '/prəˈʤɛktə/', meaning: 'Máy chiếu' },
  { word: 'Desk', phonetic: '/dɛsk/', meaning: 'Bàn học' },
  { word: 'Chair', phonetic: '/ʧeə/', meaning: 'Ghế' },

  // Other
  { word: 'Homework', phonetic: '/ˈhəʊmwɜːk/', meaning: 'Bài tập về nhà' },
  { word: 'Exam', phonetic: '/ɪgˈzæm/', meaning: 'Kỳ thi' },
  { word: 'Test', phonetic: '/tɛst/', meaning: 'Bài kiểm tra' },
  { word: 'Grade', phonetic: '/greɪd/', meaning: 'Điểm' },
  { word: 'Semester', phonetic: '/sɪˈmɛstə/', meaning: 'Học kỳ' },
  { word: 'Timetable', phonetic: '/ˈtaɪmˌteɪbl/', meaning: 'Thời khóa biểu' },
  { word: 'Certificate', phonetic: '/səˈtɪfɪkət/', meaning: 'Chứng chỉ' },
  { word: 'Diploma', phonetic: '/dɪˈpləʊmə/', meaning: 'Bằng cấp' },
  { word: 'Graduation', phonetic: '/ˌgræʤʊˈeɪʃən/', meaning: 'Lễ tốt nghiệp' },
];
