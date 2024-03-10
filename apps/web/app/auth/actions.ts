"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function logout() {
  "use server";

  cookies().delete("session_jwt");
  redirect("/signin");
}

export async function deleteQuestions(formData: FormData) {
  const session = cookies().get("session_jwt").value;

  const selectedIdsRaw = formData.get("selectedIds");

  if (selectedIdsRaw === undefined || selectedIdsRaw === null) {
    throw new Error("Please select at least one question to delete");
  }

  const selectedIds = (selectedIdsRaw as string).split(",");

  const response = await fetch("http://localhost:5001/questions", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session_jwt=${session}`,
    },
    body: JSON.stringify({
      selectedIds,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete question");
  }

  redirect("/manage");
}

export async function assignTo(formData: FormData) {
  const session = cookies().get("session_jwt").value;

  const selectedIdsRaw = formData.get("selectedIds");
  const assigneeRaw = formData.get("assignee");

  if (selectedIdsRaw === undefined || selectedIdsRaw === null) {
    throw new Error("Please select at least one question to assign");
  }

  if (assigneeRaw === undefined || assigneeRaw === null) {
    throw new Error("Please select a user to assign to");
  }

  const selectedIds = (selectedIdsRaw as string).split(",");
  const assignee = (assigneeRaw as string).split("-")[0];

  const response = await fetch("http://localhost:5001/questions/assign", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Cookie: `session_jwt=${session}`,
    },
    body: JSON.stringify({
      selectedIds: selectedIds,
      assignee: assignee,
    }),
  });

  if (!response.ok) {
    throw new Error("Failed to assign question");
  }

  redirect("/manage");
}
