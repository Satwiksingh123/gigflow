import { User, type IUser } from "../models/User";
import { AppError } from "../utils/AppError";
import { signToken } from "../utils/jwt";
import type { LoginInput, RegisterInput } from "../validators/auth.validator";

/** Shape of user data sent in API responses (IDs serialized to strings) */
export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  role: IUser["role"];
}

export interface AuthResult {
  token: string;
  user: AuthUser;
}

/** Serialize an IUser document into a safe, JSON-friendly shape */
function toAuthUser(user: IUser): AuthUser {
  return {
    _id: String(user._id),
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    const existing = await User.findOne({ email: input.email });
    if (existing) throw new AppError("Email already in use", 409);

    const user = await User.create(input);
    const token = signToken({ sub: String(user._id), role: user.role });
    return { token, user: toAuthUser(user) };
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await User.findOne({ email: input.email }).select("+password");
    if (!user) throw new AppError("Invalid credentials", 401);

    const ok = await user.comparePassword(input.password);
    if (!ok) throw new AppError("Invalid credentials", 401);

    const token = signToken({ sub: String(user._id), role: user.role });
    return { token, user: toAuthUser(user) };
  },

  async me(userId: string): Promise<AuthUser> {
    const user = await User.findById(userId);
    if (!user) throw new AppError("User not found", 404);
    return toAuthUser(user);
  },
};