import xlsx from "xlsx";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const baseJobs = [
  {
    Title: "Senior Software Engineer",
    Company: "Google LLC",
    Location: "New York, NY",
    Description: "We are looking for a Senior Software Engineer to join our team. Must have experience with React, Node.js, and MongoDB.",
    Skills: "React, Node.js, MongoDB, JavaScript",
    Salary: "$140,000 - $180,000",
    Experience: "5+ years",
    EmploymentType: "Full-time",
    PostedDate: "3 days ago",
    Source: "LinkedIn",
    SourceUrl: "https://linkedin.com/jobs/google-1",
  },
  {
    Title: "Sr. Software Engineer",
    Company: "Google",
    Location: "New York City",
    Description: "Google is hiring a Senior Software Engineer to build scalable web applications. Requirements include React, Node.js, and MongoDB database schema design.",
    Skills: "React, Node.js, MongoDB",
    Salary: "150000 USD",
    Experience: "5 years",
    EmploymentType: "FT",
    PostedDate: "2 days ago",
    Source: "Indeed",
    SourceUrl: "https://indeed.com/jobs/google-2",
  },
  {
    Title: "Software Engineer (Senior)",
    Company: "google",
    Location: "NYC (Hybrid)",
    Description: "Senior role. React, Node.js, MongoDB.",
    Skills: "React, JS, Node",
    Salary: "$145k - $185k",
    Experience: "5+ yrs",
    EmploymentType: "Full time",
    PostedDate: "4 days ago",
    Source: "Glassdoor",
    SourceUrl: "https://glassdoor.com/jobs/google-3",
  },
  {
    Title: "Backend Engineer",
    Company: "Amazon",
    Location: "Seattle, WA",
    Description: "Amazon's team is looking for a Backend developer with extensive Java, Spring Boot, and AWS cloud experience.",
    Skills: "Java, AWS, Spring Boot",
    Salary: "$130k - $160k",
    Experience: "3+ yrs",
    EmploymentType: "Full-time",
    PostedDate: "July 4, 2026",
    Source: "Glassdoor",
    SourceUrl: "https://glassdoor.com/jobs/amzn-1",
  },
  {
    Title: "Backend Web Developer",
    Company: "Amazon Web Services (AWS)",
    Location: "Seattle, Washington",
    Description: "AWS is seeking a backend dev. Java, Spring, Cloud architecture.",
    Skills: "Java, AWS, Microservices",
    Salary: "$135,000 - $165,000",
    Experience: "3-5 years",
    EmploymentType: "Full-time",
    PostedDate: "July 2, 2026",
    Source: "LinkedIn",
    SourceUrl: "https://linkedin.com/jobs/amzn-2",
  },
  {
    Title: "Frontend Developer",
    Company: "Microsoft Corporation",
    Location: "Redmond, WA (Remote)",
    Description: "Microsoft is looking for a Frontend Developer with excellent skills in React, TypeScript, and Tailwind CSS.",
    Skills: "React, TypeScript, CSS",
    Salary: "$110,000 - $130,000",
    Experience: "3-5 years",
    EmploymentType: "Contract",
    PostedDate: "yesterday",
    Source: "Indeed",
    SourceUrl: "https://indeed.com/jobs/msft-1",
  },
  {
    Title: "Python Developer",
    Company: "Stripe",
    Location: "Remote",
    Description: "Build robust payment APIs using Python and Django. Remote candidates welcome.",
    Skills: "Python, Django, PostgreSQL, APIs",
    Salary: "$130,000 - $170,000",
    Experience: "4 years",
    EmploymentType: "Full-time",
    PostedDate: "5 hours ago",
    Source: "Company Website",
    SourceUrl: "https://stripe.com/jobs/1",
  },
  {
    Title: "Data Scientist",
    Company: "OpenAI",
    Location: "San Francisco, CA",
    Description: "Join our core models team. Strong background in Python, PyTorch, and deep learning algorithms required.",
    Skills: "Python, PyTorch, Machine Learning, AI",
    Salary: "$200,000 - $350,000",
    Experience: "4+ years",
    EmploymentType: "Full-time",
    PostedDate: "1 week ago",
    Source: "LinkedIn",
    SourceUrl: "https://linkedin.com/jobs/openai-1",
  },
  {
    Title: "DevOps Engineer",
    Company: "Datadog",
    Location: "Hybrid - Boston, MA",
    Description: "Managing Kubernetes clusters, CI/CD pipelines, and AWS infrastructure.",
    Skills: "Kubernetes, Docker, AWS, CI/CD",
    Salary: "120000 - 150000",
    Experience: "2-4 years",
    EmploymentType: "Full-time",
    PostedDate: "Just now",
    Source: "Indeed",
    SourceUrl: "https://indeed.com/jobs/datadog-1",
  },
  {
    Title: "UI/UX Designer",
    Company: "Figma",
    Location: "On-site",
    Description: "Design intuitive and beautiful interfaces. Must have a strong portfolio.",
    Skills: "Figma, Sketch, Prototyping",
    Salary: "$80,000 - $110,000",
    Experience: "2 years",
    EmploymentType: "Part-time",
    PostedDate: "July 1, 2026",
    Source: "Dribbble",
    SourceUrl: "https://dribbble.com/jobs/figma-1",
  },
  {
    Title: "Machine Learning Intern",
    Company: "Meta",
    Location: "Menlo Park, CA",
    Description: "Summer internship for CS students interested in computer vision.",
    Skills: "Python, C++, TensorFlow",
    Salary: "$8,000/month",
    Experience: "0 years",
    EmploymentType: "Internship",
    PostedDate: "today",
    Source: "University Portal",
    SourceUrl: "https://meta.com/careers/intern-1",
  }
];

// Generate 1000 rows
const largeJobs = [];
for (let i = 0; i < 1000; i++) {
  const base = baseJobs[i % baseJobs.length];
  // Add some random variation to avoid exact duplicates for everything, but preserve group-level similarities
  largeJobs.push({
    Title: `${base.Title} ${Math.floor(i / baseJobs.length)}`,
    Company: base.Company,
    Location: base.Location,
    Description: `${base.Description} (Posting ID: ${i})`,
    Skills: base.Skills,
    Salary: base.Salary,
    Experience: base.Experience,
    EmploymentType: base.EmploymentType,
    PostedDate: base.PostedDate,
    Source: base.Source,
    SourceUrl: `${base.SourceUrl}?id=${i}`,
  });
}

// Add some malformed records (invalid rows) to match mock data failures
largeJobs.push({
  Title: "", // Missing Title
  Company: "Netflix",
  Location: "Los Gatos, CA",
  Description: "Invalid row.",
  Skills: "React",
  Salary: "$200,000",
  Experience: "2 years",
  EmploymentType: "Full-time",
  PostedDate: "today",
  Source: "LinkedIn",
  SourceUrl: "https://linkedin.com/jobs/netflix-invalid",
});

largeJobs.push({
  Title: "Marketing Analyst",
  Company: "", // Missing Company
  Location: "Chicago, IL",
  Description: "Invalid row.",
  Skills: "Excel",
  Salary: "$70,000",
  Experience: "1 year",
  EmploymentType: "Full-time",
  PostedDate: "yesterday",
  Source: "Indeed",
  SourceUrl: "https://indeed.com/jobs/no-company",
});

const worksheet = xlsx.utils.json_to_sheet(largeJobs);
const workbook = xlsx.utils.book_new();
xlsx.utils.book_append_sheet(workbook, worksheet, "Jobs");

const outputPath = path.join(__dirname, "../../../large_mock_jobs.xlsx");
xlsx.writeFile(workbook, outputPath);

console.log(`✅ Large Mock Excel spreadsheet successfully created with ${largeJobs.length} rows at: ${outputPath}`);
