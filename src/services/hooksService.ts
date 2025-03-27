import axios from "axios";

const subscribeToEvents = async (accessToken: string) => {
  try {
    const response = await axios.post(
      "https://api.kick.com/public/v1/events/subscriptions",
      {
        //TODO: fa dinamic
        events: [
          {
            name: "chat.message.sent",
            version: 1,
          },
        ],
        method: "webhook",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error_description || "Failed to subscribe to events");
  }
};

export { subscribeToEvents };

