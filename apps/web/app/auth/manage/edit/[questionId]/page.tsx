import { cookies } from "next/headers";
import { Button } from "ui/components/ui/button";
import { Input } from "ui/components/ui/input";
import { Textarea } from "ui/components/ui/textarea";
import { redirect } from "next/navigation";
import { SelectField } from "../../new/Select";
import Properties from "../../new/Properties";

export default async function NewQuestionPage({
  params,
}: {
  params: { questionId: number };
}) {
  async function updateQuestion(formData: FormData) {
    "use server";
    const session = cookies().get("session_jwt").value;

    const company = formData.get("company");
    const questionId = formData.get("questionId");
    const companyData = company.toString().split("-");
    const question = formData.get("question");
    const description = formData.get("description");
    const assignedTo = formData.get("assignedTo");
    const assignedToData = assignedTo.toString().split("-");
    const answer = formData.get("answer");
    const properties = formData.get("properties");

    const response = await fetch("http://localhost:5001/questions", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Cookie: `session_jwt=${session}`,
      },
      body: JSON.stringify({
        questionId,
        companyName: companyData[1],
        companyId: companyData[0],
        question,
        description,
        assignedTo: answer !== "" ? null : assignedToData[0],
        answer,
        properties,
      }),
    });

    if (!response.ok) {
      alert("An error occurred");
      return;
    }

    redirect(`/manage`);
  }

  const session = cookies().get("session_jwt").value;

  const questionId = params.questionId;
  const questionResponse = await fetch(
    "http://localhost:5001/questions/" + questionId,
    {
      method: "GET",
      headers: {
        Cookie: `session_jwt=${session}`,
      },
    }
  );
  const questionData = await questionResponse.json();

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
      <form action={updateQuestion} className="w-96 flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Edit question</h1>
        <input
          type="text"
          className="hidden"
          readOnly
          name="questionId"
          value={questionId}
        />
        <SelectField
          data={companyData.companies}
          label="Companies"
          name="company"
          placeholder="Select a company"
          defaultValue={
            questionData.fields["_companyId"] +
            "-" +
            questionData.fields["Company name"]
          }
        />
        <Input
          type="text"
          name="question"
          placeholder="Question"
          defaultValue={questionData.fields["Question"]}
        />
        <Textarea
          name="description"
          placeholder="Description"
          defaultValue={questionData.fields["Description"]}
        />
        <SelectField
          label="Users"
          data={users}
          name="assignedTo"
          placeholder="Assigned to"
          defaultValue={
            questionData.fields["Assigned to"] +
            "-" +
            users.find((user) => user.id === questionData.fields["Assigned to"])
              .name
          }
        />
        <Textarea
          name="answer"
          placeholder="Answer"
          className="mb-2"
          defaultValue={questionData.fields["Answer"]}
        />
        <Properties defaultValue={questionData.fields["Properties"]} />
        <Button type="submit">Update question</Button>
      </form>
    </div>
  );
}
