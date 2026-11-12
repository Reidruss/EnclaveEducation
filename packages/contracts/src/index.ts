export interface Course {
  id: string;
  code: string;
  name: string;
}
export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  durationMinutes: number;
  language: string;
}
export interface CreateCourse {
  code: string;
  name: string;
}
export interface CreateAssignment {
  courseId: string;
  title: string;
  durationMinutes: number;
  language: string;
}
export interface StudentEnrollment {
  studentName: string;
  course: Course;
  expiresAt: string;
}
export interface StudentSession {
  token: string;
  enrollment: StudentEnrollment;
}
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}
export class EnclaveApi {
  constructor(private baseUrl: string) {}
  private async request<T>(path: string, body?: unknown, token?: string): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      method: body === undefined ? 'GET' : 'POST',
      headers: {
        ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) {
      const problem = await response.json().catch(() => null);
      throw new ApiError(
        problem?.detail ?? `API request failed (${response.status})`,
        response.status,
      );
    }
    return response.json() as Promise<T>;
  }
  enrollStudent(code: string) {
    return this.request<StudentSession>('/api/student/enrollment', { code });
  }
  studentEnrollment(token: string) {
    return this.request<StudentEnrollment>('/api/student/enrollment', undefined, token);
  }
  courses() {
    return this.request<Course[]>('/api/courses');
  }
  assignments() {
    return this.request<Assignment[]>('/api/assignments');
  }
  createCourse(input: CreateCourse) {
    return this.request<Course>('/api/courses', input);
  }
  createAssignment(input: CreateAssignment) {
    return this.request<Assignment>('/api/assignments', input);
  }
}
