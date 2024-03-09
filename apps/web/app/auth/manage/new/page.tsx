import { cookies } from "next/headers";
import { SelectField } from "./Select";
import { Button } from "ui/components/ui/button";
import { Input } from "ui/components/ui/input";
import { Textarea } from "ui/components/ui/textarea";
import Properties from "./Properties";
import { redirect } from "next/navigation";

export default async function NewQuestionPage() {
  async function createQuestion(formData: FormData) {
    "use server";
    const session = cookies().get("session_jwt").value;

    const company = formData.get("company");
    const companyData = company.toString().split("-");
    const question = formData.get("question");
    const description = formData.get("description");
    const assignedTo = formData.get("assignedTo");
    const assignedToData = assignedTo.toString().split("-");
    const answer = formData.get("answer");
    const properties = formData.get("properties");

    const response = await fetch("http://localhost:5001/questions/new", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_jwt=${session}`,
      },
      body: JSON.stringify({
        companyName: companyData[1],
        companyId: companyData[0],
        question,
        description,
        assignedTo: answer !== "" ? null : assignedToData[0],
        answer,
        properties,
      }),
    });

    const data = await response.json();
    redirect(`/manage/question/${data.fields._recordId}`);
  }
  const session = cookies().get("session_jwt").value;
  const companyResponse = await fetch("http://localhost:5001/companies", {
    method: "GET",
    headers: {
      Cookie: `session_jwt=${session}`,
    },
  });
  const companyData = await companyResponse.json();

  const userResponse = await fetch("http://localhost:5001/users/list", {
    method: "GET",
    headers: {
      Cookie: `session_jwt=${session}`,
    },
  });
  const userData = await userResponse.json();
  const users = userData.map((user: any) => {
    return {
      id: user.fields.Email,
      name: user.fields.Name,
    };
  });

  return (
    <div className="flex flex-col items-center justify-center">
      <form action={createQuestion} className="w-96 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Create a question</h1>
        <SelectField
          data={companyData.companies}
          label="Companies"
          name="company"
          placeholder="Select a company"
        />
        <Input type="text" name="question" placeholder="Question" />
        <Textarea name="description" placeholder="Description" />
        <SelectField
          label="Users"
          data={users}
          name="assignedTo"
          placeholder="Assigned to"
        />
        <Textarea name="answer" placeholder="Answer" className="mb-2" />
        <Properties />
        <Button type="submit">Create question</Button>
      </form>
    </div>
  );
}
