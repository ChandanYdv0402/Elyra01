"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type WaitListComponentProps = {
  webinarId: string;
  webinarStatus: any;
  onRegistered?: () => void;
};

const WaitListComponent = ({ webinarId, webinarStatus, onRegistered }: WaitListComponentProps) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // submission logic to be added
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Join Waitlist</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join Waitlist</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit">Join Waitlist</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WaitListComponent;
