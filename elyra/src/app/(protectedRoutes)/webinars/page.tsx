"use client";
 import React from "react";
 import { onAuthenticateUser } from "@/action/auth";
 import { redirect }           from "next/navigation";
 import { getWebinarByPresenterId } from "@/actions/webinar";
 import { WebinarStatusEnum }       from "@prisma/client";
+import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

 const page = async ({ searchParams }) => {
   …  
-  return <div>Loading...</div>;
+  return (
+    <Tabs defaultValue="all" className="w-full">
+      <TabsList>
+        <TabsTrigger value="all">All</TabsTrigger>
+        <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
+        <TabsTrigger value="ended">Ended</TabsTrigger>
+      </TabsList>
+    </Tabs>
+  );
 };
