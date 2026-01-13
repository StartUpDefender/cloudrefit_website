import api from "@/utils/api";
import { Course, CourseStep, CourseStepContent, Category } from "../types";

export const academyApi = {
  getCourses: async (): Promise<Course[]> => {
    return api.get("mock/academy/courses");
  },

  getCourse: async (courseId: string): Promise<Course> => {
    return api.get(`mock/academy/courses/${courseId}`);
  },

  updateCourse: async (
    courseId: string,
    data: Partial<Course>
  ): Promise<void> => {
    await api.put(`mock/academy/courses/${courseId}`, {
      json: data,
    });
  },

  deleteCourse: async (courseId: string): Promise<void> => {
    await api.delete(`mock/academy/courses/${courseId}`);
  },

  getCourseSteps: async (courseId: string): Promise<CourseStep[]> => {
    return api.get(`mock/academy/course-steps?courseId=${courseId}`);
  },

  getCourseStepContent: async (stepId: string): Promise<CourseStepContent> => {
    return api.get(`mock/academy/course-step-contents/${stepId}`);
  },

  getCategories: async (): Promise<Category[]> => {
    return api.get("mock/academy/categories");
  },
};
