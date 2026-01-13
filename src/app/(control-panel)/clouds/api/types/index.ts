export type CourseStepContent = {
  id: string;
  stepId: string;
  html: string;
};

export type CourseStep = {
  id: string;
  courseId: string;
  order: number;
  title: string;
  subtitle: string;
  content: string;
};

export type Course = {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  duration: number;
  totalSteps: number;
  updatedAt: string;
  featured: boolean;
  progress: {
    currentStep: number;
    completed: number;
  };
  activeStep?: number;
  steps?: CourseStep[];
};

export type Category = {
  id: string;
  title: string;
  slug: string;
  color: string;
};
interface PotentialSavings {
  amount: number;
  percentage: number;
}

type ProjectStatus = "connected" | "malfunctioned" | "issued";

type DataFreshness = "Good" | "Average" | "Poor";
type CloudService = "azure" | "gcp" | "aws";

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  statusLabel: string;
  potentialSavings: PotentialSavings;
  monthlyCost: number;
  reports: number;
  dataFreshness: DataFreshness;
  cloudService: CloudService;
}
