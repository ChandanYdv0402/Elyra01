"use client";

import React from "react";
import { onAuthenticateUser } from "@/action/auth";
import { redirect } from "next/navigation";

 const page = async ({ params }) => {
 const checkUser = await onAuthenticateUser();
 if (!checkUser.user) {
   redirect("/sign-in");
 }

   return <div>Loading pipeline attendance...</div>;
 };


const page = async ({ params }: { params: Promise<{ webinarId: string }> }) => {
  return <div>Loading pipeline attendance...</div>;
};

export default page;
