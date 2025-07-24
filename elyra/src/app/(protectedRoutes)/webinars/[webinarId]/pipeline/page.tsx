"use client";

import React from "react";
import { onAuthenticateUser }     from "@/action/auth";
import { redirect }               from "next/navigation";
import { getWebinarAttendance }   from "@/action/attendance";

type Props = {
  params: Promise<{
    webinarId: string;
  }>;
};

const page = async ({ params }: Props) => {
  const { webinarId } = await params;
  const pipelineData = await getWebinarAttendance(webinarId);

  const checkUser = await onAuthenticateUser();
  if (!checkUser.user) {
    redirect("/sign-in");
  }

  return <div>Loading pipeline attendance...</div>;
};

export default page;
