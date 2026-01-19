// Vietnamese-English Vocabulary Data
// This module exports all vocabulary data organized by topic

export { vocabularyData as animalsData } from './animals';
export { vocabularyData as bankData } from './bank';
export { vocabularyData as beveragesData } from './beverages';
export { vocabularyData as bodyActionsData } from './body-actions';
export { vocabularyData as christmasData } from './christmas';
export { vocabularyData as clothingData } from './clothing';
export { vocabularyData as colorsData } from './colors';
export { vocabularyData as countriesData } from './countries';
export { vocabularyData as dailyActivitiesData } from './daily-activities';
export { vocabularyData as describingPeopleData } from './describing-people';
export { vocabularyData as emotionsData } from './emotions';
export { vocabularyData as environmentData } from './environment';
export { vocabularyData as fashionData } from './fashion';
export { vocabularyData as flowersData } from './flowers';
export { vocabularyData as foodData } from './food';
export { vocabularyData as footballData } from './football';
export { vocabularyData as fruitsData } from './fruits';
export { vocabularyData as healthData } from './health';
export { vocabularyData as hometownData } from './hometown';
export { vocabularyData as hospitalData } from './hospital';
export { vocabularyData as insectsData } from './insects';
export { vocabularyData as jobsData } from './jobs';
export { vocabularyData as kitchenData } from './kitchen';
export { vocabularyData as midAutumnData } from './mid-autumn';
export { vocabularyData as militaryData } from './military';
export { vocabularyData as moviesData } from './movies';
export { vocabularyData as numbersData } from './numbers';
export { vocabularyData as personalityData } from './personality';
export { vocabularyData as postOfficeData } from './post-office';
export { vocabularyData as schoolSuppliesData } from './school-supplies';
export { vocabularyData as schoolData } from './school';
export { vocabularyData as seafoodData } from './seafood';
export { vocabularyData as shoppingData } from './shopping';
export { vocabularyData as sportsData } from './sports';
export { vocabularyData as tetData } from './tet';
export { vocabularyData as trafficData } from './traffic';
export { vocabularyData as travelData } from './travel';
export { vocabularyData as vegetablesData } from './vegetables';
export { vocabularyData as weatherData } from './weather';
export { vocabularyData as workData } from './work';

// Re-export the interface
export type { VocabularyItem } from './animals';

// Topic metadata for navigation/UI
export const vocabularyTopics = [
  { id: 'animals', name: 'Động vật', nameEn: 'Animals' },
  { id: 'bank', name: 'Ngân hàng', nameEn: 'Bank' },
  { id: 'beverages', name: 'Đồ uống', nameEn: 'Beverages' },
  { id: 'body-actions', name: 'Hành động cơ thể', nameEn: 'Body Actions' },
  { id: 'christmas', name: 'Giáng sinh', nameEn: 'Christmas' },
  { id: 'clothing', name: 'Trang phục', nameEn: 'Clothing' },
  { id: 'colors', name: 'Màu sắc', nameEn: 'Colors' },
  { id: 'countries', name: 'Quốc gia', nameEn: 'Countries' },
  { id: 'daily-activities', name: 'Hoạt động hàng ngày', nameEn: 'Daily Activities' },
  { id: 'describing-people', name: 'Miêu tả người', nameEn: 'Describing People' },
  { id: 'emotions', name: 'Cảm xúc', nameEn: 'Emotions' },
  { id: 'environment', name: 'Môi trường', nameEn: 'Environment' },
  { id: 'fashion', name: 'Thời trang', nameEn: 'Fashion' },
  { id: 'flowers', name: 'Các loại hoa', nameEn: 'Flowers' },
  { id: 'food', name: 'Thực phẩm', nameEn: 'Food' },
  { id: 'football', name: 'Bóng đá', nameEn: 'Football' },
  { id: 'fruits', name: 'Trái cây', nameEn: 'Fruits' },
  { id: 'health', name: 'Sức khỏe', nameEn: 'Health' },
  { id: 'hometown', name: 'Quê hương', nameEn: 'Hometown' },
  { id: 'hospital', name: 'Bệnh viện', nameEn: 'Hospital' },
  { id: 'insects', name: 'Côn trùng', nameEn: 'Insects' },
  { id: 'jobs', name: 'Nghề nghiệp', nameEn: 'Jobs' },
  { id: 'kitchen', name: 'Nhà bếp', nameEn: 'Kitchen' },
  { id: 'mid-autumn', name: 'Trung thu', nameEn: 'Mid-Autumn Festival' },
  { id: 'military', name: 'Quân đội', nameEn: 'Military' },
  { id: 'movies', name: 'Phim ảnh', nameEn: 'Movies' },
  { id: 'numbers', name: 'Số đếm', nameEn: 'Numbers' },
  { id: 'personality', name: 'Tính cách', nameEn: 'Personality' },
  { id: 'post-office', name: 'Bưu điện', nameEn: 'Post Office' },
  { id: 'school-supplies', name: 'Dụng cụ học tập', nameEn: 'School Supplies' },
  { id: 'school', name: 'Trường học', nameEn: 'School' },
  { id: 'seafood', name: 'Hải sản', nameEn: 'Seafood' },
  { id: 'shopping', name: 'Mua sắm', nameEn: 'Shopping' },
  { id: 'sports', name: 'Thể thao', nameEn: 'Sports' },
  { id: 'tet', name: 'Tết', nameEn: 'Tet Holiday' },
  { id: 'traffic', name: 'Giao thông', nameEn: 'Traffic' },
  { id: 'travel', name: 'Du lịch', nameEn: 'Travel' },
  { id: 'vegetables', name: 'Rau củ', nameEn: 'Vegetables' },
  { id: 'weather', name: 'Thời tiết', nameEn: 'Weather' },
  { id: 'work', name: 'Công việc', nameEn: 'Work' },
] as const;

export type VocabularyTopicId = (typeof vocabularyTopics)[number]['id'];
