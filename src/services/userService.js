const USER_API_URL = `${import.meta.env.VITE_APP_URL}/users`;


const getUserById = async (id) => {
  try {
    if (!id) throw new Error(`User ID is required.`);

    const response = await fetch(`${USER_API_URL}/${id}`);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch user with ID ${id}. Server responded with status ${response.status}`
      );
    }
    const data = await response.json();

    return data;
  } catch (error) {
    return {
      error: `Error fetching user by ID: ${error.message}`,
    };
  }
};


const updateUser = async (id, user) => {
  try {
   
    if (!id) throw new Error(`User ID is required for updating.`);
    if (!user) {
      throw new Error(
        `Missing required user properties. Ensure 'user' are provided.`
      );
    }

    const response = await fetch(`${USER_API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to update user with ID ${id}. Server responded with status ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: `Error updating user: ${error.message}`,
    };
  }
};

const register = async (username,email,password) => {
  try {
    if (!username || !email || !password) {
      throw new Error(
        `Missing required user properties. Ensure 'id', 'username', 'email' are provided.`
      );
    }

   
    
    const response = await fetch(USER_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({username,email,password}),
    });

    if (!response.ok) {
      throw new Error(
        `Failed to create user. Server responded with status ${response.status}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      error: `Error creating user: ${error.message}`,
    };
  }
};



const getUserByEmail = async (email) => {
  try {
    if (!email) {
      throw new Error("Missing required email are provided.");
    }
    const response = await fetch(`${USER_API_URL}?email=${email}`);
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

    sessionStorage.setItem("userTempt",JSON.stringify(user))
    return user;
  } catch (error) {
    return {
      error: error.message,
    };
  }
};

export { getUserById, register, login, updateUser, getUserByEmail };
