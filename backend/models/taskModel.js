const tasks = [
  {
    id: "T1",
    title: "Setup Project",
    description: "Initialize React and Node project",
    priority: "High",
    estimatedEffort: 2,
    category: "Setup",
    dependencies: [],
    status: "To Do",
  },
  {
    id: "T2",
    title: "Build API",
    description: "Develop REST APIs",
    priority: "High",
    estimatedEffort: 5,
    category: "Backend",
    dependencies: ["T1"],
    status: "To Do",
  },
  {
    id: "T3",
    title: "Build UI",
    description: "Create frontend screens",
    priority: "Medium",
    estimatedEffort: 3,
    category: "Frontend",
    dependencies: ["T2"],
    status: "To Do",
  },
];

export default tasks;
