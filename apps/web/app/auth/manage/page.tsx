import { cookies } from "next/headers";
import { DataTable } from "../data-table";
import { manageColumns, Question } from "../columns";
import { Button } from "ui/components/ui/button";
import Link from "next/link";

export default async function Dashboard() {
  const session = cookies().get("session_jwt").value;
  const questionResponse = await fetch("http://localhost:5001/questions/list", {
    method: "GET",
    headers: {
      Cookie: `session_jwt=${session}`,
    },
  });

  const questionData = await questionResponse.json();
  const questions = questionData.map((response: any) => response.fields);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row items-center justify-end w-full mb-2">
        <Button asChild variant="secondary">
          <Link href="/manage/new">Add question</Link>
        </Button>
      </div>
      <DataTable columns={manageColumns} data={questions} />
    </div>
  );
}
