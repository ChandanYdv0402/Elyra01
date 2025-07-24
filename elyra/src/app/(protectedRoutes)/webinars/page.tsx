"use client";
 import React from "react";
 import { onAuthenticateUser } from "@/action/auth";
 import { redirect }           from "next/navigation";
 import { getWebinarByPresenterId } from "@/actions/webinar";
 import { WebinarStatusEnum }       from "@prisma/client";
+import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
+import PageHeader      from "@/components/ReusableComponent/PageHeader";
+import HomeIcon        from "@/icons/HomeIcon";
+import LeadIcon        from "@/icons/LeadIcon";
+import { Webcam }      from "lucide-react";

 const page = async ({ searchParams }) => {
   …  
-  return (
-    <Tabs …/>
-  );
+  return (
+    <PageHeader
+      leftIcon={<HomeIcon className="w-3 h-3" />}
+      mainIcon={<Webcam className="w-12 h-12" />}
+      rightIcon={<LeadIcon className="w-4 h-4" />}
+      heading="The home to all your webinars"
+      placeholder="Search option..."
+    >
+      <Tabs defaultValue="all" className="w-full">
+        <TabsList>…</TabsList>
+      </Tabs>
+    </PageHeader>
+  );
 };
 import Link from "next/link";
 …
-      <TabsTrigger value="all">All</TabsTrigger>
+      <TabsTrigger value="all">
+        <Link href={`/webinars?webinarStatus=all`}>All</Link>
+      </TabsTrigger>

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
