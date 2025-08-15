import React, { Suspense } from "react";
import AiAgentSidebar from "./_components/AiAgentSidebar";
import { onAuthenticateUser } from "@/actions/auth";
import { redirect } from "next/navigation";
import { UserWithAiAgent } from "@/lib/type";
import dynamic from "next/dynamic";

const ModelSection = dynamic(() => import("./_components/ModelSection"), {
  ssr: true,
  loading: () => (
    <div className="p-6 animate-pulse">
      <div className="h-6 w-48 bg-secondary rounded mb-4" />
      <div className="h-4 w-80 bg-secondary rounded mb-2" />
      <div className="h-4 w-64 bg-secondary rounded" />
    </div>
  ),
});

const page = async () => {
  const checkUser = await onAuthenticateUser();
  const user = checkUser.user as UserWithAiAgent | null;

  if (!user) {
    redirect("/sign-in");
  }

  if (process.env.NODE_ENV !== "production") {
    console.log("User data:", user);
  }

  const aiAgents = Array.isArray(user.aiAgents) ? user.aiAgents : [];

  return (
    <div className="w-full min-h-[70vh] md:h-[80vh] text-primary border border-border rounded-xl overflow-hidden">
      <div className="flex flex-col md:flex-row h-full">
        <AiAgentSidebar aiAgents={aiAgents} userId={user.id} />
        <div className="flex-1 flex flex-col p-4 md:p-6 lg:p-8">
          <Suspense fallback={null}>
            <ModelSection />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default page;
