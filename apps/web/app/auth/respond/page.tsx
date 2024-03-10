import { cookies } from "next/headers";
import { DataTable } from "../data-table";
import { respondColumns } from "../columns";

export default async function Dashboard() {
  const session = cookies().get("session_jwt").value;
  const questionResponse = await fetch(
    "http://localhost:5001/questions/unanswered",
    {
      method: "GET",
      headers: {
        Cookie: `session_jwt=${session}`,
      },
    }
  );

  const questionData = await questionResponse.json();
  const questions = questionData.map((response: any) => response.fields);

  return (
    <div className="flex flex-col w-full">
      <DataTable
        columns={respondColumns}
        data={questions}
        bulkAssign
        bulkDelete
      />
    </div>
  );
}
