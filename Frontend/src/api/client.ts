const BASE_URL = "http://127.0.0.1:8000/api";

export const IntelliJobAPI = {
  // Check backend health
  checkHealth: async () => {
    const res = await fetch(`${BASE_URL}/health`);
    if (!res.ok) throw new Error("Backend is down");
    return res.json();
  },

  // Trigger the LangGraph multi-agent workflow
  triggerWorkflow: async (userId: number = 1) => {
    const res = await fetch(`${BASE_URL}/workflow/trigger`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId }),
    });
    return res.json();
  },

  // Fetch AI-discovered jobs
  getJobs: async () => {
    const res = await fetch(`${BASE_URL}/jobs`);
    return res.json(); // { jobs: [...] }
  },

  // Fetch applications (e.g., approved/applied status)
  getApplications: async () => {
    const res = await fetch(`${BASE_URL}/applications`);
    return res.json(); // { applications: [...] }
  },

  // Fetch recent system notifications / agent activity
  getNotifications: async () => {
    const res = await fetch(`${BASE_URL}/notifications`);
    return res.json(); // { notifications: [...] }
  },

  // Auto-apply to a job via Playwright agent
  applyToJob: async (jobId: number) => {
    const res = await fetch(`${BASE_URL}/apply?job_id=${jobId}`, {
      method: "POST",
    });
    return res.json();
  },

  // Trigger resume tailoring via LLM agent
  optimizeResume: async (userId: number = 1) => {
    const res = await fetch(`${BASE_URL}/resume/optimize?user_id=${userId}`, {
      method: "POST",
    });
    return res.json();
  },

  // Generate AI interview questions for a specific job
  getInterviewQuestions: async (jobId: number) => {
    const res = await fetch(`${BASE_URL}/interview/questions?job_id=${jobId}`, {
      method: "POST",
    });
    return res.json(); // { questions: [...] }
  }
};
