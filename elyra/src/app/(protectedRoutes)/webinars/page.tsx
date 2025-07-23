"use client";
 import React from "react";
 import { onAuthenticateUser } from "@/action/auth";
 import { redirect }           from "next/navigation";
+import { getWebinarByPresenterId } from "@/actions/webinar";
+import { WebinarStatusEnum }       from "@prisma/client";

 const page = async ({ searchParams }) => {
+  const { webinarStatus } = await searchParams;
   const checkUser = await onAuthenticateUser();
   if (!checkUser.user) {
     redirect("/");
   }
+  const webinars = await getWebinarByPresenterId(
+    checkUser.user.id,
+    webinarStatus as WebinarStatusEnum
+  );

   return <div>Loading...</div>;
 };
