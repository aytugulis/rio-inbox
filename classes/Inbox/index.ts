import RDK, { Data, InitResponse, Response, StepResponse } from "@retter/rdk";

const rdk = new RDK();

const USERS_DUMMY_DATA = [
  { id: "def7ea25", name: "John" },
  { id: "c4b1bad4", name: "Jane" },
  { id: "450e7dbf", name: "Emily" },
];
const MESSAGES_DUMMY_DATA = [
  {
    id: "ab76999e",
    userId: "def7ea25",
    message: "Lorem ipsum dolor sit amet",
    read: false,
  },
  {
    id: "bccdfbd4",
    userId: "def7ea25",
    message: "Lorem ipsum dolor sit amet",
    read: false,
  },
  {
    id: "82a5554c",
    userId: "c4b1bad4",
    message: "Lorem ipsum dolor sit amet",
    read: false,
  },
  {
    id: "111a2076",
    userId: "c4b1bad4",
    message: "Lorem ipsum dolor sit amet",
    read: false,
  },
  {
    id: "04370e07",
    userId: "c4b1bad4",
    message: "Lorem ipsum dolor sit amet",
    read: false,
  },
  {
    id: "15950f35",
    userId: "450e7dbf",
    message: "Lorem ipsum dolor sit amet",
    read: false,
  },
  {
    id: "d266eccd",
    userId: "450e7dbf",
    message: "Lorem ipsum dolor sit amet",
    read: false,
  },
  {
    id: "06bfc896",
    userId: "450e7dbf",
    message: "Lorem ipsum dolor sit amet",
    read: false,
  },
];

export async function authorizer(data: Data): Promise<Response> {
  return { statusCode: 200 };
}

export async function init(data: Data): Promise<InitResponse> {
  return {
    state: {
      public: { messages: MESSAGES_DUMMY_DATA, users: USERS_DUMMY_DATA },
    },
  };
}

export async function getState(data: Data): Promise<Response> {
  return { statusCode: 200, body: data.state };
}

export async function getByUserId(data: Data): Promise<StepResponse> {
  const { userId } = data.request.queryStringParams;
  const { messages, users } = data.state.public;

  const userIndex = users.findIndex((user) => user.id === userId);
  if (userIndex === -1) {
    throw new Error("User not found");
  }

  const inbox = messages.filter((message) => message.userId === userId);

  data.response = {
    statusCode: 200,
    body: { inbox },
  };
  return data;
}

export async function readMessage(data: Data): Promise<StepResponse> {
  const { messageId } = data.request.queryStringParams;
  const { messages } = data.state.public;

  const messageIndex = messages.findIndex(
    (message) => message.id === messageId
  );
  if (messageIndex === -1) {
    throw new Error("Message not found");
  }

  const message = messages[messageIndex];
  message.read = true;

  data.response = {
    statusCode: 200,
    body: { message },
  };
  return data;
}
