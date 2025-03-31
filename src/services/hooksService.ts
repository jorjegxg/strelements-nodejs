import axios from "axios";

const subscribeToEvents = async (accessToken: string) => {
  console.log("subscribeToEvents");

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
          Authorization: `${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error_description || "Failed to subscribe to events");
  }
};

const unsubscribeFromEvents = async (accessToken: string) => {
  try {
    console.log("unsubscribeFromEvents");

    const subscriptions = await getSubscriptions(accessToken);

    for (const index in subscriptions.data) {

      await axios.delete(
        `https://api.kick.com/public/v1/events/subscriptions?id=${subscriptions.data[index].id}`,
        {
          headers: {
            Authorization: `${accessToken}`,
          },
        },
      );
      return { message: "Unsubscribed from events" };
    }


    return { message: "Nothing to unsubscribe" };
  } catch (error: any) {
    throw new Error(error.response?.data?.error_description || "Failed to unsubscribe from events");
  }
};

const getSubscriptions = async (accessToken: string) => {
  try {
    const response = await axios.get(
      "https://api.kick.com/public/v1/events/subscriptions",
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `${accessToken}`,
        },
      },
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.error_description || "Failed to get subscriptions");
  }
};

export { getSubscriptions, subscribeToEvents, unsubscribeFromEvents };

