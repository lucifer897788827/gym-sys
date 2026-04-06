const LOGIN_REDIRECT_PATHS = [
  "/attendance",
  "/dashboard",
  "/leads",
  "/member",
  "/members",
  "/recovery",
] as const;

export type LoginRedirectPath = (typeof LOGIN_REDIRECT_PATHS)[number];

function isLoginRedirectPath(path: string): path is LoginRedirectPath {
  return (LOGIN_REDIRECT_PATHS as readonly string[]).includes(path);
}

export function resolvePostLoginRedirect(nextPath?: string): LoginRedirectPath {
  if (nextPath && isLoginRedirectPath(nextPath)) {
    return nextPath;
  }

  return "/dashboard";
}
