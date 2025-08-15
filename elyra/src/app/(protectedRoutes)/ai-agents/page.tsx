import React from "react";
import AiAgentSidebar from "./_components/AiAgentSidebar";
// FIX: actual file is ModelSection.tsx (not ModalSection)
import ModelSection from "./_components/ModelSection";
import { onAuthenticateUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { UserWithAiAgent } from "@/lib/type";

const page = async () => {
  const checkUser = await onAuthenticateUser();
  if (!checkUser.user) {
    redirect("/sign-in");
  }
  const user = checkUser.user as UserWithAiAgent;

  console.log("User data:", checkUser.user);

  return (
    <div className="w-full flex h-[80vh] text-primary border border-border rounded-se-xl">
      <AiAgentSidebar aiAgents={user?.aiAgents || []} userId={user?.id} />
      <div className="flex-1 flex flex-col">
        <ModelSection />
      </div>
    </div>
  );
};

export default page;
