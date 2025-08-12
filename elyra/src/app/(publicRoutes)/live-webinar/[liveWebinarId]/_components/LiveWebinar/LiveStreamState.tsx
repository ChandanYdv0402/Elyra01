"use client";

import { useEffect, useState } from "react";
import {
  StreamVideoClient,
  User as StreamUser,
} from "@stream-io/video-react-sdk";
import { User } from "@prisma/client";
import { WebinarWithPresenter } from "@/lib/type";
import { getTokenForHost } from "@/action/stremIo";

type Props = {
  apiKey: string;
  callId: string;
  webinar: WebinarWithPresenter;
  user: User;
};

const LiveStreamState = ({ apiKey, callId, webinar, user }: Props) => {
  const [hostToken, setHostToken] = useState<string | null>(null);
  const [client, setClient] = useState<StreamVideoClient | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        const token = await getTokenForHost(
          webinar.presenterId,
          webinar.presenter.name,
          webinar.presenter.profileImage
        );

        const hostUser: StreamUser = {
          id: webinar.presenterId,
          name: webinar.presenter.name,
          image: webinar.presenter.profileImage,
        };

        const streamClient = new StreamVideoClient({
          apiKey,
          user: hostUser,
          token,
        });

        setHostToken(token);
        setClient(streamClient);
      } catch (error) {
        console.error("Error initializing stream client", error);
      }
    };

    init();
  }, [apiKey, webinar]);

  return null;
};

export default LiveStreamState;
