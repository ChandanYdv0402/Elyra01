"use client";

import React from "react";
import { onAuthenticateUser }   from "@/action/auth";
import { redirect }             from "next/navigation";
import { getWebinarAttendance } from "@/action/attendance";
import PageHeader               from "@/components/ReusableComponent/PageHeader";
import LeadIcon                 from "@/icons/LeadIcon";
import PipelineIcon             from "@/icons/PipelineIcon";
import { HomeIcon }             from "lucide-react";

type Props = {
  params: Promise<{
    webinarId: string;
  }>;
};

const page = async ({ params }: Props) => {
  const { webinarId } = await params;
  const pipelineData = await getWebinarAttendance(webinarId);

  if (!pipelineData.data) {
    return (
      <div className="text-3xl h-[400px] flex justify-center items-center">
        No Pipelines Found
      </div>
    );
  }

  const checkUser = await onAuthenticateUser();
  if (!checkUser.user) {
    redirect("/sign-in");
  }

  if (checkUser.user.id !== pipelineData.presenter.id) {
    return (
      <div className="text-3xl h-[400px] flex justify-center items-center">
        You are not authorized to view this page
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <PageHeader
        leftIcon={<LeadIcon className="w-4 h-4" />}
        mainIcon={<PipelineIcon className="w-12 h-12" />}
        rightIcon={<HomeIcon className="w-3 h-3" />}
        heading="Keep track of all of your customers"
        placeholder="Search Name, Tag or Email"
      />
      {/* Pipelines */}
      <div>Loading pipeline attendance...</div>
    </div>
  );
};

export default page;
