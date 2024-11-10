import { AsyncLocalStorage } from "async_hooks";

interface UserContext {
  userId: string;
}

export class UserContextService {
  private static instance: UserContextService;
  private als: AsyncLocalStorage<UserContext>;

  private constructor() {
    this.als = new AsyncLocalStorage<UserContext>();
  }

  public static getInstance(): UserContextService {
    if (!UserContextService.instance) {
      UserContextService.instance = new UserContextService();
    }
    return UserContextService.instance;
  }

  public getUserId(): string {
    const context = this.als.getStore();
    return context?.userId || "system";
  }

  public run(userId: string, callback: () => Promise<void>) {
    return this.als.run({ userId }, callback);
  }
}
