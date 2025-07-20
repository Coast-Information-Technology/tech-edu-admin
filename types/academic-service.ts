export interface AcademicService {
  id: string;
  title: string;
  description: string;
  category: string;
  serviceLevel: string;
  deliveryMode: string;
  sessionType: string;
  durationMinutes: number;
  price: number;
  tags: string[];
  learningObjectives: string[];
  prerequisites: string;
  maxParticipants: number;
  thumbnailUrl: string;
  isActive: boolean;
  rating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}
