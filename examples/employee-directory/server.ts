// Example: Employee Directory MCP Server
import { GenericMcpPlugin } from "mcp-schema-server";
import { employees, type Employee } from "./data.js";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Business Logic ---

const getEmployee = (args: { id: string }) => {
  const emp = employees.find((e) => e.id === args.id);
  if (!emp) throw new Error(`Employee with ID ${args.id} not found`);
  return emp;
};

const addEmployee = (args: Omit<Employee, "id">) => {
  const newId = (employees.length + 1).toString();
  const newEmp = { id: newId, ...args };
  employees.push(newEmp);
  return { success: true, id: newId, message: "Created" };
};

const getAllEmployees = () => employees;

const summarizeTeamPrompt = (args: { department?: string }) => {
  const dept = args.department || "Engineering";
  const team = employees.filter((e) => e.department.toLowerCase() === dept.toLowerCase());
  return `Analyze this team: ${team.map(e => e.name).join(", ")}`;
};

// --- Server Setup ---

try {
  const plugin = new GenericMcpPlugin({
    name: "employee-directory",
    version: "1.0.0",
    manifestPath: path.join(__dirname, "manifest.json"),
    handlers: {
      // Mapped exactly to manifest names/URIs
      "get_employee": getEmployee,
      "add_employee": addEmployee,
      "employee://all": getAllEmployees,
      "summarize_team": summarizeTeamPrompt
    }
  });

  plugin.start();
} catch (error: any) {
  console.error("Critical Server Error:", error.message);
  process.exit(1);
}
