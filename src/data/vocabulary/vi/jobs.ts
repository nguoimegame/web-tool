export interface VocabularyItem {
  word: string; // English word
  phonetic: string; // IPA pronunciation
  meaning: string; // Vietnamese meaning
}

export const vocabularyData: VocabularyItem[] = [
  // Law/Security
  { word: 'Solicitor', phonetic: '/səˈlɪsɪtə/', meaning: 'Người cố vấn pháp luật' },
  { word: 'Prison officer', phonetic: '/ˈprɪzn ˈɒfɪsə/', meaning: 'Công an làm việc ở trại giam' },
  { word: 'Security officer', phonetic: '/sɪˈkjʊərɪti ˈɒfɪsə/', meaning: 'Nhân viên bảo an' },
  { word: 'Customs officer', phonetic: '/ˈkʌstəmz ˈɒfɪsə/', meaning: 'Nhân viên hải quan' },
  { word: 'Policewoman', phonetic: '/pəˈliːsˌwʊmən/', meaning: 'Nữ cảnh sát' },
  { word: 'Detective', phonetic: '/dɪˈtɛktɪv/', meaning: 'Thám tử' },
  { word: 'Lawyer', phonetic: '/ˈlɔːjə/', meaning: 'Luật sư' },
  { word: 'Police officer', phonetic: '/pəˈliːs ˈɒfɪsə/', meaning: 'Cảnh sát' },
  { word: 'Bodyguard', phonetic: '/ˈbɒdɪˌgɑːd/', meaning: 'Vệ sĩ' },
  { word: 'Judge', phonetic: '/ʤʌʤ/', meaning: 'Quan tòa' },
  { word: 'Forensic scientist', phonetic: '/fəˈrɛnsɪk ˈsaɪəntɪst/', meaning: 'Nhân viên pháp y' },
  { word: 'Barrister', phonetic: '/ˈbærɪstə/', meaning: 'Luật sư bào chữa' },
  { word: 'Magistrate', phonetic: '/ˈmæʤɪstreɪt/', meaning: 'Quan tòa sơ thẩm' },

  // IT/Tech
  { word: 'Web developer', phonetic: '/wɛb dɪˈvɛləpə/', meaning: 'Nhân viên phát triển web' },
  {
    word: 'Database administrator',
    phonetic: '/ˈdeɪtəˌbeɪs ədˈmɪnɪstreɪtə/',
    meaning: 'Chuyên viên quản lý dữ liệu',
  },
  { word: 'Web designer', phonetic: '/wɛb dɪˈzaɪnə/', meaning: 'Nhân viên thiết kế web' },
  {
    word: 'Computer software engineer',
    phonetic: '/kəmˈpjuːtə ˈsɒftweə ˌendʒɪˈnɪə/',
    meaning: 'Kỹ sư phần mềm',
  },
  { word: 'Programmer', phonetic: '/ˈprəʊgræmə/', meaning: 'Lập trình viên' },
  {
    word: 'Software developer',
    phonetic: '/ˈsɒftweə dɪˈvɛləpə/',
    meaning: 'Nhân viên phát triển phần mềm',
  },

  // Finance/Business
  { word: 'Accountant', phonetic: '/əˈkaʊntənt/', meaning: 'Kế toán' },
  { word: 'Economist', phonetic: '/iˈkɒnəmɪst/', meaning: 'Nhà kinh tế học' },
  { word: 'Investment analyst', phonetic: '/ɪnˈvɛstmənt ˈænəlɪst/', meaning: 'Người phân tích đầu tư' },
  { word: 'Businessman', phonetic: '/ˈbɪznɪsmən/', meaning: 'Doanh nhân' },
  { word: 'Businesswoman', phonetic: '/ˈbɪznəswʊmən/', meaning: 'Nữ doanh nhân' },
  { word: 'Financial adviser', phonetic: '/faɪˈnænʃəl ədˈvaɪzə/', meaning: 'Cố vấn tài chính' },
  { word: 'Personal assistant', phonetic: '/ˈpɜːsənl əˈsɪstənt/', meaning: 'Trợ lý cá nhân' },
  { word: 'Director', phonetic: '/dɪˈrɛktə/', meaning: 'Giám đốc' },
  { word: 'Sales representative', phonetic: '/seɪlz ˌrɛprɪˈzɛntətɪv/', meaning: 'Đại diện bán hàng' },
  { word: 'Salesman', phonetic: '/ˈseɪlzmən/', meaning: 'Nam nhân viên bán hàng' },
  { word: 'Saleswoman', phonetic: '/ˈseɪlzˌwʊmən/', meaning: 'Nữ nhân viên bán hàng' },
  { word: 'Secretary', phonetic: '/ˈsɛkrətri/', meaning: 'Thư ký' },
  { word: 'Receptionist', phonetic: '/rɪˈsɛpʃənɪst/', meaning: 'Lễ tân' },
  { word: 'Manager', phonetic: '/ˈmænɪʤə/', meaning: 'Quản lý' },
  { word: 'Office worker', phonetic: '/ˈɒfɪs ˈwɜːkə/', meaning: 'Nhân viên văn phòng' },

  // Healthcare
  { word: 'Social worker', phonetic: '/ˈsəʊʃəl ˈwɜːkə/', meaning: 'Nhân viên xã hội' },
  { word: 'Veterinary surgeon', phonetic: '/ˈvɛtərɪnəri ˈsɜːʤən/', meaning: 'Bác sĩ thú y' },
  { word: 'Midwife', phonetic: '/ˈmɪdwaɪf/', meaning: 'Nữ hộ sinh' },
  { word: 'Optician', phonetic: '/ɒpˈtɪʃən/', meaning: 'Bác sĩ mắt' },
  { word: 'Pharmacist', phonetic: '/ˈfɑːməsɪst/', meaning: 'Dược sĩ' },
  { word: 'Surgeon', phonetic: '/ˈsɜːʤən/', meaning: 'Bác sĩ phẫu thuật' },
  { word: 'Doctor', phonetic: '/ˈdɒktə/', meaning: 'Bác sĩ' },
  { word: 'Psychiatrist', phonetic: '/saɪˈkaɪətrɪst/', meaning: 'Bác sĩ tâm thần' },
  { word: 'Dentist', phonetic: '/ˈdɛntɪst/', meaning: 'Nha sĩ' },
  { word: 'Physiotherapist', phonetic: '/ˌfɪzɪəˈθɛrəpɪst/', meaning: 'Nhà vật lý trị liệu' },
  { word: 'Nurse', phonetic: '/nɜːs/', meaning: 'Y tá' },

  // Construction/Labor
  { word: 'Cleaner', phonetic: '/ˈkliːnə/', meaning: 'Người dọn vệ sinh' },
  { word: 'Bricklayer', phonetic: '/ˈbrɪkˌleɪə/', meaning: 'Thợ xây' },
  { word: 'Carpenter', phonetic: '/ˈkɑːpɪntə/', meaning: 'Thợ mộc' },
  { word: 'Electrician', phonetic: '/ɪlɛkˈtrɪʃən/', meaning: 'Thợ điện' },
  { word: 'Mechanic', phonetic: '/mɪˈkænɪk/', meaning: 'Thợ máy' },
  { word: 'Architect', phonetic: '/ˈɑːkɪtɛkt/', meaning: 'Kiến trúc sư' },
  { word: 'Construction worker', phonetic: '/kənˈstrʌkʃən ˈwɜːkə/', meaning: 'Công nhân xây dựng' },
  { word: 'Interior designer', phonetic: '/ɪnˈtɪərɪə dɪˈzaɪnə/', meaning: 'Thiết kế nội thất' },
  { word: 'Plumber', phonetic: '/ˈplʌmə/', meaning: 'Thợ sửa ống nước' },
  { word: 'Gardener', phonetic: '/ˈgɑːdnə/', meaning: 'Người làm vườn' },
  { word: 'Welder', phonetic: '/ˈwɛldə/', meaning: 'Thợ hàn' },

  // Retail
  { word: 'Baker', phonetic: '/ˈbeɪkə/', meaning: 'Người làm bánh' },
  { word: 'Beautician', phonetic: '/bjuːˈtɪʃən/', meaning: 'Thợ làm đẹp' },
  { word: 'Florist', phonetic: '/ˈflɒrɪst/', meaning: 'Người bán hoa' },
  { word: 'Cashier', phonetic: '/kæˈʃɪə/', meaning: 'Thu ngân' },
  { word: 'Barber', phonetic: '/ˈbɑːbə/', meaning: 'Thợ cắt tóc' },
  { word: 'Butcher', phonetic: '/ˈbʊʧə/', meaning: 'Người bán thịt' },
  { word: 'Hairdresser', phonetic: '/ˈheəˌdrɛsə/', meaning: 'Thợ làm tóc' },
  { word: 'Tailor', phonetic: '/ˈteɪlə/', meaning: 'Thợ may' },
  { word: 'Shopkeeper', phonetic: '/ˈʃɒpˌkiːpə/', meaning: 'Chủ cửa hàng' },

  // Hospitality
  { word: 'Cook', phonetic: '/kʊk/', meaning: 'Đầu bếp' },
  { word: 'Chef', phonetic: '/ʃɛf/', meaning: 'Bếp trưởng' },
  { word: 'Tourist guide', phonetic: '/ˈtʊərɪst gaɪd/', meaning: 'Hướng dẫn viên du lịch' },
  { word: 'Bartender', phonetic: '/ˈbɑːˌtɛndə/', meaning: 'Người pha chế' },
  { word: 'Barista', phonetic: '/bəˈriːstə/', meaning: 'Người pha cà phê' },
  { word: 'Waiter', phonetic: '/ˈweɪtə/', meaning: 'Phục vụ bàn nam' },
  { word: 'Waitress', phonetic: '/ˈweɪtrɪs/', meaning: 'Phục vụ bàn nữ' },
  { word: 'Hotel manager', phonetic: '/həʊˈtɛl ˈmænɪʤə/', meaning: 'Quản lý khách sạn' },

  // Arts/Entertainment
  { word: 'Actor', phonetic: '/ˈæktə/', meaning: 'Nam diễn viên' },
  { word: 'Actress', phonetic: '/ˈæktrəs/', meaning: 'Nữ diễn viên' },
  { word: 'Model', phonetic: '/ˈmɒdl/', meaning: 'Người mẫu' },
  { word: 'Writer', phonetic: '/ˈraɪtə/', meaning: 'Nhà văn' },
  { word: 'Artist', phonetic: '/ˈɑːtɪst/', meaning: 'Họa sĩ' },
  { word: 'Musician', phonetic: '/mjuˈzɪʃən/', meaning: 'Nhạc sĩ' },
  { word: 'Photographer', phonetic: '/fəˈtɒgrəfə/', meaning: 'Thợ chụp ảnh' },
  { word: 'Comedian', phonetic: '/kəˈmiːdiən/', meaning: 'Diễn viên hài' },
  { word: 'Composer', phonetic: '/kəmˈpəʊzə/', meaning: 'Nhà soạn nhạc' },
  { word: 'Dancer', phonetic: '/ˈdɑːnsə/', meaning: 'Vũ công' },
  { word: 'Film director', phonetic: '/fɪlm dɪˈrɛktə/', meaning: 'Đạo diễn phim' },
  { word: 'Singer', phonetic: '/ˈsɪŋə/', meaning: 'Ca sĩ' },
  { word: 'Journalist', phonetic: '/ˈʤɜːnəlɪst/', meaning: 'Nhà báo' },
  { word: 'Editor', phonetic: '/ˈɛdɪtə/', meaning: 'Biên tập viên' },
  { word: 'Fashion designer', phonetic: '/ˈfæʃən dɪˈzaɪnə/', meaning: 'Nhà thiết kế thời trang' },

  // Education
  { word: 'Lecturer', phonetic: '/ˈlɛkʧərə/', meaning: 'Giảng viên' },
  { word: 'Teacher', phonetic: '/ˈtiːʧə/', meaning: 'Giáo viên' },
  { word: 'Teaching assistant', phonetic: '/ˈtiːʧɪŋ əˈsɪstənt/', meaning: 'Trợ giảng' },
  { word: 'Translator', phonetic: '/trænsˈleɪtə/', meaning: 'Phiên dịch' },

  // Other
  { word: 'Engineer', phonetic: '/ˌɛnʤɪˈnɪə/', meaning: 'Kỹ sư' },
  { word: 'Pilot', phonetic: '/ˈpaɪlət/', meaning: 'Phi công' },
  { word: 'Flight attendant', phonetic: '/flaɪt əˈtɛndənt/', meaning: 'Tiếp viên hàng không' },
  { word: 'Housewife', phonetic: '/ˈhaʊswaɪf/', meaning: 'Nội trợ' },
  { word: 'Politician', phonetic: '/ˌpɒlɪˈtɪʃən/', meaning: 'Chính trị gia' },
  { word: 'Factory worker', phonetic: '/ˈfæktəri ˈwɜːkə/', meaning: 'Công nhân nhà máy' },
  { word: 'Scientist', phonetic: '/ˈsaɪəntɪst/', meaning: 'Nhà khoa học' },
  { word: 'Researcher', phonetic: '/rɪˈsɜːʧə/', meaning: 'Nhà nghiên cứu' },
];
