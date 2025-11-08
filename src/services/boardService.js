import { useBoardStore } from "@/store/boardStore";

const BOARD_API_URL = `${import.meta.env.VITE_APP_URL}/boards`;

const getBoardByuserEmail = async (email) => {
  try {
    console.log(email);

    if (!email) throw new Error(`User email is required.`);

    const response = await fetch(`${BOARD_API_URL}`);
    console.log(response);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch board. Server responded with status ${response.status}`
      );
    }
    const data = await response.json();
    console.log(data);
    const res = data.filter((board) => {
      console.log(board.members);
      return board.members.includes(email);
    });
    const boardStore = useBoardStore();
    boardStore.setBoard(res);
    return res;
  } catch (error) {
    return {
      error: `Error fetching board: ${error.message}`,
    };
  }
};

const createBoard = async (board) => {
  try {
    if (!board.name || !board.members) {
      throw new Error(
        `Missing required board properties. Ensure 'name' is provemailed.`
      );
    }

    const response = await fetch(BOARD_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(board),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create board. Server responded with status ${response.status}`
      );
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return {
      error: `Error creating board: ${error.message}`,
    };
  }
};

const updateBoard = async (board) => {
  try {
    const res = await fetch(
      `${BOARD_API_URL}/${board.id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(board),
      }
    );
    if (!res.ok) {
      throw new Error(
        `Failed to update board. Server responded with status ${res.status}`
      );
    }
    const data = await res.json();

    return data;
  } catch (error) {
    return {
      error: `Error update board: ${error.message}`,
    };
  }

};

const getBoardById = async (id) => {
  try {
    if (!id) {
      throw new Error("Missing required id.");
    }
    const response = await fetch(`${BOARD_API_URL}?id=${id}`);
    const board = await response.json();

    if (!board[0]) throw new Error("Board Not Found!");

    return board[0];
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

const getUserByEmail = async (email) => {
  try {
    if (!email) {
      throw new Error("Missing required email are provemailed.");
    }
    const response = await fetch(`${BOARD_API_URL}?email=${email}`);
    const user = await response.json();

    if (!user[0]) throw new Error("User Not Found!");

    return user[0];
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

const login = async (email, password) => {
  try {
    if (!email || !password) {
      throw new Error("Please enter your email and password!");
    }
    const user = await getUserByEmail(email);

    if (user.error) {
      throw new Error(user.error);
    }
    if (!user || !user.password) {
      throw new Error("User Not Found!");
    }

    if (password !== user.password) {
      throw new Error("Some thing Wrong! Check your password or email...");
    }
    return user;
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export { getBoardByuserEmail,updateBoard, getBoardById, createBoard };
