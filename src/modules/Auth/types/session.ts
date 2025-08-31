export interface User {
  id: string;
  username: string;
}

export interface Session {
  user: User;
}
