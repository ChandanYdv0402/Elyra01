"use client";

import React from "react";
import { onAuthenticateUser }   from "@/action/auth";
import { redirect }             from "next/navigation";
import { getWebinarAttendance } from "@/action/attendance";

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
"use client";

import React from "react";
import { onAuthenticateUser }   from "@/action/auth";
import { redirect }             from "next/navigation";
import { getWebinarAttendance } from "@/action/attendance";

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

  return <div>Loading pipeline attendance...</div>;
};

export default page;

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

  return <div>Loading pipeline attendance...</div>;
};

export default page;
