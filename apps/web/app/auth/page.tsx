import { cookies } from "next/headers";
import { DataTable } from "./data-table";
import { myColumns } from "./columns";

export default async function Dashboard() {
  const session = cookies().get("session_jwt").value;
  const assignedResponse = await fetch("http://localhost:5001/questions/me", {
    method: "GET",
    headers: {
      Cookie: `session_jwt=${session}`,
    },
  });

  const assignedData = await assignedResponse.json();

  return (
    <div>
      <DataTable
        columns={myColumns}
        data={assignedData.map((data) => data.fields)}
        addButton={false}
        bulkDelete
      />
    </div>
  );
}
