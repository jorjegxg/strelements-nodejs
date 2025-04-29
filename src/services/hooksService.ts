import axios from "axios";
//unused for now
const subscribeToEvents = async (accessToken: string) => {
  const body = {
    events: [
      {
        name: "chat.message.sent",
        version: 1,
      },
      {
        name: "livestream.status.updated",
        version: 1,
      },
      {
        name: "channel.followed",
        version: 1,
      },
      {
        name: "channel.subscription.new",
        version: 1,
      },
      {
        name: "channel.subscription.renewal",
        version: 1,
      },
      {
        name: "channel.subscription.gifts",
        version: 1,
      },
    ],
    method: "webhook",
  };

  try {
    const response = await axios.post(
      "https://api.kick.com/public/v1/events/subscriptions",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description || "Failed to subscribe to events"
    );
  }
};

const unsubscribeFromEvents = async (accessToken: string) => {
  try {
    const subscriptions = await getSubscriptions(accessToken);

    for (const index in subscriptions.data) {
      await axios.delete(
        `https://api.kick.com/public/v1/events/subscriptions?id=${subscriptions.data[index].id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      return { message: "Unsubscribed from events" };
    }

    return { message: "Nothing to unsubscribe" };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description ||
        "Failed to unsubscribe from events"
    );
  }
};

const getSubscriptions = async (accessToken: string) => {
  try {
    const response = await axios.get(
      "https://api.kick.com/public/v1/events/subscriptions",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.error_description ||
        `Failed to get subscriptions ${error}`
    );
  }
};

export { getSubscriptions, subscribeToEvents, unsubscribeFromEvents };
