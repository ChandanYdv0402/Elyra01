"use client";

import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type WaitListComponentProps = {
  webinarId: string;
  webinarStatus: any;
  onRegistered?: () => void;
};

const WaitListComponent = ({ webinarId, webinarStatus, onRegistered }: WaitListComponentProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join Waitlist</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Waitlist</DialogTitle>
        </DialogHeader>
        {/* form goes here */}
      </DialogContent>
    </Dialog>
  );
};

export default WaitListComponent;
