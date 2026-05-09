const BASE_URL = "http://127.0.0.1:8000/api";

const getHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const IntelliJobAPI = {
  // Auth
  login: async (email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Invalid credentials");
    return res.json();
  },

  register: async (name: string, email: string, password: string) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Registration failed");
    }
    return res.json();
  },

  getUser: async () => {
    const res = await fetch(`${BASE_URL}/auth/me`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch user");
    return res.json();
  },

  updatePreferences: async (preferences: string) => {
    const res = await fetch(`${BASE_URL}/auth/preferences`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ preferences }),
    });
    return res.json();
  },

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
      headers: getHeaders(),
      body: JSON.stringify({ user_id: userId }),
    });
    return res.json();
  },

  // Fetch AI-discovered jobs
  getJobs: async () => {
    const res = await fetch(`${BASE_URL}/jobs`, { headers: getHeaders() });
    return res.json(); // { jobs: [...] }
  },

  // Fetch applications (e.g., approved/applied status)
  getApplications: async () => {
    const res = await fetch(`${BASE_URL}/applications`, { headers: getHeaders() });
    return res.json(); // { applications: [...] }
  },

  // Fetch recent system notifications / agent activity
  getNotifications: async () => {
    const res = await fetch(`${BASE_URL}/notifications`, { headers: getHeaders() });
    return res.json(); // { notifications: [...] }
  },

  // Auto-apply to a job via Playwright agent
  applyToJob: async (jobId: number) => {
    const res = await fetch(`${BASE_URL}/apply?job_id=${jobId}`, {
      method: "POST",
      headers: getHeaders()
    });
    return res.json();
  },

  // Trigger resume tailoring via LLM agent
  optimizeResume: async (userId: number = 1) => {
    const res = await fetch(`${BASE_URL}/resume/optimize?user_id=${userId}`, {
      method: "POST",
      headers: getHeaders()
    });
    return res.json();
  },

  // Upload PDF resume
  uploadResume: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    
    // Custom headers because we don't want to set Content-Type to application/json for FormData
    const token = localStorage.getItem("token");
    const headers: any = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;

    const res = await fetch(`${BASE_URL}/resume/upload`, {
      method: "POST",
      headers,
      body: formData,
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.detail || "Upload failed");
    }
    return res.json();
  },

  getResumeAnalysis: async () => {
    const res = await fetch(`${BASE_URL}/resume/analysis`, { headers: getHeaders() });
    return res.json();
  },

  getResumeStatus: async () => {
    const res = await fetch(`${BASE_URL}/resume/status`, { headers: getHeaders() });
    return res.json();
  },

  getGapAnalysis: async () => {
    const res = await fetch(`${BASE_URL}/resume/gap-analysis`, { headers: getHeaders() });
    return res.json();
  },

  // Generate AI interview questions for a specific job
  getInterviewQuestions: async (jobId: number) => {
    const res = await fetch(`${BASE_URL}/interview/questions?job_id=${jobId}`, {
      method: "POST",
      headers: getHeaders(),
    });
    return res.json();
  },

  getJobDetails: async (jobId: number) => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}`, { headers: getHeaders() });
    if (!res.ok) throw new Error("Failed to fetch job details");
    return res.json();
  },

  approveJob: async (jobId: number) => {
    const res = await fetch(`${BASE_URL}/jobs/${jobId}/approve`, {
      method: "POST",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to approve job");
    return res.json();
  },

  triggerAgent: async () => {
    const res = await fetch(`${BASE_URL}/agent/trigger`, {
      method: "POST",
      headers: getHeaders(),
    });
    if (!res.ok) throw new Error("Failed to trigger agent");
    return res.json();
  },

  getTailoredResumes: async () => {
    const res = await fetch(`${BASE_URL}/resumes/tailored`, { headers: getHeaders() });
    return res.json();
  }
};
