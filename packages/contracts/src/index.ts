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
export class EnclaveApi {
  constructor(private baseUrl: string) {}
  private async request<T>(path: string, body?: unknown): Promise<T> {
    const response = await fetch(
      `${this.baseUrl}${path}`,
      body === undefined
        ? {}
        : {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          },
    );
    if (!response.ok) {
      const problem = await response.json().catch(() => null);
      throw new Error(problem?.detail ?? `API request failed (${response.status})`);
    }
    return response.json() as Promise<T>;
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
