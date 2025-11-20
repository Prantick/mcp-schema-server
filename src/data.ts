// data.ts
export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
}

export const employees: Employee[] = [
  { id: "1", name: "Alice Johnson", role: "Senior Engineer", department: "Engineering", email: "alice@org.com" },
  { id: "2", name: "Bob Smith", role: "Product Manager", department: "Product", email: "bob@org.com" },
  { id: "3", name: "Charlie Davis", role: "Designer", department: "Design", email: "charlie@org.com" },
  { id: "4", name: "Diana Prince", role: "CTO", department: "Executive", email: "diana@org.com" }
];