export const ROUTES = {
  PUBLIC: {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    FORBIDDEN: '/403',
  },
  STUDENT: {
    DASHBOARD: '/student/dashboard',
    SUBJECTS: '/student/subjects',
    LESSON: (id: string) => `/student/lessons/${id}`,
    QUIZ: (id: string) => `/student/quizzes/${id}`,
    COMBOS: '/student/combos',
    CHECKOUT: '/student/checkout',
    PAYMENT_RESULT: '/student/payment/result',
    PURCHASES: '/student/purchases',
    MAJORS: '/student/majors',
    RECOMMENDATIONS: '/student/recommendations',
    PROFILE: '/student/profile',
  },
  TEACHER: {
    DASHBOARD: '/teacher/dashboard',
    CONTENT: '/teacher/content',
    LESSON_BUILDER: '/teacher/lessons/build',
    QUIZ_BUILDER: '/teacher/quizzes/build',
    COMBO_BUILDER: '/teacher/combos/build',
    MONITOR: '/teacher/students',
    FEEDBACKS: '/teacher/feedback',
  },
  ADMIN: {
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    MAJORS: '/admin/majors',
    MODERATION: '/admin/moderation',
    SETTINGS: '/admin/settings',
  }
} as const;

export enum ROLE {
  STUDENT = 'STUDENT',
  TEACHER = 'TEACHER',
  ADMIN = 'ADMIN'
}
