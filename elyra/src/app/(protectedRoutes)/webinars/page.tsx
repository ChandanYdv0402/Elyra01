"use client";
 import React from "react";
+import { onAuthenticateUser } from "@/action/auth";
+import { redirect }           from "next/navigation";

 const page = async ({ searchParams }) => {
+  const checkUser = await onAuthenticateUser();
+  if (!checkUser.user) {
+    redirect("/");
+  }

   return <div>Loading...</div>;
 };
