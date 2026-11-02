using System.Collections.Concurrent;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddProblemDetails();
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
    .WithOrigins(builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [])
    .AllowAnyHeader().AllowAnyMethod()));
var app = builder.Build();
app.UseExceptionHandler();
app.UseCors();
app.MapGet("/health", () => Results.Ok(new { status = "ok", service = "EnclaveEducation.Api" }));

// This unauthenticated, in-memory demo is deliberately unavailable outside Development.
if (app.Environment.IsDevelopment())
{
    var courses = new ConcurrentDictionary<Guid, Course>();
    var assignments = new ConcurrentDictionary<Guid, Assignment>();
    var demo = new Course(Guid.Parse("a0ca1ee0-4ebd-42af-9f34-922d79aa0123"), "CS 201", "Data structures");
    courses[demo.Id] = demo;
    var api = app.MapGroup("/api");
    api.MapGet("/courses", () => courses.Values.OrderBy(c => c.Code));
    api.MapGet("/assignments", () => assignments.Values.OrderBy(a => a.Title));
    api.MapPost("/courses", (CreateCourse input) =>
    {
        if (string.IsNullOrWhiteSpace(input.Code) || input.Code.Length > 30 ||
            string.IsNullOrWhiteSpace(input.Name) || input.Name.Length > 120)
            return Results.Problem(statusCode: 400, detail: "Provide a code (1–30 characters) and name (1–120 characters).");
        var course = new Course(Guid.NewGuid(), input.Code.Trim(), input.Name.Trim());
        courses[course.Id] = course;
        return Results.Created($"/api/courses/{course.Id}", course);
    });
    api.MapGet("/courses/{id:guid}", (Guid id) => courses.TryGetValue(id, out var course)
        ? Results.Ok(course) : Results.NotFound());
    api.MapPost("/assignments", (CreateAssignment input) =>
    {
        if (!courses.ContainsKey(input.CourseId))
            return Results.Problem(statusCode: 400, detail: "Select an existing class.");
        if (string.IsNullOrWhiteSpace(input.Title) || input.Title.Length > 160 ||
            input.DurationMinutes is < 5 or > 480 ||
            !new[] { "python", "javascript", "csharp", "java" }.Contains(input.Language))
            return Results.Problem(statusCode: 400, detail: "Provide a title (1–160 characters), duration (5–480 minutes), and supported language.");
        var assignment = new Assignment(Guid.NewGuid(), input.CourseId, input.Title.Trim(), input.DurationMinutes, input.Language!);
        assignments[assignment.Id] = assignment;
        return Results.Created($"/api/assignments/{assignment.Id}", assignment);
    });
    api.MapGet("/assignments/{id:guid}", (Guid id) => assignments.TryGetValue(id, out var assignment)
        ? Results.Ok(assignment) : Results.NotFound());
}
app.Run();

record Course(Guid Id, string Code, string Name);
record Assignment(Guid Id, Guid CourseId, string Title, int DurationMinutes, string Language);
record CreateCourse(string? Code, string? Name);
record CreateAssignment(Guid CourseId, string? Title, int DurationMinutes, string? Language);
