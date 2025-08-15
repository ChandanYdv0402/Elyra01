import React, { Suspense } from "react";
import AiAgentSidebar from "./_components/AiAgentSidebar";
import ModelSection from "./_components/ModelSection";
import { onAuthenticateUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { UserWithAiAgent } from "@/lib/type";

const ModelSectionSkeleton = () => (
  <div className="p-6 animate-pulse">
    <div className="h-6 w-48 bg-secondary rounded mb-4" />
    <div className="h-4 w-80 bg-secondary rounded mb-2" />
    <div className="h-4 w-64 bg-secondary rounded" />
  </div>
);

const page = async () => {
  const checkUser = await onAuthenticateUser();
  if (!checkUser.user) {
    redirect("/sign-in");
  }
  const user = checkUser.user as UserWithAiAgent;

  if (process.env.NODE_ENV !== "production") {
    console.log("User data:", checkUser.user);
  }

  return (
    <div className="w-full flex h-[80vh] text-primary border border-border rounded-se-xl">
      <AiAgentSidebar aiAgents={user?.aiAgents || []} userId={user?.id} />
      <div className="flex-1 flex flex-col">
        <Suspense fallback={<ModelSectionSkeleton />}>
          <ModelSection />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
