import type { ComponentType } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Root from "./Root";
import NotFound from "./NotFound";
import RouteHydrateFallback from "./RouteHydrateFallback";
import { routes } from "./routePaths";

type DefaultPageModule = { default: ComponentType };

function lazyPage(importer: () => Promise<DefaultPageModule>) {
  return async () => {
    const module = await importer();
    return { Component: module.default };
  };
}

const pages = {
  homepage: lazyPage(() => import("@/features/public/pages/Homepage")),
  login: lazyPage(() => import("@/features/public/pages/Login")),
  register: lazyPage(() => import("@/features/public/pages/Register")),
  forgotPassword: lazyPage(() => import("@/features/public/pages/ForgotPassword")),
  verifyEmail: async () => ({ Component: (await import("@/features/public/pages/TokenAction")).VerifyEmail }),
  resetPassword: async () => ({ Component: (await import("@/features/public/pages/TokenAction")).ResetPassword }),
  acceptAdminInvite: async () => ({ Component: (await import("@/features/public/pages/TokenAction")).AcceptAdminInvite }),
  studentDashboard: lazyPage(() => import("@/features/student/pages/StudentDashboard")),
  questions: lazyPage(() => import("@/features/student/pages/Questions")),
  questionDetail: lazyPage(() => import("@/features/student/pages/QuestionDetail")),
  mentors: lazyPage(() => import("@/features/student/pages/Mentors")),
  mentorProfilePage: lazyPage(() => import("@/features/student/pages/MentorProfilePage")),
  bookingNew: lazyPage(() => import("@/features/student/pages/BookingNew")),
  bookingStatus: lazyPage(() => import("@/features/student/pages/BookingStatus")),
  sessionDetail: lazyPage(() => import("@/features/student/pages/SessionDetail")),
  feedback: lazyPage(() => import("@/features/student/pages/Feedback")),
  review: lazyPage(() => import("@/features/student/pages/Review")),
  jdUpload: lazyPage(() => import("@/features/student/pages/JDUpload")),
  jdReview: lazyPage(() => import("@/features/student/pages/JDOCRReview")),
  jdMapping: lazyPage(() => import("@/features/student/pages/JDMapping")),
  jdRecommendations: lazyPage(() => import("@/features/student/pages/JDRecommendations")),
  mentorOnboarding: lazyPage(() => import("@/features/mentor/pages/MentorOnboarding")),
  mentorVerification: lazyPage(() => import("@/features/mentor/pages/MentorVerification")),
  mentorProfileEdit: lazyPage(() => import("@/features/mentor/pages/MentorProfileEdit")),
  mentorAvailability: lazyPage(() => import("@/features/mentor/pages/MentorAvailability")),
  mentorBookings: lazyPage(() => import("@/features/mentor/pages/MentorBookings")),
  mentorBookingDetail: lazyPage(() => import("@/features/mentor/pages/MentorBookingDetail")),
  mentorSessionDetail: lazyPage(() => import("@/features/mentor/pages/MentorSessionDetail")),
  mentorFeedbackForm: lazyPage(() => import("@/features/mentor/pages/MentorFeedbackForm")),
  admin: lazyPage(() => import("@/features/admin/pages/Admin")),
  adminMentorReview: lazyPage(() => import("@/features/admin/pages/AdminMentorReview")),
  adminQuestions: lazyPage(() => import("@/features/admin/pages/AdminQuestions")),
  adminCase: lazyPage(() => import("@/features/admin/pages/AdminCase")),
  adminAudit: lazyPage(() => import("@/features/admin/pages/AdminAudit")),
  status: async () => {
    const module = await import("@/features/status/StatusPage");
    return { Component: module.StatusPage };
  },
};

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    HydrateFallback: RouteHydrateFallback,
    children: [
      { index: true, element: <Navigate to={routes.home} replace /> },
      { path: routes.home, lazy: pages.homepage },
      { path: routes.login, lazy: pages.login },
      { path: routes.register, lazy: pages.register },
      { path: routes.forgotPassword, lazy: pages.forgotPassword },
      { path: routes.verifyEmail, lazy: pages.verifyEmail },
      { path: routes.resetPassword, lazy: pages.resetPassword },
      { path: routes.acceptAdminInvite, lazy: pages.acceptAdminInvite },
      { path: routes.studentDashboard, lazy: pages.studentDashboard },
      { path: routes.questions, lazy: pages.questions },
      { path: routes.question(), lazy: pages.questionDetail },
      { path: routes.mentors, lazy: pages.mentors },
      { path: routes.mentor(), lazy: pages.mentorProfilePage },
      { path: routes.bookingNew, lazy: pages.bookingNew },
      { path: routes.booking(), lazy: pages.bookingStatus },
      { path: routes.session(), lazy: pages.sessionDetail },
      { path: routes.feedback(), lazy: pages.feedback },
      { path: routes.review(), lazy: pages.review },
      { path: routes.jobDescriptionNew, lazy: pages.jdUpload },
      { path: routes.jobDescriptionReview(), lazy: pages.jdReview },
      { path: routes.jobDescriptionMapping(), lazy: pages.jdMapping },
      { path: routes.jobDescriptionRecommendations(), lazy: pages.jdRecommendations },
      { path: routes.preparationPlan(), lazy: pages.jdRecommendations },
      { path: routes.mentorOnboarding, lazy: pages.mentorOnboarding },
      { path: routes.mentorVerification, lazy: pages.mentorVerification },
      { path: routes.mentorProfile, lazy: pages.mentorProfileEdit },
      { path: routes.mentorAvailability, lazy: pages.mentorAvailability },
      { path: routes.mentorBookings, lazy: pages.mentorBookings },
      { path: routes.mentorBooking(), lazy: pages.mentorBookingDetail },
      { path: routes.mentorSession(), lazy: pages.mentorSessionDetail },
      { path: routes.mentorFeedback(), lazy: pages.mentorFeedbackForm },
      { path: routes.adminQueue, lazy: pages.admin },
      { path: routes.adminMentorReview(), lazy: pages.adminMentorReview },
      { path: routes.adminQuestions, lazy: pages.adminQuestions },
      { path: routes.adminCase(), lazy: pages.adminCase },
      { path: routes.adminAudit(), lazy: pages.adminAudit },
      { path: routes.systemStatus, lazy: pages.status },

      /* Compatibility redirects for links in the original prototype and early docs. */
      { path: "/job-description/upload", element: <Navigate to={routes.jobDescriptionNew} replace /> },
      { path: "/job-description/ocr-review", element: <Navigate to={routes.jobDescriptionNew} replace /> },
      { path: "/job-description/mapping", element: <Navigate to={routes.jobDescriptionNew} replace /> },
      { path: "/job-description/recommendations", element: <Navigate to={routes.jobDescriptionNew} replace /> },
      { path: "/bookings/:bookingId/status", lazy: pages.bookingStatus },
      { path: "/feedback/:bookingId", lazy: pages.feedback },
      { path: "/reviews/:bookingId", lazy: pages.review },
      { path: "*", Component: NotFound },
    ],
  },
]);
